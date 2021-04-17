import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { signin, authenticate } from "../auth/";

class Signin extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      error: "",
      redirectToReferer: false,
      loading: false,
    };
  }

  handleChange = (name) => (event) => {
    // console.log(name);
    // console.log(event.target.value);
    this.setState({ error: "" });
    this.setState({ [name]: event.target.value });
  };

  clickSubmit = (event) => {
    event.preventDefault();
    this.setState({ loading: true });
    const { email, password } = this.state;
    const user = {
      email: email,
      password: password,
    };

    signin(user).then((data) => {
      if (data.error) {
        this.setState({ error: data.error, loading: false });
      } else {
        authenticate(data, () => {
          this.setState({ redirectToReferer: true });
        });
      }
    });
  };

  render() {
    const {
      email,
      password,
      error,
      message,
      redirectToReferer,
      loading,
    } = this.state;

    if (redirectToReferer) {
      return <Redirect to="/" />;
    }

    return (
      <div className="container">
        <h2 className="mt-5 mb-5">Sign In</h2>
        <div
          className={error ? "alert alert-danger" : "alert alert-info"}
          style={{ display: error || message ? "" : "none" }}
        >
          {error ? error : message}
        </div>

        {loading ? (
          <div className="jumbrotron text-center">
            <h2>Loading...</h2>
          </div>
        ) : (
          ""
        )}

        <form>
          <div className="form-group">
            <label className="text-muted">Email</label>
            <input
              onChange={this.handleChange("email")}
              type="email"
              className="form-control"
              value={email}
            />
          </div>
          <div className="form-group">
            <label className="text-muted">Password</label>
            <input
              onChange={this.handleChange("password")}
              type="password"
              className="form-control"
              value={password}
            />
          </div>
          <button
            onClick={this.clickSubmit}
            className="btn btn-raised btn-primary"
          >
            SUMBIT
          </button>
        </form>
      </div>
    );
  }
}

export default Signin;
