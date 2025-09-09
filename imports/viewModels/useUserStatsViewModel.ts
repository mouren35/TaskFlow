import { useTracker } from "meteor/react-meteor-data";
import { useEffect } from "react";
import { UserStatsService } from "../lib/services/userStatsService";
import { Meteor } from "meteor/meteor";

export function useUserStatsViewModel() {
  // 初始化用户统计数据
  useEffect(() => {
    UserStatsService.init();
  }, []);

  // 订阅数据
  const loading = useTracker(() => {
    const handle = Meteor.subscribe("userStats");
    return !handle.ready();
  }, []);

  // 获取用户统计数据
  const stats = useTracker(() => UserStatsService.fetchStats(), []);

  // 计算使用天数
  const daysJoined = stats
    ? Math.ceil(
        (new Date().getTime() - stats.joinDate.getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 0;

  // 统计操作方法
  function incrementTaskCount() {
    return UserStatsService.incrementTaskCount();
  }

  function addTime(minutes: number) {
    return UserStatsService.addTime(minutes);
  }

  return {
    // 数据
    stats,
    loading,
    daysJoined,
    completedTasks: stats?.completedTasks || 0,
    totalHours: stats?.totalTime || 0,

    // 操作
    incrementTaskCount,
    addTime,
  };
}
