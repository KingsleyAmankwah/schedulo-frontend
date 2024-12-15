import { Component, effect, EventEmitter, Output, signal } from '@angular/core';
import { CustomButtonComponent } from '../custom-button/custom-button.component';
import { AuthService } from '../../../features/auth/services/auth.service';
import { CommonModule } from '@angular/common';
import { UserDetails } from '../../../features/auth/interfaces';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CustomButtonComponent, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  protected isLoggedIn = signal(false);
  protected userDetails: UserDetails | null = null;
  @Output() openLoginModal = new EventEmitter();
  @Output() openRegisterModal = new EventEmitter();
  @Output() openShareProfileModal = new EventEmitter();

  constructor(
    private authService: AuthService,
    private sharedService: SharedService
  ) {
    effect(() => {
      this.isLoggedIn = this.authService.isAuthenticated;
      if (this.isLoggedIn()) {
        const userId = this.authService.getUserId;
        return this.getUserInfo(userId);
      }
    });
  }

  public triggerLoginModal() {
    this.openLoginModal.emit();
  }

  public triggerRegisterModal() {
    this.openRegisterModal.emit();
  }

  public triggerShareProfileModal() {
    this.openShareProfileModal.emit();
  }

  toggleSidebar() {
    this.sharedService.sidebarExpanded();
  }

  protected getUserInfo(userId: string | undefined) {
    this.authService.fetchUserDetails(userId).subscribe({
      next: (response: UserDetails) => {
        this.userDetails = response;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
