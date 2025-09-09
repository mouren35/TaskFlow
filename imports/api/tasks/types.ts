export interface TimeBlock {
  _id?: string;
  title: string;
  date: Date;
  startTime: string;
  endTime?: string | null;
  createdAt: Date;
}

export interface Task {
  _id?: string;
  title: string;
  blockId?: string | null;
  estimatedTime: number;
  status?: 'pending' | 'inProgress' | 'completed';
  createdAt: Date;
  category?: string;
  notes?: string;
}
