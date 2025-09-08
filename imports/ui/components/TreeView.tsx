import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Collapse,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
} from '@mui/material';
import {
  ExpandMore,
  ChevronRight,
  Folder,
  Description,
  Add,
  Edit,
  Delete,
} from '@mui/icons-material';

export interface TreeNode {
  id: string;
  title: string;
  type: 'folder' | 'item';
  children?: TreeNode[];
  content?: string;
  tags?: string[];
}

interface TreeViewProps {
  data: TreeNode[];
  onAddNode: (parentId: string | null) => void;
  onEditNode: (node: TreeNode) => void;
  onDeleteNode: (nodeId: string) => void;
  onSelectNode: (node: TreeNode) => void;
}

const TreeView: React.FC<TreeViewProps> = ({
  data,
  onAddNode,
  onEditNode,
  onDeleteNode,
  onSelectNode,
}) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleExpand = (nodeId: string) => {
    setExpanded(prev => ({
      ...prev,
      [nodeId]: !prev[nodeId],
    }));
  };

  const renderTreeNodes = (nodes: TreeNode[], level = 0) => {
    return nodes.map(node => {
      const isExpanded = expanded[node.id] || false;
      const hasChildren = node.children && node.children.length > 0;

      return (
        <React.Fragment key={node.id}>
          <ListItem
            sx={{
              pl: level * 2 + 1,
              py: 0.5,
              '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
              '&:hover .node-actions': { opacity: 1 },
            }}
          >
            {node.type === 'folder' && (
              <ListItemIcon sx={{ minWidth: 36 }} onClick={() => toggleExpand(node.id)}>
                {hasChildren ? (
                  isExpanded ? (
                    <ExpandMore fontSize="small" />
                  ) : (
                    <ChevronRight fontSize="small" />
                  )
                ) : (
                  <Box sx={{ width: 24 }} />
                )}
              </ListItemIcon>
            )}

            <ListItemIcon sx={{ minWidth: 36 }}>
              {node.type === 'folder' ? (
                <Folder fontSize="small" sx={{ color: '#FFA000' }} />
              ) : (
                <Description fontSize="small" sx={{ color: '#2196F3' }} />
              )}
            </ListItemIcon>

            <ListItemText
              primary={
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: node.type === 'folder' ? 'medium' : 'normal',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                  onClick={() => onSelectNode(node)}
                >
                  {node.title}
                </Typography>
              }
            />

            <Box
              className="node-actions"
              sx={{
                display: 'flex',
                opacity: 0,
                transition: 'opacity 0.2s',
              }}
            >
              {node.type === 'folder' && (
                <IconButton
                  size="small"
                  onClick={() => onAddNode(node.id)}
                  sx={{ p: 0.5 }}
                >
                  <Add fontSize="small" />
                </IconButton>
              )}
              <IconButton
                size="small"
                onClick={() => onEditNode(node)}
                sx={{ p: 0.5 }}
              >
                <Edit fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => onDeleteNode(node.id)}
                sx={{ p: 0.5 }}
              >
                <Delete fontSize="small" />
              </IconButton>
            </Box>
          </ListItem>

          {node.type === 'folder' && hasChildren && (
            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {renderTreeNodes(node.children, level + 1)}
              </List>
            </Collapse>
          )}
        </React.Fragment>
      );
    });
  };

  return (
    <Paper
      elevation={0}
      sx={{
        border: '1px solid #e0e0e0',
        borderRadius: 1,
        height: '100%',
        overflow: 'auto',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1, borderBottom: '1px solid #e0e0e0' }}>
        <Typography variant="subtitle2" fontWeight="medium">
          思考结构
        </Typography>
        <IconButton size="small" onClick={() => onAddNode(null)}>
          <Add fontSize="small" />
        </IconButton>
      </Box>
      <List dense disablePadding>
        {renderTreeNodes(data)}
      </List>
    </Paper>
  );
};

export default TreeView;