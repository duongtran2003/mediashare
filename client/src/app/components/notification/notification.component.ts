import { Component, OnInit } from '@angular/core';
import { IconDefinition, faBell } from '@fortawesome/free-regular-svg-icons';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { AuthService } from 'src/app/services/auth.service';
import { ApiService } from 'src/app/services/api.service';
import { NotificationService } from 'src/app/services/notification.service';
import { ToastService } from 'src/app/services/toast.service';

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

  constructor(private toast: ToastService, private notification: NotificationService, private auth: AuthService, private api: ApiService) { }

  ngOnInit(): void {
    this.auth.currentUserEmitter.subscribe({
      next: (res) => {
        if (res.username != "") {
          this.api.get('notification/query').subscribe({
            next: (res) => {
              this.notificationContent = res.notifications;
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
        this.notificationContent.push(res);
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
      console.log(this.dropdownState);
    }
    else {
      this.dropdownState = 'close';
      console.log(this.dropdownState);
    }
  }
}
