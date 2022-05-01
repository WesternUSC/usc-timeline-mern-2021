import React from "react";
import "bootstrap-css-only/css/bootstrap.min.css";
import "mdbreact/dist/css/mdb.css";
import "./App.css";
import USCTimeline from "./components/USCTimeline";
import BadgeRow from "./components/BadgeRow";
import Events from "./events/pages/Events";
import Search from "./events/pages/Search";
import NewEvent from "./events/pages/NewEvent";
import UpdateEvent from "./events/pages/UpdateEvent";
import Auth from "./user/Auth";
import Users from "./user/Users";
import NewUser from "./user/NewUser";
import { AuthContext } from "./shared/context/auth-context";
import { useAuth } from "./shared/hooks/auth-hook";
import Footer from "./components/Footer";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import MainNagivation from "./shared/components/Navigation/MainNagivation";

function App() {
  let schoolIconStyles = { background: "#c7b0e8" };
  let cultureIconStyles = { background: "#e7c7b0" };
  let statsIconStyles = { background: "#b0e7c7" };

  const { token, login, logout, userId } = useAuth();

  let routes;

  if (token) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <h1 style={{ fontWeight: "bold" }} className="title">
            USC Timeline
          </h1>
          <BadgeRow />
          <USCTimeline
            schoolIconStyles={schoolIconStyles}
            cultureIconStyles={cultureIconStyles}
            statsIconStyles={statsIconStyles}
          />
          <Footer />
        </Route>
        <Route path="/users" exact>
          <Users />
        </Route>
        <Route path="/users/new" exact>
          <NewUser />
        </Route>
        <Route path="/events" exact>
          <Events />
          <Footer />
        </Route>
        <Route path="/events/new" exact>
          <NewEvent />
          <Footer />
        </Route>
        <Route path="/events/:eventId">
          <UpdateEvent />
          <Footer />
        </Route>
        <Redirect to="/events" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <h1 style={{ fontWeight: "bold" }} className="title">
            USC Timeline
          </h1>
          <BadgeRow />
          <USCTimeline
            schoolIconStyles={schoolIconStyles}
            cultureIconStyles={cultureIconStyles}
            statsIconStyles={statsIconStyles}
          />
          <Footer />
        </Route>
        <Route path="/search">
          <Search />
          <Footer />
        </Route>
        <Route path="/auth">
          <Auth />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  }

  return (
    <div>
      <AuthContext.Provider
        value={{
          isLoggedIn: !!token,
          token: token,
          userId: userId,
          login: login,
          logout: logout,
        }}
      >
        <Router>
          <MainNagivation />
          <main>{routes}</main>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
