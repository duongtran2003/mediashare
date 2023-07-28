import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

interface IToast {
  state: string,
  message: string,
  barClass: string[],
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  public toastList$: Subject<IToast> = new Subject<IToast>;
  makeToast(toast: IToast): void {
    this.toastList$.next(toast);
  }
}
