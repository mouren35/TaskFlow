import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Chip,
  LinearProgress,
  Tooltip,
  Zoom,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import { Task as TaskType } from "../../models/task";

interface TaskItemProps {
  task: TaskType;
  onComplete: () => void;
  onStart: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onComplete, onStart }) => {
  const [isHovered, setIsHovered] = useState(false);
  // 计算任务进度百分比
  const progress =
    task.status === "completed"
      ? 100
      : (task.actualTime ?? 0) > 0
        ? Math.min(
            Math.round(((task.actualTime ?? 0) / task.estimatedTime) * 100),
            99
          )
        : 0;

  // 格式化预计时间
  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}分钟`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}小时${mins}分钟` : `${hours}小时`;
  };

  // 根据任务状态返回不同的操作按钮
  const renderActionButton = () => {
    if (task.status === "completed") {
      return null; // 已完成任务不显示操作按钮
    } else if (task.status === "inProgress") {
      return (
        <Tooltip title="完成任务" arrow placement="top">
          <IconButton
            size="small"
            color="primary"
            onClick={onComplete}
            sx={{
              transition: "transform 0.2s",
              "&:hover": { transform: "scale(1.1)" },
            }}
          >
            <CheckCircleOutlineIcon />
          </IconButton>
        </Tooltip>
      );
    } else {
      return (
        <Tooltip title="开始任务" arrow placement="top">
          <IconButton
            size="small"
            color="primary"
            onClick={onStart}
            sx={{
              transition: "transform 0.2s",
              "&:hover": { transform: "scale(1.1)" },
            }}
          >
            <PlayArrowIcon />
          </IconButton>
        </Tooltip>
      );
    }
  };

  // 根据任务状态返回状态标签
  const renderStatusChip = () => {
    if (task.status === "completed") {
      return (
        <Zoom in={true}>
          <Chip
            size="small"
            label="已完成"
            color="success"
            variant="outlined"
            sx={{ fontWeight: 500 }}
          />
        </Zoom>
      );
    } else if (task.status === "inProgress") {
      return (
        <Zoom in={true}>
          <Chip
            size="small"
            label="进行中"
            color="primary"
            variant="outlined"
            icon={<PauseIcon />}
            sx={{ fontWeight: 500 }}
          />
        </Zoom>
      );
    }
    return null;
  };

  return (
    <Box
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        p: 1.5,
        borderRadius: 1,
        mb: 1,
        "&:last-child": { mb: 0 },
        bgcolor: task.status === "completed" ? "#f9f9f9" : "#fff",
        border: "1px solid #f0f0f0",
        transition: "all 0.2s ease",
        transform: isHovered ? "translateY(-2px)" : "none",
        boxShadow: isHovered ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 1,
        }}
      >
        <Typography
          variant="body1"
          sx={{
            fontWeight: 500,
            textDecoration:
              task.status === "completed" ? "line-through" : "none",
            color:
              task.status === "completed" ? "text.secondary" : "text.primary",
            flex: 1,
            mr: 1,
          }}
        >
          {task.title}
        </Typography>
        {renderActionButton()}
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <AccessTimeFilledIcon
              sx={{ fontSize: 14, color: "text.secondary" }}
            />
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontWeight: 500 }}
            >
              {formatTime(task.estimatedTime)}
            </Typography>
          </Box>
          {renderStatusChip()}
        </Box>

        <Typography
          variant="caption"
          sx={{
            fontWeight: "bold",
            color:
              task.status === "completed" ? "success.main" : "primary.main",
          }}
        >
          {progress}%
        </Typography>
      </Box>

      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          mt: 1,
          height: 4,
          borderRadius: 2,
          bgcolor: "#f0f0f0",
          "& .MuiLinearProgress-bar": {
            bgcolor:
              task.status === "completed" ? "success.main" : "primary.main",
            transition: "transform 1s ease-in-out",
          },
        }}
      />
    </Box>
  );
};

export default TaskItem;
