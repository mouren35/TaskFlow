import { useTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import { useState } from "react";
import { Thought } from "../api/tasks/thoughts";
import { ThoughtsService } from "../lib/services/thoughtsService";

export function useThoughtsViewModel() {
  const [currentParentId, setCurrentParentId] = useState<string | undefined>(
    undefined
  );

  // 订阅数据
  const loading = useTracker(() => {
    const handle = currentParentId
      ? Meteor.subscribe("thoughts.byParent", currentParentId)
      : Meteor.subscribe("thoughts.root");
    return !handle.ready();
  }, [currentParentId]);

  // 获取当前层级的思考（通过 ThoughtsService 的同步读取，适合在 useTracker 中使用）
  const thoughts = useTracker(
    () => ThoughtsService.fetchByParent(currentParentId),
    [currentParentId]
  );

  // 构建 breadcrumbs（通过 ThoughtsService 的同步读取）
  const breadcrumbs = useTracker(() => {
    const result: Thought[] = [];
    let parentId = currentParentId;

    while (parentId) {
      const parent = ThoughtsService.findById(parentId);
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
  function insertThought(thought: Omit<Thought, "_id" | "createdAt">) {
    return ThoughtsService.insertThought({
      ...thought,
      parentId: currentParentId,
      level: currentParentId ? breadcrumbs.length + 1 : 0,
    });
  }

  function updateThought(id: string, updates: Partial<Thought>) {
    return ThoughtsService.updateThought(id, updates);
  }

  function removeThought(id: string) {
    return ThoughtsService.removeThought(id);
  }

  function completeThought(id: string, actualTime: number) {
    return ThoughtsService.completeThought(id, actualTime);
  }

  function indentThought(id: string) {
    return ThoughtsService.indentThought(id);
  }

  function outdentThought(id: string) {
    return ThoughtsService.outdentThought(id);
  }

  function navigateToParent() {
    if (breadcrumbs.length > 0) {
      const grandParentId =
        breadcrumbs.length > 1
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
