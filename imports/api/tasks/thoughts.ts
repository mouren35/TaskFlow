import { Mongo } from "meteor/mongo";
import { Meteor } from "meteor/meteor";

export interface Thought {
  _id?: string;
  parentId?: string; // TreeView 父节点
  title: string;
  category: "social" | "mind" | "health" | "work" | "hobby" | "uncategorized";
  estimatedTime: number; // 预计分钟
  actualTime?: number;
  notes?: string;
  status: "pending" | "completed";
  createdAt: Date;
  completedAt?: Date;
  level: number; // 缩进级别
}

export const ThoughtsCollection = new Mongo.Collection<Thought>("thoughts");

// 创建思考的方法
Meteor.methods({
  "thoughts.insert"(thought: Omit<Thought, "_id" | "createdAt">) {
    return ThoughtsCollection.insert({
      ...thought,
      createdAt: new Date(),
    });
  },

  "thoughts.update"(_id: string, updates: Partial<Thought>) {
    return ThoughtsCollection.update({ _id }, { $set: updates });
  },

  "thoughts.remove"(_id: string) {
    // 递归删除所有子节点
    const childThoughts = ThoughtsCollection.find({ parentId: _id }).fetch();
    childThoughts.forEach((child) => {
      Meteor.call("thoughts.remove", child._id);
    });

    return ThoughtsCollection.remove({ _id });
  },

  "thoughts.complete"(_id: string, actualTime: number) {
    return ThoughtsCollection.update(
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

  "thoughts.indent"(_id: string) {
    const thought = ThoughtsCollection.findOne({ _id });
    if (!thought) {
      throw new Meteor.Error("not-found", "思考不存在");
    }

    // 获取前一个同级思考作为新的父节点
    const previousThought = ThoughtsCollection.findOne(
      {
        parentId: thought.parentId,
        level: thought.level,
        createdAt: { $lt: thought.createdAt },
      },
      {
        sort: { createdAt: -1 },
      }
    );

    if (!previousThought) {
      throw new Meteor.Error("invalid-operation", "无法缩进，没有前置节点");
    }

    return ThoughtsCollection.update(
      { _id },
      {
        $set: {
          parentId: previousThought._id,
          level: thought.level + 1,
        },
      }
    );
  },

  "thoughts.outdent"(_id: string) {
    const thought = ThoughtsCollection.findOne({ _id });
    if (!thought || !thought.parentId) {
      throw new Meteor.Error("invalid-operation", "无法取消缩进，已是顶级节点");
    }

    const parentThought = ThoughtsCollection.findOne({ _id: thought.parentId });
    if (!parentThought) {
      throw new Meteor.Error("not-found", "父节点不存在");
    }

    return ThoughtsCollection.update(
      { _id },
      {
        $set: {
          parentId: parentThought.parentId,
          level: thought.level - 1,
        },
      }
    );
  },

  "thoughts.getChildren"(parentId?: string) {
    return ThoughtsCollection.find({ parentId }).fetch();
  },
});

// 发布思考数据
if (Meteor.isServer) {
  Meteor.publish("thoughts", function () {
    return ThoughtsCollection.find({});
  });

  Meteor.publish("thoughts.root", function () {
    // Query for root nodes where parentId is null
    return ThoughtsCollection.find({ parentId: { $eq: null } } as any);
  });

  Meteor.publish("thoughts.byParent", function (parentId: string) {
    return ThoughtsCollection.find({ parentId });
  });
}
