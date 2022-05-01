import React from "react";
import "./MainNavigation.css";
import MainHeader from "./MainHeader";
import NavLinks from "./NavLinks";
import { Link } from "react-router-dom";
import Logo from "../../../icons/usc_logo.png";

const MainNagivation = (props) => {
  return (
    <MainHeader>
      <Link to="/">
        <img
          className="main-navigation__title"
          alt="usc-logo"
          style={{ height: 90, padding: 10, paddingLeft: 40 }}
          src={Logo}
        />
      </Link>

      <nav className="main-navigation__header-nav" style={{ paddingRight: 40 }}>
        <NavLinks />
      </nav>
    </MainHeader>
  );
};

export default MainNagivation;
