import React, {Component} from 'react';
import { follow, unFollow } from './apiUser';

class FollowProfileButton extends Component{
    followClick = () => {
        this.props.onButtonClick(follow);
    }

    unFollowClick = () => {
        this.props.onButtonClick(unFollow);
    }
    render(){
        return(
            <div className="d-inline-block mt-5">
                {
                    !this.props.following ? 
                    (
                        <button onClick={this.followClick} className="btn btn-success btn-raised mr-5">
                            Follow
                        </button>
                    ):
                    (
                        <button onClick={this.unFollowClick} className="btn btn-danger btn-raised">
                            UnFollow
                        </button>
                    )
                }
            </div>
        )
    }
}

export default FollowProfileButton;