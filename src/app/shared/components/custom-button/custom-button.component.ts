import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-custom-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './custom-button.component.html',
  styleUrl: './custom-button.component.css',
})
export class CustomButtonComponent {
  @Input() text = '';
  @Input() buttonType: 'button' | 'submit' = 'button';
  @Input() buttonColor: 'primary' | 'secondary' = 'primary';
  @Input() disabled = false;
  @Input() imgSrc?: string;
  @Input() iconName?: string;
}
