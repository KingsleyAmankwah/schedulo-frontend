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
      icon: 'dashboard',
    },
    {
      name: 'Upcoming Meetings',
      location: 'meetings',
      icon: 'calendar_today',
    },
    {
      name: 'Pending Meetings',
      location: 'pending-meetings',
      icon: 'pending_actions',
    },
    {
      name: 'Declined Meetings',
      location: 'archives',
      icon: 'archive',
    },
    {
      name: 'Logout',
      location: 'logout',
      icon: 'logout',
    },
  ];
}
