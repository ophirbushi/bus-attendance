import { Store } from 'roxanne';
import { AppState } from './interfaces';
import { AppActions } from './actions';
import { appReducer } from './reducer';
import { appInitialState } from './init';
import { registerEffects } from './effects';
import { NgModule } from '@angular/core';

function generateStore() {
  const store = new Store<AppState, AppActions>(appInitialState, appReducer);
  registerEffects(store);
  return store;
}

@NgModule({
  providers: [{ provide: Store, useFactory: generateStore }]
})
export class AppStoreModule { }
