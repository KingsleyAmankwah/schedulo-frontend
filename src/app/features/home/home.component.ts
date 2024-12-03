import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  features: Feature[] = [
    {
      icon: 'clock',
      title: 'Easy Booking',
      description:
        'Intuitive interface to schedule sessions in just a few clicks.',
    },
    {
      icon: 'users',
      title: 'Connect Anywhere',
      description:
        'Book sessions with people from around the globe effortlessly.',
    },
    {
      icon: 'calendar',
      title: 'Smart Management',
      description: 'Intelligent calendar integration and time slot management.',
    },
  ];
}
