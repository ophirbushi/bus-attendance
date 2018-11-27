import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  students: string[] = [
    'a', 'b', 'c', 'd', 'e'
  ];

  onIndexChange(index: number) {

  }
}
