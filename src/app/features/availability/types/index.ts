export interface Availabilities {
  userId: string | undefined;
  availabilities: UserAvailability[];
}

export interface UserAvailability {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

export interface AvailabilityEntry {
  dayOfWeek: string;
  enabled: boolean;
  startTime: string;
  endTime: string;
  error: string;
}
