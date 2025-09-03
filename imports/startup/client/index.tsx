import React from "react";
import { createRoot } from "react-dom/client";
import { Meteor } from "meteor/meteor";
import { App } from "../../ui/App";
import "../../ui/main.css";

// Mount basic App if client entry is used directly
Meteor.startup(() => {
  const el =
    document.getElementById("react-target") || document.getElementById("app");
  if (el) {
    const root = createRoot(el);
    root.render(React.createElement(App));
  }
});
