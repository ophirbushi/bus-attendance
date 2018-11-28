import { Component, OnInit, ViewChildren, AfterViewInit, QueryList, TrackByFunction } from '@angular/core';
import { SWUpdateService } from './sw-update.service';
import { Person, PersonStatus, AppStateService } from './store';
import { Observable } from 'rxjs';
import { take, filter, map, withLatestFrom, tap } from 'rxjs/operators';
import { SwiperComponent } from 'ngx-swiper-wrapper';

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
  trackByFn: TrackByFunction<Person> = (i: number, p: Person) => p._id;


  constructor(
    private swUpdateService: SWUpdateService,
    private stateService: AppStateService
  ) {
    this.swUpdateService.listenForUpdates();
  }

  ngOnInit() {
    this.persons$ = this.stateService.selectPersons();

    this.stateService.selectPersonStatusChange()
      .pipe(
        map(changeActions => changeActions.filter(a => a.payload.type === 'modified')),
        map(changeActions => changeActions.map<Person>(a => ({ ...a.payload.doc.data(), _id: a.payload.doc.id, })))
      )
      .subscribe(changed => {
        if (!changed.length) {
          return;
        }
        setTimeout(() => {
          this.persons$
            .pipe(take(1))
            .subscribe(persons => {
              changed.forEach(c => {
                console.log(c);
                const index = persons.findIndex(p => p._id === c._id);
                this.swiperComponents.toArray()[index].directiveRef.setIndex(this.statusToSlideIndex(c.status), 0, true);
              });
            });
        }, 3000);
      });
  }

  ngAfterViewInit() {
    this.persons$
      .pipe(
        filter(persons => persons && persons.length > 0),
        take(1)
      )
      .subscribe(this.onInitialPersonsLoaded.bind(this));
  }

  onIndexChange(index: number, person: Person) {
    console.log('onIndexChange', index, person);

    if (!this.initialized) {
      return;
    }
    const personStatus: PersonStatus = index === 0 ? 'absent' : index === 1 ? 'attendingNoPermit' : 'attendingWithPermit';
    this.stateService.dispatch('setPersonStatus', { personStatus, personId: person._id });
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
