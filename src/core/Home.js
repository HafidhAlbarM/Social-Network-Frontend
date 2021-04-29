import React from "react";
import Posts from "../post/Posts";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../auth/index";

const Home = () => {
  return (
    <div>
      <div className="jumbotron">
        <h2>Home</h2>
        <p className="lead">Welcome to React FrontEnd</p>
      </div>

      <div className="container">
        {isAuthenticated().user && (
          <div className="row">
            <div className="col-md-2 offset-10">
              <Link to="/post/create" className="btn btn-raised btn-success">
                New Post
              </Link>
            </div>
          </div>
        )}

        <Posts />
      </div>
    </div>
  );
};

export default Home;
