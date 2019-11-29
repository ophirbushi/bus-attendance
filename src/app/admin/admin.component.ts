import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { GROUPED } from '../grouped';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  constructor(private db: AngularFirestore) { }

  ngOnInit() {
    console.log(GROUPED.center.length);
    this.db.collection('center').valueChanges().subscribe(console.log);

    GROUPED.center.forEach(person => {
      this.addPerson(person);
    });
  }

  addPerson(person) {
    // Persist a document id
    const id = this.db.createId();
    person = { ...person, id, status: 0 };
    this.db.collection('center').doc(id).set(person);
  }

}
