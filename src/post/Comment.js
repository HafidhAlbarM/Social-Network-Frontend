import React, { Component } from "react";
import { comment, uncomment } from "./apiPost";
import { isAuthenticated } from "../auth";
import { Link, Redirect } from "react-router-dom";
import DefaultProfile from "../images/ava.png";

class Comment extends Component {
  constructor() {
    super();
    this.state = {
      text: "",
      error: "",
      redirectToSignIn: false,
    };
  }

  handleChange = (event) => {
    this.setState({ text: event.target.value });
  };

  isValid = () => {
    const { text } = this.state;
    if (text.length <= 0 || text.length > 150) {
      this.setState({
        error: "Comment should not be empty and less than 150 characters long",
      });
      return false;
    }
    return true;
  };

  addComment = (event) => {
    event.preventDefault();

    if (isAuthenticated()) {
      if (this.isValid()) {
        const userId = isAuthenticated().user.id;
        const token = isAuthenticated().token;
        const postId = this.props.postId;
        const text = this.state.text;

        comment(userId, token, postId, text).then((data) => {
          if (!data.error) {
            this.setState({ text: "", error: "" });
            this.props.updateComments(data);
          } else {
            console.log(data.error);
          }
        });
      }
    } else {
      this.setState({ redirectToSignIn: true });
    }
  };

  deleteConfirm = (comment_id) => {
    let answer = window.confirm("Are you sure want to delete this comment?");

    if (answer) {
      this.deleteComment(comment_id);
    }
  };

  deleteComment = (comment_id) => {
    if (isAuthenticated()) {
      const userId = isAuthenticated().user.id;
      const token = isAuthenticated().token;
      const postId = this.props.postId;

      uncomment(token, postId, comment_id).then((data) => {
        if (!data.error) {
          this.props.updateComments(data);
        } else {
          console.log(data.error);
        }
      });
    } else {
      this.setState({ redirectToSignIn: true });
    }
  };

  render() {
    const { comments } = this.props;
    const { error, redirectToSignIn } = this.state;

    if (redirectToSignIn) {
      return <Redirect to={`/signin`} />;
    } else {
      return (
        <div>
          <h2 className="mb-5 mt5">Comment</h2>
          <form onSubmit={this.addComment}>
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                onChange={(value) => this.handleChange(value)}
                value={this.state.text}
                placeholder="Leave comment..."
              />
              <button className="btn btn-raised btn-success">Post</button>
            </div>
          </form>

          <div
            className="alert alert-danger"
            style={{ display: error ? "" : "none" }}
          >
            {error}
          </div>

          <div className="col-md-12">
            <h3 className="text-primary">{comments.length} Comments</h3>
            <hr />
            {comments.map((comment, index) => {
              return (
                <div key={index}>
                  <div className="row">
                    <div className="col-sm-12">
                      <Link to={`/user/${comment.created_by}`}>
                        <img
                          src={`${process.env.REACT_APP_API_URL}/user/photo/${comment.created_by}`}
                          style={{
                            borderRadius: "50%",
                            border: "1px solid black",
                          }}
                          height="30px"
                          width="30px"
                          alt={comment.name}
                          title={comment.name}
                          onError={(i) => (i.target.src = `${DefaultProfile}`)}
                        ></img>
                        <p className="ml-2" style={{ display: "inline" }}>
                          {comment.name}
                        </p>
                      </Link>
                      <p style={{ marginLeft: "40px" }}>{comment.text}</p>
                      <p className="font-italic mark">
                        <span style={{ fontSize: "12px" }}>
                          Posted By{" "}
                          <Link to={`/user/${comment.created_by}`}>
                            {comment.name}
                          </Link>{" "}
                          on {comment.created_at}
                        </span>
                        <span className="float-right">
                          {isAuthenticated().user &&
                            isAuthenticated().user.id ===
                              comment.created_by && (
                              <span
                                className="text-danger"
                                onClick={() => this.deleteConfirm(comment.id)}
                                style={{ cursor: "pointer" }}
                              >
                                Remove{" "}
                                <i
                                  className="fa fa-trash"
                                  aria-hidden="true"
                                ></i>
                              </span>
                            )}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
  }
}

export default Comment;
