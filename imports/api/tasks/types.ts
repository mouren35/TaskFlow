export interface TimeBlock {
  _id?: string;
  title: string;
  start?: Date | null;
  end?: Date | null;
  createdAt: Date;
}

export interface Task {
  _id?: string;
  title: string;
  timeBlockId?: string | null;
  estimatedMinutes: number;
  completed?: boolean;
  createdAt: Date;
  category?: string;
  notes?: string;
}
