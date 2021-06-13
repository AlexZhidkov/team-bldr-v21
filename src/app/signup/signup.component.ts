import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Team } from '../models/team';
import { TeamBuilderUser } from '../models/teamBuilderUser';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  memberDoc: AngularFirestoreDocument<TeamBuilderUser>;
  member: Observable<TeamBuilderUser | undefined>;
  teamId: string;
  team: Observable<Team | undefined>;
  isLoading = true;

  constructor(
    private auth: AngularFireAuth,
    private afs: AngularFirestore,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.auth.user.subscribe(user => {
      if (!user) {
        this.isLoading = false;
        return;
      }
      this.teamId = <string>this.route.snapshot.paramMap.get('id');

      if (!this.teamId) {
        this.afs.doc<TeamBuilderUser>(`users/${user.uid}`).get().subscribe((userDoc) => {
          const user = userDoc.data();
          if (user) {
            this.teamId = user.teamId;
            this.team = this.afs.doc<Team>(`teams/${this.teamId}`).valueChanges();
            this.getMemberInfo(user.uid);
          }
        })
      } else {
        this.team = this.afs.doc<Team>(`teams/${this.teamId}`).valueChanges();
        this.afs.doc(`users/${user.uid}`).update({ teamId: this.teamId });
        this.afs.collection(`teams/${this.teamId}/members`).doc(user.uid).set({
          name: user.displayName,
          phoneNumber: user.phoneNumber,
        }).then(() => {
          this.getMemberInfo(user.uid);
        })
      }
    },
      (error) => {
        console.error(error);
        this.isLoading = false;
      });
  }

  getMemberInfo(userId: string) {
    this.memberDoc = this.afs.collection(`teams/${this.teamId}/members`).doc(userId);
    this.member = this.memberDoc.valueChanges();
    this.isLoading = false;
  }

}