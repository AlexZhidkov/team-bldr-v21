import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Message } from '../models/message';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  user: firebase.default.User | null;
  private messagesCollection: AngularFirestoreCollection<Message>;
  messages: Observable<Message[]>;
  text: string;
  teamId = 'test';
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
    this.messagesCollection = this.afs.collection<Message>(`teams/${this.teamId}/events/${this.eventId}/messages`, ref =>
      ref.orderBy('ts', 'desc'));
    this.messages = this.messagesCollection.valueChanges();
  }

  sendMessage() {
    if (!this.user) return;

    this.messagesCollection.add({
      userId: this.user.uid,
      img: this.user.photoURL,
      name: this.user.displayName,
      ts: new Date(),
      text: this.text
    });
    this.text = "";
  }
}
