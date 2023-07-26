import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Socket } from 'ngx-socket-io';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';

interface INotification {
  _id: string,
  message: string,  /** message to be shown in the toast */
  source: string,  /** notification sender */
  target: string, /** the one who is supposed to receive the msg */
  status: string, /** unseen, seen, */
  segs: string,
  dest: string, /** target link when user clicks on the notification */
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {


  notification$: Subject<INotification> = new Subject<INotification>();
  constructor(private socket: Socket, private api: ApiService, private auth: AuthService) {
    this.socket.on('user-vote', (data: any) => {
      if (data.username == this.auth.getCurrentUser() || data.op != this.auth.getCurrentUser()) {
        return;
      }
      const newNotification = {
         _id: "",
         message: "",
         source: "",
         target: "",
         status: "",
         segs: "",
         dest: "",
      }
      //todo: will ruled out non-friend notification later on
      if (data.voteType != 0) {
        newNotification._id = data.noti_id,
        newNotification.source = data.username;
        newNotification.target = data.op;
        newNotification.message = data.voteType == 1 ? `${data.username} has upvoted your post` : `${data.username} has downvoted your post`;
        newNotification.status = "unseen";
        newNotification.segs = '/post'
        newNotification.dest = data.post_id;
        this.notification$.next(newNotification);
      }
    });

    this.socket.on('user-comment', (data: any) => {
      if (data.source == this.auth.getCurrentUser() || data.target != this.auth.getCurrentUser()) {
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
      })
    })
  }

}
