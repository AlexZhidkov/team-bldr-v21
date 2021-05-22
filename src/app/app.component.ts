import { Component, OnInit } from '@angular/core';
import { FirebaseApp } from '@angular/fire';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { SwPush, SwUpdate } from '@angular/service-worker';
import 'firebase/messaging';
import { LinkMenuItem } from 'ngx-auth-firebaseui';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  user: firebase.default.User | null;
  showSignInButton: boolean = false;
  avatarLinks: LinkMenuItem[] = [
    { icon: 'notifications', text: 'Enable Notifications', callback: () => { this.permitToNotify(); } },
    { icon: 'event_note', text: 'Events', callback: () => { this.router.navigate(['events']); } },
  ];

  constructor(
    private auth: AngularFireAuth,
    private firebaseApp: FirebaseApp,
    private afs: AngularFirestore,
    updates: SwUpdate, push: SwPush,
    private router: Router
  ) {
    updates.available.subscribe(_ => updates.activateUpdate().then(() => {
      console.log('reload for update');
      document.location.reload();
    }));
    push.messages.subscribe(msg => console.log('push message', msg));
    push.notificationClicks.subscribe(click => console.log('notification click', click));

    navigator.serviceWorker.getRegistration().then(serviceWorkerRegistration => {
      const messaging = this.firebaseApp.messaging();
      console.log('MESSAGING SW', serviceWorkerRegistration);
      messaging.getToken({
        vapidKey: 'KEY',
        serviceWorkerRegistration  // this should be the fix for angularfire not working with ngsw
      })
    })
  }

  permitToNotify() {
    const messaging = this.firebaseApp.messaging();
    Notification.requestPermission()
      .then(() => messaging.getToken().then(token => {
        console.log('Register token ', token);
        this.afs.doc<any>(`tribes/test/members/${this.user?.uid}`).update({ fcmToken: token });
      }))
      .catch(err => {
        console.log('Unable to get permission to notify.', err);
      });
  }

  ngOnInit(): void {
    this.auth.user.subscribe(user => {
      this.user = user;
      this.showSignInButton = Boolean(!user);
    });
  }

  onSignOut(): void {
    this.router.navigate(['/']).then(() => location.reload());
  }
}
