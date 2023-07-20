import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute } from '@angular/router';
import { Clipboard } from '@angular/cdk/clipboard';
import { ToastService } from 'src/app/services/toast.service';
import { AuthService } from 'src/app/services/auth.service';
import { ImageCroppedEvent, base64ToFile } from 'ngx-image-cropper'

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  constructor(private auth: AuthService, private clipboard: Clipboard, private api: ApiService, private toast: ToastService, private route: ActivatedRoute) { }
  username: string = "";
  email: string = "";
  avatarPath: string = "";
  isMyProfile: boolean = false;
  isTooltipVisible: boolean = false;
  imgChangeEvent: any = "";
  cropImgFile: any = "";
  cropImgPreview: any = "";
  imageCroppedEvent: any = "";
  isCropperVisible: boolean = false;
  isImageLoaded: boolean = false;
  isUploadingDone: boolean = true;
  
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const usernameFromParams = params['username'];
      this.api.post('user/getUserInfo', {
        username: usernameFromParams
      }).subscribe({
        next: (response) => {
          this.username = response.username;
          this.email = response.email;
          this.avatarPath = response.avatarPath;
          if (response.username == this.auth.getCurrentUser()) {
            this.isMyProfile = true;
          }
          else {
            this.isMyProfile = false;
          }
        },
        error: (err) => {
          console.log(err.error.message);
        }
      })
    })
  }

  resetState(): void {
    this.isUploadingDone = true;
    this.isCropperVisible = false;
    this.imageCroppedEvent = "";
    this.imgChangeEvent = "";
    this.cropImgPreview = "";
    this.cropImgFile = "";
    this.isImageLoaded = false;
  }

  showUpdateAvatarTooltip(): void {
    this.isTooltipVisible = true;
  }
  hideUpdateAvatarTooltip(): void {
    this.isTooltipVisible = false;
  }

  onUsernameClick() {
    this.toast.makeToast({
      state: "close",
      message: "Copied to clipboard",
      barClass: ['bg-blue-500'],
    });
    this.clipboard.copy(this.username);
  }
  onEmailClick() {
    this.toast.makeToast({
      state: "close",
      message: "Copied to clipboard",
      barClass: ['bg-blue-500'],
    });
    this.clipboard.copy(this.email);
  }

  onFileChange(event: any): void {
    this.imgChangeEvent = event;
  }

  cropImg(event: ImageCroppedEvent) {
    this.cropImgPreview = event.objectUrl;
    this.imageCroppedEvent = event;
  }

  imgLoad() {
    this.isImageLoaded = true;
    console.log("uploaded");
  }

  initCropper() {

  }

  imgFailed() {
    this.toast.makeToast({
      state: "close",
      message: "File must be an image",
      barClass: ['bg-red-600']
    });
    this.isImageLoaded = false;
  }

  toggleCropper() {
    if (!this.isMyProfile) {
      return;
    }
    this.isCropperVisible = !this.isCropperVisible;
  }

  changeAvatar(): void {
    const username = this.auth.getCurrentUser();
    this.cropImgFile = this.imageCroppedEvent.blob;
    const file = new File([this.cropImgFile], `avatar${username}`, { type: this.cropImgFile.type });
    console.log(file);
    if (this.isImageLoaded) {
      const formData = new FormData();
      formData.append('file', file);
      this.isUploadingDone = false;
      this.api.post('user/setAvatar', formData).subscribe({
        next: (response) => {
          this.toast.makeToast({
            state: "close",
            message: "Image uploaded",
            barClass: ['bg-lime-500']
          });
          this.avatarPath = response.avatarPath;
          this.auth.setCurrentUser({ username: response.username, avatarPath: response.avatarPath });
          this.resetState();
        }
      })
    }
  }
}
