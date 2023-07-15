import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-col',
  templateUrl: './home-col.component.html',
  styleUrls: ['./home-col.component.css']
})
export class HomeColComponent implements OnInit {
  constructor(private auth: AuthService, private router: Router) { }
  
  ngOnInit(): void {
    
  }
}
