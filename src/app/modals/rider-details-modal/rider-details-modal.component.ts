import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Rider } from 'src/app/models';

@Component({
  selector: 'app-rider-details-modal',
  templateUrl: './rider-details-modal.component.html',
  styleUrls: ['./rider-details-modal.component.scss']
})
export class RiderDetailsModalComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public rider: Rider) { }

  ngOnInit() {
  }

}
