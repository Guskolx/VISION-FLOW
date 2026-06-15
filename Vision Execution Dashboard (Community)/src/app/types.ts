export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
}

export interface ProgressEntry {
  date: string;
  value: number;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  progress: number;
  targetDate: string;
  milestones: Milestone[];
  progressHistory: ProgressEntry[];
}
