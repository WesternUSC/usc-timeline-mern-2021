import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import Button from "../../components/FormElements/Button";
import "./NavLinks.css";
import { AuthContext } from "../../context/auth-context";

const NavLinks = (props) => {
  const auth = useContext(AuthContext);

  return (
    <ul className="nav-links">
      {!auth.isLoggedIn && (
        <>
          <li>
            <NavLink to="/search">SEARCH</NavLink>
          </li>
          <li>
            <NavLink to="/auth">SIGN IN</NavLink>
          </li>
        </>
      )}

      {auth.isLoggedIn && auth.userId === "60a5430a404e9f49781467ef" && (
        <li>
          <NavLink to="/users">USERS</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <NavLink to="/events">EVENTS</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <NavLink to="/events/new">ADD EVENT</NavLink>
        </li>
      )}

      {auth.isLoggedIn && (
        <li>
          <Button inverse onClick={auth.logout}>
            SIGN OUT
          </Button>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
