import React from "react";
import { useSwipeable } from "react-swipeable";
import { Paper, Stack, Box, Typography, Tooltip, Chip } from "@mui/material";
import colors from "../theme/colors";
import type { Task } from "../../models/task";

const categoryColors: Record<string, string> = {
  social: colors.cherryRed,
  mind: colors.trueBlue,
  health: colors.dillGreen,
  work: colors.midnightBlue,
  hobby: colors.butterYellow,
  uncategorized: colors.textSecondary,
};

type Props = {
  task: Task;
  onStart: (id: string) => void;
  onComplete: (id: string, minutes: number) => void;
  onOpenDetail?: (id: string) => void;
};

const TaskCard = React.forwardRef<HTMLDivElement, Props>(
  ({ task, onStart, onComplete }, ref) => {
    const swipeHandlers = useSwipeable({
      onSwipedLeft: () => onStart(task._id as string),
      onSwipedRight: () =>
        onComplete(task._id as string, task.estimatedTime || 0),
      delta: 30,
      preventScrollOnSwipe: true,
      trackTouch: true,
    });

    const setRefs = (node: HTMLDivElement | null) => {
      // @ts-ignore
      if (swipeHandlers && typeof swipeHandlers.ref === "function")
        swipeHandlers.ref(node);
      if (!ref) return;
      if (typeof ref === "function") (ref as any)(node);
      else
        (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
    };

    return (
      <Paper
        {...swipeHandlers}
        elevation={1}
        sx={{
            p: 2,
            borderRadius: 3,
            transition: "all 0.12s",
            borderLeft: `6px solid ${task.category ? (categoryColors as any)[task.category] : colors.textSecondary}`,
            backgroundColor: colors.alpineOat,
            boxShadow: "0 6px 18px rgba(17,45,78,0.04)",
          }}
        ref={setRefs}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
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
            sx={{
              fontWeight: 600,
              backgroundColor:
                task.status === "completed"
                  ? colors.cherryRed
                  : task.status === "inProgress"
                    ? colors.trueBlue
                    : "transparent",
              color: task.status === "completed" || task.status === "inProgress" ? "#fff" : colors.midnightBlue,
              border: task.status === "pending" ? `1px solid ${colors.borderLight}` : "none",
            }}
          />
        </Stack>
      </Paper>
    );
  }
);
TaskCard.displayName = "TaskCard";

export default TaskCard;
