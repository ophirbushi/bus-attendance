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
      }
    });

  function setPersonStatus(payload: SetPersonStatusPayload) {
    console.log('setting person status', payload);
    db.doc<Person>(`${[payload.bus]}/${payload.personId}`).update({ status: payload.personStatus });
  }
}
