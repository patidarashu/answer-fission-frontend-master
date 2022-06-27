import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import './styles.css';
import Paginator from './../Paginator';

export default class SearchQuestion extends Component {
	constructor(props) {
		super(props);
		this.limit=5;
		this.state={
			searchString: "",
			searchResults: [],
			activePageNumber: 0,
			totalPages: 0,
			totalResults: 0,
			searchedSomething: false,
		}
		this.searchButtonHandler=(evt,pageNumber=1)=>{
			if(pageNumber!==1 && pageNumber===this.state.activePageNumber) return;
			const searchString=this.state.searchString.trim();
			if(searchString==null || searchString.length===0) return;
			fetch("http://localhost:8888/searchForQuestion",{
				method: "POST",
				headers: {"content-type": "application/json"},
				body: JSON.stringify({searchString,pageNumber,limit: this.limit}),
				credentials: "include",
			})
			.then(res=>res.json())
			.then(res=>{
				this.setState({
					searchResults: res.searchResults,
					totalPages: res.totalPages,
					activePageNumber: pageNumber,
					totalResults: res.totalResults,
					searchedSomething: true,
				});
			});
		}
		this.onEnterPressedHandler=(evt)=>{
			if(evt.keyCode===13) {
				this.searchButtonHandler();
			}
		}
		this.prevClickHandler=(evt)=>{
			if(this.state.activePageNumber>1) {
				this.searchButtonHandler(evt,this.state.activePageNumber-1);
			} 
		}
		this.nextClickHandler=(evt)=>{
			if(this.state.activePageNumber<this.state.totalPages) {
				this.searchButtonHandler(evt,this.state.activePageNumber+1);
			} 			
		}
	}
	render() {
		return (
			<div className="search-question">
				<h4 className="page-title">
					<span>Search For Question</span>
					<div style={{display: "flex",margin: "10px 2px 0px 0px"}}>
						<input type="text" className="search-input form-control" placeholder="Search" value={this.state.searchString} onChange={(evt)=>{this.setState({searchString: evt.target.value,searchedSomething: false,})}} onKeyDown={this.onEnterPressedHandler}/>
						<button type="button" className="search-button btn" onClick={this.searchButtonHandler}><i className="fa fa-search search-icon"></i></button>
					</div>
				</h4>
				<div className="search-question-wrapper">
					{
						(this.state.searchResults.length!==0)?
						<div className="result-counter">
							{this.state.totalResults} Result{(this.state.totalResults>1)?"s":null}
						</div>
						:
						null
					}
					<ul className="search-question-list">
					{
						(this.state.searchResults.length===0)?
							<>
							{
							(this.state.searchedSomething)?
							<div className="not-found-message">
								<span className="errorLogo">&nbsp; ! &nbsp;</span>							
								<span>No matching record found for <b>{this.state.searchString}</b></span>
							</div>
							:
							null
							}
							</>
						:
						this.state.searchResults.map((question,index)=>{
								return (<li key={index} className="search-question-list-item">
								<div className="item-body">
									<div className={`answer-counter${(question.resolved)?" filled":""}`} data-title={`${(question.resolved)?"Problem resolved":"Problem does not resolve."}`}>
										<span className="answer-figure">{question.totalAnswers}</span><br/>
										<span className="answer-word">Answers</span>
									</div>
									<Link to={`/Question/${question._id}`} style={{textDecoration: "none"}}>
									<div className="question-title">
										{question.title}
									</div>
									</Link>
								</div>
								<div className="item-footer">
									<div className="vote-counter">
										<span className="vote-figure">{question.votes.positive.length-question.votes.negative.length}</span>
										<span className="vote-word"> Votes</span>
									</div>
									<div className="post-date-container">
										Posted on {new Date(question.postDate).toLocaleString("en-US",{dateStyle: "long"})}
									</div>
								</div>
							</li>)
							
						})
					}
					</ul>
					<Paginator onPageChange={this.searchButtonHandler} activePageNumber={this.state.activePageNumber} totalPages={this.state.totalPages} theme={{foreground: "rgb(246, 146, 30)", background: "white"}}/>
				</div>
			</div>
		);
	}
}