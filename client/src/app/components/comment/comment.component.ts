import { Component, Input, inject, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ToastService } from 'src/app/services/toast.service';
import { IconDefinition, faEdit } from '@fortawesome/free-regular-svg-icons';
import { faCheck, faReply, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Socket } from 'ngx-socket-io';
import { convertToGMT7 } from 'src/app/helpers/timeConverter';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {
  @Input() comment: any;

  deleteIcon: IconDefinition = faTimes;
  editIcon: IconDefinition = faEdit;
  confirmIcon: IconDefinition = faCheck;
  cancelIcon: IconDefinition = faTimes;
  replyIcon: IconDefinition = faReply;
  postCommentIcon: IconDefinition = faPaperPlane;

  isInEditMode: boolean = false;
  isReplyInputVisible: boolean = false;
  isReplyVisible: boolean = false;
  childComments: any[] = [];

  timestamp: string = "";
  userReplyInput: string = "";

  private socket = inject(Socket);
  private toast = inject(ToastService);
  private api = inject(ApiService);

  ngOnInit(): void {
    if (this.comment._id != 0) {
      this.api.post('comment/childQuery', { parent_id: this.comment._id }).subscribe({
        next: (res) => {
          for (let comment of res.comments) {
            this.api.post('user/getUserInfo', { username: comment.username }).subscribe({
              next: (res) => {
                comment.avatarPath = res.avatarPath;
                this.childComments.push(comment);
              },
              error: (err) => {
                comment.avatarPath = 'http://localhost:8000/static/default.png';
                this.childComments.push(comment);
              }
            })
          }
        },
        error: (err) => {

        }
      })
    }
    this.socket.on('comment-edit', (data: any) => {
      if (data.comment_id == this.comment._id) {
        this.comment.content = data.content;
        const formatted = convertToGMT7(data.updatedAt);
        this.timestamp = `${formatted} (edited)`;
      }
    });
    this.socket.on('comment-delete', (data: any) => {
      if (data.comment_id == this.comment._id) {
        this.comment.content = data.content;
        const formatted = convertToGMT7(data.updatedAt);
        this.timestamp = `${formatted} (deleted)`;
        this.comment.username = data.username;
      }
    });
    if (this.comment.content == '[deleted]') {
      this.timestamp = `${convertToGMT7(this.comment.updatedAt)} (deleted)`;
    }
    else if (this.comment.createdAt == this.comment.updatedAt) {
      this.timestamp = convertToGMT7(this.comment.createdAt);
    }
    else {
      this.timestamp = `${convertToGMT7(this.comment.updatedAt)} (edited)`;
    }
  }

  onDeleteClick(commentId: string) {
    this.api.post('comment/delete', { comment_id: commentId }).subscribe({
      next: (res) => {
        this.toast.makeToast({
          state: "close",
          message: "Comment deleted",
          barClass: ['bg-lime-500'],
        })
      },
      error: (err) => {
        this.toast.makeToast({
          state: "close",
          message: "Comment not found or it's not yours",
          barClass: ['bg-red-600'],
        })
      }
    })
  }
  onEditClick(commentId: string, newContent: string) {
    this.api.post('comment/edit', { comment_id: commentId, content: newContent }).subscribe({
      next: (res) => {
        this.toast.makeToast({
          state: "close",
          message: "Comment updated",
          barClass: ['bg-lime-500'],
        });
        this.toggleEditMode();
      },
      error: (err) => {
        this.toast.makeToast({
          state: "close",
          message: "Comment not found or it's not yours",
          barClass: ['bg-red-600'],
        });
        this.toggleEditMode();
      }
    })
  }

  toggleEditMode() {
    this.isInEditMode = !this.isInEditMode;
  }

  toggleReplyInput() {
    this.isReplyInputVisible = !this.isReplyInputVisible;
  }

  updateReplyInput(val: string) {
    this.userReplyInput = val;
  }

  postComment() {
    if (this.userReplyInput.trim() == "") {
      this.toast.makeToast({
        state: "close",
        message: "Can't create empty comment",
        barClass: ['bg-red-600'],
      })
      return;
    }
    this.api.post('comment/create', { content: this.userReplyInput, post_id: this.comment.post_id, parent_id: this.comment._id }).subscribe({
      next: (res) => {
        this.isReplyInputVisible = false;
        this.userReplyInput = "";
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

  toggleReply() {
    this.isReplyVisible = !this.isReplyVisible;
  }
}

