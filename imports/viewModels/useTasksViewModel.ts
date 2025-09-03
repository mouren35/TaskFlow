import { useTracker } from "meteor/react-meteor-data";
import { Tasks, TimeBlocks } from "../api/tasks/collection";
import { Meteor } from "meteor/meteor";
import type { Task, TimeBlock } from "../api/tasks/types";

export function useTasksViewModel() {
  useTracker(() => Meteor.subscribe("tasks.all"), []);

  const allTasks: Task[] = useTracker(
    () => Tasks.find({}, { sort: { createdAt: -1 } }).fetch(),
    []
  );
  const timeblocks: TimeBlock[] = useTracker(
    () => TimeBlocks.find({}, { sort: { createdAt: 1 } }).fetch(),
    []
  );

  function insertTask(payload: Partial<Task>) {
    return Meteor.call("tasks.insert", payload);
  }

  function updateTask(id: string, updates: Partial<Task>) {
    return Meteor.call("tasks.update", id, updates);
  }

  function removeTask(id: string) {
    return Meteor.call("tasks.remove", id);
  }

  return {
    tasks: allTasks,
    timeblocks,
    insertTask,
    updateTask,
    removeTask,
  };
}
