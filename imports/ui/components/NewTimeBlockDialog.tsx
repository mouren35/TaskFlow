import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from "@mui/material";

interface NewTimeBlockDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: {
    title: string;
    date: Date;
    startTime: string;
    endTime?: string;
    repeat?: { type: 'daily' | 'weekly' | 'monthly'; rule?: any };
  }) => void;
  initialDate: Date;
}

const NewTimeBlockDialog: React.FC<NewTimeBlockDialogProps> = ({
  open,
  onClose,
  onSave,
  initialDate,
}) => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState<Date>(initialDate);
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState<string>("");
  // repeat options
  const [repeatType, setRepeatType] = useState<'none' | 'daily' | 'weekly' | 'monthly'>('none');
  const [repeatRule, setRepeatRule] = useState<string>('');

  useEffect(() => {
    if (open) {
      setTitle("");
      setDate(initialDate);
      setStartTime("08:00");
      setEndTime("");
  setRepeatType('none');
  setRepeatRule('');
    }
  }, [open, initialDate]);

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({
      title: title.trim(),
      date,
      startTime,
  endTime: endTime || undefined,
  repeat: repeatType && repeatType !== 'none' ? { type: repeatType, rule: repeatRule } : undefined,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>新建时间块</DialogTitle>
      <DialogContent>
        <Box
          sx={{ display: "grid", gridTemplateColumns: "1fr", gap: 2, mt: 0.5 }}
        >
          <Box>
            <TextField
              label="标题"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </Box>
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <TextField
              label="日期"
              type="date"
              fullWidth
              value={new Date(date).toISOString().slice(0, 10)}
              onChange={(e) => setDate(new Date(e.target.value))}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="开始时间"
              type="time"
              fullWidth
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              InputLabelProps={{ shrink: true }}
              inputProps={{ step: 300 }}
            />
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <TextField
              select
              label="重复"
              value={repeatType}
              onChange={(e) => setRepeatType(e.target.value as any)}
              fullWidth
            >
              <option value="none">无</option>
              <option value="daily">每日</option>
              <option value="weekly">每周</option>
              <option value="monthly">每月</option>
            </TextField>
            <TextField
              label="重复规则（可选）"
              fullWidth
              value={repeatRule}
              onChange={(e) => setRepeatRule(e.target.value)}
            />
          </Box>
          <Box>
            <TextField
              label="结束时间（可选）"
              type="time"
              fullWidth
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              InputLabelProps={{ shrink: true }}
              inputProps={{ step: 300 }}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>取消</Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={!title.trim()}
        >
          确认
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewTimeBlockDialog;
