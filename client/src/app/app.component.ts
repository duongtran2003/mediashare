import { Component, Host, OnInit } from '@angular/core';
import { HostListener } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from './services/api.service';
import { AuthService } from './services/auth.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { NavigationEnd, Router } from '@angular/router';
import { ToastService } from './services/toast.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger(
      'inOutAnimation',
      [
        transition(':enter',
          [
            style({ opacity: '0' }),
            animate('250ms ease-out', style({ opacity: '1' })),
          ]
        ),
      ]
    ),
  ]
})
export class AppComponent implements OnInit {
  private isEscapeKeyPressed = false;
  title = 'client';
  isLoginVisible: boolean = false;
  isRegisterVisible: boolean = false;
  isModalVisible: boolean = false;
  isNavTabVisible: boolean = true;
  isCreatePostVisible: boolean = true;
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

  constructor(private toast: ToastService, private router: Router, private api: ApiService, private auth: AuthService, private cookie: CookieService) {
    this.api.get('auth/getUsername').subscribe({
      next: (response) => {
        if (response.username) {
          this.auth.setCurrentUser({ username: response.username, avatarPath: response.avatarPath });
        }
      },
      error: (err) => {
        this.auth.setCurrentUser({ username: "", avatarPath: "" });
      }
    });
  }

  ngOnInit(): void {
    this.router.events.subscribe({
      next: (event) => {
        if (event instanceof NavigationEnd && event.url) {
          if (event.url == "/" || event.url == "/home" || event.url == "/new") {
            this.isNavTabVisible = true;
            this.isCreatePostVisible = true;
          }
          else {
            this.isNavTabVisible = false;
            this.isCreatePostVisible = false;
          }
        }
      }
    })

  }

  toggleLogin(): void {
    this.isLoginVisible = !this.isLoginVisible;
    if (this.isLoginVisible && this.isRegisterVisible) {
      this.isRegisterVisible = false;
    }
    if (this.isLoginVisible || this.isRegisterVisible) {
      if (!this.isModalVisible) {
        this.isModalVisible = true;
      }
    }
    if (!this.isLoginVisible && !this.isRegisterVisible) {
      if (this.isModalVisible) {
        this.isModalVisible = false;
      }
    }
  }

  toggleRegister(): void {
    this.isRegisterVisible = !this.isRegisterVisible;
    if (this.isLoginVisible && this.isRegisterVisible) {
      this.isLoginVisible = false;
    }
    if (this.isLoginVisible || this.isRegisterVisible) {
      if (!this.isModalVisible) {
        this.isModalVisible = true;
      }
    }
    if (!this.isLoginVisible && !this.isRegisterVisible) {
      if (this.isModalVisible) {
        this.isModalVisible = false;
      }
    }
  }

  onModalClick(e: any): void {
    if ((e.target.id == 'modal' || e.target.id == 'childModal') && e.button == 0) {
      if (this.isLoginVisible) {
        this.toggleLogin();
      }
      if (this.isRegisterVisible) {
        this.toggleRegister();
      }
    }
  }
}
