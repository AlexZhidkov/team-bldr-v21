import { Component, Input, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Member } from '../models/member';

@Component({
  selector: 'app-event-registration',
  templateUrl: './event-registration.component.html',
  styleUrls: ['./event-registration.component.css']
})
export class EventRegistrationComponent implements OnInit {
  @Input() teamId: string;
  @Input() eventId: string;
  memberDoc: AngularFirestoreDocument<Member>;
  currentStatus: string | undefined;

  constructor(
    private auth: AngularFireAuth,
    private afs: AngularFirestore,
  ) { }

  ngOnInit(): void {
    this.auth.user.subscribe(user => {
      if (!user) {
        console.error('User object is falsy');
        return;
      }
      this.memberDoc = this.afs.doc<Member>(`teams/${this.teamId}/events/${this.eventId}/members/${user.uid}`);
      this.memberDoc.valueChanges().subscribe(m => this.currentStatus = m?.status);
    })
  }

  sendResponse(status: 'accepted' | 'rejected' | 'invited'): void {
    this.memberDoc.update({ status: status });
  }
}
