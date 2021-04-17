import React, { Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import { signout, isAuthenticated } from "../auth";

const isActive = (history, path) => {
  if (history.location.pathname === path) return { color: "#ff9900" };
  else return { color: "#ffffff" };
};

const Menu = ({ history }) => {
  return (
    <div>
      <ul className="nav nav-tabs bg-primary">
        <li className="nav-item">
          <Link className="nav-link" style={isActive(history, "/")} to="/">
            Home
          </Link>
        </li>
        <li className="nav-item">
          <Link
            className="nav-link"
            to="/users"
            style={isActive(history, `/users`)}
          >
            USERS
          </Link>
        </li>
        {!isAuthenticated() && (
          <Fragment>
            <li className="nav-item">
              <Link
                className="nav-link"
                style={isActive(history, "/signin")}
                to="/signin"
              >
                Sign In
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                style={isActive(history, "/signup")}
                to="/signup"
              >
                Sign Up
              </Link>
            </li>
          </Fragment>
        )}
        {isAuthenticated() && (
          <Fragment>
            <li className="nav-item">
              <Link
                className="nav-link"
                to={`/user/${isAuthenticated().user.id}`}
                style={isActive(history, `/user/${isAuthenticated().user.id}`)}
              >
                {`${isAuthenticated().user.name}'s Profile`}
              </Link>
            </li>
            <li className="nav-item">
              <span
                className="nav-link"
                style={
                  (isActive(history, "/signout"),
                  { cursor: "pointer", color: "#ffffff" })
                }
                onClick={() =>
                  signout(() => {
                    history.push("/signin");
                  })
                }
              >
                Sign Out
              </span>
            </li>
          </Fragment>
        )}
      </ul>
    </div>
  );
};

export default withRouter(Menu);
