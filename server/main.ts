import { Meteor } from 'meteor/meteor';
import { TasksCollection } from '/imports/models/task';
import { TimeBlocksCollection } from '/imports/models/timeblock';
import { HabitsCollection } from '/imports/models/habit';
import { UserStatsCollection } from '/imports/models/stats';
import { ThoughtsCollection } from '/imports/api/tasks/thoughts';
import { format } from 'date-fns';

// 初始化示例数据
async function initializeData() {
  // 检查是否已有数据
  if (await TimeBlocksCollection.find().countAsync() === 0) {
    console.log('初始化示例数据...');
    
    // 创建今天的日期
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // 创建几个时间块
    const morningBlockId = await TimeBlocksCollection.insertAsync({
      title: '上午工作',
      date: today,
      startTime: '09:00',
      endTime: '12:00',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    const afternoonBlockId = await TimeBlocksCollection.insertAsync({
      title: '下午工作',
      date: today,
      startTime: '14:00',
      endTime: '18:00',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    const eveningBlockId = await TimeBlocksCollection.insertAsync({
      title: '晚间学习',
      date: today,
      startTime: '19:30',
      endTime: '22:00',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    // 创建一些任务
    await TasksCollection.insertAsync({
      blockId: morningBlockId,
      title: '回复邮件',
      category: 'work',
      estimatedTime: 30,
      status: 'pending',
      createdAt: new Date(),
    });
    
    await TasksCollection.insertAsync({
      blockId: morningBlockId,
      title: '项目会议',
      category: 'work',
      estimatedTime: 60,
      status: 'pending',
      createdAt: new Date(),
    });
    
    await TasksCollection.insertAsync({
      blockId: afternoonBlockId,
      title: '编写代码',
      category: 'work',
      estimatedTime: 120,
      status: 'pending',
      createdAt: new Date(),
    });
    
    await TasksCollection.insertAsync({
      blockId: eveningBlockId,
      title: '阅读技术书籍',
      category: 'mind',
      estimatedTime: 45,
      status: 'pending',
      createdAt: new Date(),
    });
    
    // 创建一个习惯
    const workoutTaskId = await TasksCollection.insertAsync({
      blockId: eveningBlockId,
      title: '锻炼身体',
      category: 'health',
      estimatedTime: 30,
      repeat: {
        type: 'daily',
        rule: null,
        count: 1
      },
      status: 'pending',
      createdAt: new Date(),
    });
    
    await HabitsCollection.insertAsync({
      taskId: workoutTaskId,
      title: '锻炼身体',
      category: 'health',
      estimatedTime: 30,
      repeat: {
        type: 'daily',
        rule: null,
        count: 1
      },
      streak: 0,
      totalCompleted: 0,
      createdAt: new Date(),
    });
    
    // 创建一些思考节点
    const projectThoughtId = await ThoughtsCollection.insertAsync({
      title: '项目规划',
      category: 'work',
      estimatedTime: 0,
      status: 'pending',
      createdAt: new Date(),
      level: 0,
    });
    
    await ThoughtsCollection.insertAsync({
      parentId: projectThoughtId,
      title: '需求分析',
      category: 'work',
      estimatedTime: 60,
      status: 'pending',
      createdAt: new Date(),
      level: 1,
    });
    
    await ThoughtsCollection.insertAsync({
      parentId: projectThoughtId,
      title: '技术选型',
      category: 'work',
      estimatedTime: 45,
      status: 'pending',
      createdAt: new Date(),
      level: 1,
    });
    
    // 初始化用户统计数据
    await UserStatsCollection.insertAsync({
      completedTasks: 0,
      totalTime: 0,
      joinDate: new Date(),
      updatedAt: new Date(),
    });
    
    console.log('示例数据初始化完成');
  }
}

Meteor.startup(async () => {
  // 初始化示例数据
  await initializeData();
  
  console.log(`TaskFlow 服务器启动成功 - ${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}`);
});
