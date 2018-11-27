import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  searchString = '';
  students: string[] = [
    'a', 'b', 'c', 'd', 'ba'
  ];

  onIndexChange(index: number) {
    console.log('onIndexChange', index);
  }

  shouldHide(student: string): boolean {
    return this.searchString && student.toUpperCase().indexOf(this.searchString.toUpperCase()) === -1;
  }
}
