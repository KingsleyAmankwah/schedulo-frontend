import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { AuthService } from '../../../features/auth/services/auth.service';

@Component({
  selector: 'app-share-profile-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './share-profile-modal.component.html',
  styleUrl: './share-profile-modal.component.css',
})
export class ShareProfileModalComponent {
  @Input() profileLink: string | undefined = '';
  @Input() showSharePopup: boolean = false;
  @Output() closeModal = new EventEmitter();

  copied = false;
  protected profileURL = 'http:localhost:4200/profile/';
  private generatedProfile = '';
  private authService = inject(AuthService);

  ngOnInit() {
    this.profileLink = this.authService.getUserDetails()?.profile;
    this.generateProfileLink();
  }

  protected generateProfileLink() {
    if (this.profileLink) {
      this.generatedProfile = `${this.profileURL}${this.profileLink}`;
    }
  }

  async copyToClipboard() {
    try {
      await navigator.clipboard.writeText(this.generatedProfile);
      this.copied = true;
      setTimeout(() => {
        this.copied = false;
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  }

  getShareUrl(platform: string): string {
    const encodedLink = encodeURIComponent(this.generatedProfile);
    const text = encodeURIComponent(`Check out this profile!`);

    switch (platform) {
      case 'facebook':
        return `https://www.facebook.com/sharer/sharer.php?u=${encodedLink}`;
      case 'twitter':
        return `https://twitter.com/intent/tweet?url=${encodedLink}&text=${text}`;
      case 'linkedin':
        return `https://www.linkedin.com/shareArticle?mini=true&url=${encodedLink}&title=${text}`;
      default:
        return '';
    }
  }

  closeSharePopup() {
    this.closeModal.emit();
  }
}
