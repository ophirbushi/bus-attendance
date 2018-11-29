import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { MatSnackBarModule, MatIconModule, MatButtonModule, MatCheckboxModule, MatListModule, MatInputModule } from '@angular/material';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SwiperModule } from 'ngx-swiper-wrapper';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    MatSnackBarModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    MatListModule,
    MatInputModule,
    FormsModule,
    SwiperModule,
  ]
})
export class HomeModule { }
