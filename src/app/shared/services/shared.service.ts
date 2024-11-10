import { Injectable, signal } from '@angular/core';

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
}
