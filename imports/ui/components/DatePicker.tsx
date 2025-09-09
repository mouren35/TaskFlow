import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  useTheme,
} from "@mui/material";
// removed Grid import - using CSS grid via Box
import { ArrowBack, ArrowForward, Today } from "@mui/icons-material";

interface DatePickerProps {
  open: boolean;
  onClose: () => void;
  onSelectDate: (date: Date) => void;
  initialDate?: Date;
  minDate?: Date;
  maxDate?: Date;
}

const DatePicker: React.FC<DatePickerProps> = ({
  open,
  onClose,
  onSelectDate,
  initialDate = new Date(),
  minDate,
  maxDate,
}) => {
  const theme = useTheme();
  const [currentDate, setCurrentDate] = useState<Date>(initialDate);
  const [currentMonth, setCurrentMonth] = useState<Date>(
    new Date(initialDate.getFullYear(), initialDate.getMonth(), 1)
  );

  // 获取当前月的天数
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // 获取当前月的第一天是星期几
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  // 生成日历数据
  const generateCalendarData = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);

    const days = [];

    // 添加上个月的天数
    const prevMonthDays = getDaysInMonth(year, month - 1);
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      days.push({
        day: prevMonthDays - i,
        month: month - 1,
        year: month === 0 ? year - 1 : year,
        isCurrentMonth: false,
      });
    }

    // 添加当前月的天数
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        month,
        year,
        isCurrentMonth: true,
      });
    }

    // 添加下个月的天数
    const remainingDays = 42 - days.length; // 6行7列 = 42
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        month: month + 1,
        year: month === 11 ? year + 1 : year,
        isCurrentMonth: false,
      });
    }

    return days;
  };

  // 处理月份变化
  const handleMonthChange = (increment: number) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + increment);
    setCurrentMonth(newMonth);
  };

  // 处理日期选择
  const handleDateSelect = (day: number, month: number, year: number) => {
    const selectedDate = new Date(year, month, day);
    setCurrentDate(selectedDate);
    onSelectDate(selectedDate);
    onClose();
  };

  // 检查日期是否在允许范围内
  const isDateInRange = (day: number, month: number, year: number) => {
    const date = new Date(year, month, day);
    if (minDate && date < minDate) return false;
    if (maxDate && date > maxDate) return false;
    return true;
  };

  // 检查日期是否是今天
  const isToday = (day: number, month: number, year: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  // 检查日期是否是选中日期
  const isSelected = (day: number, month: number, year: number) => {
    return (
      day === currentDate.getDate() &&
      month === currentDate.getMonth() &&
      year === currentDate.getFullYear()
    );
  };

  // 获取月份名称
  const getMonthName = (month: number) => {
    const monthNames = [
      "一月",
      "二月",
      "三月",
      "四月",
      "五月",
      "六月",
      "七月",
      "八月",
      "九月",
      "十月",
      "十一月",
      "十二月",
    ];
    return monthNames[month];
  };

  const calendarData = generateCalendarData();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6">选择日期</Typography>
          <Box>
            <IconButton onClick={() => handleMonthChange(-1)}>
              <ArrowBack />
            </IconButton>
            <IconButton onClick={() => handleMonthChange(1)}>
              <ArrowForward />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Typography
          variant="subtitle1"
          sx={{ mb: 2, textAlign: "center", fontWeight: "bold" }}
        >
          {getMonthName(currentMonth.getMonth())} {currentMonth.getFullYear()}
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: 8,
          }}
        >
          {["日", "一", "二", "三", "四", "五", "六"].map((day) => (
            <Box
              key={day}
              sx={{ textAlign: "center", py: 1, fontWeight: "bold" }}
            >
              {day}
            </Box>
          ))}

          {calendarData.map((item, index) => (
            <Box key={index}>
              <Box
                onClick={() => {
                  if (
                    item.isCurrentMonth &&
                    isDateInRange(item.day, item.month, item.year)
                  ) {
                    handleDateSelect(item.day, item.month, item.year);
                  }
                }}
                sx={{
                  textAlign: "center",
                  py: 1,
                  borderRadius: "50%",
                  width: 36,
                  height: 36,
                  margin: "0 auto",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor:
                    item.isCurrentMonth &&
                    isDateInRange(item.day, item.month, item.year)
                      ? "pointer"
                      : "default",
                  backgroundColor: isSelected(item.day, item.month, item.year)
                    ? theme.palette.primary.main
                    : isToday(item.day, item.month, item.year)
                      ? theme.palette.primary.light
                      : "transparent",
                  color: isSelected(item.day, item.month, item.year)
                    ? theme.palette.primary.contrastText
                    : isToday(item.day, item.month, item.year)
                      ? theme.palette.primary.contrastText
                      : item.isCurrentMonth
                        ? "text.primary"
                        : "text.disabled",
                  "&:hover": {
                    backgroundColor:
                      item.isCurrentMonth &&
                      isDateInRange(item.day, item.month, item.year)
                        ? isSelected(item.day, item.month, item.year)
                          ? theme.palette.primary.dark
                          : theme.palette.action.hover
                        : "transparent",
                  },
                }}
              >
                {item.day}
              </Box>
            </Box>
          ))}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button
          startIcon={<Today />}
          onClick={() => {
            const today = new Date();
            if (
              isDateInRange(
                today.getDate(),
                today.getMonth(),
                today.getFullYear()
              )
            ) {
              handleDateSelect(
                today.getDate(),
                today.getMonth(),
                today.getFullYear()
              );
            }
          }}
        >
          今天
        </Button>
        <Button onClick={onClose}>取消</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DatePicker;
