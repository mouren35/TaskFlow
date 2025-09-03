import { Meteor } from "meteor/meteor";
import { Tasks, TimeBlocks } from "./collection";

if (Meteor.isServer) {
  Meteor.publish("tasks.all", function publishAllTasks() {
    return Tasks.find({}, { sort: { createdAt: -1 } });
  });

  Meteor.publish("timeblocks.all", function publishAllTimeBlocks() {
    return TimeBlocks.find({}, { sort: { createdAt: 1 } });
  });
}
