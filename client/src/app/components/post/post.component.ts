import { Component, Input, OnInit } from '@angular/core';
import { faComments } from '@fortawesome/free-regular-svg-icons';
import { IconDefinition, faAngleDown, faAngleUp, faChevronCircleDown, faChevronCircleUp, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
})
export class PostComponent implements OnInit {
  @Input() post: any;
  username: string = "";
  title: string = "";
  filename: string = "";
  fileType: string = "";
  avatar: string = "";
  filePath: string = "";
  karma: number = 0;
  _id: string = "";
  vote: number = 0;
  comments: number = 0;
  commentsContent: any[] = [];
  btnState: string = "0";
  isVoteBtnReady: boolean = false;
  upvoteIcon: IconDefinition = faChevronCircleUp;
  downvoteIcon: IconDefinition = faChevronCircleDown;
  commentsIcon: IconDefinition = faComments;
  postCommentIcon: IconDefinition = faPaperPlane
  userCommentInput: string = "";
  isCommentSectionVisible: boolean = false;

  constructor(private socket: Socket, private api: ApiService, private auth: AuthService, private toast: ToastService) {

  }

  ngOnInit(): void {
    this.comments = this.post.comments;
    this.username = this.post.username;
    this.title = this.post.title;
    this.fileType = this.post.fileType;
    this.filename = this.post.filename;
    this.filePath = `http://localhost:8000/static/${this.filename}`;
    this.karma = this.post.karma;
    this._id = this.post._id;
    this.api.post('user/getUserInfo', { username: this.username }).subscribe({
      next: (response) => {
        this.avatar = response.avatarPath;
      },
      error: (err) => {
        this.avatar = 'http://localhost:8000/static/default.png';
      }
    });
    console.log({ username: this.auth.getCurrentUser(), post_id: this._id })
    this.api.post('vote/getUserVote', { post_id: this._id }).subscribe({
      next: (response) => {
        this.vote = response.type;
        this.isVoteBtnReady = true;
      },
      error: (err) => {
        this.isVoteBtnReady = true;
      }
    });
    this.socket.on('user-vote', (data: any) => {
      if (data.post_id == this._id) {
        this.karma = data.karma;
      }
    });
    this.socket.on('user-comment', (data: any) => {
      if (data.post_id == this._id) {
        if (this.isCommentSectionVisible) {
          this.commentsContent.push(data.comment);
        }
        this.comments = data.postComments;
      }
    });
  }

  onUpvoteClick(): void {
    if (this.vote == 1) {
      this.isVoteBtnReady = false;
      this.api.post('vote/removeVote', { post_id: this._id, type: 1 }).subscribe({
        next: (response) => {
          this.isVoteBtnReady = true;
          this.vote = 0;
        },
        error: (err) => {
          this.isVoteBtnReady = true;
        }
      });
    }
    else {
      this.isVoteBtnReady = false;
      if (this.vote == -1) {
        this.api.post('vote/changeVote', { post_id: this._id, type: 1 }).subscribe({
          next: (response) => {
            this.isVoteBtnReady = true;
            this.vote = 1;
          },
          error: (err) => {
            this.isVoteBtnReady = true;
          }
        })
      }
      else {
        this.api.post('vote/votePost', { post_id: this._id, type: 1 }).subscribe({
          next: (response) => {
            this.isVoteBtnReady = true;
            this.vote = 1;
          },
          error: (err) => {
            this.isVoteBtnReady = true;
          }
        })
      }
    }
  }
  onDownvoteClick(): void {
    if (this.vote == -1) {
      this.isVoteBtnReady = false;
      this.api.post('vote/removeVote', { post_id: this._id, type: -1 }).subscribe({
        next: (response) => {
          this.isVoteBtnReady = true;
          this.vote = 0;
        },
        error: (err) => {
          this.isVoteBtnReady = true;
        }
      });
    }
    else {
      this.isVoteBtnReady = false;
      if (this.vote == 1) {
        this.api.post('vote/changeVote', { post_id: this._id, type: -1 }).subscribe({
          next: (response) => {
            this.isVoteBtnReady = true;
            this.vote = -1;
          },
          error: (err) => {
            this.isVoteBtnReady = true;
          }
        })
      }
      else {
        this.api.post('vote/votePost', { post_id: this._id, type: -1 }).subscribe({
          next: (response) => {
            this.isVoteBtnReady = true;
            this.vote = -1;
          },
          error: (err) => {
            this.isVoteBtnReady = true;
          }
        })
      }
    }
  }
  updateUserCommentInput(val: string) {
    this.userCommentInput = val;
  }
  postComment() {
    if (this.userCommentInput.trim() == "") {
      this.toast.makeToast({
        state: "close",
        message: "Can't create empty comment",
        barClass: ['bg-red-600'],
      })
      return;
    }
    this.api.post('comment/create', { content: this.userCommentInput, post_id: this._id }).subscribe({
      next: (response) => {
        this.userCommentInput = "";
      },
      error: (err) => {
        this.toast.makeToast({
          state: "close",
          message: "Server's error",
          barClass: ['bg-red-600'],
        })
      }
    })
  }
  toggleCommentSection() {
    this.isCommentSectionVisible = !this.isCommentSectionVisible;
    if (this.isCommentSectionVisible) {
      this.api.post('comment/queryComment', { post_id: this._id }).subscribe({
        next: (response) => {
          this.commentsContent = response.comments;
          this.comments = response.comments.length;
        },
        error: (err) => {
          console.log(err);
        }
      });
    }
    else {
      this.commentsContent = [];
    }
  }
}