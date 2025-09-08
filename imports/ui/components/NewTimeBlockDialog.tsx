import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
} from "@mui/material";

interface NewTimeBlockDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: {
    title: string;
    date: Date;
    startTime: string;
    endTime?: string;
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

  useEffect(() => {
    if (open) {
      setTitle("");
      setDate(initialDate);
      setStartTime("08:00");
      setEndTime("");
    }
  }, [open, initialDate]);

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({
      title: title.trim(),
      date,
      startTime,
      endTime: endTime || undefined,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>新建时间块</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid item xs={12}>
            <TextField
              label="标题"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="日期"
              type="date"
              fullWidth
              value={new Date(date).toISOString().slice(0, 10)}
              onChange={(e) => setDate(new Date(e.target.value))}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField
              label="开始时间"
              type="time"
              fullWidth
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              InputLabelProps={{ shrink: true }}
              inputProps={{ step: 300 }}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField
              label="结束时间（可选）"
              type="time"
              fullWidth
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              InputLabelProps={{ shrink: true }}
              inputProps={{ step: 300 }}
            />
          </Grid>
        </Grid>
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
