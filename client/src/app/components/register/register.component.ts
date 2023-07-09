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
  @Output() onRegisterToggle = new EventEmitter();
  @Output() onLoginToggle = new EventEmitter();
  
  constructor(private api: ApiService, private auth: AuthService) { }
  
  onRegisterClick(): void {

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

