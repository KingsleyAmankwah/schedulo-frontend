import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';
import { LogoutModalComponent } from "../logout-modal/logout-modal.component";

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [SidebarComponent, RouterOutlet, LogoutModalComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent {
  showLogoutModal = false;

  public triggerLogoutModal() {
    this.showLogoutModal = !this.showLogoutModal;
  }
}
