import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SendMessageComponent } from './send-message/send-message.component';
import { TeamEventComponent } from './team-event/team-event.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'event/:id', component: TeamEventComponent },
  { path: 'message', component: SendMessageComponent },
  { path: '', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
