import { Component, Input, inject, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ToastService } from 'src/app/services/toast.service';
import { IconDefinition, faEdit } from '@fortawesome/free-regular-svg-icons';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Socket } from 'ngx-socket-io';

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

  isInEditMode: boolean = false;

  timestamp: string = "";

  private socket = inject(Socket);
  private toast = inject(ToastService);
  private api = inject(ApiService);

  ngOnInit(): void {
    this.socket.on('comment-edit', (data: any) => {
      if (data.comment_id == this.comment._id) {
        this.comment.content = data.content;
        this.timestamp = `${data.updatedAt} (edited)`;
      }
    });
    if (this.comment.createdAt == this.comment.updatedAt) {
      this.timestamp = this.comment.createdAt;
    }
    else {
      this.timestamp = `${this.comment.updatedAt} (edited)`
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
    console.log(commentId);
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
}

