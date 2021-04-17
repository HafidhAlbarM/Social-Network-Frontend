import React, { Component } from "react";

class ProfileTabs extends Component {
  render() {
    const { following, followers } = this.props;
    return (
      <div>
        <div>Following{JSON.stringify(following)}</div>
        <div>Followers{JSON.stringify(followers)}</div>
      </div>
    );
  }
}

export default ProfileTabs;
