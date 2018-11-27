import { Component, OnInit } from '@angular/core';
import { SWUpdateService } from './sw-update.service';
import { Store } from 'roxanne';
import { AppState, AppActions, Person, PersonStatus } from './store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  searchString = '';
  persons$: Observable<Person[]>;

  constructor(
    private swUpdateService: SWUpdateService,
    private store: Store<AppState, AppActions>
  ) {
    this.swUpdateService.listenForUpdates();
  }

  ngOnInit() {
    this.persons$ = this.store.select('persons');
    this.store.dispatch('generatePersons', null);
  }

  onIndexChange(index: number, personIndex: number) {
    const personStatus: PersonStatus = index === 0 ? 'absent' : index === 1 ? 'attendingNoPermit' : 'attendingWithPermit';
    this.store.dispatch('setPersonStatus', { personStatus, personIndex });
  }

  shouldHide(student: string): boolean {
    return this.searchString && student.toUpperCase().indexOf(this.searchString.toUpperCase()) === -1;
  }
}
