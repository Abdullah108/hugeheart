import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { ToastContainer, Zoom } from "react-toastify";
import { renderRoutes } from "react-router-config";
import "./App.scss";
import { AppRoutes, env } from "./config";
import FullPageLoader from "./containers/Loader/FullPageLoader";
import "react-toastify/dist/ReactToastify.css";
import "flatpickr/dist/themes/dark.css";
import "@fullcalendar/core/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";

// Containers
const DefaultLayout = React.lazy(() => import("./containers/DefaultLayout"));

// Pages
const Login = React.lazy(() => import("./views/Pages/Login/Login"));
const Page404 = React.lazy(() => import("./views/Pages/Page404/Page404"));

class App extends Component {
  render() {
    return (
      <BrowserRouter basename={env === "development" ? "/" : "/"}>
        <React.Suspense fallback={<FullPageLoader />}>
          <Switch>
            <Route
              exact
              path={AppRoutes.LOGIN}
              name="Login Page"
              render={(props) => <Login {...props} />}
            />
            <Route
              exact
              path="/404"
              name="Page 404"
              render={(props) => <Page404 {...props} />}
            />
            <Route
              path={AppRoutes.MAIN}
              name="Home"
              render={(props) => <DefaultLayout {...props} />}
            />
          </Switch>
          <ToastContainer
            newestOnTop
            draggable={false}
            autoClose={8000}
            hideProgressBar
            transition={Zoom}
            closeButton={false}
          />
        </React.Suspense>
      </BrowserRouter>
    );
  }
}

export default App;
