export type BookingRequest = {
  hostSlug: String | null;
  inviteeName: string | null | undefined;
  inviteeEmail: string | null | undefined;
  summary: string | null | undefined;
  date: string | null | undefined;
  startTime: string | null | undefined;
  endTime: string | null | undefined;
};

export type RescheduleRequest = {
  meetingId: string;
  inviteeName: string | null | undefined;
  inviteeEmail: string | null | undefined;
  date: string | null | undefined;
  startTime: string | null | undefined;
  endTime: string | null | undefined;
};

export type BookingResponse = {
  message: string;
};
