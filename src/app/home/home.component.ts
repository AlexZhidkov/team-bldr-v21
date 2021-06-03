import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';
import { MatListOption } from '@angular/material/list/selection-list';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  user: firebase.default.User | null;
  tribe: any;
  members: any[];

  constructor(
    private auth: AngularFireAuth,
    private afs: AngularFirestore,
    private fns: AngularFireFunctions,
  ) { }

  ngOnInit(): void {
    this.auth.user.subscribe(user => {
      this.user = user;

      this.afs.doc('tribes/test').get().subscribe(doc => this.tribe = doc.data());
      var membersCollection = this.afs.collection<any>('tribes/test/members');
      membersCollection.valueChanges({ idField: 'userId' }).subscribe(list => this.members = list);
    });
  }

  sendMessages(selectedMembers: MatListOption[]) {
    selectedMembers.forEach((member: MatListOption) => {
      console.log(member.value);
      const sendMessage = this.fns.httpsCallable('sendTestMessageToAlexPhone');
      sendMessage({
        userId: member.value.userId,
        webpush:
        {
          notification: {
            title: 'Beach Volleyball on Floreat',
            body: 'game on Saturday at 7:30',
            requireInteraction: true,
            actions: [
              {
                action: "accepted",
                icon: "Check",
                title: "I'm in"
              },
              {
                action: "rejected",
                icon: "Clear",
                title: "Can't make it"
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
    });
  }
}
