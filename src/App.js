import React from "react";
import logo from "./logo.svg";
import "./App.css";
import "./App.less";
import "antd/dist/antd.less";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { createBrowserHistory } from "history";

const history = createBrowserHistory();
const LoginPage = React.lazy(() => import("./page/Login/LoginPage.js"));
const SingInPage = React.lazy(() => import("./page/Register/SingInPage.js"));
const PDF = React.lazy(() => import("./page/Pdf/index.js"));

const DefaultLayout = React.lazy(() => import("./Layout/DefaultLayout.js"));

function App() {
  return (
    <React.Suspense
      fallback={() => {
        return <span>Loading...</span>;
      }}
    >
      <Router history={history}>
        <Switch>
          <Route
            path="/login"
            name="Đăng nhập"
            render={(props) => <LoginPage {...props} />}
          />
          <Route
            path="/register"
            name="Đăng kí"
            render={(props) => <SingInPage {...props} />}
          />
          <Route
            path="/pdf/import/:id"
            name="PDF"
            render={(props) => <PDF {...props} />}
          />
          <Route
            path="/"
            name="Trang chủ"
            render={(props) => <DefaultLayout {...props} />}
          />
        </Switch>
      </Router>
    </React.Suspense>
  );
}

export default App;
