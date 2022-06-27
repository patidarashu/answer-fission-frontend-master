import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './styles.css';
import Modal from 'react-bootstrap/Modal';
import ArrowUpIcon from './../../images/icons/arrow-up.png';
import ArrowDownIcon from './../../images/icons/arrow-down.png';
import CommentsContainer from './../CommentsContainer';


import { connect } from 'react-redux';
import {mapStateToProps, mapDispatchToProps} from './../../store/mappingHandlers';

class Article extends Component {
	constructor(props) {
		super(props);
		this.articleId=this.props.match.params.articleId;
		this.state={
			article: {tags: [], comments: [],votes: {positive: [],negative: []}, resourceLinks: []},
			error: "",
			showConfirmModal: false,
			confirmMessage: "",
			onConfirm: null,
		}
		this.init=()=>{
			fetch("http://localhost:8888/getArticle/"+this.articleId,{
				method: "GET",
				headers: {"content-type": "application/json"},
				credentials: "include",
			})
			.then(res=>res.json())
			.then(res=>{
				if(res.success) {
//					console.log(res.article);
					this.setState({article: res.article});
				}
				else {
					this.setState({
						error: res.message,
					});
				}
			})
			.catch(err=>{
				this.setState({
					error: "Unable to get the article. Please check your connection.",				
				});
			});			
		}
		this.init();
		this.sendVoteRequest=(url)=>{
			this.props.checkLoginFirst((userRes)=>{
				if(userRes.success) {
					const {username,_id:userId,email}=userRes.user;
					this.props.setUser({username,userId,email});
					this.props.setShowLoginOrSignup(false);
					this.props.setLoggedIn(true);
					// perform action here
					fetch(url,{
						method: "PUT",
						headers: {"content-type": "application/json"},
						credentials: "include",
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
							this.props.setMessage("Unable to vote.");
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
		this.votePositiveHandler=(evt)=>{			
			this.sendVoteRequest(`http://localhost:8888/votePositiveForArticle/${this.state.article._id}`);
		}
		this.voteNegativeHandler=(evt)=>{
			this.sendVoteRequest(`http://localhost:8888/voteNegativeForArticle/${this.state.article._id}`);
		}
		this.redirectToEditArticle=()=>{
			this.props.checkLoginFirst((userRes)=>{
				if(userRes.success) {
					const {username,_id:userId,email}=userRes.user;
					this.props.setUser({username,userId,email});
					this.props.setShowLoginOrSignup(false);
					this.props.setLoggedIn(true);
					// perform action here
					if(this.state.article.userId===this.props.user.userId) {
						// redirecting to EditArticle page
						this.props.history.push(`/EditArticle/${this.state.article._id}`);
					}
					else {
						//showing message box 
						this.props.setMessage("You are not Authorized to update.");
						this.props.setShowMessage(true);
						this.props.setMessageType("error");
						setTimeout(()=>{this.props.setShowMessage(false)},4*1000);
					}
					
				}
				else {
					this.props.setUser({username: "", userId: "", email: ""});
					this.props.setShowLoginOrSignup(true);					
					this.props.setLoggedIn(false);			
				}
			});
			
		}
		this.showConfirmClickedHandler=(evt,value)=>{
			this.props.checkLoginFirst((userRes)=>{
				if(userRes.success) {
					const {username,_id:userId,email}=userRes.user;
					this.props.setUser({username,userId,email});
					this.props.setShowLoginOrSignup(false);
					this.props.setLoggedIn(true);
					// perform action here
					if(this.state.article.userId!==this.props.user.userId) {
						// show some message here 
						return;
					}
					const operation=(value)?"delete":"undelete";
					const confirmMessage=`Are you sure you want to ${operation} this Article?`;
					const url=(value)?
						`http://localhost:8888/softDeleteArticle/${this.state.article._id}`	
						:
						`http://localhost:8888/undeleteArticle/${this.state.article._id}`
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
	componentDidMount() {
	}

	render() {
		return (
		<div className="article-container">
		{
			(this.state.error.length===0)?
			<>
				<div className="article-header">
					<div className="af-row">
						<div className="vote-display">
							<button type="button" className="vote-button vote-increment-button" data-title="This article is useful" onClick={this.votePositiveHandler} disabled={this.state.article.userId===this.props.user.userId}><img alt="+" className="vote-button-icon" src={ArrowUpIcon} /></button>
							<div className="vote-figure" data-title="Votes">{this.state.article.votes.positive.length-this.state.article.votes.negative.length}</div>
							<button type="button" className="vote-button vote-decerement-button" data-title="This article is not useful" onClick={this.voteNegativeHandler} disabled={this.state.article.userId===this.props.user.userId}><img alt="-" className="vote-button-icon" src={ArrowDownIcon}/></button>
						</div>
						<div className="article-title-container">
							<div className="af-row" style={{justifyContent: "space-between"}}>
								<h4>
									{this.state.article.title} 
								</h4>
							</div>
							<div className="article-status-container">
								<div className="af-row" style={{justifyContent: "space-between"}}>
									<div>
										<div className="username-container">Author: <Link to={`/user/${this.state.article.userId}`} style={{textDecoration: "none",fontWeight: "500"}}><span className="username">{this.state.article.username}</span></Link></div>
										<div className="post-date-container">Posted on {new Date(this.state.article.postDate).toLocaleString("en-US",{dateStyle: "medium"})}</div>
									</div>
									<div style={{ textAlign: "right" }} hidden={this.state.article.userId!==this.props.user.userId}>
										<button type="button" className="button btn btn-outline-light btn-sm" onClick={this.redirectToEditArticle}><i className="fa fa-pencil"></i> Edit</button>
										{
											(this.state.article.isDeleted)?
											<button type="button" data-title-end="Article will be saved privately after delete." className="button btn btn-danger btn-sm" onClick={(evt)=>this.showConfirmClickedHandler(evt,false)}><i className="fa fa-undo"></i> Undelete</button>
											:
											<button type="button" data-title-end="Article will be saved privately after delete." className="button btn btn-danger btn-sm" onClick={(evt)=>this.showConfirmClickedHandler(evt,true)}><i className="fa fa-trash"></i> Delete</button>
										}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="article-wrapper">
					<div className="article-description" dangerouslySetInnerHTML={{__html: this.state.article.description}}>
					</div>
					<div className="tags-container">
					{
						this.state.article.tags.map((tag,tagIndex)=>{
							return <div key={tagIndex} className="tag-tile">{tag}</div>
						})
					}
					</div>
					<div className="resource-links-container">
						<h6>References: </h6>
					{
						this.state.article.resourceLinks.map((resourceLink,resourceLinkIndex)=>{
							return <div key={resourceLinkIndex} className="resource-link-tile"><a href={resourceLink} target="_blank">{resourceLink}</a></div>
						})
					}						
					</div>
					<hr/>
					<CommentsContainer parentType={"article"} parentId={this.state.article._id} init={this.init} comments={this.state.article.comments} disabled={false} />
				</div>
			</>
			:
			this.state.error
		}
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
		</div>);
	}
}

export default connect(mapStateToProps,mapDispatchToProps)(Article);