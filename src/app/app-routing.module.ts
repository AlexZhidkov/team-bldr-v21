import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoggedInGuard } from 'ngx-auth-firebaseui';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { MessagesComponent } from './messages/messages.component';
import { TeamEditComponent } from './team-edit/team-edit.component';
import { TeamEventComponent } from './team-event/team-event.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'team/:id', component: TeamEditComponent, canActivate: [LoggedInGuard] },
  { path: 'event/:id', component: TeamEventComponent, canActivate: [LoggedInGuard] },
  { path: 'event', component: TeamEventComponent, canActivate: [LoggedInGuard] },
  { path: 'messages/:id', component: MessagesComponent, canActivate: [LoggedInGuard] },
  { path: '', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
