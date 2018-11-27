import { Reducer } from 'roxanne';
import { AppState } from './interfaces';
import { AppActions, SetPersonStatusPayload } from './actions';
import { PERSONS } from './mocks';

export const appReducer = new Reducer<AppState, AppActions>(
  function (state, action, payload) {
    if (this.is('setPersonStatus', action, payload)) {
      return setPersonStatus(state, payload);
    }
    if (this.is('generatePersons', action)) {
      return { ...state, persons: PERSONS.slice() };
    }
    return state;
  }
);

function setPersonStatus(state: AppState, payload: SetPersonStatusPayload): AppState {
  const { personIndex, personStatus } = payload;
  const persons = state.persons.slice();
  persons[personIndex].status = personStatus;
  return { ...state, persons };
}
