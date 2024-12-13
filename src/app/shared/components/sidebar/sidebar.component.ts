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
      icon: 'dashboard',
    },

    {
      name: 'Pending Meetings',
      location: 'pending-meetings',
      icon: 'pending_actions',
    },

    {
      name: 'Upcoming Meetings',
      location: 'upcoming-meetings',
      icon: 'calendar_today',
    },

    {
      name: 'Past Meetings',
      location: 'past-meetings',
      icon: 'content_paste_off',
    },

    {
      name: 'Declined Meetings',
      location: 'decline-meetings',
      icon: 'archive',
    },
    {
      name: 'Logout',
      location: 'logout',
      icon: 'logout',
    },
  ];
}
