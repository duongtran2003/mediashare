import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { IconDefinition, faFire, faHome, faSun } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-nav-col-item',
  templateUrl: './nav-col-item.component.html',
  styleUrls: ['./nav-col-item.component.css'],
  animations:
    [
      trigger('activeCard',
        [
          state('active', style({ transform: 'scale(1.03)' })),
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

  changeState() {
    if (this.currentState == 'deactive') {
      this.currentState = 'active';
    }
    else {
      this.currentState = 'deactive';
    }
    console.log(this.currentState);
  }
}
