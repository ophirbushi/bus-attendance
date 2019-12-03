import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { BusGroupesState } from '../state/bus-groups.state';
import { Subject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import { BusGroup } from '../models';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, OnDestroy {
  busGroupsForm: FormArray;
  private readonly destroy = new Subject();

  constructor(private busGroupsState: BusGroupesState) { }

  ngOnInit() {
    this.busGroupsState.busGroups$
      .pipe(
        takeUntil(this.destroy),
        take(1)
      )
      .subscribe(busGroups => {
        this.busGroupsForm = new FormArray(
          busGroups.map(group => this.createNewBusGroupFormGroup(group))
        );
      });
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }

  onFileInputChange(event: any) {
    console.log('onFileInputChange()', event);
  }

  addBusGroup() {
    this.busGroupsForm.insert(this.busGroupsForm.length, this.createNewBusGroupFormGroup());
  }

  private createNewBusGroupFormGroup(existing?: BusGroup): FormGroup {
    return new FormGroup({
      _id: new FormControl(existing ? existing._id : null, Validators.required),
      name: new FormControl(existing ? existing.name : null, Validators.required),
      pickupPoints: new FormArray(
        existing ? existing.pickupPoints.map(point => new FormGroup({
          _id: new FormControl(point._id, Validators.required),
          name: new FormControl(point.name, Validators.required)
        })) : []
      )
    });
  }

}
