import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';
import { MatListOption, MatSelectionList } from '@angular/material/list';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Member } from '../models/member';
import { Team } from '../models/team';
import { TeamEvent } from '../models/team-event';

@Component({
  selector: 'app-event-admin',
  templateUrl: './event-admin.component.html',
  styleUrls: ['./event-admin.component.css']
})
export class EventAdminComponent implements OnInit {
  @ViewChild('membersList') membersList: MatSelectionList;

  team: Team;
  members: Member[];
  teamId: string;
  eventId: string;
  teamEventDoc: AngularFirestoreDocument<TeamEvent>;
  teamEvent: Observable<TeamEvent | undefined>;
  eventDate: Date;
  eventTime: string;
  message: string | undefined;
  eventMembersCollection: AngularFirestoreCollection<Member>;
  showMessages: boolean = false;
  showMembers: boolean = true;

  constructor(
    private afs: AngularFirestore,
    private fns: AngularFireFunctions,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    const teamId = this.route.snapshot.paramMap.get('teamId');
    if (teamId) {
      this.teamId = teamId;
    } else {
      console.error('Team ID is falsy');
      return;
    }

    const eventId = this.route.snapshot.paramMap.get('eventId');
    if (eventId) {
      this.eventId = eventId;
    }
    else {
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
      this.message = te?.name;
    });

    var membersCollection = this.afs.collection<any>(`teams/${this.teamId}/members`);
    membersCollection.valueChanges({ idField: 'userId' }).subscribe(list => this.members = list);

    this.eventMembersCollection = this.afs.collection<any>(`teams/${this.teamId}/events/${this.eventId}/members`);
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
      this.sendEmail(userId);
      //this.sendPushMessage(userId);
    });
  }

  sendEmail(userId: string) {
    const sendEmail = this.fns.httpsCallable('sendEmail');
    const data = {
      memberEmail: 'azhidkov@gmail.com',
      teamName: this.team.name,
      teamId: this.teamId,
      eventId: this.eventId,
      // https://stackoverflow.com/questions/63912795/how-to-pass-a-js-date-object-to-cloud-function-for-storing-it-on-firestore
      dateTime: this.eventDate.getTime(),
      message: this.message,
    };
    sendEmail(data).subscribe(r => {
      console.log(r);
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
    });
  }
}
