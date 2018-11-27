import { Component, OnInit, ViewChildren, AfterViewInit, QueryList } from '@angular/core';
import { SWUpdateService } from './sw-update.service';
import { Store } from 'roxanne';
import { AppState, AppActions, Person, PersonStatus } from './store';
import { Observable } from 'rxjs';
import { take, filter } from 'rxjs/operators';
import { SwiperComponent, SwiperDirective } from 'ngx-swiper-wrapper';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  searchString = '';
  persons$: Observable<Person[]>;
  @ViewChildren(SwiperComponent) swiperComponents: QueryList<SwiperComponent>;
  private initialized = false;

  constructor(
    private swUpdateService: SWUpdateService,
    private store: Store<AppState, AppActions>
  ) {
    this.swUpdateService.listenForUpdates();
  }

  ngOnInit() {
    this.persons$ = this.store.select('persons');
    this.store.dispatch('fetchPersons', null);


  }

  ngAfterViewInit() {
    this.store.select('persons')
      .pipe(
        filter(persons => persons && persons.length > 0),
        take(1)
      )
      .subscribe(this.onInitialPersonsLoaded.bind(this));
  }

  onIndexChange(index: number, person: Person) {
    if (!this.initialized) {
      return;
    }
    const personStatus: PersonStatus = index === 0 ? 'absent' : index === 1 ? 'attendingNoPermit' : 'attendingWithPermit';
    this.store.dispatch('setPersonStatus', { personStatus, personId: person._id });
  }

  shouldHide(student: string): boolean {
    return this.searchString && student.toUpperCase().indexOf(this.searchString.toUpperCase()) === -1;
  }

  onInitialPersonsLoaded(persons: Person[]) {
    setTimeout(() => {
      this.swiperComponents.forEach((swiper, i) => {
        const person = persons[i];
        swiper.directiveRef.setIndex(this.statusToSlideIndex(person.status), 0, true);
      });
      this.initialized = true;
    }, 100);
  }

  private statusToSlideIndex(status: PersonStatus): number {
    if (status === 'absent') { return 0; }
    if (status === 'attendingNoPermit') { return 1; }
    if (status === 'attendingWithPermit') { return 2; }
  }
}
