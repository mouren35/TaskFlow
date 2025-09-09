import { Meteor } from "meteor/meteor";
import { Tasks, TimeBlocks } from "./collection";

if (Meteor.isServer) {
  Meteor.publish("tasks.all", function publishAllTasks() {
    return Tasks.find({}, { sort: { createdAt: -1 } });
  });

  Meteor.publish("timeblocks.all", function publishAllTimeBlocks() {
    return TimeBlocks.find({}, { sort: { createdAt: 1 } });
  });

  // camelCase alias used by some client code
  Meteor.publish('timeBlocks.all', function publishAllTimeBlocksAlias() {
    return TimeBlocks.find({}, { sort: { createdAt: 1 } });
  });

  // publish timeblocks within a specific date (by createdAt)
  Meteor.publish('timeBlocks.byDate', function publishTimeBlocksByDate(date: Date) {
    // accept either Date or parsable string
    const d = date ? new Date(date) : new Date();
    const startOfDay = new Date(d);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(d);
    endOfDay.setHours(23, 59, 59, 999);
    return TimeBlocks.find({ createdAt: { $gte: startOfDay, $lte: endOfDay } }, { sort: { start: 1 } });
  });
}
