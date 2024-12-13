import { Component, inject } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';
import { LogoutModalComponent } from '../logout-modal/logout-modal.component';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [SidebarComponent, RouterOutlet, LogoutModalComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent {
  protected sharedService = inject(SharedService);
  showLogoutModal = false;
  public sidebarExpanded = false;

  public triggerLogoutModal() {
    this.showLogoutModal = !this.showLogoutModal;
  }
}
