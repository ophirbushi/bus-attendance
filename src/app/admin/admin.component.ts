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
    // console.log(GROUPED.haifa.length);
    //     this.db.collection('haifa').valueChanges().subscribe(console.log);

    // GROUPED.haifa.forEach(person => {
    //   this.addPerson(person.name);
    // });
  }

  addPerson(name: string) {
    // Persist a document id
    // const id = this.db.createId();
    // const person = { id, name, status: 0 };
    // this.db.collection('haifa').doc(id).set(person);
  }

}
