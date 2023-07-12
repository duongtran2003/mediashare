import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit{
  @Output() onLoginToggle = new EventEmitter();
  @Output() onRegisterToggle = new EventEmitter();
  
  currentUser: string = "";
  isDropdownVisible: boolean = false; 
  constructor(private auth: AuthService, private api: ApiService) { 
    this.currentUser = "";
  }
  
  ngOnInit() {
    this.auth.currentUser.subscribe({
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
      }
    })
  }

  onLoginClick(): void {
    this.onLoginToggle.emit();
  }
  onRegisterClick(): void {
    this.onRegisterToggle.emit();
  }
}
