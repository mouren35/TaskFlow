// SchedulePage.tsx
// 安排页面（使用现成的 react-calendar 组件，并接入真实数据）

import React, { useMemo, useState } from "react";
import {
  Box,
  Typography,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useTasksViewModel } from "../../viewmodels/useTasksViewModel";
import type { Task } from "../../models/task";
import type { TimeBlock } from "../../models/timeblock";

const categoryColors: Record<string, string> = {
  未分类: "#9e9e9e",
  人际: "#f44336",
  心智: "#2196f3",
  健康: "#4caf50",
  工作: "#9c27b0",
  兴趣: "#ff9800",
};

const SchedulePage: React.FC = () => {
  const { tasks, timeBlocks } = useTasksViewModel();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // blockId -> date 映射
  const blockDateMap = useMemo<Record<string, Date>>(() => {
    const map: Record<string, Date> = {};
    (timeBlocks as TimeBlock[]).forEach((b) => {
      if (b._id) map[b._id] = new Date(b.date);
    });
    return map;
  }, [timeBlocks]);

  // 计算任务的安排日期（优先 dueDate，其次时间块日期）
  const taskDateGetter = (t: Task): Date | null => {
    if (t.dueDate) return new Date(t.dueDate);
    if (t.blockId && blockDateMap[t.blockId])
      return new Date(blockDateMap[t.blockId]);
    return null;
  };

  const tasksByDate = useMemo(() => {
    const map: Record<string, Task[]> = {};
    (tasks as Task[]).forEach((t) => {
      const d = taskDateGetter(t);
      if (!d) return;
      d.setHours(0, 0, 0, 0);
      const key = d.toISOString();
      if (!map[key]) map[key] = [];
      map[key].push(t);
    });
    return map;
  }, [tasks, blockDateMap]);

  const getTasksForDate = (date: Date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return tasksByDate[d.toISOString()] || [];
  };

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view !== "month") return null;
    const dayTasks = getTasksForDate(date);
    if (dayTasks.length === 0) return null;
    return (
      <Box sx={{ mt: 0.5, display: "flex", flexDirection: "column", gap: 0.5 }}>
        {dayTasks.slice(0, 2).map((task) => (
          <Chip
            key={task._id}
            label={task.title || "未定义"}
            size="small"
            sx={{
              backgroundColor:
                categoryColors[(task.category as any) || "未分类"] || "#9e9e9e",
              color: "#fff",
              height: 18,
              fontSize: "0.7rem",
            }}
          />
        ))}
        {dayTasks.length > 2 && (
          <Typography variant="caption" color="text.secondary">
            +{dayTasks.length - 2}
          </Typography>
        )}
      </Box>
    );
  };

  // 已完成时间轴：按 completedAt 分组
  const completedTimeline = useMemo(() => {
    const completed = (tasks as Task[]).filter(
      (t) => t.status === "completed" && t.completedAt
    );
    completed.sort(
      (a, b) =>
        new Date(b.completedAt as any).getTime() -
        new Date(a.completedAt as any).getTime()
    );
    const groups: Record<string, Task[]> = {};
    completed.forEach((t) => {
      const key = new Date(t.completedAt as any).toLocaleDateString();
      if (!groups[key]) groups[key] = [];
      groups[key].push(t);
    });
    return groups;
  }, [tasks]);

  return (
    <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <Box sx={{ p: 2, borderBottom: "1px solid #eee" }}>
        <Typography variant="h6">安排</Typography>
      </Box>
      <Box sx={{ p: 2, flex: 1, overflow: "auto" }}>
        <Calendar
          onClickDay={(value) => setSelectedDate(value as Date)}
          tileContent={tileContent as any}
          calendarType="US"
          locale="zh-CN"
        />

        {/* 已完成时间轴 */}
        <Box sx={{ mt: 3 }}>
          <Divider sx={{ mb: 1 }} />
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            已完成
          </Typography>
          {Object.keys(completedTimeline).length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              暂无已完成任务
            </Typography>
          ) : (
            Object.entries(completedTimeline).map(([date, items]) => (
              <Box key={date} sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  {date}
                </Typography>
                <List dense>
                  {items.map((item) => (
                    <ListItem key={item._id} sx={{ py: 0.5 }}>
                      <ListItemText
                        primary={
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {item.title || "未定义"}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="caption" color="text.secondary">
                            用时 {item.actualTime ?? item.estimatedTime} 分钟
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            ))
          )}
        </Box>
      </Box>

      <Dialog
        open={!!selectedDate}
        onClose={() => setSelectedDate(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>{selectedDate?.toLocaleDateString("zh-CN")}</DialogTitle>
        <DialogContent>
          {selectedDate && (
            <Box>
              {getTasksForDate(selectedDate).length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  今天没有安排任务
                </Typography>
              ) : (
                getTasksForDate(selectedDate).map((t) => (
                  <Box key={t._id} sx={{ py: 1 }}>
                    <Typography variant="body1">
                      {t.title || "未定义"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {t.category}
                    </Typography>
                  </Box>
                ))
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedDate(null)}>关闭</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SchedulePage;
