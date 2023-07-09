import { Component, Output, EventEmitter } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  userName: string = "";
  userPassword: string = "";
  userEmail: string = "";
  userNameError: string = "";
  userPasswordError: string = "";
  userEmailError: string = "";
  emailRegex: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  usernameRegex: RegExp = /^[a-zA-Z0-9_]{6,20}$/;
  passwordRegex: RegExp = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/;

  @Output() onRegisterToggle = new EventEmitter();
  @Output() onLoginToggle = new EventEmitter();

  constructor(private api: ApiService, private auth: AuthService) { }

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
    if (this.userNameError != "" || this.userPasswordError != "" || this.userEmailError != "") {
      return;
    }
    //input validation end:

    this.api.post('auth/register', {
      username: this.userName,
      email: this.userEmail,
      password: this.userPassword,
    }).subscribe({
      next: (response) => {
        console.log(response.message);
        this.onLoginToggle.emit();
      },
      error: (err) => {
        console.log(err.message);
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
  onModalClick(event: any): void {
    if (event.target.id == 'modal') {
      this.onRegisterToggle.emit();
    }
  }
}

