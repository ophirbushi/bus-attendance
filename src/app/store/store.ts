import { Store } from 'roxanne';
import { AppState } from './interfaces';
import { AppActions } from './actions';
import { appReducer } from './reducer';
import { appInitialState } from './init';
import { registerEffects } from './effects';
import { NgModule } from '@angular/core';
import { AngularFirestoreModule, AngularFirestore } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';

export function generateStore(db: AngularFirestore) {
  const store = new Store<AppState, AppActions>(appInitialState, appReducer);
  registerEffects(store, db);
  return store;
}

@NgModule({
  imports: [
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule
  ],
  providers: [
    { provide: Store, useFactory: generateStore, deps: [AngularFirestore] }
  ]
})
export class AppStoreModule { }
