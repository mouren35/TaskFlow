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
  Tag,
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
    {
      id: "3",
      title: "项目管理方法",
      content: "敏捷开发方法在小团队中更为高效，但需要团队成员都理解其核心理念。",
      tags: ["项目", "管理", "敏捷"],
      createdAt: new Date(2024, 0, 13),
      updatedAt: new Date(2024, 0, 13),
      parentId: "1",
    },
    {
      id: "4",
      title: "React学习笔记",
      content: "React Hooks的使用让函数组件更加强大，useEffect、useState、useContext是最常用的几个Hook。",
      tags: ["React", "前端", "学习"],
      createdAt: new Date(2024, 0, 12),
      updatedAt: new Date(2024, 0, 12),
      parentId: "2",
    },
  ]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingThought, setEditingThought] = useState<Thought | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedThought, setSelectedThought] = useState<Thought | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'tree'>('list');
  const [selectedTreeNode, setSelectedTreeNode] = useState<TreeNode | null>(null);
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
        parentId: parentId || undefined,
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

  // 将思考列表转换为树形结构
  const buildTreeData = (): TreeNode[] => {
    const nodeMap: Record<string, TreeNode> = {};
    const rootNodes: TreeNode[] = [];
    
    // 首先创建所有节点
    thoughts.forEach(thought => {
      nodeMap[thought.id] = {
        id: thought.id,
        title: thought.title,
        type: thought.content ? 'item' : 'folder',
        content: thought.content,
        tags: thought.tags,
        children: [],
      };
    });
    
    // 然后建立父子关系
    thoughts.forEach(thought => {
      if (thought.parentId && nodeMap[thought.parentId]) {
        if (!nodeMap[thought.parentId].children) {
          nodeMap[thought.parentId].children = [];
        }
        nodeMap[thought.parentId].children!.push(nodeMap[thought.id]);
      } else {
        rootNodes.push(nodeMap[thought.id]);
      }
    });
    
    return rootNodes;
  };
  
  const treeData = buildTreeData();
  
  const handleTreeNodeSelect = (node: TreeNode) => {
    const thought = thoughts.find(t => t.id === node.id);
    if (thought) {
      setSelectedTreeNode(node);
    }
  };
  
  const handleAddTreeNode = (parentId: string | null) => {
    handleAddThought(parentId);
  };
  
  const handleEditTreeNode = (node: TreeNode) => {
    const thought = thoughts.find(t => t.id === node.id);
    if (thought) {
      handleEditThought(thought);
    }
  };
  
  const handleDeleteTreeNode = (nodeId: string) => {
    handleDeleteThought(nodeId);
  };

  return (
    <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
      {/* 标题栏 */}
      <Box sx={{ p: 2, borderBottom: "1px solid #eee" }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h5" fontWeight="bold">
              思考空间
            </Typography>
            <Typography variant="body2" color="text.secondary">
              记录你的思考和感悟
            </Typography>
          </Box>
          <Tabs value={viewMode} onChange={(_, newValue) => setViewMode(newValue)}>
            <Tab label="列表视图" value="list" />
            <Tab label="树状视图" value="tree" />
          </Tabs>
        </Box>
      </Box>

      {/* 内容区域 */}
      {viewMode === 'list' ? (
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
      ) : (
        <Grid container spacing={2} sx={{ flex: 1, p: 2, overflow: 'hidden' }}>
          {/* 左侧树状视图 */}
          <Grid item xs={4} sx={{ height: '100%' }}>
            <TreeView
              data={treeData}
              onAddNode={handleAddTreeNode}
              onEditNode={handleEditTreeNode}
              onDeleteNode={handleDeleteTreeNode}
              onSelectNode={handleTreeNodeSelect}
            />
          </Grid>
          
          {/* 右侧内容区域 */}
          <Grid item xs={8} sx={{ height: '100%' }}>
            <Paper 
              elevation={0} 
              sx={{ 
                height: '100%', 
                p: 2, 
                border: '1px solid #e0e0e0',
                borderRadius: 1,
                overflow: 'auto',
              }}
            >
              {selectedTreeNode ? (
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">{selectedTreeNode.title}</Typography>
                    <Box sx={{ ml: 2, display: 'flex', gap: 0.5 }}>
                      {selectedTreeNode.tags?.map((tag, index) => (
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
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="body1">
                    {selectedTreeNode.content || '没有内容'}
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                  <Description sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="body1" color="text.secondary">
                    选择一个思考项查看详情
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      )}


      {/* 添加按钮 */}
      <Box sx={{ position: "fixed", bottom: 80, right: 16, display: 'flex', flexDirection: 'column', gap: 1 }}>
        {viewMode === 'tree' && (
          <Fab
            size="small"
            color="secondary"
            aria-label="add folder"
            onClick={() => handleAddFolder(null)}
            sx={{
              backgroundColor: "#2196f3",
              "&:hover": {
                backgroundColor: "#1976d2",
              },
            }}
          >
            <Folder />
          </Fab>
        )}
        <Fab
          color="primary"
          aria-label="add"
          onClick={() => handleAddThought(null)}
          sx={{
            backgroundColor: "#ff9800",
            "&:hover": {
              backgroundColor: "#f57c00",
            },
          }}
        >
          <Add />
        </Fab>
      </Box>

      {/* 编辑对话框 */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingThought ? "编辑思考" : isAddingFolder ? "添加文件夹" : "添加思考"}
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
