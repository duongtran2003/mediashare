import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { IconDefinition, faPlus, faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';
import { state, trigger, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css'],
  animations: [
    trigger('closeOpenAnimation', 
      [
        state('open', style({ height: '*', marginBottom: '20px' })),
        state('close', style({ height: '0px' })),
        transition('open<=>close', 
          [
            animate('300ms ease-out'),
          ]
        ),
      ] 
    )
  ]
})
export class CreatePostComponent implements OnInit {
  isVisible: boolean = false;
  isFormVisible: boolean = false;
  formState: string = "close";
  newPostIcon: IconDefinition = faPlus;
  abortIcon: IconDefinition = faTimes;
  acceptIcon: IconDefinition = faCheck;
  titleError: boolean = false;
  userTitle: string = "";
  fileError: boolean = false;
  constructor(private auth: AuthService) {  }
  ngOnInit(): void {
    this.auth.currentUserEmitter.subscribe({
      next: (user) => {
        if (user.username != "") {
          this.isVisible = true;
        }
        else {
          this.isVisible = false;
        }
      }
    });
  }

  showForm(): void {
    this.isFormVisible = true;
    this.formState = 'open';
  }
  hideForm(): void {
    this.isFormVisible = false;
    this.formState = 'close';
  }
  updateTitle(val: string): void {
    this.userTitle = val;
  }
  createPost(): void {
    if (this.userTitle == "") {
      this.titleError = true;
    }
    else {
      this.titleError = false;
    }

  }
}
