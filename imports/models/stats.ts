import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

export interface UserStats {
  _id?: string;
  completedTasks: number;
  totalTime: number;   // 小时
  joinDate: Date;
  updatedAt: Date;
}

export const UserStatsCollection = new Mongo.Collection<UserStats>('userStats');

// 初始化用户统计数据
Meteor.methods({
  'userStats.init'() {
    const now = new Date();
    // 检查是否已存在统计数据
    const existingStats = UserStatsCollection.findOne({});
    if (!existingStats) {
      return UserStatsCollection.insert({
        completedTasks: 0,
        totalTime: 0,
        joinDate: now,
        updatedAt: now,
      });
    }
    return existingStats._id;
  },
  
  'userStats.incrementTaskCount'() {
    const stats = UserStatsCollection.findOne({});
    if (!stats) {
      throw new Meteor.Error('not-found', '用户统计数据不存在');
    }
    
    return UserStatsCollection.update({ _id: stats._id }, {
      $inc: { completedTasks: 1 },
      $set: { updatedAt: new Date() }
    });
  },
  
  'userStats.addTime'(minutes: number) {
    const stats = UserStatsCollection.findOne({});
    if (!stats) {
      throw new Meteor.Error('not-found', '用户统计数据不存在');
    }
    
    // 转换为小时
    const hours = minutes / 60;
    
    return UserStatsCollection.update({ _id: stats._id }, {
      $inc: { totalTime: hours },
      $set: { updatedAt: new Date() }
    });
  },
  
  'userStats.get'() {
    const stats = UserStatsCollection.findOne({});
    if (!stats) {
      throw new Meteor.Error('not-found', '用户统计数据不存在');
    }
    return stats;
  }
});

// 发布用户统计数据
if (Meteor.isServer) {
  Meteor.publish('userStats', function() {
    return UserStatsCollection.find({});
  });
}