import { Injectable } from '@angular/core';
import { User } from '../interfaces/news.interfaces';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  userId = 0;
  username = '';
  constructor() {}

  setUserId(id: number) {
    this.userId = id;
  }

  getUserId() {
    return this.userId;
  }
}
