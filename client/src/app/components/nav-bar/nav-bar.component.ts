import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit{
  @Output() onLoginToggle = new EventEmitter();
  @Output() onRegisterToggle = new EventEmitter();
  
  currentUser: string = "";
  
  constructor(private auth: AuthService) { 
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
  
  onLoginClick(): void {
    this.onLoginToggle.emit();
  }
  onRegisterClick(): void {
    this.onRegisterToggle.emit();
  }
}
