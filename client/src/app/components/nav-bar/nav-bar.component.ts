import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/services/toast.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
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
export class NavBarComponent implements OnInit {
  @Output() onLoginToggle = new EventEmitter();
  @Output() onRegisterToggle = new EventEmitter();

  onQuery: boolean = false;
  isSearchResultVisible: boolean = false;
  searchTimeout: number | null = null;
  searchResult: any = [];
  currentUser: string = "";
  isDropdownVisible: boolean = false;
  constructor(private auth: AuthService, private api: ApiService, private toast: ToastService, private router: Router) {
    this.currentUser = "";
  }

  ngOnInit() {
    this.auth.currentUserEmitter.subscribe({
      next: (user) => {
        this.currentUser = user;
      },
      error: (err) => {
        console.log("idk man");
      }
    })
  }

  logOut(): void {
    this.api.get('auth/logout').subscribe({
      next: (response) => {
        console.log(response.message);
        this.auth.setCurrentUser("");
        this.toast.makeToast({
          state: "close",
          message: "Logout successfully",
          barClass: ['bg-lime-500'],
        });
        this.hideDropdown();
        this.router.navigate(['']);
      },
      error: (err) => {
        this.toast.makeToast({
          state: "close",
          message: "Server's error",
          barClass: ['bg-red-600']
        })
        this.hideDropdown();
      }
    })
  }

  onLoginClick(): void {
    this.onLoginToggle.emit();
  }
  onRegisterClick(): void {
    this.onRegisterToggle.emit();
  }

  showDropdown(): void {
    this.isDropdownVisible = true;
    console.log("mouseenter");
  }
  hideDropdown(): void {
    this.isDropdownVisible = false;
    console.log("mouseleave");
  }
  onInput(val: string): void {
    this.showResult(val);
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    const parsedVal = val.trim();
    if (parsedVal == "") {
      this.onQuery = false;
      // this.hideResult();
    }
    if (parsedVal != "") {
      this.onQuery = true;
      this.searchResult = [];
      this.searchTimeout = window.setTimeout(() => {
        this.api.post('user/queryMatchedUser', {
          username: val,
        }).subscribe({
          next: (response) => {
            this.searchResult = response.users;
            this.onQuery = false;
          }
        })
      }, 1000);
    }
  }

  showResult(val: string): void {
    const parsedVal = val.trim();
    if (parsedVal != "") {
      this.isSearchResultVisible = true;
    }
  }

  hideResult(): void {
    window.setTimeout(() => {
      this.isSearchResultVisible = false;
    }, 150);
  }
}
