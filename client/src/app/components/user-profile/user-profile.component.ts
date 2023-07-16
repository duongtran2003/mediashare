import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute } from '@angular/router';
import { Clipboard } from '@angular/cdk/clipboard';
import { ToastService } from 'src/app/services/toast.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  constructor(private auth: AuthService, private clipboard: Clipboard, private api: ApiService, private toast: ToastService, private route: ActivatedRoute) { }
  username: string = "";
  email: string = "";
  avatarPath: string = "";
  isMyProfile: boolean = false;
  isTooltipVisible: boolean = false;
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const usernameFromParams = params['username'];
      this.api.post('user/getUserInfo', {
        username: usernameFromParams
      }).subscribe({
        next: (response) => {
          this.username = response.username;
          this.email = response.email;
          this.avatarPath = response.avatarPath;
          if (response.username == this.auth.getCurrentUser()) {
            this.isMyProfile = true;
          }
        },
        error: (err) => {
          console.log(err.error.message);
        }
      })
    })
  }

  showUpdateAvatarTooltip(): void {
    this.isTooltipVisible = true;
  }
  hideUpdateAvatarTooltip(): void {
    this.isTooltipVisible = false;
  }

  onUsernameClick() {
    this.toast.makeToast({
      state: "close",
      message: "Copied to clipboard",
      barClass: ['bg-blue-500'],
    });
    this.clipboard.copy(this.username);
  }
  onEmailClick() {
    this.toast.makeToast({
      state: "close",
      message: "Copied to clipboard",
      barClass: ['bg-blue-500'],
    });
    this.clipboard.copy(this.email);
  }
}
