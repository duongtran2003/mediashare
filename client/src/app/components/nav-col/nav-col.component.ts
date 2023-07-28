import { Component, OnInit, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-nav-col',
  templateUrl: './nav-col.component.html',
  styleUrls: ['./nav-col.component.css']
})
export class NavColComponent implements OnInit {
  navIndex: number = 1;
  
  private router = inject(Router);

  ngOnInit(): void {
    this.router.events.subscribe({
      next: (event) => {
        if (event instanceof NavigationEnd && event.url) {
          if (event.url == '/') {
            this.navIndex = 1;
          }
          if (event.url == '/new') {
            this.navIndex = 2;
          }
          if (event.url == '/home') {
            this.navIndex = 3;
          }
        }
      }
    })
  }
}
