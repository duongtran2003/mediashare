import { Component, Input, OnInit, inject, Output, EventEmitter } from '@angular/core';
import { faComments, faThumbsDown, faThumbsUp } from '@fortawesome/free-regular-svg-icons';
import { IconDefinition, faThumbsDown as fasThumbsDown, faThumbsUp as fasThumbsUp, faPaperPlane, faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';
import { Socket } from 'ngx-socket-io';
import { convertToGMT7 } from 'src/app/helpers/timeConverter';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
})
export class PostComponent implements OnInit {
  @Input() isCommentSectionVisible!: boolean;
  @Input() post: any;

  @Output() deleted = new EventEmitter<any>();

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
  createdAt: string = "";
  updatedAt: string = "";
  timestamp: string = "";

  btnState: string = "0";
  isVoteBtnReady: boolean = false;
  isDeletionPromptVisible: boolean = false;
  upvoteIcon: IconDefinition = faThumbsUp;
  downvoteIcon: IconDefinition = faThumbsDown;
  commentsIcon: IconDefinition = faComments;
  downvoteIconActive: IconDefinition = fasThumbsDown;
  upvoteIconActive: IconDefinition = fasThumbsUp;
  postCommentIcon: IconDefinition = faPaperPlane;
  userCommentInput: string = "";
  deleteIcon: IconDefinition = faTimes;
  confirmIcon: IconDefinition = faCheck;
  cancelIcon: IconDefinition = faTimes;

  private socket = inject(Socket);
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private toast = inject(ToastService);

  ngOnInit(): void {
    this.comments = this.post.comments;
    this.username = this.post.username;
    this.title = this.post.title;
    this.fileType = this.post.fileType;
    this.filename = this.post.filename;
    this.createdAt = this.post.createdAt;
    this.updatedAt = this.post.updatedAt;
    this.timestamp = `${convertToGMT7(this.createdAt)}`;

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
    if (this.isCommentSectionVisible) {
      this.api.post('comment/queryComment', { post_id: this._id }).subscribe({
        next: (response) => {
          this.commentsContent = response.comments;
          this.commentsContent.reverse();
          for (let comment of this.commentsContent) {
            this.api.post('user/getUserInfo', { username: comment.username }).subscribe({
              next: (res) => {
                comment.avatarPath = res.avatarPath;
              }
            })
          }
          this.comments = response.comments.length;
        },
        error: (err) => {
        }
      });
    }
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
        if (data.username == this.auth.getCurrentUser()) {
          this.vote = data.voteType;
        }
      }
    });
    this.socket.on('user-comment', (data: any) => {
      if (data.post_id == this._id) {
        if (this.isCommentSectionVisible) {
          this.api.post('user/getUserInfo', { username: data.comment.username }).subscribe({
            next: (res) => {
              data.comment.avatarPath = res.avatarPath;
              this.commentsContent.unshift(data.comment);
            }
          })
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
        },
        error: (err) => {
          if (err.status == 401) {
            this.toast.makeToast({
              state: "close",
              message: "Login first!",
              barClass: ['bg-red-600']
            });
          }
          else {
            this.toast.makeToast({
              state: "close",
              message: "Post not found",
              barClass: ['bg-red-600'],
            })
          }
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
          },
          error: (err) => {
            this.isVoteBtnReady = true;
            if (err.status == 401) {
              this.toast.makeToast({
                state: "close",
                message: "Login first!",
                barClass: ['bg-red-600']
              })
            }
            else {
              this.toast.makeToast({
                state: "close",
                message: "Post not found",
                barClass: ['bg-red-600'],
              })
            }
          }
        })
      }
      else {
        this.api.post('vote/votePost', { post_id: this._id, type: 1 }).subscribe({
          next: (response) => {
            this.isVoteBtnReady = true;
          },
          error: (err) => {
            this.isVoteBtnReady = true;
            if (err.status == 401) {
              this.toast.makeToast({
                state: "close",
                message: "Login first!",
                barClass: ['bg-red-600']
              })
            }
            else {
              this.toast.makeToast({
                state: "close",
                message: "Post not found",
                barClass: ['bg-red-600'],
              })
            }
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
        },
        error: (err) => {
          this.isVoteBtnReady = true;
          if (err.status == 401) {
            this.toast.makeToast({
              state: "close",
              message: "Login first!",
              barClass: ['bg-red-600']
            })
          }
          else {
            this.toast.makeToast({
              state: "close",
              message: "Post not found",
              barClass: ['bg-red-600'],
            })
          }
        }
      });
    }
    else {
      this.isVoteBtnReady = false;
      if (this.vote == 1) {
        this.api.post('vote/changeVote', { post_id: this._id, type: -1 }).subscribe({
          next: (response) => {
            this.isVoteBtnReady = true;
          },
          error: (err) => {
            this.isVoteBtnReady = true;
            if (err.status == 401) {
              this.toast.makeToast({
                state: "close",
                message: "Login first!",
                barClass: ['bg-red-600']
              })
            }
            else {
              this.toast.makeToast({
                state: "close",
                message: "Post not found",
                barClass: ['bg-red-600'],
              })
            }
          }
        })
      }
      else {
        this.api.post('vote/votePost', { post_id: this._id, type: -1 }).subscribe({
          next: (response) => {
            this.isVoteBtnReady = true;
          },
          error: (err) => {
            this.isVoteBtnReady = true;
            if (err.status == 401) {
              this.toast.makeToast({
                state: "close",
                message: "Login first!",
                barClass: ['bg-red-600']
              })
            }
            else {
              this.toast.makeToast({
                state: "close",
                message: "Post not found",
                barClass: ['bg-red-600'],
              })
            }
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
        if (err.status == 401) {
          this.toast.makeToast({
            state: "close",
            message: "Login first!",
            barClass: ['bg-red-600'],
          })
        }
        else if (err.status == 404) {
          this.toast.makeToast({
            state: "close",
            message: "Post not found",
            barClass: ['bg-red-600'],
          })
        }
        else {
          this.toast.makeToast({
            state: "close",
            message: "Server's error",
            barClass: ['bg-red-600'],
          })
        }
      }
    })
  }
  toggleDeletionPrompt() {
    this.isDeletionPromptVisible = !this.isDeletionPromptVisible;
  }
  onDeleteClick() {
    this.api.post('post/delete', { post_id: this._id }).subscribe({
      next: (res) => {
        this.toast.makeToast({
          state: "close",
          message: "Post deleted",
          barClass: ['bg-lime-500'],
        });
        this.toggleDeletionPrompt();
        this.deleted.emit(this._id);
      },
      error: (err) => {
        this.toast.makeToast({
          state: "close",
          message: "Post not found or it's not yours",
          barClass: ['bg-red-600'],
        })
        this.toggleDeletionPrompt();
      }
    })
  }
}