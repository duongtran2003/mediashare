import { Component, OnInit, inject } from '@angular/core';
import { IconDefinition, faBell } from '@fortawesome/free-regular-svg-icons';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { AuthService } from 'src/app/services/auth.service';
import { ApiService } from 'src/app/services/api.service';
import { NotificationService } from 'src/app/services/notification.service';
import { ToastService } from 'src/app/services/toast.service';
import { convertToGMT7 } from 'src/app/helpers/timeConverter';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'],
  animations: [
    trigger('inOutAnimation', [
      state('close', style({ height: '0px' })),
      state('open', style({ height: '*' })),
      transition('open<=>close', animate('200ms ease-out')),
    ])
  ]
})
export class NotificationComponent implements OnInit {
  isVisible: boolean = false;
  bellIcon: IconDefinition = faBell;
  dropdownState = 'close';
  notificationContent: any[] = [];
  unseenNotifications: number = 0;

  private toast = inject(ToastService);
  private notification = inject(NotificationService);
  private auth = inject(AuthService);
  private api = inject(ApiService);
  convertToGMT7 = convertToGMT7;

  ngOnInit(): void {
    this.auth.currentUserEmitter.subscribe({
      next: (res) => {
        if (res.username != "") {
          this.api.get('notification/query').subscribe({
            next: (res) => {
              this.notificationContent = res.notifications;
              for (let noti of this.notificationContent) {
                this.api.post('user/getUserInfo', { username: noti.source }).subscribe({
                  next: (res) => {
                    noti.avatarPath = res.avatarPath;
                  }
                });
              }
              let unseen = 0;
              for (let noti of this.notificationContent) {
                if (noti.status == 'unseen') {
                  unseen += 1;
                }
              }
              this.unseenNotifications = unseen;
            },
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
    this.notification.notification$.subscribe({
      next: (res) => {
        let newNoti = res;
        this.api.post('user/getUserInfo', { username: res.source }).subscribe({
          next: (res) => {
            newNoti.avatarPath = res.avatarPath;
            this.notificationContent.push(newNoti);
            this.unseenNotifications += 1;
          }
        })
        this.toast.makeToast({
          state: "close",
          message: res.message,
          barClass: ['bg-blue-600'],
        })
      }
    })
  }

  toggleDropdown(): void {
    if (this.dropdownState == 'close') {
      this.dropdownState = 'open';
    }
    else {
      this.dropdownState = 'close';
      // delete all seen notification;
      this.notificationContent = this.notificationContent.filter((noti) => {
        if (noti.status == 'unseen') {
          return true;
        }
        return false;
      });
    }
  }

  onNotiHover(noti: any) {
    if (noti.status == 'unseen') {
      noti.status = 'seen';
      this.unseenNotifications -= 1;
      this.api.post('notification/delete', { _id: noti._id }).subscribe({
        next: (res) => {
        },
        error: (err) => {
        }
      })
    }
  }

}
