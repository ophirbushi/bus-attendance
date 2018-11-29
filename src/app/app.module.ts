import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {
  MatToolbarModule, MatListModule, MatInputModule, MatSnackBarModule, MatIconModule, MatButtonModule,
  MatCheckboxModule
} from '@angular/material';

import { SwiperModule } from 'ngx-swiper-wrapper';

import { AppComponent } from './app.component';
import { FilterPipe } from './filter.pipe';
import { FormsModule } from '@angular/forms';
import { AppStoreModule } from './store';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    FilterPipe
  ],
  imports: [
    AppStoreModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    MatToolbarModule,
    MatListModule,
    MatInputModule,
    SwiperModule,
    MatSnackBarModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
