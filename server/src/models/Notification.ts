import { Schema, model } from "mongoose"

interface INotification {
  message: string,  /** message to be shown in the toast */
  source: string,  /** notification sender */
  target: string, /** the one who is supposed to receive the msg */
  status: string, /** unseen, seen */
  segs: string,
  dest: string, /** target link when user clicks on the notification */
  createdAt: string,
  updatedAt: string,
}

const notificationModel = new Schema<INotification> ({
    source: {
        type: String,
    },
    target: {
        type: String,
    },
    message: {
        type: String,
    },
    status: {
        type: String,
    },
    segs: {
        type: String,
    },
    dest: {
        type: String,
    },
}, { timestamps: true });

const Notification = model<INotification> ('Notification', notificationModel);

export {
    Notification,
}