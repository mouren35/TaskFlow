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
  Grid,
  Paper,
  Tabs,
  Tab,
  Divider,
} from "@mui/material";
import {
  Add,
  MoreVert,
  Lightbulb,
  Edit,
  Delete,
  Folder,
  Description,
} from "@mui/icons-material";
import TreeView, { TreeNode } from "../components/TreeView";

interface Thought {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  parentId?: string;
}

const ThinkPage: React.FC = () => {
  const theme = useTheme();
  const [thoughts, setThoughts] = useState<Thought[]>([
    // 初始示例数据
  ]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingThought, setEditingThought] = useState<Thought | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedThought, setSelectedThought] = useState<Thought | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "tree">("list");
  const [selectedTreeNode, setSelectedTreeNode] = useState<TreeNode | null>(
    null
  );
  const [isAddingFolder, setIsAddingFolder] = useState(false);
  const [parentId, setParentId] = useState<string | null>(null);

  const handleAddThought = (parentNodeId: string | null = null) => {
    setEditingThought(null);
    setTitle("");
    setContent("");
    setTags("");
    setParentId(parentNodeId);
    setIsAddingFolder(false);
    setOpenDialog(true);
  };

  const handleAddFolder = (parentNodeId: string | null = null) => {
    setEditingThought(null);
    setTitle("");
    setContent("");
    setTags("");
    setParentId(parentNodeId);
    setIsAddingFolder(true);
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
    const tagArray = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    if (editingThought) {
      setThoughts(
        thoughts.map((t) =>
          t.id === editingThought.id
            ? { ...t, title, content, tags: tagArray, updatedAt: new Date() }
            : t
        )
      );
    } else {
      setThoughts([
        {
          id: Date.now().toString(),
          title,
          content,
          tags: tagArray,
          createdAt: new Date(),
          updatedAt: new Date(),
          parentId: parentId || undefined,
        },
        ...thoughts,
      ]);
    }
    setOpenDialog(false);
  };

  const handleDeleteThought = (id: string) => {
    setThoughts(thoughts.filter((t) => t.id !== id));
    setAnchorEl(null);
  };

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    thought: Thought
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedThought(thought);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedThought(null);
  };

  const buildTreeData = (): TreeNode[] => {
    const nodeMap: Record<string, TreeNode> = {};
    const roots: TreeNode[] = [];
    thoughts.forEach((t) => {
      nodeMap[t.id] = {
        id: t.id,
        title: t.title,
        type: t.content ? "item" : "folder",
        content: t.content,
        tags: t.tags,
        children: [],
      };
    });
    thoughts.forEach((t) => {
      t.parentId && nodeMap[t.parentId]
        ? nodeMap[t.parentId].children!.push(nodeMap[t.id])
        : roots.push(nodeMap[t.id]);
    });
    return roots;
  };

  const treeData = buildTreeData();

  return (
    <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant="h6" fontWeight="bold" component="div">
              思考空间
            </Typography>
            <Typography variant="body2" color="text.secondary" component="div">
              记录你的思考和感悟
            </Typography>
          </Box>
          <Tabs value={viewMode} onChange={(_, v) => setViewMode(v)}>
            <Tab label="列表" value="list" />
            <Tab label="树状" value="tree" />
          </Tabs>
        </Box>
      </Box>

      {viewMode === "list" ? (
        <Box sx={{ flex: 1, overflow: "auto" }}>
          <List dense>
            {thoughts.map((t) => (
              <ListItem
                key={t.id}
                sx={{
                  cursor: "pointer",
                  "&:hover": { backgroundColor: "action.hover" },
                }}
              >
                <ListItemIcon>
                  <Lightbulb color="warning" />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="subtitle2" component="span">
                      {t.title}
                    </Typography>
                  }
                  secondary={
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      component="div"
                    >
                      {t.content || "无内容"}
                    </Typography>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMenuOpen(e, t);
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
              <Description
                sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
              />
              <Typography
                variant="body2"
                color="text.secondary"
                component="div"
              >
                还没有任何思考记录
              </Typography>
            </Box>
          )}
        </Box>
      ) : (
        <Grid container spacing={2} sx={{ flex: 1, p: 2, overflow: "hidden" }}>
          <Grid item xs={4} sx={{ height: "100%" }}>
            <TreeView
              data={treeData}
              onAddNode={(pid) => handleAddThought(pid)}
              onEditNode={(n) => {
                const th = thoughts.find((t) => t.id === n.id);
                th && handleEditThought(th);
              }}
              onDeleteNode={(id) => handleDeleteThought(id)}
              onSelectNode={(n) => setSelectedTreeNode(n)}
            />
          </Grid>
          <Grid item xs={8} sx={{ height: "100%" }}>
            <Paper
              elevation={0}
              sx={{
                height: "100%",
                p: 2,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 1,
                overflow: "auto",
              }}
            >
              {selectedTreeNode ? (
                <Box>
                  <Typography variant="h6" component="div" sx={{ mb: 1 }}>
                    {selectedTreeNode.title}
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="body2" component="div">
                    {selectedTreeNode.content || "没有内容"}
                  </Typography>
                </Box>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                  }}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    component="div"
                  >
                    选择一个思考项查看详情
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      )}

      <Box
        sx={{
          position: "fixed",
          bottom: 80,
          right: 16,
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        {viewMode === "tree" && (
          <Fab
            size="small"
            color="secondary"
            aria-label="add folder"
            onClick={() => handleAddFolder(null)}
          >
            <Folder />
          </Fab>
        )}
        <Fab
          color="primary"
          aria-label="add"
          onClick={() => handleAddThought(null)}
        >
          <Add />
        </Fab>
      </Box>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingThought
            ? "编辑思考"
            : isAddingFolder
              ? "添加文件夹"
              : "添加思考"}
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
          {!isAddingFolder && (
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
          )}
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

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={() => {
            if (selectedThought) handleEditThought(selectedThought);
            handleMenuClose();
          }}
        >
          编辑
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (selectedThought) handleDeleteThought(selectedThought.id);
            handleMenuClose();
          }}
          sx={{ color: "error.main" }}
        >
          删除
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default ThinkPage;
