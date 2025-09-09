import { Meteor } from "meteor/meteor";
import { TasksCollection, Task } from "../../models/task";
import { TimeBlocksCollection, TimeBlock } from "../../models/timeblock";

function callMeteor<T = any>(method: string, ...args: any[]): Promise<T> {
  return new Promise((resolve, reject) => {
    // @ts-ignore meteor callback
    Meteor.call(method, ...args, (err: any, res: T) => {
      if (err) reject(err);
      else resolve(res);
    });
  });
}

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
    return callMeteor("tasks.insert", task);
  },

  updateTask(id: string, updates: Partial<Task>) {
    return callMeteor("tasks.update", id, updates);
  },

  removeTask(id: string) {
    return callMeteor("tasks.remove", id);
  },

  completeTask(id: string, actualTime: number) {
    return callMeteor("tasks.complete", id, actualTime);
  },

  startTask(id: string) {
    return callMeteor("tasks.start", id);
  },

  pauseTask(id: string) {
    return callMeteor("tasks.pause", id);
  },

  insertTimeBlock(tb: Omit<TimeBlock, "_id" | "createdAt" | "updatedAt">) {
    return callMeteor("timeBlocks.insert", tb);
  },

  updateTimeBlock(id: string, updates: Partial<TimeBlock>) {
    return callMeteor("timeBlocks.update", id, updates);
  },

  removeTimeBlock(id: string) {
    return callMeteor("timeBlocks.remove", id);
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
