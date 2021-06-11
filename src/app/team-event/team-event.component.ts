import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';
import { MatListOption } from '@angular/material/list/selection-list';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Member } from '../models/member';
import { Team } from '../models/team';
import { TeamEvent } from '../models/team-event';

@Component({
  selector: 'app-team-event',
  templateUrl: './team-event.component.html',
  styleUrls: ['./team-event.component.css']
})
export class TeamEventComponent implements OnInit {
  user: firebase.default.User | null;
  team: Team;
  members: Member[];
  membersInvited: Member[];
  membersAccepted: Member[];
  membersRejected: Member[];
  eventId: string | null;
  teamId = 'test';
  teamEventDoc: AngularFirestoreDocument<TeamEvent>;
  teamEvent: Observable<TeamEvent | undefined>;
  eventDate: Date;
  eventTime: string;
  eventMembersCollection: AngularFirestoreCollection<Member>;

  constructor(
    private auth: AngularFireAuth,
    private afs: AngularFirestore,
    private fns: AngularFireFunctions,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.eventId = this.route.snapshot.paramMap.get('id');
    if (!this.eventId) {
      console.log('New Event');
      this.eventId = this.afs.createId();
      this.afs.collection(`/teams/${this.teamId}/events`)
        .doc(this.eventId)
        .set({});
    }

    this.afs.doc<Team>(`teams/${this.teamId}`).get().subscribe(doc => {
      const teamData = doc.data();
      if (teamData) {
        this.team = teamData;
      }
    })

    this.teamEventDoc = this.afs.doc<TeamEvent>(`teams/${this.teamId}/events/${this.eventId}`);
    this.teamEvent = this.teamEventDoc.valueChanges();
    this.teamEvent.subscribe(te => {
      if (te?.dateTime) {
        this.eventDate = (te.dateTime as firebase.default.firestore.Timestamp).toDate();
        this.eventTime = this.eventDate.toTimeString().substring(0, 5); // `${this.eventDate.getHours()}:${this.eventDate.getMinutes()}`;
      }
    });

    var membersCollection = this.afs.collection<any>('teams/test/members');
    membersCollection.valueChanges({ idField: 'userId' }).subscribe(list => this.members = list);

    this.eventMembersCollection = this.afs.collection<any>(`teams/${this.teamId}/events/${this.eventId}/members`);
    this.eventMembersCollection.valueChanges({ idField: 'userId' }).subscribe(list => {
      this.membersInvited = list.filter(m => m.status === 'invited');
      this.membersAccepted = list.filter(m => m.status === 'accepted');
      this.membersRejected = list.filter(m => m.status === 'rejected');
    });
  }

  updateEventDate(date: Date): void {
    this.eventDate = date;
    this.updateEventDateTime();
  }

  updateEventTime(time: string): void {
    this.eventTime = time;
    this.updateEventDateTime();
  }

  updateEventDateTime(): void {
    if (!(this.eventDate && this.eventTime)) return;

    this.eventDate.setHours(Number(this.eventTime.substring(0, 2)));
    this.eventDate.setMinutes(Number(this.eventTime.substring(3, 5)));
    this.teamEventDoc.update({ dateTime: this.eventDate });
  }

  sendInvites(selectedMembers: MatListOption[]) {
    selectedMembers.forEach((member: MatListOption) => {
      const userId = member.value.userId;
      this.eventMembersCollection.doc(userId).set({ name: member.value.name, status: 'invited' });
      //this.sendPushMessage(userId);
    });
  }

  sendPushMessage(userId: string) {
    const sendMessage = this.fns.httpsCallable('sendWebpushMessage');
    sendMessage({
      userId: userId,
      webpush:
      {
        notification: {
          title: 'Beach Volleyball on Floreat',
          body: 'game on Saturday at 7:30',
          requireInteraction: true,
          actions: [
            {
              action: "team-bldr-accepted",
              icon: "Check",
              title: "I'm in"
            },
            {
              action: "team-bldr-rejected",
              icon: "Clear",
              title: "Can't make it"
            },
            {
              action: "team-bldr-message",
              icon: "Message",
              title: "Message"
            },
          ],
        },
        fcm_options: {
          link: 'https://team-bldr.web.app/'
        }
      }
    }).subscribe(r => {
      console.log(r);
      debugger;
    });
  }
}
