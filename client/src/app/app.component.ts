import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'client';
  isLoginVisible: boolean = false;
  isRegisterVisible: boolean = false;

  toggleLogin(): void {
    this.isLoginVisible = !this.isLoginVisible;
  }
  
  toggleRegister(): void {
    this.isRegisterVisible = !this.isRegisterVisible;
  }
}
