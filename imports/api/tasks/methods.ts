import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import { Tasks, TimeBlocks } from "./collection";
import type { Task, TimeBlock } from "./types";

Meteor.methods({
  "tasks.insert"(task: Partial<Task>) {
    check(task, Object);
    if (!this.userId) {
      // app is local-only; allow anonymous actions
    }
    const now = new Date();
    const doc: Task = {
      title: (task.title as string) || "未定义",
      estimatedMinutes: (task.estimatedMinutes as number) || 25,
      completed: false,
      createdAt: now,
      timeBlockId: task.timeBlockId || null,
      category: task.category || "默认",
      notes: task.notes || "",
    };
    return Tasks.insert(doc);
  },

  "tasks.update"(taskId: string, updates: Partial<Task>) {
    check(taskId, String);
    check(updates, Object);
    return Tasks.update({ _id: taskId }, { $set: updates });
  },

  "tasks.remove"(taskId: string) {
    check(taskId, String);
    return Tasks.remove({ _id: taskId });
  },

  "tasks.complete"(taskId: string) {
    check(taskId, String);
    return Tasks.update({ _id: taskId }, { $set: { completed: true } });
  },

  "timeblocks.insert"(block: Partial<TimeBlock>) {
    check(block, Object);
    const now = new Date();
    const doc: TimeBlock = {
      title: (block.title as string) || "时间块",
      start: block.start || null,
      end: block.end || null,
      createdAt: now,
    };
    return TimeBlocks.insert(doc);
  },
  "timeblocks.update"(blockId: string, updates: Partial<TimeBlock>) {
    check(blockId, String);
    check(updates, Object);
    return TimeBlocks.update({ _id: blockId }, { $set: updates });
  },

  "timeblocks.remove"(blockId: string) {
    check(blockId, String);
    return TimeBlocks.remove({ _id: blockId });
  },
});
