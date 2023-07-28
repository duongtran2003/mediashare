import { Component, OnInit, ViewChild, ElementRef, inject } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { IconDefinition, faPlus, faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';
import { state, trigger, style, transition, animate } from '@angular/animations';
import { ApiService } from 'src/app/services/api.service';
import { ToastService } from 'src/app/services/toast.service';

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
  isUploading: boolean = false;

  @ViewChild('fileInput', { static: false })
  fileInput!: ElementRef;

  private auth = inject(AuthService);
  private api = inject(ApiService);
  private toast = inject(ToastService);

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
    this.isUploading = false;
  }
  createPost(): void {
    if (this.userTitle.trim() == "") {
      this.titleError = true;
    }
    else {
      this.titleError = false;
    }
    if (!this.filesFromInput) {
      this.fileError = true;
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
    this.isUploading = true;
    this.api.post('post/create', formData).subscribe({
      next: (response) => {
        this.toast.makeToast({
          state: "close",
          message: "Post created",
          barClass: ['bg-lime-500']
        });
        this.isUploading = false;
        this.resetForm();
      },
      error: (err) => {
        this.toast.makeToast({
          state: "close",
          message: "Server's error",
          barClass: ['bg-red-600'],
        });
        this.isUploading = false; 
      }
    })
  }
  onFileSelected(e: Event): void {
    this.filesFromInput = (<HTMLInputElement>e.target).files;
  }
}
