import { Component, inject, Input } from '@angular/core';
import { SharedService, Toast } from '../../services/shared.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css',
  animations: [
    trigger('fade', [
      transition(':enter', [
        style({ transform: 'translateY(10%)', opacity: 0 }),
        animate('400ms', style({ transform: 'translateY(0)', opacity: 1 })),
      ]),
      transition(':leave', [
        style({ transform: 'translateY(0)', opacity: 1 }),
        animate('200ms', style({ transform: 'translateY(-5%)', opacity: 0 })),
      ]),
    ]),
  ],
})
export class ToastComponent {
  @Input() toast!: Toast;
  private sharedService = inject(SharedService);

  public close() {
    this.sharedService.closeToast(this.toast.id);
  }
}
