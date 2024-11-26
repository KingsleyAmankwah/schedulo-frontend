import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { meeting } from '../../../shared/constants/apiEndpoints';
import { Meeting, MeetingRescheduleRequest, MeetingStatus } from '../types';

@Injectable({
  providedIn: 'root',
})
export class MeetingService {
  constructor(private http: HttpClient) {}

  public getUserMeetings(userId: string | undefined) {
    return this.http.get<Meeting[]>(`${meeting}/meetings/upcoming/${userId}`);
  }

  public getDeclinedMeetings(userId: string | undefined) {
    return this.http.get<Meeting[]>(`${meeting}/meetings/declined/${userId}`);
  }

  public cancelMeeting(meetingId: string, status: MeetingStatus) {
    return this.http.put<MeetingStatus>(
      `${meeting}/${meetingId}/decline`,
      status
    );
  }

  public acceptMeeting(meetingId: string, status: MeetingStatus) {
    return this.http.put<MeetingStatus>(
      `${meeting}/${meetingId}/accept`,
      status
    );
  }

  public rescheduleMeeting(
    meetingId: string,
    request: MeetingRescheduleRequest
  ) {
    return this.http.put<MeetingRescheduleRequest>(
      `${meeting}/meetings/${meetingId}/reschedule`,
      request
    );
  }
}
