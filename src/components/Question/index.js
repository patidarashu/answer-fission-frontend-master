import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './styles.css';
import Modal from 'react-bootstrap/Modal';
import ArrowUpIcon from './../../images/icons/arrow-up.png';
import ArrowDownIcon from './../../images/icons/arrow-down.png';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import CommentsContainer from './../CommentsContainer';
import AnswerContainer from './../AnswerContainer';


import { connect } from 'react-redux';
import {mapStateToProps, mapDispatchToProps} from './../../store/mappingHandlers';

class Answer {
	construcor() {
		this.description="";
		this.questionId="";
	}
}
class Question extends Component {
	constructor(props) {
		super(props);
		this.questionId=this.props.match.params.questionId;
		this.state={
			question: {tags: [],answers: [], comments: [],votes: {positive: [],negative: []}},
			error: "",
			answerDescription: "", 
			answerDescriptionError: "",
			showConfirmModal: false,
			confirmMessage: "",
			onConfirm: null,
		}
		this.init=()=>{
			fetch("http://localhost:8888/getQuestion/"+this.questionId,{
				method: "GET",
				headers: {"content-type": "application/json"},
				credentials: "include",
			})
			.then(res=>res.json())
			.then(res=>{
				if(res.success) {
					this.setState({question: res.question});
				}
				else {
					this.setState({
						error: res.message,
					});
				}
			})
			.catch(err=>{
				//showing message box 
				this.props.setMessage("Unable to get the Question. Please check you connection.");
				this.props.setShowMessage(true);
				this.props.setMessageType("error");
				setTimeout(()=>{this.props.setShowMessage(false)},4*1000);
			});			
		}
		this.init();
		this.postAnswerHandler=(evt)=>{
			this.props.checkLoginFirst((userRes)=>{
				if(userRes.success) {
					const {username,_id:userId,email}=userRes.user;
					this.props.setUser({username,userId,email});
					this.props.setShowLoginOrSignup(false);
					this.props.setLoggedIn(true);
					// perform action here
					const answer=new Answer();
					answer.description=this.state.answerDescription;
					answer.questionId=this.state.question._id;
					let valid=true;
					if(answer.description==null || answer.description.length===0) {
						this.setState({
							answerDescriptionError: "Description required."
						});
						valid=false;
					}
					if(!valid) return;
					fetch("http://localhost:8888/postAnswer",{
						method: "POST",
						headers: {"content-type": "application/json"},
						body: JSON.stringify(answer),
						credentials: "include",
					})
					.then(res=>res.json())
					.then(res=>{
						if(res.success) {
							this.setState({
								answerDescription: "",
								answerDescriptionError: res.message
							});
							this.init();
						}
						else {
							this.setState({
								answerDescriptionError: res.message
							});
						}
					})
					.catch(err=>{
						//showing message box 
						this.props.setMessage("Unable to Post Answer.");
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
			this.sendVoteRequest(`http://localhost:8888/votePositiveForQuestion/${this.state.question._id}`);
		}
		this.voteNegativeHandler=(evt)=>{
			this.sendVoteRequest(`http://localhost:8888/voteNegativeForQuestion/${this.state.question._id}`);
		}
		this.redirectToEditQuestion=()=>{
			this.props.checkLoginFirst((userRes)=>{
				if(userRes.success) {
					const {username,_id:userId,email}=userRes.user;
					this.props.setUser({username,userId,email});
					this.props.setShowLoginOrSignup(false);
					this.props.setLoggedIn(true);
					// perform action here
					if(this.state.question.userId===this.props.user.userId) {
						// redirecting to EditQuestion page
						this.props.history.push(`/EditQuestion/${this.state.question._id}`);
					}
					else {
						//showing message box 
						this.props.setMessage("You are not Authorized to edit.");
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
					if(this.state.question.userId!==this.props.user.userId) {
						//showing message box 
						this.props.setMessage("You are not Authorized.");
						this.props.setShowMessage(true);
						this.props.setMessageType("error");
						setTimeout(()=>{this.props.setShowMessage(false)},4*1000);
						return;
					}
					const operation=(value)?"close":"open";
					const confirmMessage=`Are you sure you want to ${operation} this Question?`;
					const onConfirm=()=>{
						fetch(`http://localhost:8888/openOrCloseQuestion/${this.state.question._id}`, {
							method: "PUT",
							headers: {"content-type": "application/json"},
							credentials: "include",
							body: JSON.stringify({closed: value}),
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
		<div className="question-container">
		{
			(this.state.error.length===0)?
			<>
			<div className="question-wrapper">
				<div className="question-header">
					<div className="af-row">
						<div className="vote-display">
							<button type="button" className="vote-button vote-increment-button" data-title="This question is useful and clear" onClick={this.votePositiveHandler} disabled={this.state.question.userId===this.props.user.userId}><img alt="+" className="vote-button-icon" src={ArrowUpIcon} /></button>
							<div className="vote-figure" data-title="Votes">{this.state.question.votes.positive.length-this.state.question.votes.negative.length}</div>
							<button type="button" className="vote-button vote-decerement-button" data-title="This question is unclear or not useful" onClick={this.voteNegativeHandler} disabled={this.state.question.userId===this.props.user.userId}><img alt="-" className="vote-button-icon" src={ArrowDownIcon}/></button>
						</div>
						<div className="question-title-container">
							<div className="af-row" style={{justifyContent: "space-between"}}>
								<h4>
									{this.state.question.title} 
								</h4>
								{
									(this.state.question.closed)?
									<span style={{ fontSize: "14px",marginTop: "5px"}} data-title-end="Cannot perfom any activity on a closed question.">
										<i className="fa fa-lock" style={{color: "rgb(0,0,0)",padding: "2px"}}></i>
										<span style={{ color: "rgb(225,0,0)", fontWeight: "500",}}>CLOSED</span>
									</span>
									:
									null
								}
							</div>
							<div className="question-status-container">
								<div className="af-row" style={{justifyContent: "space-between"}}>
									<div>
										<div className="username-container">By <Link to={`/user/${this.state.question.userId}`} style={{textDecoration: "none",fontWeight: "500"}}>{this.state.question.username}</Link></div>
										<div className="post-date-container">Posted on {new Date(this.state.question.postDate).toLocaleString("en-US",{dateStyle: "medium"})}</div>
									</div>
									<div style={{ textAlign: "right" }} hidden={this.state.question.userId!==this.props.user.userId}>
										<button type="button" className="button btn btn-dark btn-sm" onClick={this.redirectToEditQuestion}><i className="fa fa-pencil"></i> Edit</button>
										{
											(this.state.question.closed)?
											<button type="button" data-title-end="Activate this question again." className="button btn btn-success btn-sm" onClick={(evt)=>this.showConfirmClickedHandler(evt,false)}><i className="fa fa-check"></i> Open</button>											
											:
											<button type="button" data-title-end="No activity will be performed on a closed Question." className="button btn btn-danger btn-sm" onClick={(evt)=>this.showConfirmClickedHandler(evt,true)}><i className="fa fa-close"></i> Close</button>
										}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="question-description" dangerouslySetInnerHTML={{__html: this.state.question.description}}>
				</div>
				<div className="tags-container">
				{
					this.state.question.tags.map((tag,tagIndex)=>{
						return <div key={tagIndex} className="tag-tile">{tag}</div>
					})
				}
				</div>
				<CommentsContainer parentType={"question"} parentId={this.state.question._id} init={this.init} comments={this.state.question.comments} disabled={this.state.question.closed} />
			</div>
			<>
			{
				this.state.question.answers.map((answer,answerIndex)=>{
					return (
						<AnswerContainer key={answerIndex} answer={answer} init={this.init} questionUserId={this.state.question.userId} />
					)
				})
			}
			</>
			<div className="add-answer-container" hidden={this.state.question.userId===this.props.user.userId}>
				<h5>
					Your Answer &nbsp;
					{
						(this.state.question.closed)?
						<span data-title="Cannot add answer on a closed Question.">
							<i className="fa fa-lock"></i>
						</span>
						:
						null						
					}
				</h5>
				{
					(this.state.answerDescriptionError.length>0)?
					<label  className="errorLabel">
						<span className="errorLogo">&nbsp; ! &nbsp;</span>							
						{this.state.answerDescriptionError}
					</label>
					:null
				}				
				<CKEditor
					disabled={this.state.question.closed}
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
				<button type="button" className="button btn btn-primary" onClick={this.postAnswerHandler} disabled={this.state.question.closed}>Post Answer</button>
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

export default connect(mapStateToProps,mapDispatchToProps)(Question);