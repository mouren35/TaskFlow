// PendingPage.tsx
// 待办任务页面

import React, { useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Checkbox,
  Chip,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Menu,
  useTheme,
} from "@mui/material";
import { Add, MoreVert, Edit, Delete, AccessTime } from "@mui/icons-material";

interface Task {
  id: string;
  title: string;
  category: string;
  completed: boolean;
  dueDate?: string;
  priority: "low" | "medium" | "high";
  description?: string;
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

const PendingPage: React.FC = () => {
  const theme = useTheme();
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "完成需求文档",
      category: "工作",
      completed: false,
      dueDate: "2024-01-20",
      priority: "high",
      description: "需要完成本周的项目文档，包含功能说明和技术细节",
    },
    {
      id: "2",
      title: "健身训练",
      category: "健康",
      completed: false,
      dueDate: "2024-01-18",
      priority: "medium",
      description: "进行30分钟的有氧运动",
    },
    {
      id: "3",
      title: "阅读技术文章",
      category: "心智",
      completed: false,
      dueDate: "2024-01-19",
      priority: "low",
      description: "阅读关于React Hooks的深度文章",
    },
  ]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("未分类");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [dueDate, setDueDate] = useState("");
  const [description, setDescription] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const pendingTasks = tasks.filter((task) => !task.completed);

  const handleAddTask = () => {
    setEditingTask(null);
    setTitle("");
    setCategory("未分类");
    setPriority("medium");
    setDueDate("");
    setDescription("");
    setOpenDialog(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setTitle(task.title);
    setCategory(task.category);
    setPriority(task.priority);
    setDueDate(task.dueDate || "");
    setDescription(task.description || "");
    setOpenDialog(true);
  };

  const handleSaveTask = () => {
    if (editingTask) {
      setTasks(
        tasks.map((t) =>
          t.id === editingTask.id
            ? { ...t, title, category, priority, dueDate, description }
            : t
        )
      );
    } else {
      const newTask: Task = {
        id: Date.now().toString(),
        title,
        category,
        completed: false,
        priority,
        dueDate,
        description,
      };
      setTasks([...tasks, newTask]);
    }
    setOpenDialog(false);
  };

  const handleToggleComplete = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
    setAnchorEl(null);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, task: Task) => {
    setAnchorEl(event.currentTarget);
    setSelectedTask(task);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTask(null);
  };

  return (
    <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
      {/* 标题栏 */}
      <Box sx={{ p: 2, borderBottom: "1px solid #eee" }}>
        <Typography variant="h5" fontWeight="bold">
          待办任务
        </Typography>
        <Typography variant="body2" color="text.secondary">
          共有 {pendingTasks.length} 个待办任务
        </Typography>
      </Box>

      {/* 任务列表 */}
      <Box sx={{ flex: 1, overflow: "auto" }}>
        <List>
          {pendingTasks.map((task) => (
            <ListItem
              key={task.id}
              sx={{
                cursor: "pointer",
                "&:hover": { backgroundColor: "#f5f5f5" },
              }}
            >
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={task.completed}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleComplete(task.id);
                  }}
                />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 0.5,
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        textDecoration: task.completed
                          ? "line-through"
                          : "none",
                        color: task.completed
                          ? "text.secondary"
                          : "text.primary",
                      }}
                    >
                      {task.title}
                    </Typography>
                    <Chip
                      label={task.category}
                      size="small"
                      sx={{
                        backgroundColor:
                          categoryColors[
                            task.category as keyof typeof categoryColors
                          ],
                        color: "#fff",
                        height: 20,
                        fontSize: "0.75rem",
                      }}
                    />
                    <Chip
                      label={priorityLabels[task.priority]}
                      size="small"
                      sx={{
                        backgroundColor: priorityColors[task.priority],
                        color: "#fff",
                        height: 20,
                        fontSize: "0.75rem",
                      }}
                    />
                  </Box>
                }
                secondary={
                  <Box>
                    {task.description && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 0.5 }}
                      >
                        {task.description}
                      </Typography>
                    )}
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <AccessTime
                        fontSize="small"
                        sx={{ color: "text.secondary" }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        截止：{task.dueDate}
                      </Typography>
                    </Box>
                  </Box>
                }
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMenuOpen(e, task);
                  }}
                >
                  <MoreVert />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>

        {pendingTasks.length === 0 && (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="body1" color="text.secondary">
              太棒了！没有待办任务
            </Typography>
            <Typography variant="body2" color="text.secondary">
              点击右下角按钮添加新任务
            </Typography>
          </Box>
        )}
      </Box>

      {/* 添加按钮 */}
      <Fab
        color="primary"
        aria-label="add"
        onClick={handleAddTask}
        sx={{
          position: "fixed",
          bottom: 80,
          right: 16,
          backgroundColor: "#f44336",
          "&:hover": {
            backgroundColor: "#d32f2f",
          },
        }}
      >
        <Add />
      </Fab>

      {/* 编辑对话框 */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{editingTask ? "编辑任务" : "添加任务"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="任务标题"
            fullWidth
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>分类</InputLabel>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {Object.keys(categoryColors).map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>优先级</InputLabel>
            <Select
              value={priority}
              onChange={(e) =>
                setPriority(e.target.value as "low" | "medium" | "high")
              }
            >
              <MenuItem value="low">低</MenuItem>
              <MenuItem value="medium">中</MenuItem>
              <MenuItem value="high">高</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="截止日期"
            type="date"
            fullWidth
            variant="outlined"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="任务描述"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>取消</Button>
          <Button onClick={handleSaveTask} variant="contained">
            {editingTask ? "更新" : "添加"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* 菜单 */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={() => {
            if (selectedTask) {
              handleEditTask(selectedTask);
            }
            handleMenuClose();
          }}
        >
          <Edit sx={{ mr: 1 }} fontSize="small" />
          编辑
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (selectedTask) {
              handleDeleteTask(selectedTask.id);
            }
            handleMenuClose();
          }}
          sx={{ color: "error.main" }}
        >
          <Delete sx={{ mr: 1 }} fontSize="small" />
          删除
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default PendingPage;
