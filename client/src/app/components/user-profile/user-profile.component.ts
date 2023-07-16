import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ToastService } from 'src/app/services/toast.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  constructor(private api: ApiService, private toast: ToastService, private route: ActivatedRoute) { }
  username: string = "";
  email: string = "";
  avatarPath: string = "";
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
        },
        error: (err) => {
          console.log(err.error.message);
        }
      })
    })
  }
}
