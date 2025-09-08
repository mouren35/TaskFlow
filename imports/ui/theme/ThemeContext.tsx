import React, { createContext, useState, useContext, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme, Theme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// 定义主题类型
type ThemeMode = 'light' | 'dark' | 'system';

// 定义上下文类型
interface ThemeContextType {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

// 创建上下文
const ThemeContext = createContext<ThemeContextType>({
  themeMode: 'light',
  setThemeMode: () => {},
  toggleTheme: () => {},
});

// 自定义钩子，方便组件使用主题上下文
export const useThemeContext = () => useContext(ThemeContext);

// 主题提供者组件属性
interface ThemeProviderProps {
  children: React.ReactNode;
}

// 主题配置
const getTheme = (mode: 'light' | 'dark'): Theme => {
  // 定义颜色变量
  const primaryColor = '#ff9800'; // 橙色作为主色调
  const secondaryColor = '#2196f3'; // 蓝色作为次要色调
  
  return createTheme({
    palette: {
      mode,
      primary: {
        main: primaryColor,
        ...(mode === 'dark' && {
          main: '#ffb74d', // 深色模式下使用稍亮的橙色
        }),
      },
      secondary: {
        main: secondaryColor,
        ...(mode === 'dark' && {
          main: '#64b5f6', // 深色模式下使用稍亮的蓝色
        }),
      },
      background: {
        default: mode === 'light' ? '#fafafa' : '#121212',
        paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h5: {
        fontWeight: 600,
      },
      h6: {
        fontWeight: 600,
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            scrollbarWidth: 'thin',
            '&::-webkit-scrollbar': {
              width: '6px',
              height: '6px',
            },
            '&::-webkit-scrollbar-track': {
              background: mode === 'light' ? '#f1f1f1' : '#2d2d2d',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: mode === 'light' ? '#c1c1c1' : '#6b6b6b',
              borderRadius: '3px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: mode === 'light' ? '#a8a8a8' : '#848484',
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'light' ? '#ffffff' : '#1e1e1e',
            color: mode === 'light' ? '#333333' : '#ffffff',
            boxShadow: mode === 'light' 
              ? '0 1px 3px rgba(0,0,0,0.12)' 
              : '0 1px 3px rgba(0,0,0,0.5)',
          },
        },
      },
      MuiBottomNavigation: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'light' ? '#ffffff' : '#1e1e1e',
            borderTop: `1px solid ${mode === 'light' ? '#e0e0e0' : '#333333'}`,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            boxShadow: mode === 'light' 
              ? '0 1px 3px rgba(0,0,0,0.12)' 
              : '0 1px 3px rgba(0,0,0,0.5)',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: mode === 'light' 
              ? '0 1px 3px rgba(0,0,0,0.12)' 
              : '0 1px 3px rgba(0,0,0,0.5)',
          },
        },
      },
    },
  });
};

// 主题提供者组件
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // 从本地存储获取主题模式，默认为浅色模式
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    const savedMode = localStorage.getItem('themeMode');
    return (savedMode as ThemeMode) || 'light';
  });

  // 根据系统偏好设置主题
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light');

  // 监听系统主题变化
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    // 初始化系统主题
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light');

    // 添加监听器
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      // 兼容旧版浏览器
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  // 保存主题模式到本地存储
  useEffect(() => {
    localStorage.setItem('themeMode', themeMode);
  }, [themeMode]);

  // 切换主题模式
  const toggleTheme = () => {
    setThemeMode(prev => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'system';
      return 'light';
    });
  };

  // 确定当前使用的主题
  const currentTheme = themeMode === 'system' ? systemTheme : themeMode;
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