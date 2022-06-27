import React, { Component } from 'react';
import './styles.css';
import Paginator from './../Paginator';
import { Link } from 'react-router-dom';

export default class ArticleListContainer extends Component {
	constructor(props) {
		super(props);
		this.limit=6;
		this.state={
			searchString: "",
			searchResults: [],
			activePageNumber: 0,
			totalPages: 0,
			totalResults: 0,
			searchedSomething: false,
		}
		this.init=()=>{
			const pageNumber=1;
			const searchString="";
//			if(searchString==null || searchString.length===0) return;
			fetch("http://localhost:8888/searchForArticles",{
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
			})
			.catch(err=>{
				console.log(err);
			});
		}
		this.searchButtonHandler=(evt,pageNumber=1)=>{
			if(pageNumber!==1 && pageNumber===this.state.activePageNumber) return;
			const searchString=this.state.searchString.trim();
			if(searchString==null || searchString.length===0) return;
			fetch("http://localhost:8888/searchForArticles",{
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
			})
			.catch(err=>{
				console.log(err);
			});
		}
		this.onEnterPressedHandler=(evt)=>{
			if(evt.keyCode===13) {
				this.searchButtonHandler();
			}
		}
	}
	componentDidMount() {
		this.init();
	}
	render() {
		return (
			<div className="article-list-container">
				<h4 className="page-title">
					<span>Articles</span>
					<div style={{display: "flex",margin: "10px 2px 0px 0px"}}>
						<input type="text" className="search-input form-control" placeholder="Search" value={this.state.searchString} onChange={(evt)=>{this.setState({searchString: evt.target.value,searchedSomething: false,})}} onKeyDown={this.onEnterPressedHandler}/>
						<button type="button" className="search-button btn" onClick={this.searchButtonHandler}><i className="fa fa-search search-icon"></i></button>
					</div>
				</h4>
				<div className="article-list-wrapper">
					<Paginator onPageChange={this.searchButtonHandler} activePageNumber={this.state.activePageNumber} totalPages={this.state.totalPages} theme={{foreground: "rgb(34, 64, 153)", background: "white"}}/>
					<div className="row" style={{padding: "5px"}}>
					{
						this.state.searchResults.map((article,articleIndex)=>{
							return (
								<div className="col-lg-4 col-md-6 article-list-item">
									<div className="card m-1">
									  <div className="card-body" style={{padding: "10px"}}>
										<h5 className="card-title article-title">{article.title}</h5>
										<div className="username-container">
											<span>Author: </span><span className="username"><Link to={`/user/${article.userId}`} style={{textDecoration: "none"}}>{article.username}</Link></span>
											<span className="post-date-container">{new Date(article.postDate).toLocaleString("en",{dateStyle: "medium"})}</span>
										</div>
										<div className="article-description-wrapper">
											<p className="card-text article-description" dangerouslySetInnerHTML={{__html: article.description}}></p>
											<p className="read-more">
												<Link to={`/Article/${article._id}`}>
												<button type="button" className="btn add-article-button btn-sm read-more-button">Read more</button>
												</Link>
											</p>
										</div>
									  </div>
									</div>					
								</div>
							)
						})
					}
					</div>
				</div>
			</div>
		);
	}
}