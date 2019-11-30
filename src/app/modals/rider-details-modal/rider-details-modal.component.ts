import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Rider, BusGroup, BusPickupPoint } from 'src/app/models';
import { Observable, empty } from 'rxjs';

@Component({
  selector: 'app-rider-details-modal',
  templateUrl: './rider-details-modal.component.html',
  styleUrls: ['./rider-details-modal.component.scss']
})
export class RiderDetailsModalComponent implements OnInit {
  readonly pickupPointName: string = this.getPickupPointName(this.data);

  constructor(@Inject(MAT_DIALOG_DATA) public data: { rider: Rider, pickupPoints: BusPickupPoint[] }) { }

  ngOnInit() {
  }

  private getPickupPointName(data: { rider: Rider, pickupPoints: BusPickupPoint[] }): string {
    if (
      !data ||
      !data.rider ||
      !data.rider.pickupPointId ||
      !data.pickupPoints
    ) {
      return null;
    }

    const pickupPoint = data.pickupPoints.find(point => point._id === data.rider.pickupPointId);

    if (!pickupPoint) {
      return null;
    }

    return pickupPoint.name;
  }

}
