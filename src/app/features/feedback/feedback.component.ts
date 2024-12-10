import { Component } from '@angular/core';
import { CustomButtonComponent } from '../../shared/components/custom-button/custom-button.component';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FeedbackRating, FeedbackRequest } from './types';
import { FeedbackService } from './service/feedback.service';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '../../shared/services/shared.service';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [CustomButtonComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.css',
})
export class FeedbackComponent {
  ratings = Object.values(FeedbackRating);
  isLoading = false;
  meetingId: string | null = '';

  constructor(
    private fb: FormBuilder,
    private feedbackService: FeedbackService,
    private route: ActivatedRoute,
    private sharedService: SharedService
  ) {}

  ngOnInit() {
    this.meetingId = this.route.snapshot.queryParamMap.get('meetingId');
    console.log(this.meetingId);
  }

  feedbackForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    rating: ['', Validators.required],
    comments: [''],
  });

  selectRating(rating: FeedbackRating) {
    this.feedbackForm.patchValue({ rating });
  }

  onSubmit() {
    if (this.feedbackForm.valid) {
      this.isLoading = true;
      console.log(this.feedbackForm.value);
      const formData = this.feedbackForm.value;
      const requestData: FeedbackRequest = {
        meetingId: this.meetingId,
        name: formData.name!,
        email: formData.email!,
        rating: formData.rating!,
        comments: formData.comments!,
      };
      this.feedbackService.addFeedback(requestData).subscribe({
        next: (response) => {
          this.sharedService.successToastr(response.message);
          this.feedbackForm.reset();
        },
        error: (error) => {
          this.sharedService.errorToastr(error.error.error);
        },
      });
      this.isLoading = false;
    }
  }
}
