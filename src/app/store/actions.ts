import { SetPersonStatusPayload, Person } from './interfaces';

export interface AppActions {
  setPersonStatus: SetPersonStatusPayload;
  fetchPersons: null;
  fetchPersonsSuccess: Person[];
}
