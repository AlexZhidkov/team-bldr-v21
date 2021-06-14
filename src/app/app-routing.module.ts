import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanActivateGuard } from './can-activate.guard';
import { EventAdminComponent } from './event-admin/event-admin.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { TeamEditComponent } from './team-edit/team-edit.component';
import { TeamEventComponent } from './team-event/team-event.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: SignupComponent, canActivate: [CanActivateGuard] },
  { path: 'signup/:id', component: SignupComponent, canActivate: [CanActivateGuard] },
  { path: 'team/:id', component: TeamEditComponent, canActivate: [CanActivateGuard] },
  { path: 'event/:teamId/:eventId/:status', component: TeamEventComponent, canActivate: [CanActivateGuard] },
  { path: 'event/:teamId/:eventId', component: TeamEventComponent, canActivate: [CanActivateGuard] },
  { path: 'event-admin/:teamId/:eventId', component: EventAdminComponent, canActivate: [CanActivateGuard] },
  { path: 'event-admin/:teamId', component: EventAdminComponent, canActivate: [CanActivateGuard] },
  { path: '', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
