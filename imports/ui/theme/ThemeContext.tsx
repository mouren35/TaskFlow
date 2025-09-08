import React, { createContext, useState, useContext, useEffect } from "react";
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
  Theme,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// 定义主题类型
type ThemeMode = "light" | "dark" | "system";

// 定义上下文类型
interface ThemeContextType {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

// 创建上下文
const ThemeContext = createContext<ThemeContextType>({
  themeMode: "light",
  setThemeMode: () => {},
  toggleTheme: () => {},
});

// 自定义钩子，方便组件使用主题上下文
export const useThemeContext = () => useContext(ThemeContext);

// 主题提供者组件属性
interface ThemeProviderProps {
  children: React.ReactNode;
}

// 统一设计令牌（新主题）
const designTokens = (mode: "light" | "dark") => {
  const isLight = mode === "light";

  return {
    palette: {
      mode,
      primary: {
        // Indigo 500/400
        main: isLight ? "#6366F1" : "#8B8EF6",
        contrastText: "#ffffff",
      },
      secondary: {
        // Emerald 500/400
        main: isLight ? "#22C55E" : "#34D399",
        contrastText: "#ffffff",
      },
      background: {
        default: isLight ? "#f7f7fb" : "#0f172a", // slate-900
        paper: isLight ? "#ffffff" : "#111827", // near slate-800
      },
      divider: isLight ? "rgba(15,23,42,0.08)" : "rgba(255,255,255,0.12)",
      text: {
        primary: isLight ? "#0f172a" : "#e5e7eb",
        secondary: isLight ? "#475569" : "#cbd5e1",
      },
    },
    shape: {
      borderRadius: 12,
    },
    typography: {
      fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, system-ui, sans-serif',
      h5: { fontWeight: 700 },
      h6: { fontWeight: 700 },
      button: { textTransform: "none", fontWeight: 600 },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            scrollbarWidth: "thin",
            "&::-webkit-scrollbar": { width: "6px", height: "6px" },
            "&::-webkit-scrollbar-track": {
              background: isLight ? "#eef2ff" : "#0b1222",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: isLight ? "#c7d2fe" : "#334155",
              borderRadius: "3px",
            },
          },
        },
      },
      MuiAppBar: {
        defaultProps: { color: "primary" },
        styleOverrides: {
          root: {
            boxShadow: isLight
              ? "0 2px 8px rgba(15,23,42,0.06)"
              : "0 2px 8px rgba(0,0,0,0.5)",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            transition: "background-color .2s ease, box-shadow .2s ease",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: { borderRadius: 10 },
        },
      },
      MuiBottomNavigation: {
        styleOverrides: {
          root: {
            backgroundColor: isLight ? "#ffffff" : "#111827",
            borderTop: `1px solid ${isLight ? "rgba(15,23,42,0.08)" : "rgba(255,255,255,0.12)"}`,
          },
        },
      },
    },
  } as const;
};

// 主题配置
const getTheme = (mode: "light" | "dark"): Theme => {
  const tokens = designTokens(mode);
  return createTheme(tokens as any);
};

// 主题提供者组件
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // 从本地存储获取主题模式，默认为浅色模式
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    const savedMode = localStorage.getItem("themeMode");
    return (savedMode as ThemeMode) || "light";
  });

  // 根据系统偏好设置主题
  const [systemTheme, setSystemTheme] = useState<"light" | "dark">("light");

  // 监听系统主题变化
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? "dark" : "light");
    };

    // 初始化系统主题
    setSystemTheme(mediaQuery.matches ? "dark" : "light");

    // 添加监听器
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    } else {
      // 兼容旧版浏览器
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  // 保存主题模式到本地存储
  useEffect(() => {
    localStorage.setItem("themeMode", themeMode);
  }, [themeMode]);

  // 切换主题模式（仅在浅色/深色之间切换）
  const toggleTheme = () => {
    setThemeMode((prev) => (prev === "dark" ? "light" : "dark"));
  };

  // 确定当前使用的主题
  const currentTheme = themeMode === "system" ? systemTheme : themeMode;
  const theme = getTheme(currentTheme);

  return (
    <ThemeContext.Provider value={{ themeMode, setThemeMode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
