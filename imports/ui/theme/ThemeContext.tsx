import React, { createContext, useState, useContext, useEffect } from "react";
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
  Theme,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import colors from "./colors";

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

export const useThemeContext = () => useContext(ThemeContext);

// 主题提供者组件属性
interface ThemeProviderProps {
  children: React.ReactNode;
}
// 统一设计令牌（Material You 风格 — 白底 + 深色重色系）
const designTokens = (mode: "light" | "dark") => {
  const isLight = mode === "light";

  // 使用用户指定的调色板（Alpine Oat 背景 + 强调色/辅助色）
  const {
    alpineOat,
    cherryRed,
    butterYellow,
    trueBlue,
    midnightBlue,
    dillGreen,
    neutralText,
    neutralSecondary,
    neutralLight,
  } = colors;

  const palette = {
    mode,
    // 主色调选择 Alpine Oat（以背景/卡片为主）
    primary: { main: alpineOat, contrastText: neutralText },
    // 强调色与辅助色
    secondary: { main: cherryRed, contrastText: "#fff" },
    info: { main: trueBlue, contrastText: "#fff" },
    warning: { main: butterYellow, contrastText: neutralText },
    success: { main: dillGreen, contrastText: "#fff" },
    background: {
      default: isLight ? alpineOat : "#061316",
      paper: isLight ? alpineOat : "#071018",
    },
    divider: isLight ? neutralLight : "rgba(255,255,255,0.06)",
    text: {
      primary: isLight ? neutralText : "#F8FAFC",
      secondary: isLight ? neutralSecondary : "#9CA3AF",
    },
  } as const;

  return {
    palette,
    shape: { borderRadius: 18 },
    typography: {
      fontFamily:
        '"Inter", "Segoe UI", Roboto, Helvetica, Arial, system-ui, sans-serif',
      h5: { fontWeight: 700 },
      h6: { fontWeight: 700 },
      subtitle1: { color: palette.text.secondary },
      button: { textTransform: "none", fontWeight: 600 },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: palette.background.default,
            color: palette.text.primary,
            fontSmooth: "antialiased",
            WebkitFontSmoothing: "antialiased",
            MozOsxFontSmoothing: "grayscale",
          },
        },
      },
      MuiAppBar: {
        defaultProps: { color: "transparent", elevation: 0 },
        styleOverrides: {
          root: {
            background: isLight ? "transparent" : "transparent",
            color: palette.text.primary,
            backdropFilter: "saturate(120%) blur(6px)",
            borderBottom: `1px solid ${palette.divider}`,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: palette.background.paper,
            borderRadius: 16,
            // Material You 风格的柔和投影，使用深色系作为泛光色
            boxShadow: isLight
              ? `0 10px 30px rgba(7,20,39,0.06), 0 2px 6px rgba(13,71,161,0.04)`
              : "0 10px 30px rgba(0,0,0,0.6)",
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            overflow: "visible",
            boxShadow: isLight
              ? `0 12px 36px rgba(7,20,39,0.06), 0 6px 18px rgba(13,71,161,0.06)`
              : "0 14px 40px rgba(2,6,23,0.6)",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 14,
            padding: "8px 14px",
          },
          containedPrimary: {
            backgroundColor: trueBlue,
            color: "#fff",
            boxShadow: "0 12px 36px rgba(19,125,197,0.12)",
          },
          containedSecondary: {
            backgroundColor: cherryRed,
            color: "#fff",
            boxShadow: "0 12px 36px rgba(211,47,47,0.12)",
          },
        },
      },
      MuiFab: {
        styleOverrides: {
          root: {
            boxShadow: "0 18px 48px rgba(19,125,197,0.16)",
            backgroundColor: trueBlue,
            color: "#fff",
          },
        },
      },
      MuiBottomNavigation: {
        styleOverrides: {
          root: {
            borderRadius: 999,
            background: isLight
              ? "rgba(255,255,255,0.96)"
              : "rgba(10,14,18,0.85)",
            boxShadow: isLight
              ? "0 12px 36px rgba(7,20,39,0.06)"
              : "0 12px 36px rgba(0,0,0,0.6)",
            padding: "6px 12px",
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: { backgroundColor: palette.divider },
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
