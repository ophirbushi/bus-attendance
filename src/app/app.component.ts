import { Component } from '@angular/core';
import { SWUpdateService } from './sw-update.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private swUpdateService: SWUpdateService) {
    this.swUpdateService.listenForUpdates();
  }

}
