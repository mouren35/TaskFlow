import { Mongo } from "meteor/mongo";
import { Meteor } from "meteor/meteor";
import type { Task, TimeBlock } from "./types";

export const Tasks = new Mongo.Collection<Task>("tasks");
export const TimeBlocks = new Mongo.Collection<TimeBlock>("timeblocks");

// On server publish minimal fields
if (Meteor.isServer) {
  // ensure indexes if needed
  Meteor.startup(() => {
    // rawCollection may not support createIndex in some environments; ignore errors
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
