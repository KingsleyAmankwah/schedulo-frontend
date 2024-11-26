import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Availabilities, UserAvailability } from '../types';
import { availability } from '../../../shared/constants/apiEndpoints';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AvailabilityService {
  constructor(private http: HttpClient) {}

  public createAvailability(payload: Availabilities) {
    return this.http.post<Availabilities>(`${availability}`, payload);
  }

  public getAvailability(userId: string) {
    return this.http.get<UserAvailability[]>(`${availability}/${userId}`);
  }
}
