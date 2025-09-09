import { Meteor } from "meteor/meteor";
import { TasksCollection } from "../../models/task";
import { TimeBlocksCollection } from "../../models/timeblock";

// Export aliases to keep compatibility with older import paths
export const Tasks = TasksCollection as typeof TasksCollection;
export const TimeBlocks = TimeBlocksCollection as typeof TimeBlocksCollection;

// On server ensure indexes (use underlying rawCollection)
if (Meteor.isServer) {
  Meteor.startup(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (Tasks.rawCollection() as any)
      .createIndex({ createdAt: 1 })
      .catch(() => {});
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (TimeBlocks.rawCollection() as any)
      .createIndex({ createdAt: 1 })
      .catch(() => {});
  });
}
