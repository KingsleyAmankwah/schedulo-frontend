import { Component, EventEmitter, Output } from '@angular/core';
import { CustomButtonComponent } from '../custom-button/custom-button.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CustomButtonComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  @Output() openLoginModal = new EventEmitter();
  @Output() openRegisterModal = new EventEmitter();

  public triggerLoginModal() {
    this.openLoginModal.emit();
  }

  public triggerRegisterModal() {
    this.openRegisterModal.emit();
  }
}
