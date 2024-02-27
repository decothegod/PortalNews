import { Component, Output } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
  providers: [UserService],
})
export class UserComponent {
  isLoggedIn = true;
  @Output() userId = 1;

  constructor(public service: UserService) {}

  logIn() {
    this.userId = 1;
    this.isLoggedIn = true;
    this.service.setUserId(this.userId);
    console.log(this.isLoggedIn + ', ' + this.userId);
  }

  logOut() {
    this.userId = 0;
    this.isLoggedIn = false;
    this.service.setUserId(this.userId);
    console.log(this.isLoggedIn + ', ' + this.userId);
  }
}
