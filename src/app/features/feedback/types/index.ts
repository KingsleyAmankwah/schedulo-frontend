export type FeedbackRequest = {
  meetingId: string | null;
  name: string;
  email: string;
  rating: FeedbackRating | string;
  comments: string;
};

export enum FeedbackRating {
  EXCELLENT = 'EXCELLENT',
  GOOD = 'GOOD',
  AVERAGE = 'AVERAGE',
  POOR = 'POOR',
}

export type Response = {
  message: string;
  error: string;
};
