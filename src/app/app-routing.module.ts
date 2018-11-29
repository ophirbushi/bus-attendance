import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin/admin.component';
import { AdminGuard } from './admin/admin.guard';

@NgModule({
  imports: [
    RouterModule.forRoot([
      {
        path: '',
        component: HomeComponent
      },
      {
        path: 'admin',
        component: AdminComponent,
        canActivate: [AdminGuard]
      }
    ])
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
