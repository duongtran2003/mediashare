import { Schema, model } from "mongoose"

interface INotification {
  message: string,  /** message to be shown in the toast */
  source: string,  /** notification sender */
  target: string, /** the one who is supposed to receive the msg */
  status: string, /** unseen, seen */
  dest: string, /** target link when user clicks on the notification */
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
    dest: {
        type: String,
    },
});

const Notification = model<INotification> ('Notification', notificationModel);

export {
    Notification,
}