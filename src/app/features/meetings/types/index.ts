export type Meeting = {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: MeetingStatus;
  inviteeName: string;
  inviteeEmail: string;
  linkActive: boolean;
  summary: string;
  join_link: string;
  createdAt: string;
  updatedAt: string;
};

export enum MeetingStatus {
  Upcoming = 'UPCOMING',
  Pending = 'PENDING',
  Completed = 'COMPLETED',
  Cancelled = 'CANCELLED',
  Accepted = '  ACCEPTED',
}

export type MeetingRescheduleRequest = {
  meetingId: string;
  inviteeName: string;
  inviteeEmail: string;
  date: string | null | undefined;
  startTime: string | null | undefined;
  endTime: string | null | undefined;
};
