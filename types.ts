export interface Feedback {
  id: string;
  text: string;
  mood: number; // 1 to 5
  timestamp: number;
}

export interface AnalysisResult {
  summary: string;
  actionPoints: string[];
}

export enum MoodType {
  Angry = 1,
  Sad = 2,
  Neutral = 3,
  Happy = 4,
  Ecstatic = 5,
}

export interface ChartDataPoint {
  mood: string;
  count: number;
  color: string;
}
