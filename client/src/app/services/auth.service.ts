import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }
  currentUser = new Subject<string>();
  setCurrentUser(username: string) {
    this.currentUser.next(username);
  }
}
