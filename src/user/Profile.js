import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import { isAuthenticated } from "../auth/";
import { read } from "../user/apiUser";
import Ava from "../images/ava.png";
import DeleteUser from "./DeleteUser";
import FollowProfileButton from "./FollowProfileButton";
import ProfileTabs from "./ProfileTabs";

class Profile extends Component {
  constructor() {
    super();
    this.state = {
      user: { following: [], followers: [] },
      redirectToSignIn: false,
      isFollowing: false,
      error: "",
    };
  }

  checkFollow = (user) => {
    const jwt = isAuthenticated();
    const match = user.followers.find((follower) => {
      return follower.follower_id === jwt.user.id;
    });

    return match;
  };

  clickFollowButton = (callApi) => {
    const userId = isAuthenticated().user.id;
    const token = isAuthenticated().token;

    callApi(userId, token, this.state.user.id).then((data) => {
      if (data.error) {
        this.setState({ error: data.error });
      } else {
        this.setState({ user: data, isFollowing: !this.state.isFollowing });
      }
    });
  };

  init = (userId) => {
    const token = isAuthenticated().token;
    read(userId, token).then((data) => {
      if (data.error) {
        this.setState({ redirectToSignIn: true });
      } else {
        let isFollowing = this.checkFollow(data);
        this.setState({
          user: data,
          isFollowing: isFollowing != undefined ? true : false,
        });
      }
    });
  };

  componentDidMount() {
    this._isMounted = true;

    const userId = this.props.match.params.userId;
    this.init(userId);
  }

  componentDidUpdate(prevProps) {
    let userIdPrev = prevProps.match.params.userId;
    let userIdCurrent = this.props.match.params.userId;

    if (userIdPrev !== userIdCurrent) {
      this.init(this.props.match.params.userId);
    }
  }

  render() {
    const { redirectToSignIn, user } = this.state;

    const photoUrl = user.id
      ? `${process.env.REACT_APP_API_URL}/user/photo/${
          user.id
        }?${new Date().getTime()}`
      : Ava;

    if (redirectToSignIn) {
      return <Redirect to="/signin" />;
    }

    return (
      <div className="container">
        <h2 className="mt-5 mb-5">Profile</h2>
        <div className="row">
          <div className="col-md-6">
            <img
              style={{ height: "200px", width: "auto" }}
              className="img-thumbnail"
              src={`${process.env.REACT_APP_API_URL}/user/photo/${user.id}`}
              //src={photoUrl} pake ini juga bisa
              onError={(i) => (i.target.src = `${Ava}`)}
              alt={user.id}
            />
          </div>
          <div className="col-md-6">
            <div className="lead mt-2">
              <p>Hello {user.name}</p>
              <p>Email: {user.email}</p>
              <p>Joined: {new Date(user.created_at).toDateString()}</p>
            </div>
            {isAuthenticated().user && isAuthenticated().user.id === user.id ? (
              <div className="d-inline-block">
                <Link
                  className="btn btn-raised btn-success mr-5"
                  to={`/user/edit/${user.id}`}
                >
                  Edit Profile
                </Link>
                <DeleteUser userId={user.id} />
              </div>
            ) : (
              <p>
                <FollowProfileButton
                  following={this.state.isFollowing}
                  onButtonClick={this.clickFollowButton}
                />
              </p>
            )}
            <hr></hr>
            <ProfileTabs
              followers={user.followers}
              following={user.following}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 mb-5 mt-5">
            <hr></hr>
            {user.about}
            <hr></hr>
          </div>
        </div>
      </div>
    );
  }
}

export default Profile;
