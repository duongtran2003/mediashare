import { Injectable, inject } from '@angular/core';
import { Subject } from 'rxjs';
import { Socket } from 'ngx-socket-io';
import { AuthService } from './auth.service';
import { FriendService } from './friend.service';

interface INotification {
  _id: string,
  message: string,  /** message to be shown in the toast */
  source: string,  /** notification sender */
  target: string, /** the one who is supposed to receive the msg */
  status: string, /** unseen, seen, */
  segs: string,
  dest: string, /** target link when user clicks on the notification */
  avatarPath: string,
  createdAt: string,
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  notification$: Subject<INotification> = new Subject<INotification>();

  private friendState = inject(FriendService);
  private socket = inject(Socket);
  private auth = inject(AuthService);

  constructor() {
    this.socket.on('user-vote', (data: any) => {
      if (!(this.friendState.isFriend(data.username) && data.op == this.auth.getCurrentUser())) {
        return;
      }
      if (data.voteType != 0) {
        this.notification$.next({
          _id: data.noti_id,
          source: data.username,
          target: data.op,
          message: data.voteType == 1 ? `${data.username} has upvoted your post` : `${data.username} has downvoted your post`,
          status: "unseen",
          segs: '/post',
          dest: data.post_id,
          avatarPath: "",
          createdAt: data.createdAt,
        });
      }
    });

    this.socket.on('user-comment', (data: any) => {
      if (!(this.friendState.isFriend(data.comment.username) && data.target == this.auth.getCurrentUser())) {
        return;
      }
      this.notification$.next({
        _id: data.noti_id,
        source: data.comment.username,
        target: data.target,
        message: data.message,
        status: "unseen",
        segs: '/post',
        dest: data.post_id,
        avatarPath: "",
        createdAt: data.createdAt,
      })
    })
  }

}
