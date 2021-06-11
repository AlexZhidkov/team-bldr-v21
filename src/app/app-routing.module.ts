import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoggedInGuard } from 'ngx-auth-firebaseui';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { MessagesComponent } from './messages/messages.component';
import { SignupComponent } from './signup/signup.component';
import { TeamEditComponent } from './team-edit/team-edit.component';
import { TeamEventComponent } from './team-event/team-event.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup/:id', component: SignupComponent, canActivate: [LoggedInGuard] },
  { path: 'team/:id', component: TeamEditComponent, canActivate: [LoggedInGuard] },
  { path: 'event/:teamId/:eventId', component: TeamEventComponent, canActivate: [LoggedInGuard] },
  { path: 'event/:teamId', component: TeamEventComponent, canActivate: [LoggedInGuard] },
  { path: 'messages/:teamId/:eventId', component: MessagesComponent, canActivate: [LoggedInGuard] },
  { path: '', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
