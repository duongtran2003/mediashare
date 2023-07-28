import { Component, Output, EventEmitter, inject } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  timeoutDup: number | null = null;
  timeoutConf: number | null = null;
  userName: string = "";
  userPassword: string = "";
  userEmail: string = "";
  userPasswordConf: string = "";
  userNameError: string = "";
  userPasswordError: string = "";
  userEmailError: string = "";
  userPasswordConfError: string = "";
  emailRegex: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  usernameRegex: RegExp = /^[a-zA-Z0-9_]{6,20}$/;
  passwordRegex: RegExp = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/;

  @Output() onRegisterToggle = new EventEmitter();
  @Output() onLoginToggle = new EventEmitter();

  private api = inject(ApiService);
  private auth = inject(AuthService); 
  private toast = inject(ToastService); 

  onRegisterClick(): void {

    //input validation begin:
    if (!this.emailRegex.test(this.userEmail)) {
      this.userEmailError = "Invalid email";
    }
    else {
      this.userEmailError = "";
    }
    if (!this.usernameRegex.test(this.userName)) {
      this.userNameError = "No special characters, length has to be between 6 and 20";
    }
    else {
      this.userNameError = "";
    }
    if (!this.passwordRegex.test(this.userPassword)) {
      this.userPasswordError = "Has to contain at least 1 alphabetic character, 1 digit, and between 8 and 20 characters long"
    }
    else {
      this.userPasswordError = "";
    }
    if (this.userPasswordConf != this.userPassword) {
      this.userPasswordConfError = "Password doesn't match";
    }
    else {
      this.userPasswordConfError = "";
    }
    if (this.userNameError != "" || this.userPasswordError != "" || this.userEmailError != "" || this.userPasswordConfError != "") {
      return;
    }
    //input validation end:

    this.api.post('auth/register', {
      username: this.userName,
      email: this.userEmail,
      password: this.userPassword,
    }).subscribe({
      next: (response) => {
        this.toast.makeToast({
          state: "close",
          message: "Account created",
          barClass: ['bg-lime-500']
        });
        this.onLoginToggle.emit();
      },
      error: (err) => {
        console.log(err);
        if (err.error.type == "username") {
          this.userNameError = err.error.message;
        }
        else {
          this.userEmailError = err.error.message;
        }
      }
    })
  }
  onLoginClick(): void {
    this.onLoginToggle.emit();
  }
  updateUserName(val: string): void {
    this.userName = val;
  }
  updateUserPassword(val: string): void {
    this.userPassword = val;
  }
  updateUserEmail(val: string): void {
    this.userEmail = val;
  }
  updateUserPasswordConf(val: string) {
    this.userPasswordConf = val;
  }
  checkDuplicate(val: string) {
    if (this.timeoutDup) {
      clearTimeout(this.timeoutDup);
    }
    this.timeoutDup = window.setTimeout(() => {
      this.api.post('user/checkUsername', {
        username: val,
      })
        .subscribe({
          next: (response) => {
            if (response.message != "OK") {
              this.userNameError = response.message;
            }
            else {
              this.userNameError = "";
            }
          },
          error: (err) => {
          }
        })
    }, 300);
  }
}

