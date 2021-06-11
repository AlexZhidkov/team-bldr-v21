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
  user: firebase.default.User | null;
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
      this.user = user;
      if (!this.user) {
        this.isLoading = false;
        return;
      }

      this.teamId = <string>this.route.snapshot.paramMap.get('id');

      this.teamDoc = this.afs.doc<Team>(`teams/${this.teamId}`);
      this.team = this.teamDoc.valueChanges();
      this.team.subscribe(t => {
        if (!t) {
          this.afs.collection(`teams`)
            .doc(this.teamId)
            .set({ adminIds: [this.user?.uid] });
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
