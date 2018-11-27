export interface AppState {
  persons: Person[];
}

export interface Person {
  id: string;
  name: string;
  status: PersonStatus;
}

export type PersonStatus = 'absent' | 'attendingNoPermit' | 'attendingWithPermit';

