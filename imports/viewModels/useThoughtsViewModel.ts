import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { useState } from 'react';
import { ThoughtsCollection, Thought } from '../api/tasks/thoughts';

export function useThoughtsViewModel() {
  const [currentParentId, setCurrentParentId] = useState<string | undefined>(undefined);
  
  // 订阅数据
  const loading = useTracker(() => {
    const handle = currentParentId
      ? Meteor.subscribe('thoughts.byParent', currentParentId)
      : Meteor.subscribe('thoughts.root');
    return !handle.ready();
  }, [currentParentId]);
  
  // 获取当前层级的思考
  const thoughts = useTracker(() => {
    return ThoughtsCollection.find(
      { parentId: currentParentId },
      { sort: { createdAt: 1 } }
    ).fetch();
  }, [currentParentId]);
  
  // 获取当前思考的路径
  const breadcrumbs = useTracker(() => {
    const result: Thought[] = [];
    let parentId = currentParentId;
    
    while (parentId) {
      const parent = ThoughtsCollection.findOne({ _id: parentId });
      if (parent) {
        result.unshift(parent);
        parentId = parent.parentId;
      } else {
        break;
      }
    }
    
    return result;
  }, [currentParentId]);
  
  // 思考操作方法
  function insertThought(thought: Omit<Thought, '_id' | 'createdAt'>) {
    return Meteor.call('thoughts.insert', {
      ...thought,
      parentId: currentParentId,
      level: currentParentId ? (breadcrumbs.length + 1) : 0
    });
  }
  
  function updateThought(id: string, updates: Partial<Thought>) {
    return Meteor.call('thoughts.update', id, updates);
  }
  
  function removeThought(id: string) {
    return Meteor.call('thoughts.remove', id);
  }
  
  function completeThought(id: string, actualTime: number) {
    return Meteor.call('thoughts.complete', id, actualTime);
  }
  
  function indentThought(id: string) {
    return Meteor.call('thoughts.indent', id);
  }
  
  function outdentThought(id: string) {
    return Meteor.call('thoughts.outdent', id);
  }
  
  function navigateToParent() {
    if (breadcrumbs.length > 0) {
      const grandParentId = breadcrumbs.length > 1 
        ? breadcrumbs[breadcrumbs.length - 2]._id 
        : undefined;
      setCurrentParentId(grandParentId);
    }
  }
  
  function navigateToThought(thoughtId: string) {
    setCurrentParentId(thoughtId);
  }
  
  function navigateToRoot() {
    setCurrentParentId(undefined);
  }
  
  return {
    // 数据
    thoughts,
    breadcrumbs,
    currentParentId,
    loading,
    
    // 导航
    setCurrentParentId,
    navigateToParent,
    navigateToThought,
    navigateToRoot,
    
    // 操作
    insertThought,
    updateThought,
    removeThought,
    completeThought,
    indentThought,
    outdentThought,
  };
}