// MyPage.tsx
// 我的页面

import React, { useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Switch,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  useTheme,
  Paper,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Brightness4,
  Brightness7,
  Settings,
  Notifications,
  VolumeUp,
  StayCurrentPortrait,
  Info,
  ContactMail,
  Description,
  PrivacyTip,
} from "@mui/icons-material";
import { useThemeContext } from "../theme/ThemeContext";

interface UserStats {
  completedTasks: number;
  totalHours: number;
  daysJoined: number;
}

interface Settings {
  theme: "light" | "dark" | "system";
  soundEnabled: boolean;
  defaultCategory: string;
  defaultDuration: number;
  notificationsEnabled: boolean;
  reminderEnabled: boolean;
  keepScreenOn: boolean;
}

const MyPage: React.FC = () => {
  const theme = useTheme();
  const { themeMode, setThemeMode, toggleTheme } = useThemeContext();

  const [userStats] = useState<UserStats>({
    completedTasks: 156,
    totalHours: 89.5,
    daysJoined: 45,
  });

  const [settings, setSettings] = useState<Settings>({
    theme: themeMode,
    soundEnabled: true,
    defaultCategory: "未分类",
    defaultDuration: 25,
    notificationsEnabled: true,
    reminderEnabled: true,
    keepScreenOn: false,
  });

  const [themeDialogOpen, setThemeDialogOpen] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [durationDialogOpen, setDurationDialogOpen] = useState(false);

  const categories = ["未分类", "人际", "心智", "健康", "工作", "兴趣"];
  const durations = [15, 20, 25, 30, 45, 60];

  const categoryColors = {
    未分类: theme.palette.grey[500],
    人际: theme.palette.error.main,
    心智: theme.palette.primary.main,
    健康: theme.palette.success.main,
    工作: theme.palette.secondary.main,
    兴趣: theme.palette.warning.main,
  } as Record<string, string>;

  const handleSettingChange = (key: keyof Settings, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleThemeChange = (theme: "light" | "dark" | "system") => {
    handleSettingChange("theme", theme);
    setThemeMode(theme);
    setThemeDialogOpen(false);
  };

  const handleCategoryChange = (category: string) => {
    handleSettingChange("defaultCategory", category);
    setCategoryDialogOpen(false);
  };

  const handleDurationChange = (duration: number) => {
    handleSettingChange("defaultDuration", duration);
    setDurationDialogOpen(false);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("support@taskflow.com");
  };

  const settingsItems = [
    {
      label: "主题",
      value:
        settings.theme === "light"
          ? "浅色"
          : settings.theme === "dark"
            ? "深色"
            : "跟随系统",
      icon: settings.theme === "light" ? <Brightness7 /> : <Brightness4 />,
      onClick: () => setThemeDialogOpen(true),
    },
    {
      label: "开启音效",
      value: settings.soundEnabled ? "已开启" : "已关闭",
      icon: <VolumeUp />,
      onClick: () =>
        handleSettingChange("soundEnabled", !settings.soundEnabled),
      isSwitch: true,
      switchValue: settings.soundEnabled,
    },
    {
      label: "默认分类",
      value: settings.defaultCategory,
      icon: <Settings />,
      onClick: () => setCategoryDialogOpen(true),
    },
    {
      label: "默认计时时长",
      value: `${settings.defaultDuration}分钟`,
      icon: <Settings />,
      onClick: () => setDurationDialogOpen(true),
    },
    {
      label: "开启通知",
      value: settings.notificationsEnabled ? "已开启" : "已关闭",
      icon: <Notifications />,
      onClick: () =>
        handleSettingChange(
          "notificationsEnabled",
          !settings.notificationsEnabled
        ),
      isSwitch: true,
      switchValue: settings.notificationsEnabled,
    },
    {
      label: "计时到时提醒",
      value: settings.reminderEnabled ? "已开启" : "已关闭",
      icon: <Notifications />,
      onClick: () =>
        handleSettingChange("reminderEnabled", !settings.reminderEnabled),
      isSwitch: true,
      switchValue: settings.reminderEnabled,
    },
    {
      label: "保持屏幕常亮",
      value: settings.keepScreenOn ? "已开启" : "已关闭",
      icon: <StayCurrentPortrait />,
      onClick: () =>
        handleSettingChange("keepScreenOn", !settings.keepScreenOn),
      isSwitch: true,
      switchValue: settings.keepScreenOn,
    },
  ];

  const infoItems = [
    {
      label: "版本号",
      value: "1.0.0",
      icon: <Info />,
      onClick: () => console.log("检查更新"),
    },
    {
      label: "问题反馈",
      value: "support@taskflow.com",
      icon: <ContactMail />,
      onClick: handleCopyEmail,
    },
    {
      label: "用户协议",
      icon: <Description />,
      onClick: () => console.log("打开用户协议"),
    },
    {
      label: "隐私政策",
      icon: <PrivacyTip />,
      onClick: () => console.log("打开隐私政策"),
    },
  ];

  return (
    <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
      {/* 用户信息区域 */}
      <Paper
        elevation={0}
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          color: theme.palette.common.white,
          p: 3,
          borderRadius: 0,
          position: "relative",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <Avatar
            sx={{
              width: 60,
              height: 60,
              mr: 2,
              background: (theme) => `rgba(255,255,255,0.16)`,
            }}
          >
            {userStats.completedTasks.toString()[0]}
          </Avatar>
          <Box>
            <Typography variant="h6">用户</Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              专注每一天
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-around" }}>
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              {userStats.completedTasks}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              已完成任务
            </Typography>
          </Box>
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              {userStats.totalHours}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              总计时长(小时)
            </Typography>
          </Box>
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              {userStats.daysJoined}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              加入天数
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* 设置列表 */}
      <Box sx={{ flex: 1, overflow: "auto" }}>
        <List>
          <Typography variant="h6" sx={{ p: 2, pb: 1 }}>
            设置
          </Typography>
          {settingsItems.map((item, index) => (
            <ListItem
              key={item.label}
              onClick={item.onClick}
              sx={{ py: 2, cursor: "pointer" }}
            >
              <ListItemIcon sx={{ color: "inherit" }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} secondary={item.value} />
              {item.isSwitch && (
                <Switch
                  checked={item.switchValue}
                  onChange={(e) => {
                    e.stopPropagation();
                    item.onClick();
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
              )}
            </ListItem>
          ))}

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" sx={{ p: 2, pb: 1 }}>
            关于
          </Typography>
          {infoItems.map((item) => (
            <ListItem
              key={item.label}
              onClick={item.onClick}
              sx={{ py: 2, cursor: "pointer" }}
            >
              <ListItemIcon sx={{ color: "inherit" }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} secondary={item.value} />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* 主题选择对话框 */}
      <Dialog open={themeDialogOpen} onClose={() => setThemeDialogOpen(false)}>
        <DialogTitle>选择主题</DialogTitle>
        <DialogContent>
          <FormControl component="fieldset">
            <RadioGroup
              value={settings.theme}
              onChange={(e) => handleThemeChange(e.target.value as any)}
            >
              <FormControlLabel
                value="light"
                control={<Radio />}
                label="浅色"
              />
              <FormControlLabel value="dark" control={<Radio />} label="深色" />
              <FormControlLabel
                value="system"
                control={<Radio />}
                label="跟随系统"
              />
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setThemeDialogOpen(false)}>取消</Button>
        </DialogActions>
      </Dialog>

      {/* 分类选择对话框 */}
      <Dialog
        open={categoryDialogOpen}
        onClose={() => setCategoryDialogOpen(false)}
      >
        <DialogTitle>选择默认分类</DialogTitle>
        <DialogContent>
          <FormControl component="fieldset">
            <RadioGroup
              value={settings.defaultCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
            >
              {categories.map((category) => (
                <FormControlLabel
                  key={category}
                  value={category}
                  control={<Radio />}
                  label={
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: "50%",
                          background:
                            categoryColors[
                              category as keyof typeof categoryColors
                            ],
                          mr: 1,
                        }}
                      />
                      {category}
                    </Box>
                  }
                />
              ))}
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCategoryDialogOpen(false)}>取消</Button>
        </DialogActions>
      </Dialog>

      {/* 时长选择对话框 */}
      <Dialog
        open={durationDialogOpen}
        onClose={() => setDurationDialogOpen(false)}
      >
        <DialogTitle>选择默认计时时长</DialogTitle>
        <DialogContent>
          <FormControl component="fieldset">
            <RadioGroup
              value={settings.defaultDuration}
              onChange={(e) => handleDurationChange(Number(e.target.value))}
            >
              {durations.map((duration) => (
                <FormControlLabel
                  key={duration}
                  value={duration}
                  control={<Radio />}
                  label={`${duration}分钟`}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDurationDialogOpen(false)}>取消</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyPage;
