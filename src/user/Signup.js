import React, { Component } from "react";
import { signup } from "../auth";

class Signup extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      password: "",
      error: "",
    };
  }

  handleChange = (name) => (event) => {
    // console.log(name);
    // console.log(event.target.value);
    this.setState({ error: "" });
    this.setState({ [name]: event.target.value });
  };

  isValid = () => {
    const { name, email, password } = this.state;

    if (name.length === 0) {
      this.setState({ error: "Name is required" });
      return false;
    }
    if (email.length === 0) {
      this.setState({ error: "Email is required" });
      return false;
    }
    if (
      !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
        email
      )
    ) {
      this.setState({ error: "a valid Email is required" });
      return false;
    }
    if (password.length === 0) {
      this.setState({ error: "Password is required" });
      return false;
    }
    return true;
  };

  clickSubmit = (event) => {
    event.preventDefault();
    if (this.isValid()) {
      const { name, email, password } = this.state;
      const user = {
        name: name,
        email: email,
        password: password,
      };

      signup(user).then((data) => {
        if (data.error) {
          this.setState({ error: data.error });
        } else {
          this.setState({
            name: "",
            email: "",
            password: "",
            error: "",
            message: data.message,
          });
        }
      });
    }
  };

  signupForm = (name, email, password) => (
    <form>
      <div className="form-group">
        <label className="text-muted">Name</label>
        <input
          onChange={this.handleChange("name")}
          type="text"
          className="form-control"
          value={name}
        />
      </div>
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
      <button onClick={this.clickSubmit} className="btn btn-raised btn-primary">
        SUMBIT
      </button>
    </form>
  );

  render() {
    const { name, email, password, error, message } = this.state;
    return (
      <div className="container">
        <h2 className="mt-5 mb-5">Sign Up</h2>
        <div
          className={error ? "alert alert-danger" : "alert alert-info"}
          style={{ display: error || message ? "" : "none" }}
        >
          {error ? error : message}
        </div>
        {this.signupForm(name, email, password)}
      </div>
    );
  }
}

export default Signup;
