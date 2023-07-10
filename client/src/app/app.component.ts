import { Component, Host, OnInit } from '@angular/core';
import { HostListener } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from './services/api.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private isEscapeKeyPressed = false;
  title = 'client';
  isLoginVisible: boolean = false;
  isRegisterVisible: boolean = false;

  @HostListener('document:keydown.escape', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (!this.isEscapeKeyPressed) {
      this.isEscapeKeyPressed = true;
      //code goes here
      if (this.isLoginVisible) {
        this.toggleLogin();
      }
      if (this.isRegisterVisible) {
        this.toggleRegister();
      }
      event.preventDefault();
    }
  }

  @HostListener('document:keyup.escape', ['$event'])
  handleKeyUpEvent(event: KeyboardEvent) {
    this.isEscapeKeyPressed = false;
  }

  constructor(private api: ApiService, private auth: AuthService, private cookie: CookieService) { }
  ngOnInit(): void {
    this.api.get('auth/getUsername').subscribe({
      next: (response) => {
        if (response.username) {
          this.auth.setCurrentUser(response.username);
        }
      },
    });
  }

  toggleLogin(): void {
    this.isLoginVisible = !this.isLoginVisible;
    if (this.isLoginVisible && this.isRegisterVisible) {
      this.isRegisterVisible = false;
    }
  }

  toggleRegister(): void {
    this.isRegisterVisible = !this.isRegisterVisible;
    if (this.isLoginVisible && this.isRegisterVisible) {
      this.isLoginVisible = false;
    }
  }
}
