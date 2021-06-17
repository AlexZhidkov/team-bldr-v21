import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-invite-url',
  templateUrl: './invite-url.component.html',
  styleUrls: ['./invite-url.component.css']
})
export class InviteUrlComponent implements OnInit {
  @Input() teamId: string;
  signupURL: string;

  constructor() { }

  ngOnInit(): void {
    this.signupURL = `https://team-bldr.web.app/signup/${this.teamId}`;
  }

}
