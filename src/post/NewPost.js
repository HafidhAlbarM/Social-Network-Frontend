import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { isAuthenticated } from "../auth";
import { create } from "./apiPost";
import PostImage from "../images/post.jpg";

class NewPost extends Component {
  constructor() {
    super();
    this.state = {
      title: "",
      body: "",
      error: "",
      loading: false,
      fileSize: 0,
      redirectToProfile: false,
    };
  }

  componentDidMount() {
    this.userData = new FormData();
  }

  handleChange = (name) => (event) => {
    // console.log(name);
    // console.log(event.target.value)
    this.setState({
      error: "",
      loading: false,
    });

    const value = name === "photo" ? event.target.files[0] : event.target.value;
    const fileSize = name === "photo" ? event.target.files[0].size : 0;

    this.userData.set(name, value);
    this.setState({
      [name]: value,
      fileSize,
    });
  };

  isValid = () => {
    const { title, body, fileSize } = this.state;

    if (fileSize >= 1250000) {
      this.setState({ error: "File size should be less than 10MB" });
      return false;
    }
    if (title.length === 0) {
      this.setState({ error: "Title is required", loading: false });
      return false;
    }
    if (body.length === 0) {
      this.setState({ error: "Body is required", loading: false });
      return false;
    }
    if (title != null && title.length > 80) {
      this.setState({ error: "Title cannot more than 80 characters" });
      return false;
    }
    if (body != null && title.length > 2000) {
      this.setState({ error: "Body cannot more than 2000 characters" });
      return false;
    }
    return true;
  };

  clickSubmit = (event) => {
    event.preventDefault();
    this.setState({ loading: true });

    if (this.isValid()) {
      const userId = isAuthenticated().user.id;
      const token = isAuthenticated().token;

      create(userId, token, this.userData).then((data) => {
        if (data.error) {
          this.setState({ error: data.error });
        } else {
          console.log("berhasil");
          this.setState({
            redirectToProfile: true,
          });
        }
      });
    }
  };

  signupForm = (title, body) => (
    <form>
      <div className="form-group">
        <label className="text-muted">Photo</label>
        <input
          onChange={this.handleChange("photo")}
          type="file"
          accept="image/*"
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Title</label>
        <input
          onChange={this.handleChange("title")}
          type="text"
          className="form-control"
          value={title}
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Body</label>
        <input
          onChange={this.handleChange("body")}
          type="text"
          className="form-control"
          value={body}
        />
      </div>

      <button onClick={this.clickSubmit} className="btn btn-raised btn-primary">
        POST
      </button>
    </form>
  );

  render() {
    const { title, body, error, loading, redirectToProfile } = this.state;

    if (redirectToProfile) {
      return <Redirect to={`/user/${isAuthenticated().user.id}`} />;
    }

    // const photoUrl = id
    //   ? `${
    //       process.env.REACT_APP_API_URL
    //     }/user/photo/${id}?${new Date().getTime()}`
    //   : PostImage;

    return (
      <div className="container">
        <h2 className="mt-5 mb-5">Create New Post</h2>
        <div
          className="alert alert-danger"
          style={{ display: error ? "" : "none" }}
        >
          {error}
        </div>

        {loading ? (
          <div className="jumbrotron text-center">
            <h2>Loading...</h2>
          </div>
        ) : (
          ""
        )}

        <img
          style={{ height: "200px", width: "auto" }}
          className="img-thumbnail"
          src={PostImage}
          alt={title}
        />

        {this.signupForm(title, body)}
      </div>
    );
  }
}

export default NewPost;
