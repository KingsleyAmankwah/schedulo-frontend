import { CommonModule } from '@angular/common';
import {
  Component,
  effect,
  EventEmitter,
  inject,
  Input,
  Output,
} from '@angular/core';
import { AuthService } from '../../../features/auth/services/auth.service';
import { UserDetails } from '../../../features/auth/interfaces';

@Component({
  selector: 'app-share-profile-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './share-profile-modal.component.html',
  styleUrl: './share-profile-modal.component.css',
})
export class ShareProfileModalComponent {
  @Input() showSharePopup: boolean = false;
  @Output() closeModal = new EventEmitter();
  private authService = inject(AuthService);
  protected userDetails: UserDetails | null = null;

  copied = false;
  protected profileURL = 'https://schedullr.vercel.app/profile/';
  protected generatedProfile = '';

  profileLink: string = '';

  constructor() {
    effect(() => {
      const isLoggedIn = this.authService.isAuthenticated;
      if (isLoggedIn()) {
        const userId = this.authService.getUserId;
        return this.getUserInfo(userId);
      }
    });
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

  private getUserInfo(userId: string | undefined) {
    this.authService.fetchUserDetails(userId).subscribe({
      next: (response: UserDetails) => {
        this.profileLink = response.profileLink;
        this.generateProfileLink();
      },
      error: (error) => {
        console.log(error);
      },
    });
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
