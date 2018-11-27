import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { MatSnackBar } from '@angular/material/snack-bar';

import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SWUpdateService {

  listeningForUpdates = false;

  constructor(private updates: SwUpdate, private snackBar: MatSnackBar) { }

  listenForUpdates() {
    if (this.listeningForUpdates) {
      return;
    }
    this.listeningForUpdates = true;
    this.updates.available
      .subscribe(() => {
        this.snackBar
          .open('גרסה חדשה זמינה. לחץ על "רענן"', 'רענן')
          .onAction()
          .pipe(take(1))
          .subscribe(() => {
            this.updates.activateUpdate().then(() => document.location.reload());
          });
      });
  }
}
