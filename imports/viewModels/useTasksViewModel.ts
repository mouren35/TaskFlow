import { useTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import { TasksCollection, Task } from "../models/task";
import { TimeBlocksCollection, TimeBlock } from "../models/timeblock";
import { format } from "date-fns";
import { useState } from "react";

export function useTasksViewModel() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  // 订阅数据
  const tasksLoading = useTracker(() => {
    const handle = Meteor.subscribe('tasks');
    return !handle.ready();
  }, []);
  
  const timeBlocksLoading = useTracker(() => {
    const handle = Meteor.subscribe('timeBlocks.byDate', selectedDate);
    return !handle.ready();
  }, [selectedDate]);
  
  // 获取任务数据
  const allTasks: Task[] = useTracker(
    () => TasksCollection.find({}, { sort: { createdAt: -1 } }).fetch(),
    []
  );
  
  // 获取当前选中日期的时间块
  const timeBlocks: TimeBlock[] = useTracker(
    () => {
      const startOfDay = new Date(selectedDate);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(selectedDate);
      endOfDay.setHours(23, 59, 59, 999);
      
      return TimeBlocksCollection.find({
        date: {
          $gte: startOfDay,
          $lte: endOfDay
        }
      }, { sort: { startTime: 1 } }).fetch();
    },
    [selectedDate]
  );

  // 任务操作方法
  function insertTask(task: Omit<Task, '_id' | 'createdAt'>) {
    return Meteor.call('tasks.insert', task);
  }

  function updateTask(id: string, updates: Partial<Task>) {
    return Meteor.call('tasks.update', id, updates);
  }

  function removeTask(id: string) {
    return Meteor.call('tasks.remove', id);
  }
  
  function completeTask(id: string, actualTime: number) {
    return Meteor.call('tasks.complete', id, actualTime);
  }
  
  function startTask(id: string) {
    return Meteor.call('tasks.start', id);
  }
  
  function pauseTask(id: string) {
    return Meteor.call('tasks.pause', id);
  }
  
  // 时间块操作方法
  function insertTimeBlock(timeBlock: Omit<TimeBlock, '_id' | 'createdAt' | 'updatedAt'>) {
    return Meteor.call('timeBlocks.insert', timeBlock);
  }
  
  function updateTimeBlock(id: string, updates: Partial<TimeBlock>) {
    return Meteor.call('timeBlocks.update', id, updates);
  }
  
  function removeTimeBlock(id: string) {
    return Meteor.call('timeBlocks.remove', id);
  }
  
  // 获取指定时间块的任务
  function getTasksByBlockId(blockId: string): Task[] {
    return TasksCollection.find({ blockId }, { sort: { createdAt: 1 } }).fetch();
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
    formatDate: (date: Date) => format(date, 'yyyy-MM-dd'),
    formatTime: (time: string) => time, // 可以根据需要格式化时间
  };
}
