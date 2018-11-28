export interface AppState {
  persons: Person[];
}

export interface Person {
  _id: string;
  name: string;
  status: PersonStatus;
}

export enum PersonStatus {
  Absent = 0,
  AttendingNoPermit = 1,
  AttendingWithPermit = 2
}

export interface SetPersonStatusPayload {
  personId: string;
  personStatus: PersonStatus;
}
