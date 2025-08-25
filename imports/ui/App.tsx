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

export const App = () => (
  <BrowserRouter>
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <div style={{ flex: 1 }}>
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
      </div>
      <BottomNav />
    </div>
  </BrowserRouter>
);
