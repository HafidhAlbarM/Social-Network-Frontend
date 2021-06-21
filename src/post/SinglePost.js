import React, { Component } from "react";
import { singlePost, remove } from "./apiPost";
import { Link, Redirect } from "react-router-dom";
import PostImage from "../images/post.jpg";
import { isAuthenticated } from "../auth/index";

class SinglePost extends Component {
  constructor() {
    super();
    this.state = {
      post: {},
      loading: true,
      redirectToHome: false,
      message: "",
    };
  }

  componentDidMount = () => {
    const postId = this.props.match.params.postId;
    singlePost(postId).then((data) => {
      if (data.error) {
        this.setState({ redirectToHome: true });
      } else {
        this.setState({ post: data, loading: false });
      }
    });
  };

  deletePost = () => {
    const postId = this.props.match.params.postId;
    const token = isAuthenticated().token;
    remove(postId, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ redirectToHome: true });
      }
    });
  };

  deleteComfirmed = () => {
    let answer = window.confirm("Are you sure you want to delete your account");
    if (answer) {
      this.deletePost();
    }
  };

  renderPost = (post) => {
    return (
      <div className="card-body">
        <img
          style={{ height: "300px", width: "100%", objectFit: "cover" }}
          className="img-thumbnail"
          src={`${process.env.REACT_APP_API_URL}/post/photo/${post.id}`}
          onError={(i) => (i.target.src = `${PostImage}`)}
          alt={post.title}
        />
        <p className="card-text">{post.body}</p>
        <br />
        <p className="font-italic mark">
          Posted By <Link to={`/user/${post.created_by}`}>{post.name} </Link>
          on {new Date(post.created_at).toDateString()}
        </p>
        <div className="d-inline-block">
          <Link className="mr-5" to="/">
            Back to All Posts
          </Link>

          {isAuthenticated().user &&
            isAuthenticated().user.id === post.created_by && (
              <div>
                <Link
                  to={`/post/edit/${post.id}`}
                  className="btn btn-raised btn-success mr-5"
                >
                  Edit
                </Link>
                <button
                  onClick={() => this.deleteComfirmed()}
                  className="btn btn-raised btn-danger mr-5"
                >
                  Delete
                </button>
              </div>
            )}
        </div>
      </div>
    );
  };

  render() {
    const { post, loading, redirectToHome } = this.state;

    if (redirectToHome) {
      return <Redirect to="/" />;
    } else {
      return (
        <div className="container">
          {loading ? (
            <div className="jumbrotron text-center">
              <h2>Loading...</h2>
            </div>
          ) : (
            <div>
              <h2 className="display-2 mt-5 mb-5">{post.title}</h2>
              {this.renderPost(post)}
            </div>
          )}
        </div>
      );
    }
  }
}

export default SinglePost;
