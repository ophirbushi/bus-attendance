import { Component, OnInit, TrackByFunction, OnDestroy } from '@angular/core';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { filter, map, take, takeUntil } from 'rxjs/operators';
import { BusGroupesState } from '../state/bus-groups.state';
import { RidersState } from '../state/riders.state';
import { Rider, RiderStatus } from '../models';
import { DataService } from '../data/data.service';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  private readonly _selectedBusGroupId = new BehaviorSubject<string>(null);
  private readonly _statusFilter = new BehaviorSubject({ 0: true, 1: true, 2: true });
  private readonly _searchString = new BehaviorSubject<string>('');
  readonly busGroups$ = this.busGroupsState.busGroups$;
  readonly riders$ = combineLatest(
    this.ridersState.riders$,
    this._selectedBusGroupId.asObservable(),
    this._statusFilter.asObservable(),
    this._searchString.asObservable()
  ).pipe(
    filter(([riders]) => riders != null),
    map(([riders, selectedBusGroupId, statusFilter, searchString]) => {
      return riders.filter((rider) => {
        return (
          rider != null &&
          rider.busGroupId === selectedBusGroupId &&
          statusFilter[rider.status] === true &&
          rider.name.toLowerCase().includes(searchString.toLowerCase())
        );
      });
    })
  );
  readonlyMode = true;
  private readonly destroy = new Subject();
  trackByFn: TrackByFunction<Rider> = (index, rider) => rider._id;
  get selectedBusGroupId(): string { return this._selectedBusGroupId.getValue(); }
  set selectedBusGroupId(value: string) { this._selectedBusGroupId.next(value); }
  get statusFilter() { return this._statusFilter.getValue(); }
  get searchString(): string { return this._searchString.getValue(); }
  set searchString(value: string) { this._searchString.next(value); }

  constructor(
    private busGroupsState: BusGroupesState,
    private ridersState: RidersState,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.busGroups$.pipe(
      takeUntil(this.destroy),
      filter(busGroups => busGroups != null && busGroups.length > 0),
      take(1)
    ).subscribe((busGroups) => {
      this.selectedBusGroupId = busGroups[0]._id;
    });
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }

  setStatusFilter(index: number, value: boolean) {
    this._statusFilter.next({ ...this.statusFilter, [index]: value });
  }

  toggleReadonlyMode() {
    this.readonlyMode = !this.readonlyMode;
  }

  onRiderStatusChange(status: RiderStatus, rider: Rider) {
    if (status === rider.status) {
      return;
    }
    this.ridersState.setRiderStatus(rider._id, status);
    this.dataService.updateRiderStatus(rider._id, status);
  }

  showDetails(rider: Rider) {
    alert(`טלפון: ${rider.phone}
      טלפון של ההורים: ${rider.parentPhone}
    `);
  }
}
