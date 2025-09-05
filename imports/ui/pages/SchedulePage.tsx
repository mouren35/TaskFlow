// SchedulePage.tsx
// 安排页面

import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  useTheme,
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
  Add,
  Category,
  People,
  Psychology,
  HealthAndSafety,
  Work,
  Interests,
} from "@mui/icons-material";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay } from "date-fns";
import { zhCN } from "date-fns/locale";

interface Task {
  id: string;
  title: string;
  category: string;
  date: Date;
  completed: boolean;
}

const categoryColors = {
  未分类: "#9e9e9e",
  人际: "#f44336",
  心智: "#2196f3",
  健康: "#4caf50",
  工作: "#9c27b0",
  兴趣: "#ff9800",
};

const SchedulePage: React.FC = () => {
  const theme = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [tasks] = useState<Task[]>([
    {
      id: "1",
      title: "完成需求文档",
      category: "工作",
      date: new Date(2024, 0, 15),
      completed: false,
    },
    {
      id: "2",
      title: "健身训练",
      category: "健康",
      date: new Date(2024, 0, 16),
      completed: true,
    },
    {
      id: "3",
      title: "阅读技术文章",
      category: "心智",
      date: new Date(2024, 0, 17),
      completed: false,
    },
  ]);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = [];
  let day = startDate;
  while (day <= endDate) {
    days.push(day);
    day = addDays(day, 1);
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => isSameDay(task.date, date));
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const TaskChip = ({ task }: { task: Task }) => (
    <Chip
      label={task.title}
      size="small"
      sx={{
        backgroundColor: categoryColors[task.category as keyof typeof categoryColors],
        color: "#fff",
        height: 20,
        fontSize: "0.75rem",
        mb: 0.5,
        opacity: task.completed ? 0.6 : 1,
      }}
    />
  );

  return (
    <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
      {/* 月份导航 */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          background: "#fff",
          borderBottom: "1px solid #eee",
        }}
      >
        <IconButton onClick={handlePrevMonth}>
          <ChevronLeft />
        </IconButton>
        <Typography variant="h6">
          {format(currentDate, "yyyy年M月", { locale: zhCN })}
        </Typography>
        <IconButton onClick={handleNextMonth}>
          <ChevronRight />
        </IconButton>
      </Box>

      {/* 星期标题 */}
      <Grid container sx={{ background: "#f5f5f5", p: 1 }}>
        {["一", "二", "三", "四", "五", "六", "日"].map((day) => (
          <Grid item xs key={day}>
            <Typography align="center" variant="body2" color="text.secondary">
              {day}
            </Typography>
          </Grid>
        ))}
      </Grid>

      {/* 日历网格 */}
      <Grid container spacing={0} sx={{ flex: 1 }}>
        {days.map((day) => {
          const dayTasks = getTasksForDate(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isToday = isSameDay(day, new Date());
          const isSelected = selectedDate && isSameDay(day, selectedDate);

          return (
            <Grid
              item
              xs={12 / 7}
              key={day.toISOString()}
              sx={{
                borderRight: "1px solid #eee",
                borderBottom: "1px solid #eee",
                minHeight: 80,
                background: isSelected ? "#e3f2fd" : "#fff",
                cursor: "pointer",
                "&:hover": {
                  background: "#f5f5f5",
                },
              }}
              onClick={() => handleDateClick(day)}
            >
              <Box sx={{ p: 1, height: "100%" }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: isToday ? "bold" : "normal",
                    color: !isCurrentMonth ? "#ccc" : "inherit",
                    mb: 0.5,
                  }}
                >
                  {format(day, "d")}
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  {dayTasks.slice(0, 2).map((task) => (
                    <TaskChip key={task.id} task={task} />
                  ))}
                  {dayTasks.length > 2 && (
                    <Typography variant="caption" color="text.secondary">
                      +{dayTasks.length - 2}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Grid>
          );
        })}
      </Grid>

      {/* 日期详情对话框 */}
      <Dialog
        open={!!selectedDate}
        onClose={() => setSelectedDate(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          {selectedDate && format(selectedDate, "yyyy年M月d日", { locale: zhCN })}
        </DialogTitle>
        <DialogContent>
          {selectedDate && (
            <Box>
              {getTasksForDate(selectedDate).length > 0 ? (
                getTasksForDate(selectedDate).map((task) => (
                  <Card
                    key={task.id}
                    sx={{
                      mb: 1,
                      boxShadow: "none",
                      border: "1px solid #eee",
                      opacity: task.completed ? 0.6 : 1,
                    }}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            background: categoryColors[task.category as keyof typeof categoryColors],
                            mr: 2,
                          }}
                        />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body1">{task.title}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {task.category}
                          </Typography>
                        </Box>
                        {task.completed && <CheckCircle sx={{ color: "#4caf50" }} />}
                      </Box>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary" align="center">
                  今天没有安排任务
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedDate(null)}>关闭</Button>
          <Button variant="contained" startIcon={<Add />}>
            添加任务
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SchedulePage;
