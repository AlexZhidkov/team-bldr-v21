import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { TeamEvent } from '../models/team-event';
import { Tribe } from '../models/tribe';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  user: firebase.default.User | null;
  tribeDoc: AngularFirestoreDocument<Tribe>;
  tribe: Observable<Tribe | undefined>;
  teamEvents: TeamEvent[];
  tribeId = 'test';

  constructor(
    private auth: AngularFireAuth,
    private afs: AngularFirestore,
  ) { }

  ngOnInit(): void {
    this.auth.user.subscribe(user => {
      this.user = user;

      this.tribeDoc = this.afs.doc<Tribe>(`tribes/${this.tribeId}`);
      this.tribe = this.tribeDoc.valueChanges();

      this.afs.collection<TeamEvent>(`/tribes/${this.tribeId}/events`, ref => ref.orderBy('dateTime', 'desc'))
        .valueChanges({ idField: 'id' })
        .subscribe(events => this.teamEvents = events);
    });
  }

  teamEventDateTime(dateTime: Date | firebase.default.firestore.Timestamp) {
    return (<firebase.default.firestore.Timestamp>dateTime)?.toDate();
  }

}
