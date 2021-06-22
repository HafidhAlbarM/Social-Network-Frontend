import React, { Component } from "react";
import { singlePost, remove, like, unlike } from "./apiPost";
import { Link, Redirect } from "react-router-dom";
import PostImage from "../images/post.jpg";
import { isAuthenticated } from "../auth/index";
import Comment from "./Comment";

class SinglePost extends Component {
  constructor() {
    super();
    this.state = {
      post: {},
      loading: true,
      redirectToHome: false,
      redirectToSignIn: false,
      message: "",
      like: false,
      likes: 0,
      comments: [],
    };
  }

  componentDidMount = () => {
    const postId = this.props.match.params.postId;
    singlePost(postId).then((data) => {
      if (data.error) {
        this.setState({ redirectToHome: true });
      } else {
        this.setState({
          post: data,
          loading: false,
          like: this.checkLike(data.post_likes),
          likes: data.post_likes.length,
          comments: data.post_comments,
        });
      }
    });
  };

  checkLike = (post_likes) => {
    const userId = isAuthenticated() ? isAuthenticated().user.id : 0;
    let match = post_likes.some(function (o) {
      return o["user_id"] === userId;
    });

    return match;
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

  updateComments = (comments) => {
    this.setState({ comments });
  };

  likeToggle = () => {
    if (isAuthenticated()) {
      let callAPI = this.state.like ? unlike : like;

      const userId = isAuthenticated().user.id;
      const postId = this.state.post.id;
      const token = isAuthenticated().token;

      callAPI(userId, token, postId).then((data) => {
        if (data.error) {
          console.log(data.error);
        } else {
          this.setState({
            like: !this.state.like,
            likes: data.length,
          });
        }
      });
    } else {
      this.setState({ redirectToSignIn: true });
    }
  };

  renderPost = (post, like, likes) => {
    return (
      <div className="card-body">
        <img
          style={{ height: "300px", width: "100%", objectFit: "cover" }}
          className="img-thumbnail"
          src={`${process.env.REACT_APP_API_URL}/post/photo/${post.id}`}
          onError={(i) => (i.target.src = `${PostImage}`)}
          alt={post.title}
        />
        {like ? (
          <h3
            onClick={() => {
              this.likeToggle();
            }}
          >
            <i
              className="fa fa-thumbs-up text-info bg-dark"
              style={{ padding: "10px", borderRadius: "50%" }}
            />{" "}
            {likes} like
          </h3>
        ) : (
          <h3
            onClick={() => {
              this.likeToggle();
            }}
          >
            <i
              className="fa fa-thumbs-up bg-dark"
              style={{ padding: "10px", borderRadius: "50%" }}
            />{" "}
            {likes} like
          </h3>
        )}

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
                  Edit{" "}
                  <i className="fa fa-pencil-square" aria-hidden="true"></i>
                </Link>
                <button
                  onClick={() => this.deleteComfirmed()}
                  className="btn btn-raised btn-danger mr-5"
                >
                  Delete <i className="fa fa-trash" aria-hidden="true"></i>
                </button>
              </div>
            )}
        </div>
      </div>
    );
  };

  render() {
    const {
      post,
      like,
      likes,
      comments,
      loading,
      redirectToHome,
      redirectToSignIn,
    } = this.state;

    if (redirectToHome) {
      return <Redirect to="/" />;
    } else if (redirectToSignIn) {
      return <Redirect to="/signin" />;
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
              {this.renderPost(post, like, likes)}
              <Comment
                postId={post.id}
                comments={comments}
                updateComments={this.updateComments}
              />
            </div>
          )}
        </div>
      );
    }
  }
}

export default SinglePost;
