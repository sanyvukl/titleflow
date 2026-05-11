import React from "react";
import ReactDOM from "react-dom/client";
import {BrowserRouter} from "react-router";
import {Provider} from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import appTheme from "./theme/theme";

import App from "./App";
import "./index.css";
import {store} from "./store/store";


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
      <Provider store={store}>
          <ThemeProvider theme={appTheme}>
              <CssBaseline />
              <BrowserRouter>
                <App />
              </BrowserRouter>
          </ThemeProvider>
      </Provider>
  </React.StrictMode>
);