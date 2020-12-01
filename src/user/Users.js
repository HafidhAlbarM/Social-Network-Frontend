import React, { Component } from 'react';
import { list } from './apiUser';
import Ava from '../images/ava.png';
import { Link } from 'react-router-dom';

class Users extends Component{
    constructor(){
        super();
        this.state = {
            users: []
        }
    }

    componentDidMount = () => {
        list().then(data => {
            if(data.error){
                console.log(data.error);
            }else{
                this.setState({users: data});
            }
        });
    }

    renderUsers = (users) => {
        return <div className="row">
            {users.map((user, index) => (
                <div className="card col-md-4" key={index}>
                    <div className="card-body">
                        <img 
                            className="card-img-top" 
                            src={Ava} 
                            alt={user.id}
                            style={{width:"60%", height:"60%"}}
                        />
                        <h5 className="card-title">{user.name}</h5>
                        <p className="card-text">{user.email}</p>
                        <Link 
                            to={`user/${user.id}`} 
                            className="btn btn-raised btn-primary btn-sm"
                        >
                            View Profile
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    }

    render(){
        const { users } = this.state;
        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Users</h2>
                
                {this.renderUsers(users)}
            </div>
        )
    }
}

export default Users;