import { Component, OnInit } from '@angular/core';
import { IconDefinition } from '@fortawesome/free-regular-svg-icons';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { AuthService } from 'src/app/services/auth.service';
import { ApiService } from 'src/app/services/api.service';
import { NotificationService } from 'src/app/services/notification.service';
import { ToastService } from 'src/app/services/toast.service';
import { faUserFriends } from '@fortawesome/free-solid-svg-icons';

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

  constructor(private toast: ToastService, protected auth: AuthService, private api: ApiService) { }

  ngOnInit(): void {
    this.auth.currentUserEmitter.subscribe({
      next: (res) => {
        if (res.username != "") {
          this.api.get('friend/query').subscribe({
            next: (res) => {
              this.currentFriends = res.friends; 
            },
          });
          this.api.get('friend/getRequest').subscribe({
            next: (res) => {
              this.currentRequests = res.requests;
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
