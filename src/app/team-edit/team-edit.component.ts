import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Tribe } from '../models/tribe';

@Component({
  selector: 'app-team-edit',
  templateUrl: './team-edit.component.html',
  styleUrls: ['./team-edit.component.css']
})
export class TeamEditComponent implements OnInit {
  user: firebase.default.User | null;
  teamDoc: AngularFirestoreDocument<Tribe>;
  team: Observable<Tribe | undefined>;
  tribeId = 'test';
  isLoading = true;

  constructor(
    private auth: AngularFireAuth,
    private afs: AngularFirestore,
  ) { }

  ngOnInit(): void {
    this.auth.user.subscribe(user => {
      this.user = user;
      if (!this.user) {
        this.isLoading = false;
        return;
      }

      this.teamDoc = this.afs.doc<Tribe>(`tribes/${this.tribeId}`);
      this.team = this.teamDoc.valueChanges();
      this.team.subscribe(() => this.isLoading = false);
    },
      (error) => {
        console.error(error);
        this.isLoading = false;
      });
  }

}
