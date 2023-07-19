import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { IconDefinition, faPlus, faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';
import { state, trigger, style, transition, animate } from '@angular/animations';
import { ApiService } from 'src/app/services/api.service';

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
  filesFromInput: FileList | null = null;
  fileError: boolean = false;

  @ViewChild('fileInput', { static: false })
  fileInput!: ElementRef;

  constructor(private auth: AuthService, private api: ApiService) { }
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
  resetForm(): void {
    this.userTitle = "";
    this.titleError = false;
    this.filesFromInput = null;
    this.fileError = false;
    this.isFormVisible = false;
    this.formState = 'close';
    this.fileInput.nativeElement.value = "";
  }
  createPost(): void {
    if (this.userTitle == "") {
      this.titleError = true;
      console.log("loi title", this.userTitle);
    }
    else {
      this.titleError = false;
    }
    if (!this.filesFromInput) {
      this.fileError = true;
      console.log("loi file", this.filesFromInput);
    }
    else {
      this.fileError = false;
    }
    if (this.titleError || this.fileError) {
      return;
    }
    const uploadFile: File = this.filesFromInput![0];
    const formData = new FormData();
    formData.append('title', this.userTitle);
    formData.append('file', uploadFile);
    // this.api.post('post/createPost', formData).subscribe({
    //   next: (response) => {

    //   }
    // })
    console.log(formData);
    this.resetForm();
  }
  onFileSelected(e: Event): void {
    this.filesFromInput = (<HTMLInputElement>e.target).files;
  }
}
