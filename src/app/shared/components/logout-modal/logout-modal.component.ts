import { Component, inject, Input } from '@angular/core';
import { CustomButtonComponent } from '../custom-button/custom-button.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../features/auth/services/auth.service';

@Component({
  selector: 'app-logout-modal',
  standalone: true,
  imports: [CustomButtonComponent, CommonModule],
  templateUrl: './logout-modal.component.html',
  styleUrl: './logout-modal.component.css',
})
export class LogoutModalComponent {
  @Input() showModal = false;
  private authService = inject(AuthService);

  onClose() {
    this.showModal = !this.showModal;
  }

  protected triggerLogout() {
    this.authService.logout();
  }
}
