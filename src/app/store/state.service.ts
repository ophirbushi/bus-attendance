import { Injectable } from '@angular/core';
import { AppState, Person } from './interfaces';
import { AppActions } from './actions';
import { Store } from 'roxanne';
import { Observable, from } from 'rxjs';
import { AngularFirestore, DocumentChangeAction } from '@angular/fire/firestore';
import { map, tap, switchMap } from 'rxjs/operators';

@Injectable()
export class AppStateService {

  constructor(
    private store: Store<AppState, AppActions>,
    private db: AngularFirestore
  ) { }

  selectPersons(): Observable<Person[]> {
    return this.db.collection<Person>('persons').snapshotChanges()
      .pipe(
        map(response => response.map(a => this.actionToPersonWithId(a)))
      );
  }

  selectHaifa(): Observable<Person[]> {
    return this.db.collection<Person>('haifa').snapshotChanges()
      .pipe(
        map(response => response.map(a => this.actionToPersonWithId(a)))
      );
  }

  selectCenter(): Observable<Person[]> {
    return this.db.collection<Person>('center').snapshotChanges()
      .pipe(
        map(response => response.map(a => this.actionToPersonWithId(a)))
      );
  }

  selectPersonStatusChange() {
    return this.db.collection<Person>('persons').snapshotChanges()
      .pipe(
        map(changeActions => changeActions.filter(p => p.payload.type === 'modified')),
        map(changeActions => changeActions.map(a => this.actionToPersonWithId(a))),
        switchMap(persons => from(persons))
      );
  }

  dispatch<ActionType extends keyof AppActions>(action: ActionType, payload: AppActions[ActionType]) {
    this.store.dispatch(action, payload);
  }

  private actionToPersonWithId(action: DocumentChangeAction<Person>): Person {
    const { doc } = action.payload;
    return { ...doc.data(), _id: doc.id };
  }
}
