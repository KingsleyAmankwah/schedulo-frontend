import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { generateGuid } from '../utils';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private _showLoginModal = signal(false);
  showLoginModal = this._showLoginModal.asReadonly();

  public triggerLoginModal() {
    this._showLoginModal.set(true);
  }
  public closeLoginModal() {
    this._showLoginModal.set(false);
  }

  public toasts: BehaviorSubject<Toast[]> = new BehaviorSubject<Toast[]>([]);
  public successToastr(message: string) {
    this.showToast({ message, type: 'success', id: generateGuid() });
  }

  public errorToastr(message: string) {
    this.showToast({ message, type: 'error', id: generateGuid() });
  }

  public infoToastr(message: string) {
    this.showToast({ message, type: 'info', id: generateGuid() });
  }

  public warningToastr(message: string) {
    this.showToast({ message, type: 'warning', id: generateGuid() });
  }

  public closeToast(id: string) {
    this.toasts.next(this.toasts.value.filter((t) => t.id !== id));
  }

  private removeToast(toast: Toast) {
    setTimeout(() => this.closeToast(toast.id), 5000);
  }

  private showToast(toast: Toast) {
    this.toasts.next([...this.toasts.value, toast]);
    this.removeToast(toast);
  }
}
