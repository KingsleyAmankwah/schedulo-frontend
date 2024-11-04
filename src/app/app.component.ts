import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { AuthComponent } from './features/auth/auth.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, AuthComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  protected isAuthModalOpen = false;
  public authMode: 'login' | 'register' = 'login';

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
