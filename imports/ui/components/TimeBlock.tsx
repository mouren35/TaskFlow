import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Collapse,
  Paper,
  Fade,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import TaskItem from "./TaskItem";
import { TimeBlock as TimeBlockType } from "../../models/timeblock";
import { Task } from "../../models/task";

interface TimeBlockProps {
  timeBlock: TimeBlockType;
  tasks: Task[];
  onAddTask: (blockId: string) => void;
  onTaskComplete: (taskId: string, actualTime: number) => void;
  onTaskStart: (taskId: string) => void;
}

const TimeBlock: React.FC<TimeBlockProps> = ({
  timeBlock,
  tasks,
  onAddTask,
  onTaskComplete,
  onTaskStart,
}) => {
  const [expanded, setExpanded] = useState(true);

  // 计算时间块内所有任务的预计总时间
  const totalEstimatedTime = tasks.reduce(
    (total, task) => total + task.estimatedTime,
    0
  );
  const formattedTotalTime = `${Math.floor(totalEstimatedTime / 60)}h ${totalEstimatedTime % 60}m`;

  const handleToggleExpand = () => {
    setExpanded(!expanded);
  };

  const handleAddTask = () => {
    onAddTask(timeBlock._id!);
  };

  return (
    <Fade in={true} timeout={300}>
      <Paper
        elevation={0}
        sx={{
          mb: 2,
          borderRadius: 2,
          overflow: "hidden",
          border: "1px solid #f0f0f0",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
            bgcolor: "#fafafa",
            borderBottom:
              expanded && tasks.length > 0 ? "1px solid #f0f0f0" : "none",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton size="small" onClick={handleToggleExpand}>
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
            <Box sx={{ ml: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                {timeBlock.title}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <AccessTimeIcon
                  sx={{ fontSize: 14, color: "text.secondary" }}
                />
                <Typography variant="caption" color="text.secondary">
                  {timeBlock.startTime} - {timeBlock.endTime || "未设置"}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ fontWeight: "bold", color: "primary.main" }}
                >
                  · {formattedTotalTime}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Tooltip title="添加任务" arrow placement="top">
            <IconButton
              color="primary"
              onClick={handleAddTask}
              sx={{
                transition: "transform 0.2s",
                "&:hover": { transform: "scale(1.1)" },
              }}
            >
              <AddIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <Collapse in={expanded} timeout={300}>
          <Box sx={{ p: tasks.length > 0 ? 1 : 0 }}>
            {tasks.length > 0
              ? tasks.map((task, index) => (
                  <Fade key={task._id} in={true} timeout={(index + 1) * 150}>
                    <Box>
                      <TaskItem
                        task={task}
                        onComplete={() =>
                          onTaskComplete(task._id!, task.estimatedTime)
                        }
                        onStart={() => onTaskStart(task._id!)}
                      />
                    </Box>
                  </Fade>
                ))
              : expanded && (
                  <Box
                    sx={{
                      p: 2,
                      textAlign: "center",
                      borderRadius: 1,
                      bgcolor: "#f9f9f9",
                      m: 1,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      暂无任务，点击右上角添加
                    </Typography>
                  </Box>
                )}
          </Box>
        </Collapse>
      </Paper>
    </Fade>
  );
};

export default TimeBlock;
