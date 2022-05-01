import React from "react";
import { Link } from "react-router-dom";

import "./Button.css";

const Button = (props) => {
  if (props.href) {
    return (
      <a
        className={`event-button event-button--${props.size || "default"} ${
          props.inverse && "event-button--inverse"
        } ${props.danger && "event-button--danger"}`}
        href={props.href}
      >
        {props.children}
      </a>
    );
  }
  if (props.to) {
    return (
      <Link
        to={props.to}
        exact={props.exact}
        className={`event-button event-button--${props.size || "default"} ${
          props.inverse && "event-button--inverse"
        } ${props.danger && "event-button--danger"} ${
          props.create && "event-button--create"
        }`}
      >
        {props.children}
      </Link>
    );
  }
  return (
    <button
      className={`event-button button--${props.size || "default"} ${
        props.inverse && "event-button--inverse"
      } ${props.danger && "event-button--danger"}`}
      type={props.type}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
};

export default Button;
