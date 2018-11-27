import { PersonStatus, AppState } from './interfaces';
import { Store } from 'roxanne';
import { AppActions } from './actions';

export function registerEffects(store: Store<AppState, AppActions>) {
  store.actions$
    .subscribe(actionPayloadPair => {
      switch (actionPayloadPair.action) {
        case 'setPersonStatus': {
          onSetPersonStatus(actionPayloadPair.payload);
          break;
        }
        default: {
          console.warn('unknown action type', actionPayloadPair);
          return;
        }
      }
    });
}

function onSetPersonStatus(payload: PersonStatus) {
  console.log('onSetPersonStatus()', payload);
}
