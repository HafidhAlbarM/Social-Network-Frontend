import React, { Component } from "react";
import { Link } from "react-router-dom";
import DefaultProfile from "../images/ava.png";

class ProfileTabs extends Component {
  render() {
    const { following, followers } = this.props;
    return (
      <div>
        <div className="row">
          <div className="col-md-4">
            <h3 className="text-primary">Followers</h3>
            <hr></hr>
            {followers.map((person, index) => {
              return (
                <div key={index}>
                  <div className="row">
                    <Link to={`/user/${person.follower_id}`}>
                      <div>
                        <img
                          style={{
                            borderRadius: "50%",
                            border: "1px solid black",
                          }}
                          height="30px"
                          width="30px"
                          src={`${process.env.REACT_APP_API_URL}/user/photo/${person.follower_id}`}
                          alt={person.name}
                          onError={(i) => (i.target.src = `${DefaultProfile}`)}
                        />
                        <h4 style={{ display: "inline" }}> {person.name}</h4>
                      </div>
                    </Link>
                    <p>{person.about}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="col-md-4">
            <h3 className="text-primary">Following</h3>
            <hr />
            {following.map((person, index) => {
              return (
                <div key={index}>
                  <div className="row">
                    <Link to={`/user/${person.following_id}`}>
                      <img
                        src={`${process.env.REACT_APP_API_URL}/user/photo/${person.following_id}`}
                        style={{
                          borderRadius: "50%",
                          border: "1px solid black",
                        }}
                        height="30px"
                        width="30px"
                        alt={person.name}
                        onError={(i) => (i.target.src = `${DefaultProfile}`)}
                      ></img>
                      <h4 style={{ display: "inline" }}> {person.name}</h4>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="col-md-4">
            <h3 className="text-primary">Posts</h3>
            <hr />
          </div>
        </div>
      </div>
    );
  }
}

export default ProfileTabs;
