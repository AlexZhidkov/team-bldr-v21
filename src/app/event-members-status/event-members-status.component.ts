import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Member } from '../models/member';

@Component({
  selector: 'app-event-members-status',
  templateUrl: './event-members-status.component.html',
  styleUrls: ['./event-members-status.component.css']
})
export class EventMembersStatusComponent implements OnInit {
  @Input() teamId: string;
  @Input() eventId: string;
  eventMembersCollection: AngularFirestoreCollection<Member>;
  membersInvited: Member[];
  membersAccepted: Member[];
  membersRejected: Member[];

  constructor(
    private afs: AngularFirestore,

  ) { }

  ngOnInit(): void {
    this.eventMembersCollection = this.afs.collection<any>(`teams/${this.teamId}/events/${this.eventId}/members`);
    this.eventMembersCollection.valueChanges({ idField: 'userId' }).subscribe(list => {
      this.membersInvited = list.filter(m => m.status === 'invited');
      this.membersAccepted = list.filter(m => m.status === 'accepted');
      this.membersRejected = list.filter(m => m.status === 'rejected');
    });
  }

}
