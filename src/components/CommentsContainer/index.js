import React, { Component } from 'react';
import './styles.css';
import Modal from 'react-bootstrap/Modal';

import { connect } from 'react-redux';
import {mapStateToProps, mapDispatchToProps} from './../../store/mappingHandlers';


class Comment {
	constructor(body="",parentType="",parentId="") {
		this.body=body;
		this.parentType=parentType;
		this.parentId=parentId;
	}
}
class CommentsContainer extends Component {
	constructor(props) {
		super(props);
		this.state={
			showQuestionComments: false,
			commentBody: "",
			showSubComments: new Array(this.props.comments.length).fill(false),
			subCommentBodies: new Array(this.props.comments.length).fill(""),
			showEditModal: false,
			toUpdateCommentBody: "",
			toUpdateCommentId: "",
			toUpdateCommentError: "",
		}
		this.postComment=(newComment)=>{
			this.props.checkLoginFirst((userRes)=>{
				if(userRes.success) {
					const {username,_id:userId,email}=userRes.user;
					this.props.setUser({username,userId,email});
					this.props.setShowLoginOrSignup(false);
					this.props.setLoggedIn(true);
					// perform action here
					fetch('http://localhost:8888/postComment',{
						method: "POST",
						headers: {"content-type": "application/json"},
						body: JSON.stringify(newComment),
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

							this.props.init();
							this.setState({
								commentBody: "",
								subCommentBodies: new Array(this.props.comments.length).fill(""),
							});
						}
						else {
							//showing message box 
							this.props.setMessage(res.message);
							this.props.setShowMessage(true);
							this.props.setMessageType("error");
							setTimeout(()=>{this.props.setShowMessage(false)},4*1000);
						}
					});
					
				}
				else {
					this.props.setUser({username: "", userId: "", email: ""});
					this.props.setShowLoginOrSignup(true);					
					this.props.setLoggedIn(false);			
				}
			});
			
		}
		this.postCommentHandler=()=>{
			if(this.state.commentBody==null || this.state.commentBody.trim().length===0) {
				//showing message box 
				this.props.setMessage("Comment Required.");
				this.props.setShowMessage(true);
				this.props.setMessageType("error");
				setTimeout(()=>{this.props.setShowMessage(false)},3*1000);
				return;
			}
			const newComment=new Comment(this.state.commentBody,this.props.parentType,this.props.parentId);
			this.postComment(newComment);
		}
		this.postSubCommentHandler=(evt,index,parentId)=>{
			const subCommentBody=this.state.subCommentBodies[index];
			if(subCommentBody==null || subCommentBody.trim().length===0) {
				this.props.setMessage("Comment Required.");
				this.props.setShowMessage(true);
				this.props.setMessageType("error");
				setTimeout(()=>{this.props.setShowMessage(false)},3*1000);
				return;				
			}
			const newComment=new Comment(subCommentBody,"comment",parentId);
			this.postComment(newComment);			
		}
		this.subCommentOnChangeHandler=(evt,index)=>{
			const subCommentBodies=[...this.state.subCommentBodies];
			subCommentBodies[index]=evt.target.value;
			this.setState({subCommentBodies});
		}
		this.repliesClickHandler=(evt,index)=>{
			const showSubComments=[...this.state.showSubComments];
			showSubComments[index]=!showSubComments[index];
			this.setState({showSubComments});
		}
		this.deleteCommentHandler=(commentId,cUserId)=>{
			this.props.checkLoginFirst((userRes)=>{
				if(userRes.success) {
					const {username,_id:userId,email}=userRes.user;
					this.props.setUser({username,userId,email});
					this.props.setShowLoginOrSignup(false);
					this.props.setLoggedIn(true);
					// perform action here
					const valid=this.authorityCheck(cUserId);
					if(!valid) {
						//showing message box 
						this.props.setMessage("You are not Authorized to delete.");
						this.props.setShowMessage(true);
						this.props.setMessageType("error");
						setTimeout(()=>{this.props.setShowMessage(false)},4*1000);
						return;
					} 
					fetch("http://localhost:8888/deleteComment/"+commentId,{
						method: "DELETE",
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
							this.props.init();
						}
						else {
							//showing message box 
							this.props.setMessage(res.message);
							this.props.setShowMessage(true);
							this.props.setMessageType("error");
							setTimeout(()=>{this.props.setShowMessage(false)},4*1000);
						}
					});
					
				}
				else {
					this.props.setUser({username: "", userId: "", email: ""});
					this.props.setShowLoginOrSignup(true);					
					this.props.setLoggedIn(false);			
				}
			});
			
		}
		this.authorityCheck=(cUserId)=>{
			if(cUserId===this.props.user.userId) return true;
			else return false;
		}
		this.editClickHandler=(evt,toUpdateCommentBody,toUpdateCommentId,toUpdateCommentUserId)=>{
			this.props.checkLoginFirst((userRes)=>{
				if(userRes.success) {
					const {username,_id:userId,email}=userRes.user;
					this.props.setUser({username,userId,email});
					this.props.setShowLoginOrSignup(false);
					this.props.setLoggedIn(true);
					// perform action here
					if(!this.authorityCheck(toUpdateCommentUserId)) {
							//showing message box 
							this.props.setMessage("You are not Authorized to delete.");
							this.props.setShowMessage(true);
							this.props.setMessageType("error");
							setTimeout(()=>{this.props.setShowMessage(false)},4*1000);
						return;
					}
					this.setState({
						showEditModal: true,
						toUpdateCommentBody,
						toUpdateCommentId,
					});
					
				}
				else {
					this.props.setUser({username: "", userId: "", email: ""});
					this.props.setShowLoginOrSignup(true);					
					this.props.setLoggedIn(false);			
				}
			});			
		}
		this.updateCommentHandler=(evt)=>{
			this.props.checkLoginFirst((userRes)=>{
				if(userRes.success) {
					const {username,_id:userId,email}=userRes.user;
					this.props.setUser({username,userId,email});
					this.props.setShowLoginOrSignup(false);
					this.props.setLoggedIn(true);
					// perform action here
					if(this.state.toUpdateCommentBody==null || this.state.toUpdateCommentBody.length===0) {
						this.setState({
							toUpdateCommentError: "Required.",
						});
						return;
					}
					fetch(`http://localhost:8888/updateComment/${this.state.toUpdateCommentId}`,{
						method: "PUT",
						headers: {"content-type": "application/json"},
						credentials: "include",
						body: JSON.stringify({body: this.state.toUpdateCommentBody}),
					})
					.then(res=>res.json())
					.then(res=>{
						if(res.success) {
							this.setState({
								showEditModal: false,
							});
							//showing message box 
							this.props.setMessage(res.message);
							this.props.setShowMessage(true);
							this.props.setMessageType("success");
							setTimeout(()=>{this.props.setShowMessage(false)},4*1000);
							this.props.init();
						}
						else {
							//showing message box 
							this.props.setMessage(res.message);
							this.props.setShowMessage(true);
							this.props.setMessageType("error");
							setTimeout(()=>{this.props.setShowMessage(false)},4*1000);
						}
					});
					
				}
				else {
					this.setState({
						showEditModal: false,
					});
					this.props.setUser({username: "", userId: "", email: ""});
					this.props.setShowLoginOrSignup(true);					
					this.props.setLoggedIn(false);			
				}
			});			
			
		}

	}
	render() {
		return (
			<div className="comments-container">
				<div className="comments-heading">
					Comments 
					<button type="button" className="arrow-button" onClick={(evt)=>{this.setState({showQuestionComments: !this.state.showQuestionComments})}}>
					{
						(this.state.showQuestionComments)?
						<i className="fa fa-chevron-down"></i>
						:
						<i className="fa fa-chevron-right"></i>
					}
					</button>
				</div>
				{
					(this.state.showQuestionComments)?
					<>
						<input type="text" className="comment-input form-control" placeholder="Add a Comment" value={this.state.commentBody} onChange={(evt)=>{this.setState({commentBody: evt.target.value})}} disabled={this.props.disabled}/>
						<button type="button" className="comment-post-button btn btn-primary btn-sm" onClick={this.postCommentHandler} disabled={this.props.disabled} ><i className="fa fa-paper-plane"></i></button>
						{
						this.props.comments.map((comment,commentIndex)=>{
							return (
								<div className="comment-wrapper" key={commentIndex}>
									<div className="comment">
										<div className="comment-body">
											<span className="username">{comment.username}</span> :&nbsp;
											{comment.body}
										</div>
										<div className="comment-footer">
											<button type="button" className="comment-operation-button" onClick={(evt)=>{this.repliesClickHandler(evt,commentIndex)}}>{comment.subComments.length} Replies</button>
											<button type="button" className="comment-operation-button" onClick={(evt)=>{this.editClickHandler(evt,comment.body,comment._id,comment.userId)}} hidden={comment.userId!==this.props.user.userId}>Edit</button>
											<button type="button" className="comment-operation-button" onClick={(evt)=>{this.deleteCommentHandler(comment._id,comment.userId)}} hidden={comment.userId!==this.props.user.userId}>Delete</button>
											<span className="post-date-container">{new Date(comment.postDate).toLocaleString("en-US",{dateStyle: "medium"})}</span>
										</div>
									</div>
									{
										(this.state.showSubComments[commentIndex])?
										<>
											<div className="sub-comments">
												{
													comment.subComments.map((subComment,subCommentIndex)=>{
														return (
																<div key={subCommentIndex} className="sub-comment">
																	<div className="comment-body">
																		<span className="username">{subComment.username}</span> :&nbsp;
																		{subComment.body}
																	</div>
																	<div className="comment-footer">
																		<button type="button" className="comment-operation-button" onClick={(evt)=>{this.editClickHandler(evt,subComment.body,subComment._id,subComment.userId)}} hidden={subComment.userId!==this.props.user.userId}>Edit</button>
																		<button type="button" className="comment-operation-button" onClick={(evt)=>{this.deleteCommentHandler(subComment._id,subComment.userId)}} hidden={subComment.userId!==this.props.user.userId}>Delete</button>
																		<span className="post-date-container">{new Date(subComment.postDate).toLocaleString("en-US",{dateStyle: "medium"})}</span>
																	</div>
																</div>
														)
													})
												}
												<input type="text" className="comment-input form-control" placeholder="Add a Comment" value={this.state.subCommentBodies[commentIndex]} onChange={(evt)=>{this.subCommentOnChangeHandler(evt,commentIndex)}} />
												<button type="button" className="comment-post-button btn btn-primary btn-sm" onClick={(evt)=>this.postSubCommentHandler(evt,commentIndex,comment._id)}><i className="fa fa-paper-plane"></i></button>
											</div>												
										</>
										:
										null
									}
								</div>						
							)
						})
					}
					</>
					:
					null
				}
				<Modal
					size="md"
					centered
					show={this.state.showEditModal}
					onHide={(evt)=>{this.setState({showEditModal: false})}}
				>
					<Modal.Header>
						<Modal.Title>Edit Comment</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<div>
							{
								(this.state.toUpdateCommentError.length>0)?
								<label  className="errorLabel">
									<span className="errorLogo">&nbsp; ! &nbsp;</span>							
									{this.state.toUpdateCommentError}
								</label>
								:null
							}											
							<input className="form-control" placeholder="Add comment" value={this.state.toUpdateCommentBody} onChange={(evt)=>{this.setState({toUpdateCommentBody: evt.target.value,toUpdateCommentError: ""})}}/><br/>
							<button className="modal-button btn btn-sm btn-dark" onClick={(evt)=>{this.setState({showEditModal: false})}}>Cancel</button>
							<button className="modal-button btn btn-sm btn-primary" onClick={this.updateCommentHandler}>Update</button>
						</div>
					</Modal.Body>
				</Modal>
			
			</div>
		
		);
	}
}

export default connect(mapStateToProps,mapDispatchToProps)(CommentsContainer);