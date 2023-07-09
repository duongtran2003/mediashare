import { Component, Host } from '@angular/core';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
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
      if(this.isRegisterVisible) {
        this.toggleRegister();
      }
      event.preventDefault();
    }
  }

  @HostListener('document:keyup.escape', ['$event'])
  handleKeyUpEvent(event: KeyboardEvent) {
    this.isEscapeKeyPressed = false;
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
