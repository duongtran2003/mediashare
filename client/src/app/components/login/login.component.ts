import { Component, Output, EventEmitter, inject } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  userName: string = "";
  userPassword: string = "";
  userNameError: string = "";
  userPasswordError: string = "";
  usernameRegex: RegExp = /^[a-zA-Z0-9_]{6,20}$/;
  @Output() onLoginToggle = new EventEmitter();
  @Output() onRegisterToggle = new EventEmitter();

  private api = inject(ApiService);
  private auth = inject(AuthService); 
  private toast = inject(ToastService); 

  onLoginClick(): void {

    //validate input start:
    if (!this.usernameRegex.test(this.userName)) {
      this.userNameError = "No special characters, length has to be between 6 and 20";
    }
    else {
      this.userNameError = "";
    }
    if (this.userPassword.length < 8 || this.userPassword.length > 20) {
      this.userPasswordError = "Too short or too long";
    }
    else {
      this.userPasswordError = "";
    }
    //validate input end;
    if (this.userNameError != "" || this.userPasswordError != "") {
      return;
    }
    this.api.post('auth/login', {
      username: this.userName,
      password: this.userPassword
    }).subscribe({
      next: (response: any) => {
        this.auth.setCurrentUser({ username: response.username, avatarPath: response.avatarPath }); 
        this.toast.makeToast({
          state: "close",
          message: `Welcome home, ${response.username}`,
          barClass: ['bg-lime-500']
        });
        this.onLoginToggle.emit();
        this.userNameError = "";
        this.userPasswordError = "";
      },
      error: (err) => {
        //wrong credentials
        this.userNameError = "Incorrect username or password";
      }
    });
  }

  onRegisterClick(): void {
    this.onRegisterToggle.emit();
  }

  updateUserName(val: string): void {
    this.userName = val;
  }
  updateUserPassword(val: string): void {
    this.userPassword = val;
  }
}
