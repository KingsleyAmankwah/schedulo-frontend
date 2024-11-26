import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

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
  @Input() buttonColor: 'primary' | 'secondary' | 'danger' = 'primary';
  @Input() disabled = false;
  @Input() imgSrc?: string;
  @Input() iconName?: string;
  @Output() buttonClick = new EventEmitter();

  public onButtonClick() {
    if (!this.disabled) {
      this.buttonClick.emit();
    }
  }

  getButtonClasses(): string {
    switch (this.buttonColor) {
      case 'primary':
        return 'bg-primary-100 text-white hover:bg-primary-100/90';
      case 'secondary':
        return 'bg-secondary-200 text-secondary-100 hover:bg-secondary-200/90';
      case 'danger':
        return 'bg-danger-100 text-white hover:bg-danger-100/90';
      default:
        return '';
    }
  }
}
