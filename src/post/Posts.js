import React, { Component } from "react";
import { list } from "./apiPost";
import PostImage from "../images/post.jpg";
import { Link } from "react-router-dom";

class Posts extends Component {
  constructor() {
    super();
    this.state = {
      posts: [],
    };
  }

  componentDidMount = () => {
    list().then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ posts: data });
      }
    });
  };

  renderPosts = (posts) => {
    return (
      <div className="row">
        {posts.map((post, index) => {
          return (
            <div className="card col-md-4" key={index}>
              <div className="card-body">
                <img
                  style={{ height: "200px", width: "auto" }}
                  className="img-thumbnail"
                  src={`${process.env.REACT_APP_API_URL}/user/photo/${post.id}`}
                  onError={(i) => (i.target.src = `${PostImage}`)}
                  alt={post.id}
                />
                <h5 className="card-title">{post.title}</h5>
                <p className="card-text">
                  {post.body.substring(0, 100)}
                  <Link to={`post/${post.id}`}> read more...</Link>
                </p>
                <br />
                <p className="font-italic mark">
                  Posted By{" "}
                  <Link to={`/user/${post.created_by}`}>{post.name} </Link>
                  on {new Date(post.created_at).toDateString()}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  render() {
    const { posts } = this.state;
    return (
      <div className="container">
        <h2 className="mt-5 mb-5">Recent Posts</h2>

        {this.renderPosts(posts)}
      </div>
    );
  }
}

export default Posts;
