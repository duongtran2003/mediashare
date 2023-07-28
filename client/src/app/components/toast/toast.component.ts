import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit, inject } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations'
import { ToastService } from 'src/app/services/toast.service';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css'],
  animations: [
    trigger('toastTrigger', [
      state('open', style({ transform: 'translateX(-5%)' })),
      state('close', style({ transform: 'translateX(200%)' })),
      transition('* => close', [
        animate('300ms ease-in-out')
      ]),
      transition('* => open', [
        animate('200ms ease-in-out')
      ])
    ])
  ]
})
export class ToastComponent implements OnInit, AfterViewInit {
  @Input() index!: number;
  @Input() newToast!: any;
  @Output() destroyToast = new EventEmitter();
  @ViewChild('bar') bar!: ElementRef;


  closeIcon = faTimesCircle;
  closeToast = setTimeout(() => {
    this.newToast.state = 'close';
  }, 2200);

  terminateToast = setTimeout(() => {
    this.destroyToast.emit(this.index);
  }, 2500);

  private toast = inject(ToastService);
  
  ngOnInit(): void {
    this.newToast.state = 'open';
    // this.closeToast;
    // this.terminateToast;
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.bar.nativeElement.style.width = "0%";
    }, 250);
  }
  dismiss(): void {
    clearTimeout(this.closeToast);
    clearTimeout(this.terminateToast);
    this.newToast.state = 'close';
    setTimeout(() => {
      this.destroyToast.emit(this.index);
    }, 300);
  }
}

