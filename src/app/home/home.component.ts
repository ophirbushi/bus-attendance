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
  bus: 'center' | 'haifa' = 'center';
  readonlyMode = true;
  searchString = '';
  center$: Observable<Person[]>;
  haifa$: Observable<Person[]>;
  @ViewChildren('centerSwiper') centerSwiperComponents: QueryList<SwiperComponent>;
  @ViewChildren('haifaSwiper') haifaSwiperComponents: QueryList<SwiperComponent>;
  readonly statusFilter: boolean[] = [true, true, true];
  private centerInit = false;
  private haifaInit = false;
  private lock = false;
  trackByFn: TrackByFunction<Person> = (i: number, p: Person) => p._id;

  constructor(private stateService: AppStateService) { }

  ngOnInit() {
    this.center$ = this.stateService.selectCenter();
    this.haifa$ = this.stateService.selectHaifa();

    // this.stateService.selectPersonStatusChange()
    //   .pipe(withLatestFrom(this.persons$))
    //   .subscribe(([p, persons]) => {
    //     this.lock = true;
    //     const { _id, status } = p;
    //     this.getSwiperByPersonId(persons, _id).directiveRef.setIndex(status, 0, true);
    //     this.lock = false;
    //     console.log('changed person', p, status);
    //   });
  }

  ngAfterViewInit() {
    this.center$
      .pipe(
        filter(persons => persons && persons.length > 0),
        take(1),
        delay(100)
      )
      .subscribe(persons => this.onInitialPersonsLoaded(persons, 'center'));

    this.haifa$
      .pipe(
        filter(persons => persons && persons.length > 0),
        take(1),
        delay(100)
      )
      .subscribe(persons => this.onInitialPersonsLoaded(persons, 'haifa'));
  }

  onIndexChange(index: PersonStatus, person: Person, bus: 'center' | 'haifa') {
    if (this.lock) return;
    if (bus === 'center' && !this.centerInit) return;
    if (bus === 'haifa' && !this.haifaInit) return;
    if (bus !== 'center' && bus !== 'haifa') {
      console.error('unknown bus', bus);
      return;
    }

    console.log('index change!', index, bus);
    this.stateService.dispatch('setPersonStatus', { personStatus: index, personId: person._id, bus });
  }

  setBus(bus: 'center' | 'haifa') {
    this.bus = bus;
  }

  shouldHide(student: Person): boolean {
    const { name, status } = student;
    return !this.statusFilter[status] ||
      (this.searchString && name.toUpperCase().indexOf(this.searchString.toUpperCase()) === -1);
  }

  onInitialPersonsLoaded(persons: Person[], bus: 'center' | 'haifa') {
    this.lock = true;
    for (const p of persons) {
      const swiper = this.getSwiperByPersonId(persons, p._id, bus);
      swiper.directiveRef.setIndex(p.status, 0, true);
    }
    if (bus === 'center') {
      this.centerInit = true;
      console.log('this.centerInit = true');
    }
    if (bus === 'haifa') {
      this.haifaInit = true;
      console.log('this.haifaInit = true');
    }
    this.lock = false;
  }

  toggleReadonlyMode() {
    this.readonlyMode = !this.readonlyMode;
  }

  private getSwiperByPersonId(persons: Person[], id: string, bus: 'center' | 'haifa'): SwiperComponent {
    const index = persons.findIndex(p => p._id === id);
    const swipersList = bus === 'center' ? this.centerSwiperComponents : this.haifaSwiperComponents;
    return swipersList.toArray()[index];
  }
}
