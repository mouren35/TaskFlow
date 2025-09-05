// SearchPage.tsx
// 搜索页面

import React, { useState } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Divider,
  useTheme,
  Button,
} from "@mui/material";
import {
  Search,
  Clear,
  AccessTime,
  Category,
  History,
} from "@mui/icons-material";

interface SearchResult {
  id: string;
  title: string;
  category: string;
  completed: boolean;
  date: string;
}

interface SearchHistory {
  id: string;
  query: string;
  timestamp: Date;
}

const categoryColors = {
  未分类: "#9e9e9e",
  人际: "#f44336",
  心智: "#2196f3",
  健康: "#4caf50",
  工作: "#9c27b0",
  兴趣: "#ff9800",
};

const SearchPage: React.FC = () => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults] = useState<SearchResult[]>([
    {
      id: "1",
      title: "完成需求文档",
      category: "工作",
      completed: false,
      date: "2024-01-15",
    },
    {
      id: "2",
      title: "健身训练",
      category: "健康",
      completed: true,
      date: "2024-01-16",
    },
    {
      id: "3",
      title: "阅读技术文章",
      category: "心智",
      completed: false,
      date: "2024-01-17",
    },
  ]);
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([
    {
      id: "1",
      query: "工作",
      timestamp: new Date(2024, 0, 15),
    },
    {
      id: "2",
      query: "健康",
      timestamp: new Date(2024, 0, 14),
    },
  ]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const newHistory: SearchHistory = {
        id: Date.now().toString(),
        query: query.trim(),
        timestamp: new Date(),
      };
      setSearchHistory(prev => [newHistory, ...prev.slice(0, 9)]);
    }
  };

  const handleClearHistory = () => {
    setSearchHistory([]);
  };

  const handleClearQuery = () => {
    setSearchQuery("");
  };

  return (
    <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
      {/* 搜索栏 */}
      <AppBar position="static" elevation={0} sx={{ background: "#fff", color: "#000" }}>
        <Toolbar sx={{ px: 1 }}>
          <TextField
            placeholder="搜索任务、分类..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSearch(searchQuery);
              }
            }}
            variant="outlined"
            size="small"
            fullWidth
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: "#666" }} />,
              endAdornment: searchQuery && (
                <IconButton size="small" onClick={handleClearQuery}>
                  <Clear />
                </IconButton>
              ),
            }}
            sx={{
              mr: 1,
              "& .MuiOutlinedInput-root": {
                borderRadius: 20,
                background: "#f5f5f5",
                border: "none",
                "& fieldset": { border: "none" },
              },
            }}
          />
        </Toolbar>
      </AppBar>

      {/* 搜索结果 */}
      <Box sx={{ flex: 1, overflow: "auto" }}>
        {searchQuery ? (
          <Box>
            <Typography variant="h6" sx={{ p: 2, pb: 1 }}>
              搜索结果 ({searchResults.length})
            </Typography>
            <List>
              {searchResults.map((result) => (
                <ListItem
                  key={result.id}
                  sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#f5f5f5' } }}
                >
                  <ListItemIcon>
                    <Category
                      sx={{
                        color: categoryColors[result.category as keyof typeof categoryColors],
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={result.title}
                    secondary={
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Chip
                          label={result.category}
                          size="small"
                          sx={{
                            backgroundColor: categoryColors[result.category as keyof typeof categoryColors],
                            color: "#fff",
                            height: 20,
                            fontSize: "0.75rem",
                          }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {result.date}
                        </Typography>
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Typography variant="caption" color="text.secondary">
                      {result.completed ? "已完成" : "待完成"}
                    </Typography>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Box>
        ) : (
          <Box>
            <Typography variant="h6" sx={{ p: 2, pb: 1 }}>
              搜索历史
            </Typography>
            <List>
              {searchHistory.map((history) => (
                <ListItem
                  key={history.id}
                  onClick={() => {
                    setSearchQuery(history.query);
                    handleSearch(history.query);
                  }}
                  sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#f5f5f5' } }}
                >
                  <ListItemIcon>
                    <History sx={{ color: "#666" }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={history.query}
                    secondary={
                      <Typography variant="caption" color="text.secondary">
                        {history.timestamp.toLocaleDateString()}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
            {searchHistory.length > 0 && (
              <Box sx={{ p: 2 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  color="secondary"
                  onClick={handleClearHistory}
                  startIcon={<Clear />}
                >
                  清空搜索历史
                </Button>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default SearchPage;
