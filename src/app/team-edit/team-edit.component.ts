import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Team } from '../models/team';

@Component({
  selector: 'app-team-edit',
  templateUrl: './team-edit.component.html',
  styleUrls: ['./team-edit.component.css']
})
export class TeamEditComponent implements OnInit {
  user: firebase.default.User;
  teamDoc: AngularFirestoreDocument<Team>;
  team: Observable<Team | undefined>;
  teamId: string;
  isLoading = true;

  constructor(
    private auth: AngularFireAuth,
    private afs: AngularFirestore,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.auth.user.subscribe(user => {
      if (!user) {
        this.isLoading = false;
        return;
      }
      this.user = user;
      this.teamId = <string>this.route.snapshot.paramMap.get('id');
      this.teamDoc = this.afs.doc<Team>(`teams/${this.teamId}`);
      this.team = this.teamDoc.valueChanges();
      this.team.subscribe(t => {
        if (!t) {
          this.afs.collection(`teams`)
            .doc(this.teamId)
            .set({ adminIds: [this.user?.uid] });
          this.afs.collection('users').doc(this.user?.uid).update({ teamId: this.teamId });
          this.afs.collection(`teams/${this.teamId}/members`).doc(this.user.uid).set({
            name: user.displayName,
            phoneNumber: user.phoneNumber,
          })
        }
        this.isLoading = false;
      });
    },
      (error) => {
        console.error(error);
        this.isLoading = false;
      });
  }

}
