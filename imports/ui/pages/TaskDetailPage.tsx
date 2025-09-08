// TaskDetailPage.tsx
// 任务详情页面

import React, { useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Chip,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  Checkbox,
} from "@mui/material";
import {
  ArrowBack,
  Edit,
  Delete,
  CheckCircle,
  AccessTime,
  Category,
  PriorityHigh,
  Description,
} from "@mui/icons-material";
import { useParams, useHistory } from "react-router-dom";

interface Task {
  id: string;
  title: string;
  category: string;
  completed: boolean;
  dueDate?: string;
  priority: "low" | "medium" | "high";
  description?: string;
  subtasks: Subtask[];
}

interface Subtask {
  id: string;
  title: string;
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

const priorityColors = {
  low: "#4caf50",
  medium: "#ff9800",
  high: "#f44336",
};

const priorityLabels = {
  low: "低",
  medium: "中",
  high: "高",
};

const TaskDetailPage: React.FC = () => {
  const theme = useTheme();
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  
  const [task, setTask] = useState<Task>({
    id: id || "1",
    title: "完成需求文档",
    category: "工作",
    completed: false,
    dueDate: "2024-01-20",
    priority: "high" as const,
    description: "需要完成本周的项目文档，包含功能说明和技术细节。重点关注用户体验设计和功能流程图。",
    subtasks: [
      { id: "1", title: "收集用户反馈", completed: true },
      { id: "2", title: "整理功能需求", completed: true },
      { id: "3", title: "绘制流程图", completed: false },
      { id: "4", title: "撰写技术方案", completed: false },
    ],
  });

  const [editingSubtask, setEditingSubtask] = useState<string | null>(null);
  const [subtaskText, setSubtaskText] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");

  const handleToggleSubtask = (subtaskId: string) => {
    setTask({
      ...task,
      subtasks: task.subtasks.map(subtask =>
        subtask.id === subtaskId ? { ...subtask, completed: !subtask.completed } : subtask
      ),
    });
  };

  const handleAddSubtask = () => {
    if (newSubtaskTitle.trim()) {
      const newSubtask: Subtask = {
        id: Date.now().toString(),
        title: newSubtaskTitle,
        completed: false,
      };
      setTask({
        ...task,
        subtasks: [...task.subtasks, newSubtask],
      });
      setNewSubtaskTitle("");
      setOpenDialog(false);
    }
  };

  const handleDeleteSubtask = (subtaskId: string) => {
    setTask({
      ...task,
      subtasks: task.subtasks.filter(subtask => subtask.id !== subtaskId),
    });
  };

  const handleEditSubtask = (subtaskId: string) => {
    const subtask = task.subtasks.find(s => s.id === subtaskId);
    if (subtask) {
      setEditingSubtask(subtaskId);
      setSubtaskText(subtask.title);
    }
  };

  const handleSaveSubtask = (subtaskId: string) => {
    if (subtaskText.trim()) {
      setTask({
        ...task,
        subtasks: task.subtasks.map(subtask =>
          subtask.id === subtaskId ? { ...subtask, title: subtaskText } : subtask
        ),
      });
    }
    setEditingSubtask(null);
    setSubtaskText("");
  };

  const handleToggleTask = () => {
    setTask({ ...task, completed: !task.completed });
  };

  const handleDeleteTask = () => {
    history.push("/");
  };

  const completionRate = task.subtasks.length > 0 
    ? Math.round((task.subtasks.filter(s => s.completed).length / task.subtasks.length) * 100)
    : 0;

  return (
    <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
      {/* 顶部导航栏 */}
      <Box
        sx={{
          p: 2,
          background: "#fff",
          borderBottom: "1px solid #eee",
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
  <IconButton onClick={() => history.push("/")}> 
          <ArrowBack />
        </IconButton>
        <Typography variant="h6" sx={{ flex: 1 }}>
          任务详情
        </Typography>
        <IconButton onClick={handleDeleteTask} color="error">
          <Delete />
        </IconButton>
      </Box>

      {/* 任务详情内容 */}
      <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
        {/* 任务基本信息 */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Typography variant="h4" component="h1" sx={{ flex: 1 }}>
              {task.title}
            </Typography>
            <Button
              variant={task.completed ? "outlined" : "contained"}
              color={task.completed ? "success" : "primary"}
              startIcon={<CheckCircle />}
              onClick={handleToggleTask}
            >
              {task.completed ? "已完成" : "标记完成"}
            </Button>
          </Box>

          <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
            <Chip
              icon={<Category />}
              label={task.category}
              sx={{
                backgroundColor: categoryColors[task.category as keyof typeof categoryColors],
                color: "#fff",
              }}
            />
            <Chip
              icon={<PriorityHigh />}
              label={`优先级：${priorityLabels[task.priority]}`}
              sx={{
                backgroundColor: priorityColors[task.priority],
                color: "#fff",
              }}
            />
            {task.dueDate && (
              <Chip
                icon={<AccessTime />}
                label={`截止：${task.dueDate}`}
                variant="outlined"
              />
            )}
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
              <Description fontSize="small" />
              任务描述
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {task.description}
            </Typography>
          </Box>
        </Box>

        {/* 子任务列表 */}
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>
            子任务 ({task.subtasks.filter(s => s.completed).length}/{task.subtasks.length})
          </Typography>
          
          {task.subtasks.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                完成进度：{completionRate}%
              </Typography>
              <Box
                sx={{
                  width: "100%",
                  height: 4,
                  backgroundColor: "#e0e0e0",
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    width: `${completionRate}%`,
                    height: "100%",
                    backgroundColor: "#4caf50",
                    transition: "width 0.3s ease",
                  }}
                />
              </Box>
            </Box>
          )}

          <List>
            {task.subtasks.map((subtask) => (
              <ListItem
                key={subtask.id}
                sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#f5f5f5' } }}
              >
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={subtask.completed}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleSubtask(subtask.id);
                    }}
                  />
                </ListItemIcon>
                {editingSubtask === subtask.id ? (
                  <TextField
                    value={subtaskText}
                    onChange={(e) => setSubtaskText(e.target.value)}
                    onBlur={() => handleSaveSubtask(subtask.id)}
                    onKeyPress={(e) => e.key === "Enter" && handleSaveSubtask(subtask.id)}
                    size="small"
                    autoFocus
                    fullWidth
                  />
                ) : (
                  <ListItemText
                    primary={subtask.title}
                    sx={{
                      textDecoration: subtask.completed ? "line-through" : "none",
                      color: subtask.completed ? "text.secondary" : "text.primary",
                    }}
                    onClick={() => handleEditSubtask(subtask.id)}
                  />
                )}
                <IconButton
                  edge="end"
                  onClick={() => handleDeleteSubtask(subtask.id)}
                  size="small"
                >
                  <Delete fontSize="small" />
                </IconButton>
              </ListItem>
            ))}
          </List>

          <Button
            variant="outlined"
            onClick={() => setOpenDialog(true)}
            sx={{ mt: 2 }}
          >
            添加子任务
          </Button>
        </Box>
      </Box>

      {/* 添加子任务对话框 */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>添加子任务</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="子任务标题"
            fullWidth
            variant="outlined"
            value={newSubtaskTitle}
            onChange={(e) => setNewSubtaskTitle(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAddSubtask()}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>取消</Button>
          <Button onClick={handleAddSubtask} variant="contained">
            添加
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TaskDetailPage;
