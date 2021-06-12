import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Team } from '../models/team';
import { TeamEvent } from '../models/team-event';
import { TeamBuilderUser } from '../models/teamBuilderUser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  user: TeamBuilderUser;
  teamDoc: AngularFirestoreDocument<Team>;
  team: Team;
  teamEvents: TeamEvent[];
  isAdmin: boolean = false;
  isLoading = true;

  constructor(
    private auth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.auth.user.subscribe(user => {
      if (!user) {
        this.isLoading = false;
        console.error('User object is falsy');
        return;
      }
      this.afs.doc<TeamBuilderUser>(`users/${user.uid}`).get().subscribe(u => {
        this.user = <TeamBuilderUser>u.data();
        this.teamDoc = this.afs.doc<Team>(`teams/${this.user.teamId}`);
        this.teamDoc.valueChanges().subscribe((team) => {
          this.isLoading = false;
          if (!team) {
            console.error('Team is falsy');
            return;
          }
          this.team = team;
          this.isAdmin = team.adminIds.includes(this.user.uid);
        });

        this.afs.collection<TeamEvent>(`/teams/${this.user.teamId}/events`, ref => ref.orderBy('dateTime', 'desc'))
          .valueChanges({ idField: 'id' })
          .subscribe(events => this.teamEvents = events);
      })
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
