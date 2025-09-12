import React, { createContext, useState, useContext, useEffect } from "react";
import { ThemeProvider as MuiThemeProvider, Theme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import colors from "./colors";
import { lightTheme, darkTheme } from "./materialTheme";

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
// The app now uses centralized themes exported from materialTheme.ts
// lightTheme and darkTheme are created from the project's Material Theme Builder JSON.

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
  const theme = currentTheme === "dark" ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ themeMode, setThemeMode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
