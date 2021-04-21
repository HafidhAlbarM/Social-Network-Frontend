import React, { Component } from "react";
import { findpeople } from "./apiUser";
import Ava from "../images/ava.png";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../auth";
import { follow } from "../user/apiUser";

class FindPeople extends Component {
  constructor() {
    super();
    this.state = {
      users: [],
      error: "",
      open: false,
      followMessage: "",
    };
  }

  componentDidMount = () => {
    const userId = isAuthenticated().user.id;
    const token = isAuthenticated().token;

    findpeople(userId, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ users: data });
      }
    });
  };

  clickFollow = (user, index) => {
    const userId = isAuthenticated().user.id;
    const token = isAuthenticated().token;

    follow(userId, token, user.id).then((data) => {
      if (data.error) {
        this.setState({ error: data.error });
      } else {
        let toFollow = this.state.users;
        toFollow.splice(index, 1);
        this.setState({
          users: toFollow,
          open: true,
          followMessage: `Following ${user.name}`,
        });
      }
    });
  };

  renderUsers = (users) => {
    return (
      <div className="row">
        {users.map((user, index) => (
          <div className="card col-md-4" key={index}>
            <div className="card-body">
              <img
                style={{ height: "200px", width: "auto" }}
                className="img-thumbnail"
                src={`${process.env.REACT_APP_API_URL}/user/photo/${user.id}`}
                onError={(i) => (i.target.src = `${Ava}`)}
                alt={user.id}
              />
              <h5 className="card-title">{user.name}</h5>
              <p className="card-text">{user.email}</p>
              <Link
                to={`user/${user.id}`}
                key={index}
                exact={`user/${user.id}`}
                className="btn btn-raised btn-primary btn-sm"
              >
                View Profile
              </Link>
              <button
                onClick={() => this.clickFollow(user, index)}
                className="btn btn-raised btn-info float-right"
              >
                Follow
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  render() {
    const { users, open, followMessage } = this.state;
    return (
      <div className="container">
        <h2 className="mt-5 mb-5">Users</h2>

        {open && (
          <div className="alert alert-success">
            <p>{followMessage}</p>
          </div>
        )}

        {this.renderUsers(users)}
      </div>
    );
  }
}

export default FindPeople;
