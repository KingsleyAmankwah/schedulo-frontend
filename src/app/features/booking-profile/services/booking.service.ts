import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { meeting } from '../../../shared/constants/apiEndpoints';
import { BookingRequest, BookingResponse } from '../types';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  constructor(private http: HttpClient) {}

  public scheduleMeeting(request: BookingRequest) {
    return this.http.post<BookingResponse>(`${meeting}/book-meeting`, request);
  }
}
