import { Component, effect } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { AuthComponent } from './features/auth/auth.component';
import { CommonModule } from '@angular/common';
import { SharedService } from './shared/services/shared.service';
import { ShareProfileModalComponent } from './shared/components/share-profile-modal/share-profile-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NavbarComponent,
    AuthComponent,
    ShareProfileModalComponent,
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
    private sharedService: SharedService,
    private route: ActivatedRoute
  ) {
    effect(() => {
      if (this.sharedService.showLoginModal()) {
        this.authMode = 'login';
        this.isAuthModalOpen = true;

        this.sharedService.closeLoginModal();
      }
    });
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
