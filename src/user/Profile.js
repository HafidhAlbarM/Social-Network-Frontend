import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { isAuthenticated } from '../auth/';
import { read } from '../user/apiUser';
import Ava from '../images/ava.png';
import DeleteUser from './DeleteUser';

class Profile extends Component{
    constructor(){
        super();
        this.state = {
            user: "",
            redirectToSignIn: false
        }
    }
    

    init = userId => {
        const token = isAuthenticated().token;
        read(userId, token)
        .then(data => {
            //then kedua untuk mengambil data response json dari then pertama
            if(data.error){
                this.setState({redirectToSignIn: true});
            }else{
                this.setState({user: data});
            }
        });
    }

    componentDidMount(){
        this._isMounted = true;
        
        const userId = this.props.match.params.userId;
        this.init(userId);
    }

    componentDidUpdate(prevProps){
        let userIdPrev = prevProps.match.params.userId;
        let userIdCurrent = this.props.match.params.userId;

        if(userIdPrev !== userIdCurrent){
            this.init(this.props.match.params.userId);
        }
    }

    render(){
        const {redirectToSignIn, user} = this.state;

        if(redirectToSignIn){
            return <Redirect to="/signin"/>
        }
        
        return <div className="container">
            <h2 className="mt-5 mb-5">Profile</h2>
            <div className="row">
                <div className="col-md-6">
                    <img 
                            className="card-img-top" 
                            src={Ava} 
                            alt={user.id}
                            style={{height:"80%", width:"60%"}}
                    />
                </div>
                <div className="col-md-6">
                    <div className="lead mt-2">
                        <p>Hello {user.name}</p>
                        <p>Email: {user.email}</p>
                        <p>Joined: {new Date(user.created_at).toDateString()}</p>
                    </div>
                    {isAuthenticated().user && 
                        isAuthenticated().user.id === user.id && (
                            <div className="d-inline-block">
                                <Link 
                                    className="btn btn-raised btn-success mr-5"
                                    to={`/user/edit/${user.id}`}
                                >   
                                    Edit Profile
                                </Link>
                                <DeleteUser userId={user.id}/>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    }
}

export default Profile;