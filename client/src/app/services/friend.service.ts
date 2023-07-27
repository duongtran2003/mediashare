import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FriendService {

  currentFriendList: string[] = [];

  constructor() { }

  updateFriendList(friends: any[]) {
    this.currentFriendList = friends.map(friend => friend.name);
    console.log(this.currentFriendList);
  }

  isFriend(name: string) {
    return this.currentFriendList.includes(name);
  }
}
