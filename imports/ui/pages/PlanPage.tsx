// PlanPage.tsx
// 计划页面（首页）

import React, { useState } from "react";
import { useTasksViewModel } from "../../viewModels/useTasksViewModel";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import {
  Box,
  Stack,
  Button,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip,
  Tooltip,
  Zoom,
} from "@mui/material";
import AddTaskDialog from "../components/AddTaskDialog";
import { Task } from "../../models/task";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

// 分类颜色映射
const categoryColors: Record<string, string> = {
  social: "#f44336", // 人际关系 - 红色
  mind: "#2196f3",  // 心智 - 蓝色
  health: "#4caf50", // 健康 - 绿色
  work: "#9c27b0",   // 工作 - 紫色
  hobby: "#ff9800",  // 兴趣爱好 - 橙色
  uncategorized: "#9e9e9e" // 未分类 - 灰色
};

const PlanPage: React.FC = () => {
  const { tasks, timeBlocks, insertTask } = useTasksViewModel();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);

  // menu state for AppBar
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    useState<null | HTMLElement>(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleOpenAddTaskDialog = () => {
    setIsAddTaskDialogOpen(true);
  };

  const handleCloseAddTaskDialog = () => {
    setIsAddTaskDialogOpen(false);
  };

  const handleSaveTask = async (taskData: Omit<Task, '_id' | 'createdAt' | 'status' | 'completedAt'>) => {
    try {
      await insertTask({
        title: taskData.title,
        category: taskData.category,
        estimatedTime: taskData.estimatedTime,
        notes: taskData.notes ,
        status: 'pending',
        blockId: taskData.blockId
      });
    } catch (e) {
      // 错误处理可以在这里添加，例如显示提示消息
      console.error('添加任务失败:', e);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      {/* AppBar */}
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ display: { xs: "none", sm: "block" } }}
            >
              TaskFlow
            </Typography>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Search>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              <IconButton
                size="large"
                aria-label="show 4 new mails"
                color="inherit"
              >
                <Badge badgeContent={4} color="error">
                  <MailIcon />
                </Badge>
              </IconButton>
              <IconButton
                size="large"
                aria-label="show 17 new notifications"
                color="inherit"
              >
                <Badge badgeContent={17} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls={"primary-search-account-menu"}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
            </Box>
            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="show more"
                aria-controls={"primary-search-account-menu-mobile"}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
        {/* menus */}
        <Menu
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          id={"primary-search-account-menu"}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={isMenuOpen}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
          <MenuItem onClick={handleMenuClose}>My account</MenuItem>
        </Menu>
        <Menu
          anchorEl={mobileMoreAnchorEl}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          id={"primary-search-account-menu-mobile"}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={isMobileMenuOpen}
          onClose={handleMobileMenuClose}
        >
          <MenuItem>
            <IconButton
              size="large"
              aria-label="show 4 new mails"
              color="inherit"
            >
              <Badge badgeContent={4} color="error">
                <MailIcon />
              </Badge>
            </IconButton>
            <p>Messages</p>
          </MenuItem>
          <MenuItem>
            <IconButton
              size="large"
              aria-label="show 17 new notifications"
              color="inherit"
            >
              <Badge badgeContent={17} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <p>Notifications</p>
          </MenuItem>
          <MenuItem onClick={handleProfileMenuOpen}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="primary-search-account-menu"
              aria-haspopup="true"
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <p>Profile</p>
          </MenuItem>
        </Menu>
      </Box>

      <Stack spacing={2}>
        <Typography variant="h5">计划</Typography>

        {/* 添加任务按钮 */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Tooltip title="添加新任务" arrow>
            <Zoom in={true}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleOpenAddTaskDialog}
                sx={{
                  borderRadius: 8,
                  px: 3,
                  boxShadow: 2,
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: 4,
                  },
                  transition: 'all 0.2s'
                }}
              >
                添加任务
              </Button>
            </Zoom>
          </Tooltip>
        </Box>
        
        {/* 添加任务对话框 */}
        <AddTaskDialog
          open={isAddTaskDialogOpen}
          onClose={handleCloseAddTaskDialog}
          onSave={handleSaveTask}
          title="添加新任务"
        />

        {/* responsive layout: left column (timeblocks) and right column (tasks) */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
          }}
        >
          <Box sx={{ flex: "0 0 auto", width: { xs: "100%", md: "30%" } }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              时间块
            </Typography>
            <Paper 
              elevation={2} 
              sx={{ 
                p: 1, 
                borderRadius: 2,
                overflow: 'hidden'
              }}
            >
              <List sx={{ p: 0 }}>
                {timeBlocks.length > 0 ? (
                  timeBlocks.map((tb, index) => (
                    <Zoom 
                      in={true} 
                      style={{ transitionDelay: `${index * 30}ms` }} 
                      key={tb._id}
                    >
                      <ListItem 
                        divider 
                        disableGutters
                        sx={{
                          p: 1.5,
                          borderRadius: 1,
                          mb: 0.5,
                          '&:hover': {
                            bgcolor: 'action.hover',
                          },
                          transition: 'all 0.2s'
                        }}
                      >
                        <ListItemText 
                          primary={
                            <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                              {tb.title}
                            </Typography>
                          } 
                          secondary={
                            <Typography variant="caption" color="text.secondary">
                              {new Date(tb.date).toLocaleDateString()} {tb.startTime}-{tb.endTime}
                            </Typography>
                          }
                        />
                      </ListItem>
                    </Zoom>
                  ))
                ) : (
                  <Box sx={{ p: 2, textAlign: 'center' }}>
                    <Typography color="text.secondary" variant="body2">
                      暂无时间块
                    </Typography>
                  </Box>
                )}
              </List>
            </Paper>
          </Box>

          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              任务
            </Typography>

            <Box
              sx={{
                display: "grid",
                gap: 2,
                gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
              }}
            >
              {tasks.length > 0 ? (
                tasks.map((t, index) => (
                  <Zoom 
                    in={true} 
                    style={{ transitionDelay: `${index * 50}ms` }} 
                    key={t._id}
                  >
                    <Paper 
                      elevation={1} 
                      sx={{ 
                        p: 2, 
                        borderRadius: 2,
                        transition: 'all 0.3s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: 3,
                        },
                        borderLeft: `4px solid ${t.category ? categoryColors[t.category] : '#9e9e9e'}`
                      }}
                    >
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                            {t.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {t.estimatedTime} 分钟
                            {t.notes && (
                              <Tooltip title={t.notes} arrow placement="bottom-start">
                                <Box component="span" sx={{ ml: 1, cursor: 'help', textDecoration: 'underline dotted' }}>...</Box>
                              </Tooltip>
                            )}
                          </Typography>
                        </Box>
                        <Box>
                          {t.status === 'completed' ? (
                            <Chip 
                              label="已完成" 
                              color="success" 
                              size="small" 
                              sx={{ fontWeight: 500 }}
                            />
                          ) : (
                            <Chip 
                              label="未完成" 
                              size="small" 
                              sx={{ fontWeight: 500 }}
                            />
                          )}
                        </Box>
                      </Stack>
                    </Paper>
                  </Zoom>
                ))
              ) : (
                <Box sx={{ p: 4, textAlign: 'center', gridColumn: '1 / -1' }}>
                  <Typography color="text.secondary">
                    暂无任务，点击"添加任务"按钮创建新任务
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Stack>
    </Box>
  );
};

export default PlanPage;
