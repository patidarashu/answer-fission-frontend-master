import React, { Component } from 'react';
import './styles.css';
import Modal from 'react-bootstrap/Modal';
import { Link } from 'react-router-dom';

import { connect } from 'react-redux';
import {mapStateToProps, mapDispatchToProps} from './../../store/mappingHandlers';


class Profile extends Component {
	constructor(props) {
		super(props);
		this.userId=this.props.match.params.userId;
		this.emailInputRef=React.createRef();
		this.userInputRef=React.createRef();
		this.state={
			username: this.props.user.username,
			email: this.props.user.email,
			disableEmailEdit: true,
			disableUserEdit: true,
			showConfirmModal: false,
			confirmMessage: "",
			onConfirm: null,
			deletedArticles: [],
			questions: [],
			articles: [],
		}
		this.cancelClickHandler=(evt)=>{
			this.setState({
				disableEmailEdit: true,
				disableUserEdit: true,				
				username: this.props.user.username,
				email: this.props.user.email,
			});
		}
		this.updateClickHandler=(evt)=>{
		}
		this.init=()=>{
			this.props.checkLoginFirst((userRes)=>{
				if(userRes.success) {
					const {username,_id:userId,email}=userRes.user;
					this.props.setUser({username,userId,email});
					this.props.setShowLoginOrSignup(false);
					this.props.setLoggedIn(true);
					// perform action here
					// fetching deleted articles
					fetch("http://localhost:8888/getSoftDeletedArticles",{
						method: "GET",
						headers: {"content-type": "application/json"},
						credentials: "include",
					})
					.then(res=>res.json())
					.then(res=>{
						this.setState({
							deletedArticles: res.deletedArticles,
						});
					});

					
					
					this.setState({
						username: this.props.user.username,
						email: this.props.user.email,
						disableEmailEdit: true,
						disableUserEdit: true,
						showConfirmModal: false,
					});
				}
			});
			// fetching questions
			fetch(`http://localhost:8888/getQuestions/${this.userId}`,{
				method: "GET",
				headers: {"content-type": "application/json"},
				credentials: "include",
			})
			.then(res=>res.json())
			.then(res=>{
				this.setState({
					questions: res.questions,
				});
			});
			
			// fetching articles
			fetch(`http://localhost:8888/getArticles/${this.userId}`,{
				method: "GET",
				headers: {"content-type": "application/json"},
				credentials: "include",
			})
			.then(res=>res.json())
			.then(res=>{
				this.setState({
					articles: res.articles,
				});
			});			
		}
		this.init();
		this.showConfirmClickedHandler=(evt,value)=>{
			const confirmMessage=`Are you sure you want to update the details?`;
			const onConfirm=()=>{
				this.props.checkLoginFirst((userRes)=>{
					if(userRes.success) {
						const {username,_id:userId,email}=userRes.user;
						this.props.setUser({username,userId,email});
						this.props.setShowLoginOrSignup(false);
						this.props.setLoggedIn(true);
						// perform action here
						if(this.state.username.trim().length===0 || this.state.email.trim().length===0) {
							// error
							return;
						}
						fetch(`http://localhost:8888/updateUser/${this.props.user.userId}`,{
							method: "PUT",
							headers: {"content-type": "application/json"},
							credentials: "include",
							body: JSON.stringify({username: this.state.username,email: this.state.email}),
						})
						.then(res=>res.json())
						.then(res=>{
							if(res.success) {
								//showing message box 
								this.props.setMessage(res.message);
								this.props.setShowMessage(true);
								this.props.setMessageType("success");
								setTimeout(()=>{this.props.setShowMessage(false)},4*1000);
								this.init();
							}
							else {
								//showing message box 
								this.props.setMessage(res.message);
								this.props.setShowMessage(true);
								this.props.setMessageType("error");
								setTimeout(()=>{this.props.setShowMessage(false)},4*1000);
							}
						})
						.catch(err=>{
								//showing message box 
								this.props.setMessage("Unable to update.");
								this.props.setShowMessage(true);
								this.props.setMessageType("error");
								setTimeout(()=>{this.props.setShowMessage(false)},4*1000);
						});			
						
					}
					else {
						this.props.setUser({username: "", userId: "", email: ""});
						this.props.setShowLoginOrSignup(true);					
						this.props.setLoggedIn(false);			
					}
				});

			}
			this.setState({
				showConfirmModal: true,
				confirmMessage,
				onConfirm,
			});
								
		}
		this.showConfirmClickedHandlerForDeletedArticles=(evt,articleId,value)=>{
			this.props.checkLoginFirst((userRes)=>{
				if(userRes.success) {
					const {username,_id:userId,email}=userRes.user;
					this.props.setUser({username,userId,email});
					this.props.setShowLoginOrSignup(false);
					this.props.setLoggedIn(true);
					// perform action here
					const operation=(value)?"permanently delete":"undelete";
					const confirmMessage=`Are you sure you want to ${operation} this Article?`;
					const url=(value)?
						`http://localhost:8888/hardDeleteArticle/${articleId}`	
						:
						`http://localhost:8888/undeleteArticle/${articleId}`
						;
					const onConfirm=()=>{
						fetch(url, {
							method: (value)?"DELETE":"PUT",
							headers: {"content-type": "application/json"},
							credentials: "include",
						})
						.then(res=>res.json())
						.then(res=>{
							if(res.success) {
							// redirect to Articles 
							//showing message box 
								this.props.setMessage(res.message);
								this.props.setShowMessage(true);
								this.props.setMessageType("success");
								setTimeout(()=>{this.props.setShowMessage(false)},4*1000);
								this.init();
							}
							else {
								//showing message box 
								this.props.setMessage(res.message);
								this.props.setShowMessage(true);
								this.props.setMessageType("error");
								setTimeout(()=>{this.props.setShowMessage(false)},4*1000);
							}
							this.setState({
								showConfirmModal: false,
								confirmMessage: "",
								onConfirm: null,
							});
						});
					}
					this.setState({
						showConfirmModal: true,
						confirmMessage,
						onConfirm,
					});
					
				}
				else {
					this.props.setUser({username: "", userId: "", email: ""});
					this.props.setShowLoginOrSignup(true);					
					this.props.setLoggedIn(false);			
				}
			});
			
		}		

	}
	componentDidUpdate() {
		if(this.props.loggedIn && this.state.username==="") {
			this.init();
		}
	}
	render() {
		return (
		<div className="profile row">
			<div className="col-md-6 col-lg-6 col-wrapper" hidden={this.props.user.userId!=this.userId}>
				<div className="sub-container basic-info-container">
					<div className="title">Basic Information</div>
					<div className="content">
						<div className="username data">
							<span className="key">Username</span><br/>
							<div class="input-group">
								<input ref={this.userInputRef} type="text" class="form-control" placeholder="Recipient's username" style={{fontSize: "14px"}} value={this.state.username} onChange={(evt)=>{this.setState({username: evt.target.value})}} disabled={this.state.disableUserEdit} />
								<button class="input-group-text" id="basic-addon2" style={{fontSize: "18px"}} onClick={(evt)=>{this.setState({disableUserEdit: false})}}><i className="fa fa-pencil"></i></button>
							</div>
						</div>
						<div className="email data">
							<span className="key">Email</span><br/>
							<div class="input-group">
								<input ref={this.emailInputRef} type="text" class="form-control" placeholder="Recipient's username" style={{fontSize: "14px"}} value={this.state.email} onChange={(evt)=>{this.setState({email: evt.target.value})}} disabled={this.state.disableEmailEdit} />
								<button class="input-group-text" id="basic-addon2" style={{fontSize: "18px"}} onClick={(evt)=>{this.setState({disableEmailEdit: false})}}><i className="fa fa-pencil"></i></button>
							</div>
						</div>
						{
							(!this.state.disableEmailEdit || !this.state.disableUserEdit)?
							<>
							<button className="modal-button btn btn-dark btn-sm" onClick={this.cancelClickHandler}>Cancel</button>
							<button className="modal-button btn btn-primary btn-sm" onClick={this.showConfirmClickedHandler}>Update</button>
							</>
							:
							null
						}
					</div>
				</div>
			</div>
			<div className="col-md-6 col-lg-6 col-sm-12 col-wrapper" hidden={this.props.user.userId!=this.userId}>
				<div className="sub-container deleted-article-list">
					<div className="title">Deleted Articles ({this.state.deletedArticles.length})</div>
					<div className="content">
						{
							(this.state.deletedArticles.length>0)?
							<ul class="list-group">
								{
									this.state.deletedArticles.map((deletedArticle,deletedArticleIndex)=>{
									return <li class="list-group-item">
											<Link to={`/Article/${deletedArticle._id}`} style={{textDecoration: "none"}}>{deletedArticle.title}</Link>
											<button className="btn btn-sm btn-danger" data-title-end="It will be deleted Permanently." onClick={(evt)=>{this.showConfirmClickedHandlerForDeletedArticles(evt,deletedArticle._id,true)}} style={{float: "right",marginLeft: "2px"}}>Delete</button>
											<button className="btn btn-sm btn-dark" data-title-end="It will be available publicly again" onClick={(evt)=>{this.showConfirmClickedHandlerForDeletedArticles(evt,deletedArticle._id,false)}}  style={{float: "right"}}>Undelete</button>
											
									</li>
									})
								}
							</ul>					

							:
							<span style={{color: "rgb(180,180,180)"}}>No deleted articles</span>
						}
					</div>
				</div>
			</div>
			<div className="col-md-6 col-lg-6 col-sm-12 col-wrapper">
				<div className="sub-container question-list">
					<div className="title">Questions Asked ({this.state.questions.length})</div>
					<div className="content">
						{
							(this.state.questions.length>0)?
							<ul class="list-group">
								{
									this.state.questions.map((question,questionIndex)=>{
									return <li key={questionIndex} class="list-group-item">
											<Link to={`/Question/${question._id}`} style={{textDecoration: "none"}}>{question.title}</Link>										
									</li>
									})
								}
							</ul>					
							:
							<span style={{color: "rgb(180,180,180)"}}>No question to show.</span>
							
						}
					</div>
				</div>
			</div>
			<div className="col-md-6 col-lg-6 col-sm-12 col-wrapper">
				<div className="sub-container article-list">
					<div className="title">Articles ({this.state.articles.length})</div>
					<div className="content">
						{
							(this.state.articles.length>0)?
							<ul class="list-group">
								{
									this.state.articles.map((article,articleIndex)=>{
									return <li class="list-group-item">
											<Link to={`/Article/${article._id}`} style={{textDecoration: "none"}}>{article.title}</Link>										
									</li>
									})
								}
							</ul>					
							:
							<span style={{color: "rgb(180,180,180)"}}>No article to show.</span>
							
						}
					</div>
				</div>
			</div>
			
			<Modal size="sm" centered show={this.state.showConfirmModal} onHide={(evt)=>{this.setState({showConfirmModal: false})}}>
				<Modal.Body>
					<div>
						<h6>{this.state.confirmMessage}</h6>
						<center>
						<button className="btn btn-sm btn-danger" style={{margin: "0px 5px"}} onClick={(evt)=>{this.setState({showConfirmModal: false, onConfirm: null, confirmMessage: "",})}}>Cancel</button>
						<button className="btn btn-sm btn-dark" style={{margin: "0px 5px"}} onClick={this.state.onConfirm}>Yes</button>
						</center>
					</div>
				</Modal.Body>
			</Modal>
						
		</div>
		);
	}
}

export default connect(mapStateToProps,mapDispatchToProps)(Profile);