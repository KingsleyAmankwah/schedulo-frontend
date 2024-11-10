import { Component, effect, EventEmitter, Output } from '@angular/core';
import { CustomButtonComponent } from '../custom-button/custom-button.component';
import { AuthService } from '../../../features/auth/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CustomButtonComponent, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  protected isLoggedIn = false;
  @Output() openLoginModal = new EventEmitter();
  @Output() openRegisterModal = new EventEmitter();

  constructor(private authService: AuthService) {
    effect(() => {
      this.isLoggedIn = this.authService.isAuthenticated();
    });
  }

  public triggerLoginModal() {
    this.openLoginModal.emit();
  }

  public triggerRegisterModal() {
    this.openRegisterModal.emit();
  }
}
