import { Meteor } from "meteor/meteor";
import { ThoughtsCollection, Thought } from "../../api/tasks/thoughts";

function callMeteor<T = any>(method: string, ...args: any[]): Promise<T> {
  return new Promise((resolve, reject) => {
    // @ts-ignore meteor callback
    Meteor.call(method, ...args, (err: any, res: T) => {
      if (err) reject(err);
      else resolve(res);
    });
  });
}

export const ThoughtsService = {
  // Read helpers (synchronous, for use inside useTracker)
  fetchByParent(parentId?: string): Thought[] {
    return ThoughtsCollection.find(
      { parentId },
      { sort: { createdAt: 1 } }
    ).fetch();
  },

  findById(id: string): Thought | undefined {
    return ThoughtsCollection.findOne({ _id: id });
  },

  // Operations
  insertThought(
    thought: Omit<Thought, "_id" | "createdAt"> & {
      parentId?: string;
      level?: number;
    }
  ) {
    return callMeteor("thoughts.insert", thought);
  },

  updateThought(id: string, updates: Partial<Thought>) {
    return callMeteor("thoughts.update", id, updates);
  },

  removeThought(id: string) {
    return callMeteor("thoughts.remove", id);
  },

  completeThought(id: string, actualTime: number) {
    return callMeteor("thoughts.complete", id, actualTime);
  },

  indentThought(id: string) {
    return callMeteor("thoughts.indent", id);
  },

  outdentThought(id: string) {
    return callMeteor("thoughts.outdent", id);
  },
};

export type IThoughtsService = typeof ThoughtsService;
