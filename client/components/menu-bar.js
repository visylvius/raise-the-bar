import React, { PropTypes } from 'react';
import auth from '../AuthService';
import {ModalContainer, ModalDialog} from 'react-modal-dialog';

import { EventEmitter } from 'events';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { getUser } from '../actions/user-actions';

import Modal from './modal';

class MenuBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = { isShowingModal: false };

    auth.on('server-profile-non-existent', (serverProfile) => {
      this.createUserProfile(serverProfile);
    });
  }

  handleClick() {
    this.setState({isShowingModal: true});
  }

  handleClose() {
    this.setState({isShowingModal: false});
  }

   userButton() {
     if (localStorage.getItem('id_token')) {
       return <a className='nav-link' href='#' onClick={this.logout.bind(this)}>Logout</a>;
     } else {
       return <a className='nav-link' href='#' onClick={auth.login.bind(auth)}>Login</a>;
     }
   }

   createUserProfile(serverProfile) {
     if (serverProfile === null) {
       this.setState({isShowingModal: true});
     }
   }

   createAthlete() {
     this.setState({isShowingModal: false});
     this.context.router.push(`/createathlete`);
   }

   createTrainer() {
     this.setState({isShowingModal: false});
     this.context.router.push(`/createtrainer`)
   }
   logout(){
     // destroys the session data
     console.log('in logout');
     this.props.auth.logout()
     // redirects to login page
     this.context.router.push('/');
   }

   userProfile() {
     const userProfile = JSON.parse(localStorage.getItem('profile'));
     const { email } = userProfile;
     console.log();
     console.log('props', this.props);
     this.props.getUser(email)
      .then((user) => {
        if (user.value.type === 'athlete') {
          const { id } = user.value.athlete;
          this.context.router.push(`/athlete/${id}`)
        }
      });
   }

  render(){
    return (
      <div>
        <nav className="navbar navbar-dark bg-inverse">
          <ul className="nav navbar-nav">
            <li className="nav-item active">
              <a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Athletes</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Trainers</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Find Gyms Near You</a>
            </li>
            <li className='nav-item'>
              <a className='nav-link' href="#" onClick={this.userProfile.bind(this)}>Profile</a>
            </li>
            <li className='nav-item'>
              <a className='nav-link' href="#" onClick={this.createUserProfile.bind(this)}>Test</a>
            </li>
            <li className='nav-item'>
              {this.userButton()}
            </li>
          </ul>
        </nav>
        <div>
        {
          this.state.isShowingModal &&
          <ModalContainer onClose={this.handleClose.bind(this)}>
            <ModalDialog onClose={this.handleClose.bind(this)}>
              <p>Whoops! <br />It looks like you haven't create a profile with us yet</p>
              <p>Are you an Athlete, or a Trainer?</p>
              <button onClick={() => { this.createAthlete() }}>Create Athlete</button>
              <button onClick={() => { this.createTrainer() }}>Create Trainer</button>
            </ModalDialog>
          </ModalContainer>
        }
          {this.props.children}
        </div>
      </div>
    );
  }
}

MenuBar.contextTypes = {
  router: PropTypes.object
};

MenuBar.PropTypes = {
  // auth: PropTypes.instanceOf(auth)
};


const mapStateToProps = (state) => {
  const { user, error, loading } = state.user;
  return { user, error, loading };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({getUser}, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(MenuBar);
