import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Stack,
  Box,
  Typography,
  Tooltip,
  Chip,
  IconButton,
  useTheme,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CheckIcon from "@mui/icons-material/Check";
import InfoIcon from "@mui/icons-material/Info";
import colors from "../theme/colors";
import type { Task } from "../../models/task";

const categoryColors = (theme: any): Record<string, string> => ({
  social: theme.palette.error.main,
  mind: theme.palette.primary.main,
  health: theme.palette.success.main,
  work: theme.palette.secondary.main,
  hobby: theme.palette.warning.main,
  uncategorized: theme.palette.grey[500],
});

type Props = {
  task: Task;
  onStart: (id: string) => void;
  onComplete: (id: string, minutes: number) => void;
  onOpenDetail?: (id: string) => void;
};

const TaskCard = React.forwardRef<HTMLDivElement, Props>(({ task, onStart, onComplete, onOpenDetail }, ref) => {
  const theme = useTheme();
  const handleStart = () => onStart(task._id as string);
  const handleComplete = () => onComplete(task._id as string, task.estimatedTime || 0);
  const openDetail = () => onOpenDetail && onOpenDetail(task._id as string);

  return (
    <Card
      elevation={1}
      ref={ref}
      sx={{
        borderRadius: 3,
        transition: "transform 0.12s",
        borderLeft: `6px solid ${task.category ? (categoryColors as any)[task.category] : colors.textSecondary}`,
        backgroundColor: "background.paper",
      }}
    >
      <CardContent sx={{ py: 1.5, px: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box onClick={openDetail} sx={{ cursor: onOpenDetail ? "pointer" : "default" }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
              {task.title || "未定义"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {task.estimatedTime ?? 0} 分钟
              {task.notes && (
                <Tooltip title={task.notes} arrow placement="bottom-start">
                  <Box component="span" sx={{ ml: 1, cursor: "help", textDecoration: "underline dotted" }}>...</Box>
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
            sx={{
              fontWeight: 600,
              backgroundColor: task.status === "completed" ? theme.palette.error.main : task.status === "inProgress" ? theme.palette.primary.main : "transparent",
              color: task.status === "completed" || task.status === "inProgress" ? theme.palette.common.white : theme.palette.text.primary,
              border: task.status === "pending" ? `1px solid ${theme.palette.divider}` : "none",
            }}
          />
        </Stack>
      </CardContent>
      <CardActions sx={{ justifyContent: "flex-end", px: 1.5, pb: 1.25 }}>
        <Tooltip title="开启" arrow>
          <IconButton size="small" color="primary" onClick={handleStart} aria-label="start-task">
            <PlayArrowIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="完成" arrow>
          <IconButton size="small" color="success" onClick={handleComplete} aria-label="complete-task">
            <CheckIcon />
          </IconButton>
        </Tooltip>
        {onOpenDetail && (
          <Tooltip title="详情" arrow>
            <IconButton size="small" onClick={openDetail} aria-label="open-detail">
              <InfoIcon />
            </IconButton>
          </Tooltip>
        )}
      </CardActions>
    </Card>
  );
});

TaskCard.displayName = "TaskCard";

export default TaskCard;
