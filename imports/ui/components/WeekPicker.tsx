import React from "react";
import { Box, Button } from "@mui/material";

export function getStartOfWeek(date: Date) {
  const d = new Date(date);
  const day = d.getDay() || 7;
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - (day - 1));
  return d;
}

interface Props {
  selectedDate: Date;
  onSelectDate: (d: Date) => void;
}

const WeekPicker: React.FC<Props> = ({ selectedDate, onSelectDate }) => {
  const startOfWeek = getStartOfWeek(selectedDate);
  const daysOfWeek = Array.from({ length: 7 }).map((_, idx) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + idx);
    return d;
  });

  return (
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
            onClick={() => onSelectDate(new Date(d))}
            sx={{ minWidth: 64, borderRadius: 2 }}
          >
            {`${d.getMonth() + 1}/${d.getDate()}`}
          </Button>
        );
      })}
    </Box>
  );
};

export default WeekPicker;
