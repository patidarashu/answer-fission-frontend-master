import React, { Component } from 'react';
import './styles.css';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import TagInput from './../TagInput';
import Modal from 'react-bootstrap/Modal';
import suggestions from './../../suggestions';

import { connect } from 'react-redux';
import {mapStateToProps, mapDispatchToProps} from './../../store/mappingHandlers';


class Question {
	constructor() {
		this.title="";
		this.description="";
		this.tags=[];		
	}
}

class EditQuestion extends Component {
	constructor(props) {
		super(props);
		this.questionId=this.props.match.params.questionId;
		this.initialState={
			question: {tags: [],answers: [], comments: [],votes: {positive: [],negative: []}},
			title: "",
			description: "",
			tags:[],
			titleError: "",
			descriptionError: "",
			tagsError: "",
			suggestions,
			showPreview: false
		};
		this.state=this.initialState;
		this.init=()=>{
			this.props.checkLoginFirst((userRes)=>{
				if(userRes.success) {
					const {username,_id:userId,email}=userRes.user;
					this.props.setUser({username,userId,email});
					this.props.setShowLoginOrSignup(false);
					this.props.setLoggedIn(true);
					// perform action here
					fetch("http://localhost:8888/getQuestion/"+this.questionId,{
						method: "GET",
						headers: {"content-type": "application/json"},
						credentials: "include",
					})
					.then(res=>res.json())
					.then(res=>{
						if(res.success) {
							this.setState({
								question: res.question,
								title: res.question.title,
								description: res.question.description,
								tags: res.question.tags,								
							});
							
						}
						else {
							this.setState({
								titleError: res.message,
							});
						}
					})
					.catch(err=>{
						this.setState({
							error: "Unable to get the question. Please check your connection.",				
						});
					});			
					
				}
				else {
					this.props.setUser({username: "", userId: "", email: ""});
					this.props.setShowLoginOrSignup(true);					
					this.props.setLoggedIn(false);
				}
				
			});
		}	
		this.onTagAddHandler=(tag)=>{
			const tags=[...this.state.tags];
			const suggestions=[...this.state.suggestions]
			suggestions.splice(suggestions.indexOf(tag),1);
			tags.push(tag);
			this.setState({tags,tagsError: "", suggestions});
		}
		this.onTagRemoveHandler=(index)=>{
			const tags=[...this.state.tags];
			const tag=tags[index];
			const suggestions=[...this.state.suggestions];
			suggestions.push(tag);
			tags.splice(index,1);
			this.setState({tags, suggestions});			
		}
		this.verifyData=(question)=>{
			let valid=true;
			if(question.title.trim().length===0) {
				this.setState({
					titleError: "Title required."
				});
				valid=false;
			}
			if(question.description.length===0) {
				this.setState({
					descriptionError: "Description required."
				});
				valid=false;
			}
			if(question.tags.length===0) {
				this.setState({
					tagsError: "Please add at least one tag."
				});
				valid=false;				
			}
			return valid;
		}
		this.previewClickHandler=(evt)=>{
			const question=new Question();
			question.title=this.state.title;
			question.description=this.state.description;
			question.tags=this.state.tags;
			const valid=this.verifyData(question);
			if(!valid) return;
			this.setState({showPreview: true});
			// style modal properly
		}
		this.updateClickHandler=(evt)=>{
			this.props.checkLoginFirst((userRes)=>{
				if(userRes.success) {
					const {username,_id:userId,email}=userRes.user;
					this.props.setUser({username,userId,email});
					this.props.setShowLoginOrSignup(false);
					this.props.setLoggedIn(true);
					// perform action here
					if(this.state.question.userId!==this.props.user.userId) {
						alert("You are not authorized to update this question!!!");
						// show some message for unauthorization
						// redirected to question page
						this.props.history.push(`/Question/${this.questionId}`);
						return;
					}
					const question=new Question();
					question.title=this.state.title;
					question.description=this.state.description;
					question.tags=this.state.tags;
					const valid=this.verifyData(question);
					if(!valid) return;			
					fetch(`http://localhost:8888/updateQuestion/${this.questionId}`,{
						method: "PUT",
						headers: {
							"content-type": "application/json"
						},
						body: JSON.stringify(question),
						credentials: "include"
					})
					.then(res=>res.json())
					.then(res=>{
						if(res.success) {
							alert(res.message);
							// redirected to question page
							this.props.history.push(`/Question/${this.questionId}`);
						}
						else {
							alert(res.message);
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
		this.cancelClickHandler=(evt)=>{
			this.props.history.push(`/Question/${this.questionId}`);
		}
	}
	componentDidMount() {
		this.init();
	}
	render() {
		return (
			<div className="edit-question">
				<h4 className="page-title">
					<span>Edit Your Question</span>
				</h4>
				<form>
					<div className="input-label">Title</div>
					<div className="input-description">
						Be specific about your question
						{
							(this.state.titleError.length>0)?
							<label className="errorLabel">
								<span className="errorLogo">&nbsp; ! &nbsp;</span>
								{this.state.titleError}
							</label>
							:null
						}
					</div>
					<input type="text" className="title-input form-control" id="edit-question-title-input" placeholder="eg: How to make windows 10 faster?" value={this.state.title} onChange={(evt)=>{this.setState({title: evt.target.value, titleError: ""})}} /> 
					
					<div className="input-label">Description</div>
					<div className="input-description">
						Describe all the information to make it easy to understand
						{
							(this.state.descriptionError.length>0)?
							<label  className="errorLabel">
								<span className="errorLogo">&nbsp; ! &nbsp;</span>							
								{this.state.descriptionError}
							</label>
							:null
						}
					</div>
					<CKEditor
						editor={ ClassicEditor }
						data={this.state.description}
						config={{         
						  toolbar: ['heading', '|', 'bold', 'italic', 'numberedList', 'bulletedList', 'blockQuote', 'link', 'imageUpload', '|', 'insertTable',
							'tableColumn', 'tableRow', 'mergeTableCells', 'mediaEmbed', '|', 'undo', 'redo'],
						  ckfinder: {
							  uploadUrl: "http://localhost:8888/imageUpload/question",
						  }
						}}     				
						onReady={ (editor) => {
						} }
						onChange={ ( event, editor ) => {
							const data = editor.getData();
							this.setState({
								description: data,
								descriptionError: ""
							});
						} }
					/>

					<div className="input-label">Tags</div>
					<div className="input-description">
						Add some relatable tags
						{
							(this.state.tagsError.length>0)?
							<label  className="errorLabel">
								<span className="errorLogo">&nbsp; ! &nbsp;</span>
								{this.state.tagsError}
							</label>
							:null
						}
					</div>
					<TagInput
						tags={this.state.tags}
						suggestions={this.state.suggestions}
						onAdd={this.onTagAddHandler}
						onRemove={this.onTagRemoveHandler}
						placeholder="eg: Technology, OS etc."
					/>
					<div>
						<button type="button" className="cancel-button button btn btn-outline-secondary" onClick={this.cancelClickHandler}>Cancel</button>
						<button type="button" className="btn button btn-dark" onClick={this.previewClickHandler}>Preview</button>
						<button type="button" className="post-button ask-question-button button btn" onClick={this.updateClickHandler}>Update</button>
					</div>
				</form>
				<Modal
					size="lg"
					centered
					show={this.state.showPreview}
					onHide={(evt)=>{this.setState({showPreview: false})}}
				>
					<Modal.Header>
						<Modal.Title style={{color: "rgb(55, 179, 163)"}}>Question Preview</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<div className="preview-question-wrapper">
							<div className="preview-question-title-container">
								<h4>{this.state.title}</h4>
							</div>
							<div className="preview-question-description" dangerouslySetInnerHTML={{__html: this.state.description}}></div>
							<div className="preview-tags-container">
							{
								this.state.tags.map((tag,tagIndex)=>{
									return <div className="preview-tag-tile">{tag}</div>
								})
							}
							</div>
						</div>
					</Modal.Body>
					<Modal.Footer>
						<button className="btn btn-dark" onClick={(evt)=>{this.setState({showPreview: false})}}>OK</button>
					</Modal.Footer>
				</Modal>
			</div>
		);
	}
}

export default connect(mapStateToProps,mapDispatchToProps)(EditQuestion);