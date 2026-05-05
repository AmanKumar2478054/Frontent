export interface Feedback {
  feedbackId: number;
  citizenId: number;
  category: string;
  comments: string;
  date: string;
  status: string;
}

export interface FeedbackCreateRequest {
  category: string;
  comments: string;
  status: string;
}
