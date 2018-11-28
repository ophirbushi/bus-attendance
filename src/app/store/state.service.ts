import { Injectable } from '@angular/core';
import { AppState, Person } from './interfaces';
import { AppActions } from './actions';
import { Store } from 'roxanne';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Injectable()
export class AppStateService {

  constructor(
    private store: Store<AppState, AppActions>,
    private db: AngularFirestore
  ) { }

  selectPersons(): Observable<Person[]> {
    return this.db.collection<Person>('persons').snapshotChanges()
      .pipe(
        map(response => response.map(p => ({ ...p.payload.doc.data() as Person, _id: p.payload.doc.id })))
      );
  }

  selectPersonStatusChange() {
    return this.db.collection<Person>('persons').snapshotChanges();
  }

  dispatch<ActionType extends keyof AppActions>(action: ActionType, payload: AppActions[ActionType]) {
    this.store.dispatch(action, payload);
  }
}
