import { Meteor } from "meteor/meteor";

// Provide client-side wrappers to call server methods implemented in imports/models
export const TasksAPI = {
  insert(task: any) {
    return new Promise((resolve, reject) => {
      // @ts-ignore
      Meteor.call("tasks.insert", task, (err: any, res: any) => {
        if (err) reject(err);
        else resolve(res);
      });
    });
  },
  update(id: string, updates: any) {
    return new Promise((resolve, reject) => {
      // @ts-ignore
      Meteor.call("tasks.update", id, updates, (err: any, res: any) => {
        if (err) reject(err);
        else resolve(res);
      });
    });
  },
  remove(id: string) {
    return new Promise((resolve, reject) => {
      // @ts-ignore
      Meteor.call("tasks.remove", id, (err: any, res: any) => {
        if (err) reject(err);
        else resolve(res);
      });
    });
  },
  complete(id: string, actualTime?: number) {
    return new Promise((resolve, reject) => {
      // @ts-ignore
      Meteor.call("tasks.complete", id, actualTime || 0, (err: any, res: any) => {
        if (err) reject(err);
        else resolve(res);
      });
    });
  },
};

export const TimeBlocksAPI = {
  insert(block: any) {
    return new Promise((resolve, reject) => {
      // @ts-ignore
      Meteor.call("timeBlocks.insert", block, (err: any, res: any) => {
        if (err) reject(err);
        else resolve(res);
      });
    });
  },
  update(id: string, updates: any) {
    return new Promise((resolve, reject) => {
      // @ts-ignore
      Meteor.call("timeBlocks.update", id, updates, (err: any, res: any) => {
        if (err) reject(err);
        else resolve(res);
      });
    });
  },
  remove(id: string) {
    return new Promise((resolve, reject) => {
      // @ts-ignore
      Meteor.call("timeBlocks.remove", id, (err: any, res: any) => {
        if (err) reject(err);
        else resolve(res);
      });
    });
  },
};
