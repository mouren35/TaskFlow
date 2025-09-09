// imports/ui/pages/PlanPage.tsx
// Clean single implementation of PlanPage (fixed corruption)

import React, { useState, useMemo, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useTasksViewModel } from "../../viewmodels/useTasksViewModel";
import { Task } from "../../models/task";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import TimerIcon from "@mui/icons-material/Timer";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import {
  Box,
  Stack,
  Button,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Tooltip,
  Zoom,
  Divider,
  Fab,
} from "@mui/material";

import WeekPicker from "../components/WeekPicker";
import TaskCard from "../components/TaskCard";
import TimeBlockComp from "../components/TimeBlock";
import AddTaskDialog from "../components/AddTaskDialog";
import NewTimeBlockDialog from "../components/NewTimeBlockDialog";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.08),
  "&:hover": { backgroundColor: alpha(theme.palette.common.white, 0.12) },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: { marginLeft: theme.spacing(3), width: "auto" },
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
    [theme.breakpoints.up("md")]: { width: "20ch" },
  },
}));

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
  const [isNewBlockOpen, setIsNewBlockOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [fabAnchorEl, setFabAnchorEl] = useState<null | HTMLElement>(null);
  const [currentTimerTaskId, setCurrentTimerTaskId] = useState<string | null>(
    null
  );
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [addTaskBlockId, setAddTaskBlockId] = useState<string | null>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;
    if (currentTimerTaskId)
      timer = setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [currentTimerTaskId]);

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleOpenAddTaskDialog = (blockId?: string) => {
    if (blockId) setAddTaskBlockId(blockId);
    setIsAddTaskDialogOpen(true);
  };
  const handleCloseAddTaskDialog = () => {
    setIsAddTaskDialogOpen(false);
    setAddTaskBlockId(null);
  };

  const handleSaveTask = async (
    taskData: Omit<Task, "_id" | "createdAt" | "status" | "completedAt">
  ) => {
    try {
      const toInsert = { ...taskData, status: "pending" } as any;
      if (addTaskBlockId) toInsert.blockId = addTaskBlockId;
      await insertTask(toInsert);
      setIsAddTaskDialogOpen(false);
      setAddTaskBlockId(null);
    } catch (err) {
      console.error("save task failed", err);
    }
  };

  const handleCreateTimeBlock = async (data: {
    title: string;
    date: Date;
    startTime: string;
    endTime?: string;
  }) => {
    try {
      await insertTimeBlock({ ...data } as any);
      setIsNewBlockOpen(false);
    } catch (err) {
      console.error("create timeblock failed", err);
    }
  };

  const completedTimeline = useMemo(() => {
    const completed = tasks.filter(
      (t) => (t as any).status === "completed" && (t as any).completedAt
    );
    completed.sort(
      (a, b) =>
        new Date((b as any).completedAt || 0).getTime() -
        new Date((a as any).completedAt || 0).getTime()
    );
    const groups: Record<string, Task[]> = {};
    completed.forEach((t) => {
      const key = new Date((t as any).completedAt).toLocaleDateString();
      groups[key] = groups[key] || [];
      groups[key].push(t);
    });
    return groups;
  }, [tasks]);

  return (
    <Box sx={{ p: 0 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleMenuOpen}
            aria-label="menu"
            sx={{ mr: 1 }}
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
          <Button color="inherit" onClick={() => setIsNewBlockOpen(true)}>
            新建时间块
          </Button>
          <Button color="inherit" onClick={() => history.push("/pending")}>
            待处理
          </Button>
        </Toolbar>
      </AppBar>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={() => {
            setIsNewBlockOpen(true);
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

      <WeekPicker selectedDate={selectedDate} onSelectDate={setSelectedDate} />

      <Stack spacing={2} sx={{ p: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h5">计划</Typography>
          <Tooltip title="添加新任务">
            <Zoom in>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenAddTaskDialog()}
              >
                添加任务
              </Button>
            </Zoom>
          </Tooltip>
        </Box>

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
                      in
                      key={tb._id}
                      style={{ transitionDelay: `${index * 30}ms` }}
                    >
                      <ListItem divider disableGutters sx={{ p: 0.5, mb: 0.5 }}>
                        <TimeBlockComp
                          block={tb}
                          tasks={tasks.filter((t) => t.blockId === tb._id)}
                          onAddTask={(bid?: string) =>
                            handleOpenAddTaskDialog(bid)
                          }
                          onStartTask={(id: string) => {
                            startTask(id);
                            setCurrentTimerTaskId(id);
                            setElapsedSeconds(0);
                          }}
                          onCompleteTask={(id: string, minutes?: number) => {
                            completeTask(id, minutes || 0);
                            if (currentTimerTaskId === id)
                              setCurrentTimerTaskId(null);
                          }}
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
                    in
                    key={t._id}
                    style={{ transitionDelay: `${index * 50}ms` }}
                  >
                    <TaskCard
                      task={t}
                      onStart={(id: string) => {
                        startTask(id);
                        setCurrentTimerTaskId(id);
                        setElapsedSeconds(0);
                      }}
                      onComplete={(id: string, mins?: number) => {
                        completeTask(id, mins || 0);
                        if (currentTimerTaskId === id)
                          setCurrentTimerTaskId(null);
                      }}
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

        {/* FAB / Timer */}
        <Box>
          {currentTimerTaskId ? (
            <>
              <Fab
                color="secondary"
                aria-label="timer"
                sx={{ position: "fixed", bottom: 80, right: 16 }}
                onClick={(e) => setFabAnchorEl(e.currentTarget)}
              >
                <TimerIcon />
              </Fab>
              <Menu
                anchorEl={fabAnchorEl}
                open={Boolean(fabAnchorEl)}
                onClose={() => setFabAnchorEl(null)}
              >
                <MenuItem
                  onClick={() => {
                    setIsAddTaskDialogOpen(true);
                    setFabAnchorEl(null);
                  }}
                >
                  新建任务
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    history.push(`/task/${currentTimerTaskId}`);
                    setFabAnchorEl(null);
                  }}
                >
                  当前任务详情
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Fab
              color="primary"
              aria-label="add"
              sx={{ position: "fixed", bottom: 80, right: 16 }}
              onClick={() => handleOpenAddTaskDialog()}
            >
              <PlayArrowIcon />
            </Fab>
          )}
        </Box>
      </Stack>

      <AddTaskDialog
        open={isAddTaskDialogOpen}
        onClose={handleCloseAddTaskDialog}
        onSave={handleSaveTask}
        title="添加新任务"
      />
      <NewTimeBlockDialog
        open={isNewBlockOpen}
        onClose={() => setIsNewBlockOpen(false)}
        onSave={handleCreateTimeBlock}
        initialDate={selectedDate}
      />
    </Box>
  );
};

export default PlanPage;
