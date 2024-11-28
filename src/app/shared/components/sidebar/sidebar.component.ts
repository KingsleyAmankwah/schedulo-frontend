import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  @Output() openLogoutModal = new EventEmitter();

  public triggerLogoutModal() {
    this.openLogoutModal.emit();
  }

  protected sidebarNavItems = [
    {
      name: 'Dashboard',
      location: 'dashboard',
    },

    {
      name: 'Meetings',
      location: 'meetings',
    },

    {
      name: 'Archives',
      location: 'archives',
    },

    {
      name: 'Logout',
    },
  ];
}
