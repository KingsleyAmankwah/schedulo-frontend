import { Component, Input } from '@angular/core';
import { CustomButtonComponent } from '../../../../shared/components/custom-button/custom-button.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-decline-modal',
  standalone: true,
  imports: [CustomButtonComponent, CommonModule],
  templateUrl: './decline-modal.component.html',
  styleUrl: './decline-modal.component.css',
})
export class DeclineModalComponent {
  @Input() showModal = false;

  onClose() {
    this.showModal = !this.showModal;
  }
}
