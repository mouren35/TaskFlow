// PlanPage.tsx
// 计划页面（首页）

import React, { useState, useMemo } from "react";
import { useTasksViewModel } from "../../viewModels/useTasksViewModel";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import {
  Box,
  Stack,
  Button,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip,
  Tooltip,
  Zoom,
  Divider,
} from "@mui/material";
import AddTaskDialog from "../components/AddTaskDialog";
import NewTimeBlockDialog from "../components/NewTimeBlockDialog";
import { Task } from "../../models/task";
import { useHistory } from "react-router-dom";
import { useSwipeable } from "react-swipeable";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

// 分类颜色映射
const categoryColors: Record<string, string> = {
  social: "#f44336",
  mind: "#2196f3",
  health: "#4caf50",
  work: "#9c27b0",
  hobby: "#ff9800",
  uncategorized: "#9e9e9e",
};

// 单个任务卡片（将 useSwipeable 放在子组件中，保证 Hooks 顺序稳定）
const TaskCard: React.FC<{
  task: Task;
  onStart: (id: string) => void;
  onComplete: (id: string, minutes: number) => void;
}> = ({ task, onStart, onComplete }) => {
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => onStart(task._id as string),
    onSwipedRight: () =>
      onComplete(task._id as string, task.estimatedTime || 0),
    delta: 30,
    preventScrollOnSwipe: true,
    trackTouch: true,
  });

  return (
    <Paper
      {...swipeHandlers}
      elevation={1}
      sx={{
        p: 2,
        borderRadius: 2,
        transition: "all 0.2s",
        borderLeft: `4px solid ${task.category ? categoryColors[task.category] : "#9e9e9e"}`,
        "&:active": { transform: "scale(0.99)" },
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
            {task.title || "未定义"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {task.estimatedTime} 分钟
            {task.notes && (
              <Tooltip title={task.notes} arrow placement="bottom-start">
                <Box
                  component="span"
                  sx={{
                    ml: 1,
                    cursor: "help",
                    textDecoration: "underline dotted",
                  }}
                >
                  ...
                </Box>
              </Tooltip>
            )}
          </Typography>
        </Box>
        <Chip
          label={
            task.status === "completed"
              ? "已完成"
              : task.status === "inProgress"
                ? "进行中"
                : "未完成"
          }
          size="small"
          sx={{ fontWeight: 500 }}
        />
      </Stack>
    </Paper>
  );
};

const PlanPage: React.FC = () => {
  const history = useHistory();
  const {
    tasks,
    timeBlocks,
    insertTask,
    insertTimeBlock,
    selectedDate,
    setSelectedDate,
    startTask,
    completeTask,
  } = useTasksViewModel();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);
  const [newBlockOpen, setNewBlockOpen] = useState(false);

  // menu state for AppBar
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const isMenuOpen = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOpenAddTaskDialog = () => {
    setIsAddTaskDialogOpen(true);
  };

  const handleCloseAddTaskDialog = () => {
    setIsAddTaskDialogOpen(false);
  };

  const handleSaveTask = async (
    taskData: Omit<Task, "_id" | "createdAt" | "status" | "completedAt">
  ) => {
    try {
      await insertTask({
        title: taskData.title,
        category: taskData.category,
        estimatedTime: taskData.estimatedTime,
        notes: taskData.notes,
        status: "pending",
        blockId: taskData.blockId,
      });
    } catch (e) {
      console.error("添加任务失败:", e);
    }
  };

  // 周条（当周7天）
  const startOfWeek = (() => {
    const d = new Date(selectedDate);
    const day = d.getDay() || 7;
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - (day - 1));
    return d;
  })();

  const daysOfWeek = Array.from({ length: 7 }).map((_, idx) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + idx);
    return d;
  });

  const handleCreateTimeBlock = async (data: {
    title: string;
    date: Date;
    startTime: string;
    endTime?: string;
  }) => {
    try {
      await insertTimeBlock({
        title: data.title,
        date: data.date,
        startTime: data.startTime,
        endTime: data.endTime,
      } as any);
      setNewBlockOpen(false);
    } catch (e) {
      console.error("创建时间块失败", e);
    }
  };

  // 计算已完成任务时间轴数据
  const completedTimeline = useMemo(() => {
    const completed = tasks.filter(
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
      groups[key] = groups[key] || [];
      groups[key].push(t);
    });
    return groups;
  }, [tasks]);

  return (
    <Box sx={{ p: 0 }}>
      {/* AppBar */}
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 1 }}
              onClick={handleMenuOpen}
            >
              <MenuIcon />
            </IconButton>

            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="搜索任务…"
                inputProps={{ "aria-label": "search" }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Search>

            <Box sx={{ flexGrow: 1 }} />

            <Button color="inherit" onClick={() => setNewBlockOpen(true)}>
              新建时间块
            </Button>
            <Button color="inherit" onClick={() => history.push("/pending")}>
              待处理
            </Button>
          </Toolbar>
        </AppBar>

        {/* 菜单 */}
        <Menu
          anchorEl={anchorEl}
          open={isMenuOpen}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: "top", horizontal: "left" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
        >
          <MenuItem
            onClick={() => {
              setNewBlockOpen(true);
              handleMenuClose();
            }}
          >
            新建时间块
          </MenuItem>
          <MenuItem
            onClick={() => {
              history.push("/pending");
              handleMenuClose();
            }}
          >
            待处理事项
          </MenuItem>
        </Menu>
      </Box>

      {/* 周条日期选择器 */}
      <Box
        sx={{
          display: "flex",
          gap: 1,
          px: 2,
          py: 1,
          alignItems: "center",
          overflowX: "auto",
        }}
      >
        {daysOfWeek.map((d) => {
          const isToday = new Date().toDateString() === d.toDateString();
          const isSelected = selectedDate.toDateString() === d.toDateString();
          return (
            <Button
              key={d.toISOString()}
              variant={isSelected ? "contained" : "text"}
              color={isToday ? "secondary" : "primary"}
              onClick={() => setSelectedDate(new Date(d))}
              sx={{ minWidth: 64, borderRadius: 2 }}
            >
              {`${d.getMonth() + 1}/${d.getDate()}`}
            </Button>
          );
        })}
      </Box>

      <Stack spacing={2} sx={{ p: 2 }}>
        <Typography variant="h5">计划</Typography>

        {/* 添加任务按钮 */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <Tooltip title="添加新任务" arrow>
            <Zoom in={true}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleOpenAddTaskDialog}
                sx={{
                  borderRadius: 8,
                  px: 3,
                  boxShadow: 2,
                  "&:hover": { transform: "scale(1.05)", boxShadow: 4 },
                  transition: "all 0.2s",
                }}
              >
                添加任务
              </Button>
            </Zoom>
          </Tooltip>
        </Box>

        {/* 添加任务对话框 */}
        <AddTaskDialog
          open={isAddTaskDialogOpen}
          onClose={handleCloseAddTaskDialog}
          onSave={handleSaveTask}
          title="添加新任务"
        />

        {/* 创建时间块对话框 */}
        <NewTimeBlockDialog
          open={newBlockOpen}
          onClose={() => setNewBlockOpen(false)}
          onSave={handleCreateTimeBlock}
          initialDate={selectedDate}
        />

        {/* 左列：时间块；右列：任务 */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
            px: 2,
          }}
        >
          <Box sx={{ flex: "0 0 auto", width: { xs: "100%", md: "30%" } }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              时间块
            </Typography>
            <Paper
              elevation={2}
              sx={{ p: 1, borderRadius: 2, overflow: "hidden" }}
            >
              <List sx={{ p: 0 }}>
                {timeBlocks.length > 0 ? (
                  timeBlocks.map((tb, index) => (
                    <Zoom
                      in={true}
                      style={{ transitionDelay: `${index * 30}ms` }}
                      key={tb._id}
                    >
                      <ListItem
                        divider
                        disableGutters
                        sx={{
                          p: 1.5,
                          borderRadius: 1,
                          mb: 0.5,
                          transition: "all 0.2s",
                        }}
                      >
                        <ListItemText
                          primary={
                            <Typography
                              variant="subtitle2"
                              sx={{ fontWeight: 500 }}
                            >
                              {tb.title}
                            </Typography>
                          }
                          secondary={
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {new Date(tb.date).toLocaleDateString()}{" "}
                              {tb.startTime}-{tb.endTime}
                            </Typography>
                          }
                        />
                      </ListItem>
                    </Zoom>
                  ))
                ) : (
                  <Box sx={{ p: 2, textAlign: "center" }}>
                    <Typography color="text.secondary" variant="body2">
                      暂无时间块
                    </Typography>
                  </Box>
                )}
              </List>
            </Paper>
          </Box>

          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              任务（左滑开始，右滑完成）
            </Typography>

            <Box
              sx={{
                display: "grid",
                gap: 2,
                gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
              }}
            >
              {tasks.length > 0 ? (
                tasks.map((t, index) => (
                  <Zoom
                    in={true}
                    style={{ transitionDelay: `${index * 50}ms` }}
                    key={t._id}
                  >
                    <TaskCard
                      task={t}
                      onStart={startTask}
                      onComplete={completeTask}
                    />
                  </Zoom>
                ))
              ) : (
                <Box sx={{ p: 4, textAlign: "center", gridColumn: "1 / -1" }}>
                  <Typography color="text.secondary">
                    暂无任务，点击"添加任务"按钮创建新任务
                  </Typography>
                </Box>
              )}
            </Box>

            {/* 完成时间轴（真实数据） */}
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
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: 500 }}
                              >
                                {item.title || "未定义"}
                              </Typography>
                            }
                            secondary={
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                用时 {item.actualTime ?? item.estimatedTime}{" "}
                                分钟
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
        </Box>
      </Stack>
    </Box>
  );
};

export default PlanPage;
