import { Meteor } from "meteor/meteor";
import { Tasks, TimeBlocks } from "./collection";

export function loadSampleTasks() {
  if (Meteor.isServer) {
    Meteor.startup(() => {
      if (TimeBlocks.find().count() === 0) {
        const now = new Date();
        const tb = {
          title: "默认时间块",
          start: new Date(now.setHours(8, 0, 0, 0)),
          end: null,
          createdAt: new Date(),
        };
        const tbId = TimeBlocks.insert(tb as any);

        Tasks.insert({
          title: "示例任务：完成第一个时间块",
          timeBlockId: tbId,
          estimatedMinutes: 25,
          completed: false,
          createdAt: new Date(),
          category: "默认",
          notes: "",
        });
      }
    });
  }
}
