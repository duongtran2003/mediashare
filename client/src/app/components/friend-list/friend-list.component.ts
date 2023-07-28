import { Component, OnInit, inject } from '@angular/core';
import { IconDefinition } from '@fortawesome/free-regular-svg-icons';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { AuthService } from 'src/app/services/auth.service';
import { ApiService } from 'src/app/services/api.service';
import { ToastService } from 'src/app/services/toast.service';
import { faUserFriends } from '@fortawesome/free-solid-svg-icons';
import { Socket } from 'ngx-socket-io';
import { FriendService } from 'src/app/services/friend.service';

@Component({
  selector: 'app-friend-list',
  templateUrl: './friend-list.component.html',
  styleUrls: ['./friend-list.component.css'],
  animations: [
    trigger('inOutAnimation', [
      state('close', style({ height: '0px' })),
      state('open', style({ height: '*' })),
      transition('open<=>close', animate('200ms ease-out')),
    ])
  ]
})
export class FriendListComponent implements OnInit {
  isVisible: boolean = false;
  friendIcon: IconDefinition = faUserFriends;
  dropdownState = 'close';
  currentFriends: any[] = [];
  currentRequests: any[] = [];

  private friendState = inject(FriendService);
  private toast = inject(ToastService); 
  private auth = inject(AuthService);
  private api = inject(ApiService);
  private socket = inject(Socket); 

  ngOnInit(): void {
    this.auth.currentUserEmitter.subscribe({
      next: (res) => {
        if (res.username != "") {
          this.api.get('friend/query').subscribe({
            next: (res) => {
              this.currentFriends = res.friends.map((friend: any) => {
                return {
                  _id: friend._id,
                  name: friend.source == this.auth.getCurrentUser() ? friend.target : friend.source,
                  avatarPath: "",
                }
              });
              this.friendState.updateFriendList(this.currentFriends);
              for (let friend of this.currentFriends) {
                this.api.post('user/getUserInfo', { username: friend.name }).subscribe({
                  next: (res) => {
                    friend.avatarPath = res.avatarPath;
                  },
                  error: (err) => {
                    friend.avatarPath = 'http:/localhost:8000/static/default.png';
                  }
                })
              }
            },
          });
          this.api.get('friend/getRequest').subscribe({
            next: (res) => {
              this.currentRequests = res.requests.map((request: any) => {
                return {
                  _id: request._id,
                  name: request.source == this.auth.getCurrentUser() ? request.target : request.source,
                  avatarPath: "",
                }
              });
              for (let request of this.currentRequests) {
                this.api.post('user/getUserInfo', { username: request.name }).subscribe({
                  next: (res) => {
                    request.avatarPath = res.avatarPath;
                  },
                  error: (err) => {
                    request.avatarPath = 'http:/localhost:8000/static/default.png';
                  }
                })
              }
            }
          })
        }
        if (res.username == "") {
          this.isVisible = false;
        }
        else {
          this.isVisible = true;
        }
      }
    });
    this.socket.on('friend-request-send', (data: any) => {
      if (data.target == this.auth.getCurrentUser()) {
        const newRequest = {
          name: data.source,
          avatarPath: "",
          _id: data._id,
        }
        for (let request of this.currentRequests) {
          if (request.name == newRequest.name) {
            return;
          }
        }
        this.toast.makeToast({
          state: "close",
          message: `${data.source} has sent you a friend request`,
          barClass: ['bg-blue-600'],
        })
        this.api.post('user/getUserInfo', { username: newRequest.name }).subscribe({
          next: (res) => {
            newRequest.avatarPath = res.avatarPath;
            this.currentRequests.push(newRequest);
          },
          error: (err) => {
            newRequest.avatarPath = 'http:/localhost:8000/static/default.png';
            this.currentRequests.push(newRequest);
          }
        })
      }
    });
    this.socket.on('friend-request-accept', (data: any) => {
      if (data.target == this.auth.getCurrentUser() || data.source == this.auth.getCurrentUser()) {
        const newFriend = {
          name: data.source == this.auth.getCurrentUser() ? data.target : data.source,
          avatarPath: "",
          _id: data._id,
        }
        for (let friend of this.currentFriends) {
          if (friend.name == newFriend.name) {
            return;
          }
        }
        for (let i = 0; i < this.currentRequests.length; i++) {
          if (this.currentRequests[i].name == newFriend.name) {
            this.currentRequests.splice(i, 1);
            break;
          }
        }
        if (data.target == this.auth.getCurrentUser()) {
          this.toast.makeToast({
            state: "close",
            message: `${data.target} has accepted your friend request`,
            barClass: ['bg-blue-600'],
          })
        }
        this.api.post('user/getUserInfo', { username: newFriend.name }).subscribe({
          next: (res) => {
            newFriend.avatarPath = res.avatarPath;
            this.currentFriends.push(newFriend);
            this.friendState.updateFriendList(this.currentFriends);
          },
          error: (err) => {
            newFriend.avatarPath = 'http:/localhost:8000/static/default.png';
            this.currentFriends.push(newFriend);
          }
        })
      }
    });
    this.socket.on('friend-request-decline', (data: any) => {
      if (data.source == this.auth.getCurrentUser()) {
        const name = data.target;
        for (let i = 0; i < this.currentRequests.length; i++) {
          if (this.currentRequests[i].name == name) {
            this.currentRequests.splice(i, 1);
            break;
          }
        }
      }
    });
    this.socket.on('friend-request-cancel', (data: any) => {
      if (data.target == this.auth.getCurrentUser()) {
        const name = data.source;
        for (let i = 0; i < this.currentRequests.length; i++) {
          if (this.currentRequests[i].name == name) {
            this.currentRequests.splice(i, 1);
            break;
          }
        }
      }
    });
    this.socket.on('friend-removed', (data: any) => {
      if (data.target == this.auth.getCurrentUser() || data.source == this.auth.getCurrentUser()) {
        const name = data.target == this.auth.getCurrentUser() ? data.source : data.target;
        for (let i = 0; i < this.currentFriends.length; i++) {
          if (this.currentFriends[i].name == name) {
            this.currentFriends.splice(i, 1);
            this.friendState.updateFriendList(this.currentFriends);
            break;
          }
        }
      }
    });
  }

  toggleDropdown(): void {
    if (this.dropdownState == 'close') {
      this.dropdownState = 'open';
    }
    else {
      this.dropdownState = 'close';
    }
  }
}
