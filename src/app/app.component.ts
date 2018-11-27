import { Component, OnInit } from '@angular/core';
import { SWUpdateService } from './sw-update.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  searchString = '';
  students: string[] = [
    'a', 'b', 'c', 'd', 'ba'
  ];

  constructor(private swUpdateService: SWUpdateService) { }

  ngOnInit() {
    this.swUpdateService.listenForUpdates();
  }

  onIndexChange(index: number) {
    console.log('onIndexChange', index);
  }

  shouldHide(student: string): boolean {
    return this.searchString && student.toUpperCase().indexOf(this.searchString.toUpperCase()) === -1;
  }
}
