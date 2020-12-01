import React, { Component } from 'react';

class DeleteUser extends Component{
    deleteAccount = () => {
        console.log('delete account');
    }

    deleteComfirmed = () => {
        let answer = window.confirm('Are you sure you want to delete your account');
        if(answer){
            this.deleteAccount();
        }
    }

    render(){
        return <button 
            className="btn btn-raised btn-danger mr-5"
            onClick={() => this.deleteComfirmed()}
        >   
            Delete Profile
        </button>
    }
}

export default DeleteUser;