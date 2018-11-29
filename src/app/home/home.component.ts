import { Component, OnInit, ViewChildren, AfterViewInit, QueryList, TrackByFunction } from '@angular/core';
import { Person, PersonStatus, AppStateService } from '../store';
import { Observable } from 'rxjs';
import { take, filter, withLatestFrom, delay } from 'rxjs/operators';
import { SwiperComponent } from 'ngx-swiper-wrapper';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
  readonlyMode = true;
  searchString = '';
  persons$: Observable<Person[]>;
  @ViewChildren(SwiperComponent) swiperComponents: QueryList<SwiperComponent>;
  readonly statusFilter: boolean[] = [true, true, true];
  private initialized = false;
  private lock = false;
  trackByFn: TrackByFunction<Person> = (i: number, p: Person) => p._id;

  constructor(private stateService: AppStateService) { }

  ngOnInit() {
    this.persons$ = this.stateService.selectPersons();

    this.stateService.selectPersonStatusChange()
      .pipe(withLatestFrom(this.persons$))
      .subscribe(([p, persons]) => {
        this.lock = true;
        const { _id, status } = p;
        this.getSwiperByPersonId(persons, _id).directiveRef.setIndex(status, 0, true);
        this.lock = false;
        console.log('changed person', p, status);
      });
  }

  ngAfterViewInit() {
    this.persons$
      .pipe(
        filter(persons => persons && persons.length > 0),
        take(1),
        delay(100)
      )
      .subscribe(persons => this.onInitialPersonsLoaded(persons));
  }

  onIndexChange(index: PersonStatus, person: Person) {
    if (this.lock || !this.initialized) return;
    console.log('index change!', index);
    this.stateService.dispatch('setPersonStatus', { personStatus: index, personId: person._id });
  }

  shouldHide(student: Person): boolean {
    const { name, status } = student;
    return !this.statusFilter[status] ||
      (this.searchString && name.toUpperCase().indexOf(this.searchString.toUpperCase()) === -1);
  }

  onInitialPersonsLoaded(persons: Person[]) {
    for (const p of persons) {
      const swiper = this.getSwiperByPersonId(persons, p._id);
      swiper.directiveRef.setIndex(p.status, 0, true);
    }
    this.initialized = true;
  }

  toggleReadonlyMode() {
    this.readonlyMode = !this.readonlyMode;
  }

  private getSwiperByPersonId(persons: Person[], id: string): SwiperComponent {
    const index = persons.findIndex(p => p._id === id);
    return this.swiperComponents.toArray()[index];
  }
}
