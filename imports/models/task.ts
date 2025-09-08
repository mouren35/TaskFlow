import { Mongo } from "meteor/mongo";
import { Meteor } from "meteor/meteor";

export interface Task {
  _id?: string;
  blockId: string; // 关联时间块
  title: string;
  category: "social" | "mind" | "health" | "work" | "hobby" | "uncategorized";
  estimatedTime: number; // 预计分钟
  actualTime?: number;
  dueDate?: string; // 截止日期
  repeat?: {
    type: "daily" | "weekly" | "monthly" | "none";
    rule: any; // 具体重复规则
    count: number; // 当天执行次数
  };
  status: "pending" | "inProgress" | "completed";
  notes?: string;
  createdAt: Date;
  completedAt?: Date;
}

export const TasksCollection = new Mongo.Collection<Task>("tasks");

// 创建任务的方法
Meteor.methods({
  "tasks.insert"(task: Omit<Task, "_id" | "createdAt">) {
    try {
      const now = new Date();
      const newTask: Task = {
        blockId: (task.blockId as string) || "",
        title: (task.title as string) || "未定义",
        category: (task.category as any) || "uncategorized",
        estimatedTime:
          typeof task.estimatedTime === "number" && task.estimatedTime > 0
            ? task.estimatedTime
            : 25,
        notes: task.notes,
        dueDate: task.dueDate,
        repeat: task.repeat,
        status: (task.status as any) || "pending",
        createdAt: now,
      };
      return TasksCollection.insert(newTask);
    } catch (e) {
      // 记录错误以便调试
      // eslint-disable-next-line no-console
      console.error("tasks.insert failed:", e);
      throw new Meteor.Error("internal-error", "创建任务失败");
    }
  },

  "tasks.update"(_id: string, updates: Partial<Task>) {
    return TasksCollection.update({ _id }, { $set: updates });
  },

  "tasks.remove"(_id: string) {
    return TasksCollection.remove({ _id });
  },

  "tasks.complete"(_id: string, actualTime: number) {
    return TasksCollection.update(
      { _id },
      {
        $set: {
          status: "completed",
          completedAt: new Date(),
          actualTime,
        },
      }
    );
  },

  "tasks.start"(_id: string) {
    // 先将所有进行中的任务设为待处理
    TasksCollection.update(
      { status: "inProgress" },
      { $set: { status: "pending" } },
      { multi: true }
    );

    // 将当前任务设为进行中
    return TasksCollection.update(
      { _id },
      {
        $set: { status: "inProgress" },
      }
    );
  },

  "tasks.pause"(_id: string) {
    return TasksCollection.update(
      { _id },
      {
        $set: { status: "pending" },
      }
    );
  },
});

// 发布任务数据
if (Meteor.isServer) {
  Meteor.publish("tasks", function () {
    return TasksCollection.find({});
  });

  Meteor.publish("tasks.byBlock", function (blockId: string) {
    return TasksCollection.find({ blockId });
  });

  Meteor.publish("tasks.pending", function () {
    return TasksCollection.find({ status: "pending" });
  });

  Meteor.publish("tasks.completed", function () {
    return TasksCollection.find({ status: "completed" });
  });
}
