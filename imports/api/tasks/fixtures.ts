import { Meteor } from "meteor/meteor";
import { TasksCollection } from "../../models/task";
import { TimeBlocksCollection } from "../../models/timeblock";

export function loadSampleTasks() {
  if (Meteor.isServer) {
    Meteor.startup(() => {
      if (TimeBlocksCollection.find().count() === 0) {
        const now = new Date();
        const tb = {
          title: "默认时间块",
          date: new Date(now.setHours(8, 0, 0, 0)),
          startTime: "08:00",
          endTime: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        } as any;
        const tbId = TimeBlocksCollection.insert(tb);

        TasksCollection.insert({
          title: "示例任务：完成第一个时间块",
          blockId: tbId,
          estimatedTime: 25,
          status: "pending",
          createdAt: new Date(),
          category: "uncategorized",
          notes: "",
        } as any);
      }
    });
  }
}
