import { Injectable } from '@angular/core';
import { RiderStatus, Rider, BusGroup } from '../models';
import { AngularFirestore, AngularFirestoreCollection, DocumentChangeAction } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class DataService {
    private get ridersCollection(): AngularFirestoreCollection<Rider> {
        return this.db.collection(environment.ridersCollection);
    }
    private get busGroupsCollection(): AngularFirestoreCollection<BusGroup> {
        return this.db.collection(environment.busGroupsCollection);
    }
    riders$: Observable<Rider[]> = this.select(this.ridersCollection);
    busGroups$: Observable<BusGroup[]> = this.select(this.busGroupsCollection);

    constructor(private db: AngularFirestore) { }

    updateRiderStatus(riderId: string, status: RiderStatus): Observable<any> {
        return from(this.ridersCollection.doc(riderId).update({ status }));
    }

    private select<T>(collection: AngularFirestoreCollection<T>): Observable<T[]> {
        return collection.snapshotChanges().pipe(
            map((changeActions) => {
                return changeActions.map((action) => {
                    const { doc } = action.payload;
                    return { ...doc.data(), _id: doc.id };
                });
            })
        );
    }
}
