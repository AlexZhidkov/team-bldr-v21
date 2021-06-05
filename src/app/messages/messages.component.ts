import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  user: firebase.default.User | null;
  private messagesCollection: AngularFirestoreCollection<any>;
  messages: Observable<any[]>;
  text: string;
  tribeId = 'test';
  eventId: string | null;

  constructor(
    private auth: AngularFireAuth,
    private afs: AngularFirestore,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.eventId = this.route.snapshot.paramMap.get('id');
    this.auth.user.subscribe(user => {
      this.user = user;
    });
    this.messagesCollection = this.afs.collection<any>(`tribes/${this.tribeId}/events/${this.eventId}/messages`, ref =>
      ref.orderBy('ts', 'desc'));
    this.messages = this.messagesCollection.valueChanges();
  }

  sendMessage() {
    this.messagesCollection.add({
      userId: this.user?.uid,
      img: this.user?.photoURL,
      name: this.user?.displayName,
      ts: new Date(),
      text: this.text
    });
    this.text = "";
  }
}
