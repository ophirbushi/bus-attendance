import { Reducer } from 'roxanne';
import { AppState, SetPersonStatusPayload } from './interfaces';
import { AppActions } from './actions';

export const appReducer = new Reducer<AppState, AppActions>(
  function (state, action, payload) {
    if (this.is('setPersonStatus', action, payload)) {
      return setPersonStatus(state, payload);
    }

    return state;
  }
);

function setPersonStatus(state: AppState, payload: SetPersonStatusPayload): AppState {
  const { personId, personStatus } = payload;
  const persons = state.persons.slice();
  const index = persons.findIndex(p => p._id === personId);
  if (index > -1) {
    persons[index].status = personStatus;
  }
  return { ...state, persons };
}
