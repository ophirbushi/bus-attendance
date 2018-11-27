import { PersonStatus } from './interfaces';

export interface AppActions {
  setPersonStatus: SetPersonStatusPayload;
  generatePersons: null;
}

export interface SetPersonStatusPayload {
  personIndex: number;
  personStatus: PersonStatus;
}
