import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FeedbackRequest, Response } from '../types';
import { meeting } from '../../../shared/constants/apiEndpoints';

@Injectable({
  providedIn: 'root',
})
export class FeedbackService {
  constructor(private http: HttpClient) {}

  public addFeedback(request: FeedbackRequest) {
    return this.http.post<Response>(`${meeting}/feedback-form`, request);
  }
}
