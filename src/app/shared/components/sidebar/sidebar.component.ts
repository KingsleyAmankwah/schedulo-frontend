import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  protected sidebarNavItems = [
    {
      name: 'Availability',
      location: 'availability',
    },

    {
      name: 'Meetings',
      location: 'meetings',
    },

    {
      name: 'Event',
      location: 'event',
    },

    {
      name: 'Settings',
      location: 'settings',
    },

    {
      name: 'Logout',
      location: 'logout',
    },
  ];
}
