import { Component, OnInit, inject } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute } from '@angular/router';
import { Clipboard } from '@angular/cdk/clipboard';
import { ToastService } from 'src/app/services/toast.service';
import { AuthService } from 'src/app/services/auth.service';
import { ImageCroppedEvent } from 'ngx-image-cropper'
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  
  private socket = inject(Socket);
  private auth = inject(AuthService); 
  private clipboard = inject(Clipboard); 
  private api = inject(ApiService);
  private toast = inject(ToastService);
  private route = inject(ActivatedRoute);

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
  posts: any = []; // all posts from database  
  usernameFromParams: string = "";
  friendCase!: number;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.usernameFromParams = params['username'];
      this.api.post('post/index', { username: this.usernameFromParams }).subscribe({
        next: (response) => {
          this.posts = [];
          for (let post of response.posts) {
            this.posts.push(post);
          }
        }
      })
      if (this.auth.getCurrentUser() == this.usernameFromParams) {
        this.friendCase = 0;
      }
      this.auth.currentUserEmitter.subscribe({
        next: (user) => {
          this.api.post('post/index', { username: this.usernameFromParams }).subscribe({
            next: (response) => {
              this.posts = [];
              for (let post of response.posts) {
                this.posts.push(post);
              }
            }
          })
          if (user.username == this.usernameFromParams) {
            this.isMyProfile = true;
          }
          else {
            this.isMyProfile = false;
          }
          if (user.username == "") {
            this.friendCase = 0;
          }
          if (!this.isMyProfile && user.username != "") {
            this.api.post('friend/checkStatus', { target: this.usernameFromParams }).subscribe({
              next: (res) => {
                //case 1: u sent them a request and its still pending: source: your username, target: their username, 
                if (res.source == user.username && res.target == this.usernameFromParams && res.status == 'pending') {
                  this.friendCase = 1;
                }
                //case 2: they sent u a request and its still pending: source: their username, target: your username,
                if (res.source == this.usernameFromParams && res.target == user.username && res.status == 'pending') {
                  this.friendCase = 2;
                }
                //case 3: no relationship => status: none 
                if (res.status == 'none') {
                  this.friendCase = 3;
                }
                //case4: are friend
                if (res.status == 'active') {
                  this.friendCase = 4;
                }
              }
            })
          }
          this.resetState();
        }
      })


      this.api.post('user/getUserInfo', {
        username: this.usernameFromParams
      }).subscribe({
        next: (response) => {
          if (this.auth.getCurrentUser() == "") {
            this.friendCase = 0;
          }
          this.username = response.username;
          this.email = response.email;
          this.avatarPath = response.avatarPath;
          if (response.username == this.auth.getCurrentUser()) {
            this.isMyProfile = true;
          }
          else {
            this.isMyProfile = false;
          }
          if (!this.isMyProfile && this.auth.getCurrentUser() != "") {
            this.api.post('friend/checkStatus', { target: this.usernameFromParams }).subscribe({
              next: (res) => {
                //case 1: u sent them a request and its still pending: source: your username, target: their username, 
                if (res.source == this.auth.getCurrentUser() && res.target == this.usernameFromParams && res.status == 'pending') {
                  this.friendCase = 1;
                }
                //case 2: they sent u a request and its still pending: source: their username, target: your username,
                if (res.source == this.usernameFromParams && res.target == this.auth.getCurrentUser() && res.status == 'pending') {
                  this.friendCase = 2;
                }
                //case 3: no relationship => status: none 
                if (res.status == 'none') {
                  this.friendCase = 3;
                }
                //case4: friend
                if (res.status == 'active') {
                  this.friendCase = 4;
                }
              }
            })
          }
          this.resetState();
        },
        error: (err) => {
        }
      });
      this.resetState();
    })
    this.socket.on('friend-request-cancel', (data: any) => {
      //case1: ur the one who canceled it: source: your username, target: their username
      if (data.source == this.auth.getCurrentUser() && data.target == this.usernameFromParams) {
        this.friendCase = 3;
      }
      //case2: they canceled it: source: their username, target: your username
      if (data.source == this.usernameFromParams && data.target == this.auth.getCurrentUser()) {
        this.friendCase = 3;
      }
    });
    this.socket.on('friend-request-decline', (data: any) => {
      //case1: they declined: source: their username, target: your username
      if (data.source == this.usernameFromParams && data.target == this.auth.getCurrentUser()) {
        this.friendCase = 3;
      }
      //case2: you declined: source: your username, target: their username
      if (data.source == this.auth.getCurrentUser() && data.target == this.usernameFromParams) {
        this.friendCase = 3;
      }
    });
    this.socket.on('friend-request-accept', (data: any) => {
      //case1: they accepted it: source: their username, target: your username
      if (data.source == this.usernameFromParams && data.target == this.auth.getCurrentUser()) {
        this.friendCase = 4;
      }
      //case2: you accepted it: source: your username, target: their username
      if (data.source == this.auth.getCurrentUser() && data.target == this.usernameFromParams) {
        this.friendCase = 4;
      }
    })
    this.socket.on('friend-request-send', (data: any) => {
      //case1: they sent it: source: their username, target: your username
      if (data.source == this.usernameFromParams && data.target == this.auth.getCurrentUser()) {
        this.friendCase = 2;
      }
      //case2: you sent it: source: your username, target: their username
      if (data.source == this.auth.getCurrentUser() && data.target == this.usernameFromParams) {
        this.friendCase = 1;
      }
    })
    this.socket.on('friend-removed', (data: any) => {
      //case1: they removed you: source: their username, target: your username
      if (data.source == this.usernameFromParams && data.target == this.auth.getCurrentUser()) {
        this.friendCase = 3;
      }
      //case2: you removed them: source: your username, target: their username
      if (data.source == this.auth.getCurrentUser() && data.target == this.usernameFromParams) {
        this.friendCase = 3;
      }
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

  cancelRequest() {
    this.api.post('friend/cancelRequest', { target: this.usernameFromParams }).subscribe({
      next: (res) => {

      },
      error: (err) => {

      }
    })
  }

  confRequest(opt: number) {
    this.api.post('friend/confirmRequest', { target: this.usernameFromParams, conf: opt }).subscribe({
      next: (res) => {

      },
      error: (err) => {

      }
    })
  }

  sendFriendRequest() {
    this.api.post('friend/sendRequest', { target: this.usernameFromParams }).subscribe({
      next: (res) => {

      },
      error: (err) => {

      }
    })
  }

  removeFriend() {
    this.api.post('friend/removeFriend', { target: this.usernameFromParams }).subscribe({
      next: (res) => {

      },
      error: (res) => {

      }
    })
  }

  deleteThis(id: string) {
    for (let i = 0; i < this.posts.length; i++) {
      if (this.posts[i]._id == id) {
        this.posts.splice(i, 1);
        break;
      }
    }
  }
}
