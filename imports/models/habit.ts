import { Mongo } from "meteor/mongo";
import { Meteor } from "meteor/meteor";
import { Task } from "./task";

export interface Habit {
  _id?: string;
  taskId: string; // 关联的任务ID
  title: string;
  category: "social" | "mind" | "health" | "work" | "hobby" | "uncategorized";
  estimatedTime: number; // 预计分钟
  repeat: {
    type: "daily" | "weekly" | "monthly";
    rule: any; // 具体重复规则，如每周几、每月几号等
    count: number; // 当天执行次数
  };
  streak: number; // 连续完成次数
  totalCompleted: number; // 总完成次数
  lastCompleted?: Date; // 最后一次完成时间
  createdAt: Date;
}

export const HabitsCollection = new Mongo.Collection<Habit>("habits");

// 创建习惯的方法
Meteor.methods({
  // Change: accept taskId explicitly because callers may pass only task data without _id
  "habits.insert"(taskId: string, task: Omit<Task, "_id" | "createdAt">) {
    // 从任务创建习惯 — 任务的 repeat 可能包含 'none'
    if (!task.repeat || task.repeat.type === "none") {
      throw new Meteor.Error("invalid-habit", "无法从非重复任务创建习惯");
    }

    // Cast repeat to the Habit.repeat shape (exclude 'none')
    const repeat = task.repeat as {
      type: "daily" | "weekly" | "monthly";
      rule: any;
      count: number;
    };

    return HabitsCollection.insert({
      taskId: taskId,
      title: task.title,
      category: task.category,
      estimatedTime: task.estimatedTime,
      repeat,
      streak: 0,
      totalCompleted: 0,
      createdAt: new Date(),
    });
  },

  "habits.update"(_id: string, updates: Partial<Habit>) {
    return HabitsCollection.update({ _id }, { $set: updates });
  },

  "habits.remove"(_id: string) {
    return HabitsCollection.remove({ _id });
  },

  "habits.complete"(_id: string) {
    const habit = HabitsCollection.findOne({ _id });
    if (!habit) {
      throw new Meteor.Error("not-found", "习惯不存在");
    }

    const lastCompleted = habit.lastCompleted;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // 检查上次完成时间是否是昨天，如果是则增加连续次数
    let streak = habit.streak;
    if (lastCompleted) {
      const lastCompletedDate = new Date(
        lastCompleted.getFullYear(),
        lastCompleted.getMonth(),
        lastCompleted.getDate()
      );
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (lastCompletedDate.getTime() === yesterday.getTime()) {
        streak += 1;
      } else if (lastCompletedDate.getTime() < yesterday.getTime()) {
        // 如果上次完成时间早于昨天，则重置连续次数
        streak = 1;
      }
    } else {
      streak = 1;
    }

    return HabitsCollection.update(
      { _id },
      {
        $set: {
          lastCompleted: now,
          streak,
        },
        $inc: { totalCompleted: 1 },
      }
    );
  },
});

// 发布习惯数据
if (Meteor.isServer) {
  Meteor.publish("habits", function () {
    return HabitsCollection.find({});
  });

  Meteor.publish("habits.active", function () {
    return HabitsCollection.find({
      // 可以添加筛选条件，如只显示活跃的习惯
    });
  });
}
