import React, { useState, useEffect } from "react";
import {
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
  Box,
  Typography,
  Slide,
  IconButton,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { Task } from "../../models/task";
import { CalendarToday } from "@mui/icons-material";
import DatePicker from "./DatePicker";

// 滑动动画效果
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// 分类颜色映射
const categoryColors = {
  social: "#f44336", // 人际关系 - 红色
  mind: "#2196f3", // 心智 - 蓝色
  health: "#4caf50", // 健康 - 绿色
  work: "#9c27b0", // 工作 - 紫色
  hobby: "#ff9800", // 兴趣爱好 - 橙色
  uncategorized: "#9e9e9e", // 未分类 - 灰色
};

// 分类标签映射
const categoryLabels = {
  social: "人际",
  mind: "心智",
  health: "健康",
  work: "工作",
  hobby: "兴趣",
  uncategorized: "未分类",
};

interface AddTaskDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (
    task: Omit<Task, "_id" | "createdAt" | "status" | "completedAt">
  ) => void;
  blockId?: string;
  initialTask?: Partial<Task>;
  title?: string;
}

const AddTaskDialog: React.FC<AddTaskDialogProps> = ({
  open,
  onClose,
  onSave,
  blockId,
  initialTask,
  title = "添加任务",
}) => {
  // 表单状态
  const [taskTitle, setTaskTitle] = useState("");
  const [category, setCategory] = useState<Task["category"]>("uncategorized");
  const [estimatedTime, setEstimatedTime] = useState(25); // 默认25分钟
  const [notes, setNotes] = useState("");
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  // PRD: repeat and habit fields
  const [repeatType, setRepeatType] = useState<"none" | "daily" | "weekly" | "monthly">("none");
  const [repeatRule, setRepeatRule] = useState<string>("");
  const [timesPerDay, setTimesPerDay] = useState<number>(1);
  const [applyToFuture, setApplyToFuture] = useState<boolean>(false);

  // 当对话框打开或初始任务变化时，重置表单
  useEffect(() => {
    if (open) {
      if (initialTask) {
        setTaskTitle(initialTask.title || "");
        setCategory(initialTask.category || "uncategorized");
        setEstimatedTime(initialTask.estimatedTime || 25);
        setNotes(initialTask.notes || "");
        setDueDate(initialTask.dueDate ? new Date(initialTask.dueDate) : null);
        // initialize repeat/habit fields if present
        if (initialTask.repeat) {
          setRepeatType(initialTask.repeat.type || "none");
          setRepeatRule(initialTask.repeat.rule || "");
          setTimesPerDay(initialTask.repeat.count || 1);
        } else {
          setRepeatType("none");
          setRepeatRule("");
          setTimesPerDay(1);
        }
        setApplyToFuture(false);
      } else {
        // 新任务的默认值
        setTaskTitle("");
        setCategory("uncategorized");
        setEstimatedTime(25);
        setNotes("");
        setDueDate(null);
        setRepeatType("none");
        setRepeatRule("");
        setTimesPerDay(1);
        setApplyToFuture(false);
      }
    }
  }, [open, initialTask]);

  // 保存任务
  const handleSave = () => {
    const taskData: Omit<Task, "_id" | "createdAt" | "status" | "completedAt"> =
      {
        blockId: blockId || "",
        title: taskTitle.trim(),
        category,
        estimatedTime,
        notes: notes.trim() || undefined,
        dueDate: dueDate ? dueDate.toISOString() : undefined,
      };

    // attach repeat info if applicable
    if (repeatType && repeatType !== "none") {
      (taskData as any).repeat = {
        type: repeatType,
        rule: repeatRule || undefined,
        count: timesPerDay || 1,
      };
    }

    // habit applyToFuture passed as meta flag when editing existing tasks
    if (applyToFuture) {
      (taskData as any)._applyToFuture = true;
    }

    onSave(taskData);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ pb: 1 }}>{title}</DialogTitle>

      <DialogContent sx={{ pb: 2 }}>
        <TextField
          autoFocus
          margin="dense"
          label="任务标题"
          fullWidth
          variant="outlined"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          sx={{ mb: 2 }}
        />

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>分类</InputLabel>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value as Task["category"])}
            label="分类"
          >
            {Object.entries(categoryLabels).map(([value, label]) => (
              <MenuItem key={value} value={value}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      bgcolor:
                        categoryColors[value as keyof typeof categoryColors],
                      mr: 1,
                    }}
                  />
                  {label}
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom component="div">
            预计时间（分钟）
          </Typography>
          <TextField
            type="number"
            variant="outlined"
            fullWidth
            value={estimatedTime}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              if (!isNaN(value) && value > 0 && value <= 180) {
                setEstimatedTime(value);
              }
            }}
            inputProps={{ min: 1, max: 180 }}
            helperText="请输入1-180之间的分钟数"
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom component="div">
            截止日期（可选）
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="选择日期"
              value={dueDate ? dueDate.toLocaleDateString("zh-CN") : ""}
              InputProps={{ readOnly: true }}
              sx={{ mr: 1 }}
            />
            <IconButton color="primary" onClick={() => setDatePickerOpen(true)}>
              <CalendarToday />
            </IconButton>
          </Box>
        </Box>

        <TextField
          margin="dense"
          label="备注（可选）"
          fullWidth
          multiline
          rows={3}
          variant="outlined"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        {/* 日期选择器 */}
        <DatePicker
          open={datePickerOpen}
          onClose={() => setDatePickerOpen(false)}
          onSelectDate={(date) => {
            setDueDate(date);
            setDatePickerOpen(false);
          }}
          initialDate={dueDate || new Date()}
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit">
          取消
        </Button>
        <Button onClick={handleSave} variant="contained">
          保存
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTaskDialog;
