import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Member, MemberEventStatus } from '../models/member';
import { Team } from '../models/team';
import { TeamEvent } from '../models/team-event';

@Component({
  selector: 'app-team-event',
  templateUrl: './team-event.component.html',
  styleUrls: ['./team-event.component.css']
})
export class TeamEventComponent implements OnInit {
  team: Team;
  teamId: string;
  eventId: string;
  teamEvent: Observable<TeamEvent | undefined>;
  eventDate: Date;

  constructor(
    private afs: AngularFirestore,
    private auth: AngularFireAuth,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.auth.user.subscribe(user => {
      if (!user) {
        console.error('User object is falsy');
        return;
      }

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
        console.error('Event ID is falsy');
        return;
      }

      const status = this.route.snapshot.paramMap.get('status');
      if (status === 'accepted' || status === 'rejected') {
        this.afs.doc<Member>(`teams/${this.teamId}/events/${this.eventId}/members/${user.uid}`).update({ status: <MemberEventStatus>status });
      }

      this.afs.doc<Team>(`teams/${this.teamId}`).get().subscribe(doc => {
        const teamData = doc.data();
        if (teamData) {
          this.team = teamData;
        }
      })

      this.teamEvent = this.afs.doc<TeamEvent>(`teams/${this.teamId}/events/${this.eventId}`).valueChanges();
      this.teamEvent.subscribe(te => {
        if (te?.dateTime) {
          this.eventDate = (te.dateTime as firebase.default.firestore.Timestamp).toDate();
        }
      });
    })
  }
}
