import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Socket } from 'ngx-socket-io';

interface INotification {
  message: string,  /** message to be shown in the toast */
  source: string,  /** notification sender */
  target: string, /** the one who is supposed to receive the msg */
  status: string, /** unseen, seen, pending: reserved for friend request, it stays pending as long as it should be */
  dest: string, /** target link when user clicks on the notification */
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {


  notification$: Subject<INotification> = new Subject<INotification>();
  constructor(private socket: Socket) {
    this.socket.on('user-vote', (data: any) => {
      const newNotification = {
         message: "",
         source: "",
         target: "",
         status: "",
         dest: "",
      }
      //todo: will ruled out non-friend notification later on
      if (data.voteType != 0) {
        newNotification.source = data.username;
        newNotification.target = data.op;
        newNotification.message = data.voteType == 1 ? `${data.username} has upvoted your post` : `${data.username} has downvoted your post`;
        newNotification.status = "unseen";
        newNotification.dest = `http://localhost:4200/post/${data.post_id}`;
      }
      this.notification$.next(newNotification);
    });

    //todo: listen for friend request notification and new post notification
  }

}
