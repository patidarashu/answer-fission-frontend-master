import React, { Component } from 'react';
import './styles.css';

export default class LoginOrSignup extends Component {
	constructor(props) {
		super(props);
		this.state={
			showLogin: true,
			login_username: "",
			login_password: "",
			login_error: [],
			signup_username: "",
			signup_password: "",
			signup_confirm_password: "",
			signup_email: "",
			signup_error: [],
		}
		this.setLoginForm=()=>{
			if(this.state.showLogin) return;
			this.setState({
				showLogin: true
			});
		}
		this.setSignupForm=()=>{
			if(!this.state.showLogin) return;
			this.setState({
				showLogin: false
			});
		}
		this.loginButtonHandler=(evt)=>{
			const username=this.state.login_username;
			const password=this.state.login_password;
			let valid=true;
			let error=[];
			if(username==null || username.length===0) {
				valid=false;
				error.push("Username Required.");
			}
			if(password==null || password.length<6) {
				valid=false;
				error.push("Password: at least 6 characters.");
			}
			if(!valid) {
				this.setState({
					login_error: error
				});
				return;				
			}
			const userData={
				username,
				password
			}
			fetch("http://localhost:8888/login",{
				method: "POST",
				headers: {
					"content-type": "application/json"
				},
				body: JSON.stringify(userData),
				credentials: "include"
			})
			.then(res=>res.json())
			.then(res=>{
				if(res.success) {
					this.props.onLoggedIn(res);
				}
				else {
					this.setState({
						login_error: [res.message]
					});
				}
			})
			.catch(err=>{
					this.setState({
						login_error: ["Unable to login. Please check your connection."]
					});				
			});
		}
		this.signupButtonHandler=(evt)=>{
			const username=this.state.signup_username.trim();
			const password=this.state.signup_password;
			const confirmPassword=this.state.signup_confirm_password;
			const email=this.state.signup_email.trim();
			let error=[];
			let valid=true;
			if(username==null || username.length===0) {
				valid=false;
				error.push("Username Required.");
			}
			if(password==null || password.length<6) {
				valid=false;
				error.push("Password: at least 6 characters.");
			}
			if(confirmPassword==null || confirmPassword!==password) {
				valid=false;
				error.push("Please confirm the password.");
			}
			if(email==null || email.length===0) {
				valid=false;
				error.push("Email Required.");
			}
			if(!valid) {
				this.setState({
					signup_error: error
				});
				return;
			}
			const userData={
				username,
				password,
				email
			};
			fetch("http://localhost:8888/signup",{
				method: "POST",
				headers: {
					"content-type": "application/json"
				},
				body: JSON.stringify(userData),
				credentials: "include"
			})
			.then(res=>res.json())
			.then(res=>{
				if(res.success) {
					this.props.onLoggedIn(res);
				}
				else {
					this.setState({
						signup_error: res.message
					});
				}
			})
			.catch(err=>{
					this.setState({
						signup_error: ["Unable to signup. Please check your connection."]
					});				
			});
			
		}
	}
	render() {
		return (
			<div className="login-or-signup">
				<button className={`tab-button${(this.state.showLogin)?" active":""}`} onClick={this.setLoginForm}>Login</button>
				<button className={`tab-button${(!this.state.showLogin)?" active":""}`} onClick={this.setSignupForm}>Signup</button>
				<div className="form-wrapper">
				{
					(this.state.showLogin)?
					(<form className="login-form">
						<input type="text" className="form-control" placeholder="Username" value={this.state.login_username} onChange={(evt)=>{this.setState({login_username: evt.target.value,login_error:[]})}} />
						<input type="password" className="form-control" placeholder="Password" value={this.state.login_password} onChange={(evt)=>{this.setState({login_password: evt.target.value,login_error:[]})}}/>
						<button type="reset" className="button btn btn-sm btn-dark">Reset</button>
						<button type="button" className="button btn btn-sm btn-primary" onClick={this.loginButtonHandler}>Login</button>
						<div className="error-popup" hidden={this.state.login_error.length===0}>
						<i className="fa fa-warning" style={{float: "right",padding: "4px"}}></i>
						<ul>
						{
							this.state.login_error.map((err,errIndex)=>{
							return <li key={errIndex}><i className="fa fa-caret-right" style={{fontSize: "12px"}}></i> {err}</li>
							})
						}
						</ul>
						</div>
					</form>)
					:
					(<form className="signup-form">
						<input type="text" className="form-control" placeholder="Username" value={this.state.signup_username} onChange={(evt)=>{this.setState({signup_username: evt.target.value,signup_error:[]})}} />
						<input type="password" className="form-control" placeholder="Password" value={this.state.signup_password} onChange={(evt)=>{this.setState({signup_password: evt.target.value,signup_error:[]})}} />
						<input type="password" className="form-control" placeholder="Confirm Password" value={this.state.signup_confirm_password} onChange={(evt)=>{this.setState({signup_confirm_password: evt.target.value,signup_error:[]})}}/>
						<input type="text" className="form-control" placeholder="Email" value={this.state.signup_email} onChange={(evt)=>{this.setState({signup_email: evt.target.value,signup_error:[]})}} />
						<button type="reset" className="button btn btn-sm btn-dark">Reset</button>
						<button type="button" className="button btn btn-sm btn-primary" onClick={this.signupButtonHandler}>Sign Up</button>						
						<div className="error-popup" hidden={this.state.signup_error.length===0}>
						<i className="fa fa-warning" style={{float: "right",padding: "4px"}}></i>
						<ul>
						{
							this.state.signup_error.map((err,errIndex)=>{
							return <li key={errIndex}><i className="fa fa-caret-right" style={{fontSize: "12px"}}></i> {err}</li>
							})
						}
						</ul>
						</div>
					</form>)
				
				}
				</div>
			</div>
		);
	}
}