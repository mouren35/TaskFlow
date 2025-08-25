// BottomNav.tsx
// 底部导航栏组件

import React from "react";
import { useLocation, useHistory } from "react-router-dom";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import EmojiObjectsOutlinedIcon from "@mui/icons-material/EmojiObjectsOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";

const navs = [
  { label: "计划", value: "/plan", icon: <HomeOutlinedIcon /> },
  { label: "安排", value: "/schedule", icon: <CalendarTodayOutlinedIcon /> },
  { label: "思考", value: "/think", icon: <EmojiObjectsOutlinedIcon /> },
  { label: "我的", value: "/my", icon: <PersonOutlineOutlinedIcon /> },
];

const BottomNav: React.FC = () => {
  const location = useLocation();
  const history = useHistory();
  const current =
    navs.find((n) => location.pathname.startsWith(n.value))?.value || "/plan";

  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        borderTop: "1px solid #eee",
        background: "#fff",
      }}
    >
      <BottomNavigation
        value={current}
        onChange={(_, value) => history.push(value)}
        showLabels
      >
        {navs.map((nav) => (
          <BottomNavigationAction
            key={nav.value}
            label={nav.label}
            value={nav.value}
            icon={nav.icon}
          />
        ))}
      </BottomNavigation>
    </nav>
  );
};

export default BottomNav;
