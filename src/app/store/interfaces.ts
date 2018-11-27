export interface AppState {
  persons: Person[];
}

export interface Person {
  _id: string;
  name: string;
  status: PersonStatus;
}

export type PersonStatus = 'absent' | 'attendingNoPermit' | 'attendingWithPermit';

export interface SetPersonStatusPayload {
  personId: string;
  personStatus: PersonStatus;
}
