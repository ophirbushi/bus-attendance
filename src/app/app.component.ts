import { Component, OnInit, OnDestroy } from '@angular/core';
import { SWUpdateService } from './sw-update.service';
import { DataService } from './data/data.service';
import { RidersState } from './state/riders.state';
import { BusGroupesState } from './state/bus-groups.state';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from './auth/auth.service';
import { UIState } from './state/ui.state';
import { Router, NavigationStart, NavigationCancel, NavigationError, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  user$ = this.authService.authState$;
  isAdmin$ = this.authService.isAdmin$;
  loading$ = this.uiState.loading$;
  private readonly destroy = new Subject();

  constructor(
    private authService: AuthService,
    private swUpdateService: SWUpdateService,
    private busGroupsState: BusGroupesState,
    private ridersState: RidersState,
    private uiState: UIState,
    private dataService: DataService,
    private router: Router
  ) { }

  ngOnInit() {
    this.swUpdateService.listenForUpdates();

    this.router.events.pipe(takeUntil(this.destroy))
      .subscribe(event => {
        if (event instanceof NavigationStart) {
          this.uiState.setLoading(true);
        } else if (
          event instanceof NavigationEnd ||
          event instanceof NavigationError ||
          event instanceof NavigationCancel
        ) {
          this.uiState.setLoading(false);
        }
      });

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
