import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { singlePost, update } from "./apiPost";
import { isAuthenticated } from "../auth";
import PostImage from "../images/post.jpg";

class EditPost extends Component {
  constructor() {
    super();
    this.state = {
      id: "",
      title: "",
      body: "",
      redirectToProfile: false,
    };
  }

  init = (postId) => {
    singlePost(postId).then((data) => {
      if (data.error) {
        this.setState({ redirectToProfile: true });
      } else {
        this.setState({
          id: data.id,
          title: data.title,
          body: data.body,
          error: "",
          loading: false,
          fileSize: 0,
        });
      }
    });
  };

  componentDidMount() {
    const postId = this.props.match.params.postId;
    this.init(postId);
    this.postData = new FormData();
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

    this.postData.set(name, value);
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
      const postId = this.state.id;
      const token = isAuthenticated().token;

      console.log(this.postData);
      update(postId, token, this.postData).then((data) => {
        if (data.error) {
          this.setState({ error: data.error });
        } else {
          console.log("berhasil");
          this.setState({ redirectToProfile: true });
        }
      });
    }
  };

  editPostForm = (title, body) => (
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
        UPDATE POST
      </button>
    </form>
  );

  render() {
    const { id, title, body, redirectToProfile, error, loading } = this.state;
    if (redirectToProfile) {
      return <Redirect to={`/user/${isAuthenticated().user.id}`} />;
    }

    return (
      <div className="container">
        <h2 className="mt-5 mb-5">{title}</h2>
        <div
          className="alert alert-danger"
          style={{ display: error ? "" : "none" }}
        >
          {error}
        </div>

        {loading ? (
          <div className="jumbotron text-center">
            <h2>Loading...</h2>
          </div>
        ) : (
          ""
        )}

        <img
          style={{ height: "200px", width: "auto" }}
          className="img-thumbnail"
          src={`${process.env.REACT_APP_API_URL}/post/photo/${id}`}
          onError={(i) => (i.target.src = `${PostImage}`)}
          alt={title}
        />

        {this.editPostForm(title, body)}
      </div>
    );
  }
}

export default EditPost;
