import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-nav-col',
  templateUrl: './nav-col.component.html',
  styleUrls: ['./nav-col.component.css']
})
export class NavColComponent {
  @Output() forceLogin = new EventEmitter();
  onUnauthenticatedAccess(): void {
    this.forceLogin.emit();
  }
}
