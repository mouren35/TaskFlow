import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import colors from "../theme/colors";

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

  // layout will evenly distribute seven day slots to fill the container width

  const handleKeyDown = (e: React.KeyboardEvent, d: Date) => {
    if (
      e.key === "Enter" ||
      e.key === " " ||
      e.key === "Spacebar" ||
      e.key === "Space"
    ) {
      e.preventDefault();
      onSelectDate(new Date(d));
    }
  };

  return (
    <Box
      component="nav"
      aria-label="Week picker"
      sx={{
        width: "100%",
        display: "flex",
        gap: { xs: 0, sm: 0.25, md: 0.5 },
        px: { xs: 0.5, sm: 1, md: 2 },
        py: { xs: 0.25, sm: 0.5, md: 0.75 },
        alignItems: "center",
        bgcolor: "transparent",
        justifyContent: "space-between",
      }}
    >
      {daysOfWeek.map((d) => {
        const today = new Date();
        const isToday = today.toDateString() === d.toDateString();
        const isSelected = selectedDate.toDateString() === d.toDateString();
        const weekdayNames = ["日", "一", "二", "三", "四", "五", "六"];
        const weekday = weekdayNames[d.getDay()];

        return (
          <Box
            role="button"
            aria-pressed={isSelected}
            aria-label={`选择 ${d.toLocaleDateString()}`}
            data-selected={isSelected ? "true" : "false"}
            tabIndex={0}
            key={d.toISOString()}
            onClick={() => onSelectDate(new Date(d))}
            onKeyDown={(e) => handleKeyDown(e, d)}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              flex: "1 1 0",
              minWidth: 0,
              px: { xs: 0.25, sm: 0.5 },
              cursor: "pointer",
              outline: "none",
              // show focus ring only for keyboard navigation
              "&:focus-visible": {
                boxShadow: "0 0 0 3px rgba(43,103,163,0.12)",
                borderRadius: 1,
              },
              WebkitTapHighlightColor: "transparent",
              userSelect: "none",
            }}
          >
            <Typography
              component="div"
              sx={{
                color: "text.secondary",
                mb: 0.25,
                fontSize: { xs: 11, sm: 12 },
              }}
            >
              {weekday}
            </Typography>

            <Box
              sx={{
                width: { xs: 32, sm: 36 },
                height: { xs: 32, sm: 36 },
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: isSelected ? colors.trueBlue : "transparent",
                color: isSelected ? "#fff" : "text.primary",
                border: isSelected ? "none" : "1px solid transparent",
                boxShadow: isSelected
                  ? "0 2px 6px rgba(43,103,163,0.25)"
                  : "none",
                // disable transient click/tap animation so selection appears immediately
                transition: "none",
              }}
            >
              <Typography
                sx={{
                  fontWeight: isSelected ? 600 : 500,
                  fontSize: { xs: 13, sm: 14 },
                }}
              >
                {d.getDate()}
              </Typography>
            </Box>

            {/* small today indicator */}
            <Box sx={{ mt: 0.4, height: { xs: 6, sm: 6 } }}>
              {isToday && !isSelected ? (
                <Box
                  sx={{
                    width: { xs: 5, sm: 6 },
                    height: { xs: 5, sm: 6 },
                    borderRadius: "50%",
                    bgcolor: colors.trueBlue,
                  }}
                />
              ) : null}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default WeekPicker;
