import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { IconDefinition, faFire, faHome, faSun } from '@fortawesome/free-solid-svg-icons';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-nav-col-item',
  templateUrl: './nav-col-item.component.html',
  styleUrls: ['./nav-col-item.component.css'],
  animations:
    [
      trigger('activeCard',
        [
          state('active', style({ transform: 'scale(0.99)' })),
          state('deactive', style({ transform: 'scale(1.0)' })),
          transition('active <=> deactive', [
            animate('0.1s ease-in')
          ])
        ]
      )
    ]
})
export class NavColItemComponent implements OnInit {
  @Input() content!: string;
  currentIcon!: IconDefinition;
  currentState: string = 'deactive';

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd && event.url) {
        console.log(event.url);
        if (this.content == "Home") {
          if (event.url == '/home') {
            this.currentState = 'active';
          }
          else {
            this.currentState = 'deactive';
          }
        }
        if (this.content == "Hot") {
          if (event.url == '/') {
            this.currentState = 'active';
          }
          else {
            this.currentState = 'deactive';
          }
        }
        if (this.content == "New") {
          if (event.url == '/new') {
            this.currentState = 'active';
          }
          else {
            this.currentState = 'deactive';
          }
        }
      }
    });
  }
  ngOnInit(): void {
    if (this.content == "Home") {
      this.currentIcon = faHome;
    }
    if (this.content == "New") {
      this.currentIcon = faSun;
    }
    if (this.content == "Hot") {
      this.currentIcon = faFire;
    }
  }
}
