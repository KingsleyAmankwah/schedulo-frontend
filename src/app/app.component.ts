import { Component, effect } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { AuthComponent } from './features/auth/auth.component';
import { CommonModule } from '@angular/common';
import { SharedService } from './shared/services/shared.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, AuthComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  protected isAuthModalOpen = false;
  protected showNavbar = true;
  public authMode: 'login' | 'register' = 'login';

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

    this.route.url.subscribe((url) => {
      this.showNavbar = url[0].path !== 'autactivate-account';
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
}
