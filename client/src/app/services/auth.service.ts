import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }
  currentUserEmitter = new Subject<string>();
  private currentUser: string = "";
  setCurrentUser(username: string) {
    this.currentUserEmitter.next(username);
    this.currentUser = username; 
  }
  getCurrentUser(): string {
    return this.currentUser;
  }
}
