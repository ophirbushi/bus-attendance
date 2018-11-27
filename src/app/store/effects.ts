import { AppState, Person, SetPersonStatusPayload } from './interfaces';
import { Store } from 'roxanne';
import { AppActions } from './actions';
import { AngularFirestore } from '@angular/fire/firestore';
import { take, map } from 'rxjs/operators';

export function registerEffects(store: Store<AppState, AppActions>, db: AngularFirestore) {
  store.actions$
    .subscribe(actionPayloadPair => {
      switch (actionPayloadPair.action) {
        case 'setPersonStatus': {
          setPersonStatus(actionPayloadPair.payload as SetPersonStatusPayload);
          break;
        }
        case 'fetchPersons': {
          fetchPersons();
          break;
        }
      }
    });

  function fetchPersons() {
    db.collection<Person>('persons').get()
      .pipe(
        take(1),
        map(response => {
          return response.docs.map(doc => ({ ...doc.data(), _id: doc.id }));
        })
      )
      .subscribe(persons => store.dispatch('fetchPersonsSuccess', persons as any));
  }

  function setPersonStatus(payload: SetPersonStatusPayload) {
    console.log('setting person status', payload);
    db.doc<Person>(`persons/${payload.personId}`).update({ status: payload.personStatus });
  }
}
