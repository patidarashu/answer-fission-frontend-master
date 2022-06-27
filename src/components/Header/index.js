import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import './styles.css';
import LOGO from '../../logo.png';
import Modal from 'react-bootstrap/Modal';
import LoginOrSignup from './../LoginOrSignup';
import UserIcon from '../../images/icons/userIcon.png';

import { connect } from 'react-redux';
import {mapStateToProps, mapDispatchToProps} from './../../store/mappingHandlers';


class Header extends Component {
	constructor(props) {
		super(props);
		this.checkForLogin=()=>{
			this.props.checkLoginFirst((userRes)=>{
				if(userRes.success) {
					const {username,_id:userId,email}=userRes.user;
					this.props.setUser({username,userId,email});
					this.props.setShowLoginOrSignup(false);
					this.props.setLoggedIn(true);
				}
				else {
					this.props.setUser({username: "",userId: "", email: ""});
					this.props.setShowLoginOrSignup(false);
					this.props.setLoggedIn(false);
				}
			});			
		}
		this.loginButtonHandler=(evt)=>{
			this.props.setShowLoginOrSignup(true);
		}
		this.closeModalHandler=(evt)=>{
			this.props.setShowLoginOrSignup(false);
		}
		this.loggedInHandler=(data)=>{
			this.checkForLogin();
		}
		this.logoutHandler=(evt)=>{
			fetch("http://localhost:8888/logout",{
				credentials: "include"
			})
			.then(res=>{
				this.props.setShowLoginOrSignup(false);
				this.props.setLoggedIn(false);
				this.props.setUser({username: "",userId: "", email: ""});
			});
		}
	}
	componentDidMount() {
		this.checkForLogin();		
	}
	render() {
		return (
			<div className="header">
				<div className="row">
				<div className="col col-10">
					<Link to="/" style={{textDecoration: "none"}}>
						<img alt="AF" className="app-logo" src={LOGO} />
						<h4 className="title">ANSWER <span className="title-highlight">FISSION</span></h4>
					</Link>
				</div>
				<div className="col col-sm-2">
				{
					(this.props.loggedIn)?
					<div className="profile-container">
						<Link to={`/user/${this.props.user.userId}`} style={{textDecoration: "none"}}><span className="username-text"><img alt="User:" className="user-icon" src={UserIcon} /> {this.props.user.username}</span></Link>
						<button type="button" className="button btn btn-danger btn-sm" onClick={this.logoutHandler}>Logout</button>
					</div>
					:
					<button className="login-button btn btn-sm btn-info" onClick={this.loginButtonHandler}>Login</button>					
				}
				</div>
				</div>
				<Modal
					size="sm"
					centered
					show={this.props.showLoginOrSignup}
					onHide={this.closeModalHandler}
				>
					<Modal.Body>
						<button type="button" className="modal-close-button" onClick={this.closeModalHandler}><i className="fa fa-times-circle"></i></button>
						<LoginOrSignup onLoggedIn={this.loggedInHandler} />
					</Modal.Body>
				</Modal>
				
			</div>
		);
	}
}

export default connect(mapStateToProps,mapDispatchToProps)(Header);