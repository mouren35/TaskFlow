// ErrorPage.tsx
// 错误页面组件

import React from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import { ErrorOutline, Home } from "@mui/icons-material";

const ErrorPage: React.FC = () => {
  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 3,
      }}
    >
      <Paper
        elevation={0}
        sx={(theme) => ({
          p: 4,
          textAlign: "center",
          maxWidth: 400,
          background: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
        })}
      >
        <ErrorOutline sx={{ fontSize: 64, color: "error.main", mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          页面未找到
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          抱歉，您访问的页面不存在或已被删除。
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Home />}
          href="/plan"
          sx={{ textTransform: "none" }}
        >
          返回首页
        </Button>
      </Paper>
    </Box>
  );
};

export default ErrorPage;
