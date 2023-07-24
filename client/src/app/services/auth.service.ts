import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }
  currentUserEmitter = new Subject<{username: string, avatarPath: string}>();
  private currentUser: string = "";
  setCurrentUser(user: { username: string, avatarPath: string }) {
    this.currentUserEmitter.next({ username: user.username, avatarPath: user.avatarPath });
    this.currentUser = user.username; 
    console.log(this.currentUser);
  }
  getCurrentUser(): string {
    return this.currentUser;
  }
}
