import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  user: firebase.User | null;
  tribe: any;
  members: any[];

  constructor(
    private auth: AngularFireAuth,
    private afs: AngularFirestore
  ) { }

  ngOnInit(): void {
    this.auth.user.subscribe(user => {
      this.user = user;

      this.afs.doc('tribes/test').get().subscribe(doc => this.tribe = doc.data());
      var membersCollection = this.afs.collection<any>('tribes/test/members');
      membersCollection.valueChanges().subscribe(list => this.members = list);
    });
  }

}
