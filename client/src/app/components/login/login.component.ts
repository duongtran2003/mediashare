import { Component, Output, EventEmitter } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  userName: string = "";
  userPassword: string = "";
  @Output() onLoginToggle = new EventEmitter();

  constructor(private api: ApiService, private auth: AuthService) { }
  onLoginClick(): void {
    this.api.post('auth/login', {
      username: this.userName,
      password: this.userPassword
    }).subscribe({
      next: (response: any) => {
        console.log(response.message);
        this.auth.setCurrentUser(response.username); 
        this.onLoginToggle.emit();
      },
      error: (err) => {
        console.log(err.statusCode);
      }
    });
  }
  updateUserName(val: string): void {
    this.userName = val;
  }
  updateUserPassword(val: string): void {
    this.userPassword = val;
  }
  onModalClick(event: any): void {
    if (event.target.id == 'modal') {
      this.onLoginToggle.emit();
    }
  }
}
