import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  user: firebase.default.User | null;
  tribe: any;
  teamEvents: any[];
  tribeId = 'test';

  constructor(
    private auth: AngularFireAuth,
    private afs: AngularFirestore,
  ) { }

  ngOnInit(): void {
    this.auth.user.subscribe(user => {
      this.user = user;

      this.afs.doc(`tribes/${this.tribeId}`).get().subscribe(doc => this.tribe = doc.data());
      this.afs.collection<any>(`/tribes/${this.tribeId}/events`, ref => ref.orderBy('dateTime', 'desc'))
        .valueChanges({ idField: 'id' })
        .subscribe(events => this.teamEvents = events);
    });
  }
}
