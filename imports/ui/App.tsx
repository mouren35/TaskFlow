import React from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import PlanPage from "./pages/PlanPage";
import SchedulePage from "./pages/SchedulePage";
import ThinkPage from "./pages/ThinkPage";
import MyPage from "./pages/MyPage";
import PendingPage from "./pages/PendingPage";
import SearchPage from "./pages/SearchPage";
import TaskDetailPage from "./pages/TaskDetailPage";
import ErrorPage from "./components/ErrorPage";
import BottomNav from "./components/BottomNav";
import Box from "@mui/material/Box";
import { ThemeProvider } from "./theme/ThemeContext";

export const App = () => (
  <ThemeProvider>
    <BrowserRouter>
      <Box
        sx={{
          height: "100vh",
          width: "100vw",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          boxSizing: "border-box",
          margin: 0,
          padding: 0,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{ flex: 1, overflow: "auto", pb: { xs: 9, sm: 9, md: 9 }, pt: 0 }}
        >
          <Switch>
            <Route exact path="/" render={() => <Redirect to="/plan" />} />
            <Route path="/plan" component={PlanPage} />
            <Route path="/schedule" component={SchedulePage} />
            <Route path="/think" component={ThinkPage} />
            <Route path="/my" component={MyPage} />
            <Route path="/pending" component={PendingPage} />
            <Route path="/search" component={SearchPage} />
            <Route path="/task/:id" component={TaskDetailPage} />
            <Route component={ErrorPage} />
          </Switch>
        </Box>
        <BottomNav />
      </Box>
    </BrowserRouter>
  </ThemeProvider>
);
