import { TasksCollection, Task } from "../../models/task";
import { TimeBlocksCollection, TimeBlock } from "../../models/timeblock";
import { TasksAPI, TimeBlocksAPI } from "../../api/tasks/methods";

export const TaskService = {
  // Read helpers (synchronous, for use inside useTracker)
  fetchAllTasks(): Task[] {
    return TasksCollection.find({}, { sort: { createdAt: -1 } }).fetch();
  },

  fetchTimeBlocksByDate(date: Date): TimeBlock[] {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    return TimeBlocksCollection.find(
      {
        date: { $gte: startOfDay, $lte: endOfDay },
      },
      { sort: { startTime: 1 } }
    ).fetch();
  },

  // Operations (return Promises)
  insertTask(task: Omit<Task, "_id" | "createdAt">) {
    return TasksAPI.insert(task as any);
  },

  updateTask(id: string, updates: Partial<Task>) {
    return TasksAPI.update(id, updates as any);
  },

  removeTask(id: string) {
    return TasksAPI.remove(id);
  },

  completeTask(id: string, actualTime: number) {
    return TasksAPI.complete(id, actualTime);
  },

  startTask(id: string) {
    // models/task.ts already implements tasks.start via Meteor.methods, so call directly
    return TasksAPI.update(id, { status: "inProgress" } as any);
  },

  pauseTask(id: string) {
    return TasksAPI.update(id, { status: "pending" } as any);
  },

  insertTimeBlock(tb: Omit<TimeBlock, "_id" | "createdAt" | "updatedAt">) {
    return TimeBlocksAPI.insert(tb as any);
  },

  updateTimeBlock(id: string, updates: Partial<TimeBlock>) {
    return TimeBlocksAPI.update(id, updates as any);
  },

  removeTimeBlock(id: string) {
    return TimeBlocksAPI.remove(id);
  },

  // Helper to fetch tasks by block id (synchronous)
  getTasksByBlockId(blockId: string): Task[] {
    return TasksCollection.find(
      { blockId },
      { sort: { createdAt: 1 } }
    ).fetch();
  },
};

export type ITaskService = typeof TaskService;
