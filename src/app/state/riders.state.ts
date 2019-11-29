import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Rider, RiderStatus } from '../models';

@Injectable({
    providedIn: 'root'
})
export class RidersState {
    private readonly _riders = new BehaviorSubject<Rider[]>(null);
    readonly riders$ = this._riders.asObservable();
    get riders() {
        return this._riders.getValue();
    }

    setRiders(riders: Rider[]) {
        this._riders.next(riders);
    }

    setRiderStatus(riderId: string, status: RiderStatus) {
        const riders = this.riders.slice();
        const riderIndex = this.riders.findIndex(rider => rider._id === riderId);
        if (riderIndex > -1) {
            riders[riderIndex] = { ...riders[riderIndex], status };
        }
        this.setRiders(riders);
    }
}
