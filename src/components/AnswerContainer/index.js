import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './styles.css';
import Modal from 'react-bootstrap/Modal';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import ArrowUpIcon from './../../images/icons/arrow-up.png';
import ArrowDownIcon from './../../images/icons/arrow-down.png';
import CommentsContainer from './../CommentsContainer';

import { connect } from 'react-redux';
import {mapStateToProps, mapDispatchToProps} from './../../store/mappingHandlers';


class AnswerContainer extends Component {
	constructor(props) {
		super(props);
		this.state={
			showEditModal: false,
			answerDescriptionError: "",
			answerDescription: "",
		}
		this.sendVoteRequest=(url)=> {
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
							this.props.init();
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
			this.sendVoteRequest(`http://localhost:8888/votePositiveForAnswer/${this.props.answer._id}`);
		}
		this.voteNegativeHandler=(evt)=>{
			this.sendVoteRequest(`http://localhost:8888/voteNegativeForAnswer/${this.props.answer._id}`);
		}
		this.editClickHandler=(evt)=>{
			this.props.checkLoginFirst((userRes)=>{
				if(userRes.success) {
					const {username,_id:userId,email}=userRes.user;
					this.props.setUser({username,userId,email});
					this.props.setShowLoginOrSignup(false);
					this.props.setLoggedIn(true);
					// perform action here
					if(this.props.answer.userId!==this.props.user.userId) {
						//showing message box 
						this.props.setMessage("You are not Authorized to edit.");
						this.props.setShowMessage(true);
						this.props.setMessageType("error");
						setTimeout(()=>{this.props.setShowMessage(false)},4*1000);
						return;
					}
					this.setState({
						answerDescription: this.props.answer.description,
						answerDescriptionError: "",
						showEditModal: true,
					});
					
				}
				else {
					this.props.setUser({username: "", userId: "", email: ""});
					this.props.setShowLoginOrSignup(true);					
					this.props.setLoggedIn(false);			
				}
			});			
		}
		this.updateAnswerHandler=(evt)=>{
			this.props.checkLoginFirst((userRes)=>{
				if(userRes.success) {
					const {username,_id:userId,email}=userRes.user;
					this.props.setUser({username,userId,email});
					this.props.setShowLoginOrSignup(false);
					this.props.setLoggedIn(true);
					// perform action here
					const answer={
						description: this.state.answerDescription,
					};
					fetch(`http://localhost:8888/updateAnswer/${this.props.answer._id}`,{
						method: "PUT",
						headers: {"content-type": "application/json"},
						credentials: "include",
						body: JSON.stringify(answer),
					})
					.then(res=>res.json())
					.then(res=>{
						if(res.success) {
							//showing message box 
							this.props.setMessage(res.message);
							this.props.setShowMessage(true);
							this.props.setMessageType("success");
							setTimeout(()=>{this.props.setShowMessage(false)},4*1000);
							this.setState({
								showEditModal: false,
								answerDescription: "",
								answerDescriptionError: "",
							});
							this.props.init();
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
		this.showConfirmClickedHandler=(evt)=>{
			this.props.checkLoginFirst((userRes)=>{
				if(userRes.success) {
					const {username,_id:userId,email}=userRes.user;
					this.props.setUser({username,userId,email});
					this.props.setShowLoginOrSignup(false);
					this.props.setLoggedIn(true);
					// perform action here
					if(this.props.answer.userId!==this.props.user.userId) {
						//showing message box 
						this.props.setMessage("You are not Authorized to delete.");
						this.props.setShowMessage(true);
						this.props.setMessageType("error");
						setTimeout(()=>{this.props.setShowMessage(false)},4*1000);
						return;
					}
					const confirmMessage="Are you sure you want to delete this Answer?";
					const onConfirm=()=>{
						fetch(`http://localhost:8888/deleteAnswer/${this.props.answer._id}`, {
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
		this.sendResolvedChangeRequest=(url)=> {
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
		this.markAsResolvedClickHandler=(evt)=>{
			const url=`http://localhost:8888/markAsResolved/${this.props.answer.questionId}/${this.props.answer._id}`;
			this.sendResolvedChangeRequest(url);
		}
		this.markAsUnresolvedClickHandler=(evt)=>{
			const url=`http://localhost:8888/markAsUnresolved/${this.props.answer.questionId}/${this.props.answer._id}`;
			this.sendResolvedChangeRequest(url);
		}
	}
	render() {
		return (
			<div className="answer-container" key={this.props.answer._id}>
				<div className="af-row">
					<div className="vote-display">
						<button type="button" className="vote-button vote-increment-button" data-title="This answer is useful" onClick={this.votePositiveHandler} disabled={this.props.answer.userId===this.props.user.userId}><img alt="+" className="vote-button-icon" src={ArrowUpIcon}/></button>
						<div className="vote-figure" data-title="Votes">{this.props.answer.votes.positive.length-this.props.answer.votes.negative.length}</div>
						<button type="button" className="vote-button vote-decerement-button" data-title="This answer is not useful" onClick={this.voteNegativeHandler} disabled={this.props.answer.userId===this.props.user.userId}><img alt="-" className="vote-button-icon" src={ArrowDownIcon}/></button>
						<div className="resolved-sign" data-title="Problem resolved by this Answer." hidden={!this.props.answer.resolvable}><i className="fa fa-check"></i></div>
					</div>
					<div style={{width: "100%"}}>
						<div className="answer-status-container">
							<div className="af-row" style={{justifyContent: "space-between"}}>
								<div>
									<div className="username-container">By <Link to={`/user/${this.props.answer.userId}`} style={{textDecoration: "none",fontWeight: "500"}}>{this.props.answer.username}</Link></div>
									<div className="post-date-container">Posted on {new Date(this.props.answer.postDate).toLocaleString("en-US",{dateStyle: "long"})}</div>
								</div>
								<div  style={{textAlign: "right"}}>
									{
										(this.props.answer.resolvable)?
										<button type="button" className="btn btn-sm btn-outline-warning" onClick={this.markAsUnresolvedClickHandler} hidden={this.props.questionUserId!==this.props.user.userId} style={{margin: "4px"}}><i className="fa fa-remove"></i> Mark as Unresolved</button>
										:
										<button type="button" className="btn btn-sm btn-outline-success" onClick={this.markAsResolvedClickHandler} hidden={this.props.questionUserId!==this.props.user.userId} style={{margin: "4px"}}><i className="fa fa-check"></i> Mark as Resolved</button>
										
									}
									<button type="button" className="button btn btn-dark btn-sm" onClick={this.editClickHandler} hidden={this.props.answer.userId!==this.props.user.userId}><i className="fa fa-pencil"></i> Edit</button>
									<button type="button" className="button btn btn-danger btn-sm" onClick={(evt)=>this.showConfirmClickedHandler(evt,true)} hidden={this.props.answer.userId!==this.props.user.userId}><i className="fa fa-trash"></i> Delete</button>
								</div>
							</div>
						</div>
						<div className="answer-description" dangerouslySetInnerHTML={{__html: this.props.answer.description}}>
						</div>
					</div>
				</div>
				<CommentsContainer parentType={"answer"} parentId={this.props.answer._id} init={this.props.init} comments={this.props.answer.comments} />
				<Modal
					size="lg"
					centered
					show={this.state.showEditModal}
					onHide={(evt)=>{this.setState({showEditModal: false})}}
				>
					<Modal.Header>
						<Modal.Title>Edit Answer</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<div>
							{
								(this.state.answerDescriptionError.length>0)?
								<label  className="errorLabel">
									<span className="errorLogo">&nbsp; ! &nbsp;</span>							
									{this.state.answerDescriptionError}
								</label>
								:null
							}
							<CKEditor
								editor={ ClassicEditor }
								data={this.state.answerDescription}
									config={{         
									  toolbar: ['heading', '|', 'bold', 'italic', 'numberedList', 'bulletedList', 'blockQuote', 'link', 'imageUpload', '|', 'insertTable',
										'tableColumn', 'tableRow', 'mergeTableCells', 'mediaEmbed', '|', 'undo', 'redo'],
									  ckfinder: {
										  uploadUrl: "http://localhost:8888/imageUpload/answer",
									  }
										
									}}     				
								onReady={ (editor) => {
								} }
								onChange={ ( event, editor ) => {
									const data = editor.getData();
									this.setState({
										answerDescription: data,
										answerDescriptionError: ""
									});
								} }
							/>
							
							<button className="modal-button btn btn-sm btn-dark" onClick={(evt)=>{this.setState({showEditModal: false})}}>Cancel</button>
							<button className="modal-button btn btn-sm btn-primary" onClick={this.updateAnswerHandler}>Update</button>
						</div>
					</Modal.Body>
				</Modal>
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

export default connect(mapStateToProps,mapDispatchToProps)(AnswerContainer);