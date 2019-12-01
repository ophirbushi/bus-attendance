import { Component, OnInit, OnDestroy } from '@angular/core';
import { SWUpdateService } from './sw-update.service';
import { DataService } from './data/data.service';
import { RidersState } from './state/riders.state';
import { BusGroupesState } from './state/bus-groups.state';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  user$ = this.authService.user$;
  private readonly destroy = new Subject();

  constructor(
    private authService: AuthService,
    private swUpdateService: SWUpdateService,
    private busGroupsState: BusGroupesState,
    private ridersState: RidersState,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.swUpdateService.listenForUpdates();

    this.dataService.busGroups$
      .pipe(takeUntil(this.destroy))
      .subscribe(groups => this.busGroupsState.setBusGroups(groups));

    this.dataService.riders$
      .pipe(takeUntil(this.destroy))
      .subscribe(riders => this.ridersState.setRiders(riders));
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }

  signOut() {
    this.authService.signOut()
      .subscribe(() => {
        location.href = location.href;
      });
  }

}
