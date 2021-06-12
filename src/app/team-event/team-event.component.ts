import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
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
      console.error('Event ID is falsy');
      return;
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
  }
}
