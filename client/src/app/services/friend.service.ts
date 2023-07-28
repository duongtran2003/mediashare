import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FriendService {

  currentFriendList: string[] = [];

  updateFriendList(friends: any[]) {
    this.currentFriendList = friends.map(friend => friend.name);
  }

  isFriend(name: string) {
    return this.currentFriendList.includes(name);
  }
}
