import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BusGroup } from '../models';

@Injectable({
    providedIn: 'root'
})
export class BusGroupesState {
    private readonly _busGroups = new BehaviorSubject<BusGroup[]>(null);
    readonly busGroups$ = this._busGroups.asObservable();
    get busGroups() {
        return this._busGroups.getValue();
    }

    setBusGroups(busGroups: BusGroup[]) {
        this._busGroups.next(busGroups);
    }
}
