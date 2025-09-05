// ThinkPage.tsx
// 思考页面

import React, { useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Chip,
  Menu,
  MenuItem,
  useTheme,
} from "@mui/material";
import {
  Add,
  MoreVert,
  Lightbulb,
  Edit,
  Delete,
  Tag,
} from "@mui/icons-material";

interface Thought {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ThinkPage: React.FC = () => {
  const theme = useTheme();
  const [thoughts, setThoughts] = useState<Thought[]>([
    {
      id: "1",
      title: "关于时间管理的思考",
      content: "今天思考了如何更好地管理时间，发现番茄工作法很有效，但需要在实际应用中调整时间间隔。",
      tags: ["时间管理", "效率", "思考"],
      createdAt: new Date(2024, 0, 15),
      updatedAt: new Date(2024, 0, 15),
    },
    {
      id: "2",
      title: "学习新技术的感悟",
      content: "学习新技术时，先理解核心概念比直接上手更重要。建立知识体系，然后逐步实践。",
      tags: ["学习", "技术", "成长"],
      createdAt: new Date(2024, 0, 14),
      updatedAt: new Date(2024, 0, 14),
    },
  ]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingThought, setEditingThought] = useState<Thought | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedThought, setSelectedThought] = useState<Thought | null>(null);

  const handleAddThought = () => {
    setEditingThought(null);
    setTitle("");
    setContent("");
    setTags("");
    setOpenDialog(true);
  };

  const handleEditThought = (thought: Thought) => {
    setEditingThought(thought);
    setTitle(thought.title);
    setContent(thought.content);
    setTags(thought.tags.join(", "));
    setOpenDialog(true);
  };

  const handleSaveThought = () => {
    const tagArray = tags.split(",").map(tag => tag.trim()).filter(tag => tag);
    
    if (editingThought) {
      setThoughts(thoughts.map(t => 
        t.id === editingThought.id 
          ? { ...t, title, content, tags: tagArray, updatedAt: new Date() }
          : t
      ));
    } else {
      const newThought: Thought = {
        id: Date.now().toString(),
        title,
        content,
        tags: tagArray,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setThoughts([newThought, ...thoughts]);
    }
    
    setOpenDialog(false);
  };

  const handleDeleteThought = (id: string) => {
    setThoughts(thoughts.filter(t => t.id !== id));
    setAnchorEl(null);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, thought: Thought) => {
    setAnchorEl(event.currentTarget);
    setSelectedThought(thought);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedThought(null);
  };

  return (
    <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
      {/* 标题栏 */}
      <Box sx={{ p: 2, borderBottom: "1px solid #eee" }}>
        <Typography variant="h5" fontWeight="bold">
          思考空间
        </Typography>
        <Typography variant="body2" color="text.secondary">
          记录你的思考和感悟
        </Typography>
      </Box>

      {/* 思考列表 */}
      <Box sx={{ flex: 1, overflow: "auto" }}>
        <List>
          {thoughts.map((thought) => (
            <ListItem
              key={thought.id}
              sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#f5f5f5' } }}
            >
              <ListItemIcon>
                <Lightbulb sx={{ color: "#ff9800" }} />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                    <Typography variant="subtitle1" fontWeight="medium">
                      {thought.title}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 0.5 }}>
                      {thought.tags.map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          size="small"
                          variant="outlined"
                          sx={{ height: 20, fontSize: "0.75rem" }}
                        />
                      ))}
                    </Box>
                  </Box>
                }
                secondary={
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {thought.content.length > 100
                        ? thought.content.substring(0, 100) + "..."
                        : thought.content}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {thought.createdAt.toLocaleDateString()}
                    </Typography>
                  </Box>
                }
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMenuOpen(e, thought);
                  }}
                >
                  <MoreVert />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>

        {thoughts.length === 0 && (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Lightbulb sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
            <Typography variant="body1" color="text.secondary">
              还没有任何思考记录
            </Typography>
            <Typography variant="body2" color="text.secondary">
              点击右下角按钮开始记录
            </Typography>
          </Box>
        )}
      </Box>

      {/* 添加按钮 */}
      <Fab
        color="primary"
        aria-label="add"
        onClick={handleAddThought}
        sx={{
          position: "fixed",
          bottom: 80,
          right: 16,
          backgroundColor: "#ff9800",
          "&:hover": {
            backgroundColor: "#f57c00",
          },
        }}
      >
        <Add />
      </Fab>

      {/* 编辑对话框 */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingThought ? "编辑思考" : "添加思考"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="标题"
            fullWidth
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="内容"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="标签（用逗号分隔）"
            fullWidth
            variant="outlined"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="例如：学习, 思考, 成长"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>取消</Button>
          <Button onClick={handleSaveThought} variant="contained">
            {editingThought ? "更新" : "添加"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* 菜单 */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          if (selectedThought) {
            handleEditThought(selectedThought);
          }
          handleMenuClose();
        }}>
          <Edit sx={{ mr: 1 }} fontSize="small" />
          编辑
        </MenuItem>
        <MenuItem onClick={() => {
          if (selectedThought) {
            handleDeleteThought(selectedThought.id);
          }
          handleMenuClose();
        }} sx={{ color: "error.main" }}>
          <Delete sx={{ mr: 1 }} fontSize="small" />
          删除
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default ThinkPage;
