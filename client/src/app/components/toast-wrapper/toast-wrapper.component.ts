import { Component, OnInit } from '@angular/core';
import { ToastService } from 'src/app/services/toast.service';

interface IToast {
  state: string,
  message: string,
  barClass: string[],
}

@Component({
  selector: 'app-toast-wrapper',
  templateUrl: './toast-wrapper.component.html',
  styleUrls: ['./toast-wrapper.component.css']
})
export class ToastWrapperComponent implements OnInit {
  toastList: IToast[] = [];
  constructor(public toastService: ToastService) { }

  ngOnInit(): void {
    this.toastService.toastList$.subscribe({
      next: (newToast: IToast) => {
        this.toastList.unshift(newToast);
      }
    })
  }
  onDestroyToast(index: number): void {
    this.toastList.splice(index, 1);
  }
}
