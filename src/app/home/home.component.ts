import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Team } from '../models/team';
import { TeamEvent } from '../models/team-event';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  user: firebase.default.User | null;
  teamDoc: AngularFirestoreDocument<Team>;
  team: Observable<Team | undefined>;
  teamEvents: TeamEvent[];
  teamId = 'test';
  isLoading = true;

  constructor(
    private auth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.auth.user.subscribe(user => {
      this.user = user;
      if (!this.user) {
        this.isLoading = false;
        return;
      }

      this.teamDoc = this.afs.doc<Team>(`teams/${this.teamId}`);
      this.team = this.teamDoc.valueChanges();
      this.team.subscribe(() => this.isLoading = false);

      this.afs.collection<TeamEvent>(`/teams/${this.teamId}/events`, ref => ref.orderBy('dateTime', 'desc'))
        .valueChanges({ idField: 'id' })
        .subscribe(events => this.teamEvents = events);
    },
      (error) => {
        console.error(error);
        this.isLoading = false;
      });
  }

  teamEventDateTime(dateTime: Date | firebase.default.firestore.Timestamp) {
    return (<firebase.default.firestore.Timestamp>dateTime)?.toDate();
  }

  createNewTeam() {
    const newTeamId = this.afs.createId();
    this.router.navigate(['team', newTeamId]);
  }
}
