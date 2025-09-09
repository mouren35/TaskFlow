import { useTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import { TasksCollection, Task } from "../models/task";
import { TimeBlocksCollection, TimeBlock } from "../models/timeblock";
import { format } from "date-fns";
import { useState } from "react";
import { TaskService } from "../lib/services/taskService";

export function useTasksViewModel() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // 订阅数据
  const tasksLoading = useTracker(() => {
    const handle = Meteor.subscribe("tasks");
    return !handle.ready();
  }, []);

  const timeBlocksLoading = useTracker(() => {
    const handle = Meteor.subscribe("timeBlocks.byDate", selectedDate);
    return !handle.ready();
  }, [selectedDate]);

  // 获取任务数据 (delegated to TaskService helper that still uses collection)
  const allTasks: Task[] = useTracker(() => TaskService.fetchAllTasks(), []);

  // 获取当前选中日期的时间块
  const timeBlocks: TimeBlock[] = useTracker(
    () => TaskService.fetchTimeBlocksByDate(selectedDate),
    [selectedDate]
  );

  // 任务操作方法 (delegated to TaskService)
  function insertTask(task: Omit<Task, "_id" | "createdAt">) {
    return TaskService.insertTask(task);
  }

  function updateTask(id: string, updates: Partial<Task>) {
    return TaskService.updateTask(id, updates);
  }

  function removeTask(id: string) {
    return TaskService.removeTask(id);
  }

  function completeTask(id: string, actualTime: number) {
    return TaskService.completeTask(id, actualTime);
  }

  function startTask(id: string) {
    return TaskService.startTask(id);
  }

  function pauseTask(id: string) {
    return TaskService.pauseTask(id);
  }

  // 时间块操作方法
  function insertTimeBlock(
    timeBlock: Omit<TimeBlock, "_id" | "createdAt" | "updatedAt">
  ) {
    return TaskService.insertTimeBlock(timeBlock);
  }

  function updateTimeBlock(id: string, updates: Partial<TimeBlock>) {
    return TaskService.updateTimeBlock(id, updates);
  }

  function removeTimeBlock(id: string) {
    return TaskService.removeTimeBlock(id);
  }

  // 获取指定时间块的任务
  function getTasksByBlockId(blockId: string): Task[] {
    return TaskService.getTasksByBlockId(blockId);
  }

  return {
    // 数据
    tasks: allTasks,
    timeBlocks,
    selectedDate,
    loading: tasksLoading || timeBlocksLoading,

    // 状态控制
    setSelectedDate,

    // 任务操作
    insertTask,
    updateTask,
    removeTask,
    completeTask,
    startTask,
    pauseTask,

    // 时间块操作
    insertTimeBlock,
    updateTimeBlock,
    removeTimeBlock,
    getTasksByBlockId,

    // 辅助方法
    formatDate: (date: Date) => format(date, "yyyy-MM-dd"),
    formatTime: (time: string) => time, // 可以根据需要格式化时间
  };
}
