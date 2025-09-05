import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

export interface TimeBlock {
  _id?: string;
  title: string;
  date: Date;
  startTime: string; // 08:00 格式
  endTime?: string; // 09:30 格式
  repeat?: {
    type: 'daily' | 'weekly' | 'monthly' | 'none';
    rule: any; // 具体重复规则
  };
  createdAt: Date;
  updatedAt: Date;
}

export const TimeBlocksCollection = new Mongo.Collection<TimeBlock>('timeBlocks');

// 创建时间块的方法
Meteor.methods({
  'timeBlocks.insert'(timeBlock: Omit<TimeBlock, '_id' | 'createdAt' | 'updatedAt'>) {
    const now = new Date();
    return TimeBlocksCollection.insert({
      ...timeBlock,
      createdAt: now,
      updatedAt: now,
    });
  },
  
  'timeBlocks.update'(_id: string, updates: Partial<TimeBlock>) {
    return TimeBlocksCollection.update({ _id }, {
      $set: {
        ...updates,
        updatedAt: new Date(),
      }
    });
  },
  
  'timeBlocks.remove'(_id: string) {
    return TimeBlocksCollection.remove({ _id });
  },
  
  // 获取指定日期的时间块
  'timeBlocks.getByDate'(date: Date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    return TimeBlocksCollection.find({
      date: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    }).fetch();
  }
});

// 发布时间块数据
if (Meteor.isServer) {
  Meteor.publish('timeBlocks', function() {
    return TimeBlocksCollection.find({});
  });
  
  Meteor.publish('timeBlocks.byDate', function(date: Date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    return TimeBlocksCollection.find({
      date: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    });
  });
}