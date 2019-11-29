export interface BusPickupPoint {
    id: string;
    name: string;
}

export interface BusGroup {
    _id: string;
    name: string;
    pickupPoints: BusPickupPoint[];
}

export enum RiderStatus {
    Absent = 0,
    AttendingNoPermit = 1,
    AttendingWithPermit = 2
}

export interface Rider {
    _id: string;
    name: string;
    busGroupId: string;
    status: RiderStatus;
    phone: string;
    parentPhone: string;
    parentName: string;
}
