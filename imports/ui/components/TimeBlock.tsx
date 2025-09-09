import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Collapse,
  List,
} from "@mui/material";
import { ExpandMore, ExpandLess, Add } from "@mui/icons-material";
import type { TimeBlock } from "../../models/timeblock";
import type { Task } from "../../models/task";
import TaskCard from "./TaskCard";

interface Props {
  block: TimeBlock;
  tasks: Task[];
  onAddTask: (blockId: string) => void;
  onStartTask: (id: string) => void;
  onCompleteTask: (id: string, minutes: number) => void;
}

const TimeBlockComp: React.FC<Props> = ({
  block,
  tasks,
  onAddTask,
  onStartTask,
  onCompleteTask,
}) => {
  const [open, setOpen] = useState(true);

  const totalEstimated = tasks.reduce((s, t) => s + (t.estimatedTime || 0), 0);

  return (
    <Paper sx={{ p: 1, mb: 1, borderRadius: 1 }} elevation={0}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {block.title} · {totalEstimated} 分钟
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {new Date(block.date).toLocaleDateString()} {block.startTime}
            {block.endTime ? ` - ${block.endTime}` : ""}
          </Typography>
        </Box>
        <Box>
          <IconButton size="small" onClick={() => onAddTask(block._id!)}>
            <Add fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => setOpen((v) => !v)}>
            {open ? (
              <ExpandLess fontSize="small" />
            ) : (
              <ExpandMore fontSize="small" />
            )}
          </IconButton>
        </Box>
      </Box>

      <Collapse in={open} timeout="auto" unmountOnExit>
        <List sx={{ mt: 1 }}>
          {tasks.map((t) => (
            <Box key={t._id} sx={{ mb: 1 }}>
              <TaskCard
                task={t}
                onStart={onStartTask}
                onComplete={onCompleteTask}
              />
            </Box>
          ))}
        </List>
      </Collapse>
    </Paper>
  );
};

export default TimeBlockComp;
