import { Component, effect } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { AuthComponent } from './features/auth/auth.component';
import { CommonModule } from '@angular/common';
import { SharedService } from './shared/services/shared.service';
import { ShareProfileModalComponent } from './shared/components/share-profile-modal/share-profile-modal.component';
import { ToastComponent } from './shared/components/toast/toast.component';
import { AuthService } from './features/auth/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NavbarComponent,
    AuthComponent,
    ShareProfileModalComponent,
    ToastComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  protected isAuthModalOpen = false;
  protected showNavbar = true;
  public authMode: 'login' | 'register' = 'login';
  protected shareProfileModal = false;

  constructor(
    public sharedService: SharedService,
    private authService: AuthService
  ) {
    effect(() => {
      if (this.sharedService.showLoginModal()) {
        this.authMode = 'login';
        this.isAuthModalOpen = true;

        this.sharedService.closeLoginModal();
      }
    });
  }

  ngOnInit() {
    this.authService.checkAuthStatus();
  }

  protected onOpenLoginModal() {
    this.authMode = 'login';
    this.isAuthModalOpen = true;
  }
  protected onOpenRegisterModal() {
    this.authMode = 'register';
    this.isAuthModalOpen = true;
  }

  protected onCloseAAuthModal() {
    this.isAuthModalOpen = false;
  }

  protected onOpenShareProfileModal() {
    this.shareProfileModal = true;
  }

  protected closeShareProfileModal() {
    this.shareProfileModal = false;
  }
}
