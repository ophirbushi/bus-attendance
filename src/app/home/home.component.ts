import { Component, OnInit, TrackByFunction, OnDestroy } from '@angular/core';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { filter, map, take, takeUntil } from 'rxjs/operators';
import { BusGroupesState } from '../state/bus-groups.state';
import { RidersState } from '../state/riders.state';
import { Rider, RiderStatus } from '../models';
import { DataService } from '../data/data.service';
import { MatDialog } from '@angular/material/dialog';
import { RiderDetailsModalComponent } from '../modals/rider-details-modal/rider-details-modal.component';
import { snapshot } from '../utils/snapshot';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  private readonly _selectedBusGroupId = new BehaviorSubject<string>(null);
  private readonly _statusFilter = new BehaviorSubject({ 0: true, 1: true, 2: true });
  private readonly _searchString = new BehaviorSubject<string>('');
  private readonly _pickupPointsFilter = new BehaviorSubject<{ [pickupPointId: string]: boolean }>({});
  readonly busGroups$ = this.busGroupsState.busGroups$;
  readonly riders$ = combineLatest(
    this.ridersState.riders$,
    this._selectedBusGroupId.asObservable(),
    this._statusFilter.asObservable(),
    this._pickupPointsFilter.asObservable(),
    this._searchString.asObservable()
  ).pipe(
    map(([riders, selectedBusGroupId, statusFilter, pickupPointsFilter, searchString]) => {
      if (!riders || !selectedBusGroupId) {
        return [];
      }
      return riders.filter((rider) => {
        return (
          rider != null &&
          rider.busGroupId === selectedBusGroupId &&
          statusFilter[rider.status] === true &&
          pickupPointsFilter[rider.pickupPointId] === true &&
          rider.name.toLowerCase().includes(searchString.toLowerCase())
        );
      });
    })
  );
  readonly selectedBusGroup$ = combineLatest(
    this.busGroups$,
    this._selectedBusGroupId.asObservable()
  ).pipe(
    map(([busGroups, selectedBusGroupId]) => {
      if (!busGroups || !selectedBusGroupId) {
        return null;
      }
      return busGroups.find(group => group._id === selectedBusGroupId);
    })
  );
  readonlyMode = true;
  private readonly destroy = new Subject();
  trackByFn: TrackByFunction<Rider> = (index, rider) => rider._id;
  get selectedBusGroupId(): string { return this._selectedBusGroupId.getValue(); }
  set selectedBusGroupId(value: string) { this._selectedBusGroupId.next(value); }
  get statusFilter() { return this._statusFilter.getValue(); }
  get pickupPointsFilter() { return this._pickupPointsFilter.getValue(); }
  get searchString(): string { return this._searchString.getValue(); }
  set searchString(value: string) { this._searchString.next(value); }

  constructor(
    private busGroupsState: BusGroupesState,
    private ridersState: RidersState,
    private dataService: DataService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.busGroups$.pipe(
      takeUntil(this.destroy),
      filter(busGroups => busGroups != null),
      take(1)
    ).subscribe((busGroups) => {
      this.selectedBusGroupId = busGroups[0] ? busGroups[0]._id : null;
    });

    this.selectedBusGroup$.pipe(
      takeUntil(this.destroy)
    ).subscribe((selectedBusGroup) => {
      const pickupPoints = selectedBusGroup ? selectedBusGroup.pickupPoints : [];
      const pickupPointsFilter = pickupPoints.reduce((acc, cur) => ({ ...acc, [cur._id]: true }), {});
      this._pickupPointsFilter.next(pickupPointsFilter);
    });
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }

  setStatusFilter(index: number, value: boolean) {
    this._statusFilter.next({ ...this.statusFilter, [index]: value });
  }

  setPickupPointsFilter(pickupPointId: string, value: boolean) {
    this._pickupPointsFilter.next({ ...this.pickupPointsFilter, [pickupPointId]: value });
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
    const selectedBusGroup = snapshot(this.selectedBusGroup$);
    const pickupPoints = selectedBusGroup ? selectedBusGroup.pickupPoints : [];
    this.dialog.open(RiderDetailsModalComponent, { data: { rider, pickupPoints } });
  }
}
