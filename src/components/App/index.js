import React, { Component } from 'react';
import './styles.css';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import Header from './../Header';
import Footer from './../Footer';
import DescriptionContainer from './../DescriptionContainer';
import OperationContainer from './../OperationContainer';
import AskQuestion from './../AskQuestion';
import SearchQuestion from './../SearchQuestion';
import AddArticle from './../AddArticle';
import Question from './../Question';
import Profile from './../Profile';
import EditQuestion from './../EditQuestion';
import ArticleListContainer from './../ArticleListContainer';
import Article from './../Article';
import EditArticle from './../EditArticle';
import WebTeam from './../WebTeam';

import { connect } from 'react-redux';
import {mapStateToProps, mapDispatchToProps} from './../../store/mappingHandlers';

class App extends Component {
	constructor(props) {
		super(props);
		console.log(this.props);
	}
	render(){
	  return (
		<div className="App">
			<BrowserRouter>
				<Header />
				<Switch>
					<Route exact path="/">
						<DescriptionContainer />
						<OperationContainer />
						<p style={{textAlign: "left", paddingBottom: "50px", margin: "0px 10px"}}>
							  <blockQuote>
								“Let’s be reasonable and add an eighth day to the week that is devoted exclusively to reading.” <br/>
								– Lena Dunham
								<br/>
								<Link to="/Articles">
									<button type="button" className="btn add-article-button mb-2 mt-2">Read Articles</button>
								</Link>
							  </blockQuote>
						</p>
					</Route>
					<Route excat path="/Articles">
						<ArticleListContainer />					
					</Route>
					<Route exact path="/AskQuestion">
						<AskQuestion />
					</Route>
					<Route exact path="/SearchQuestion">
						<SearchQuestion />
					</Route>					
					<Route exact path="/AddArticle">
						<AddArticle />
					</Route>					
					<Route exact path="/Question/:questionId" component={Question} />
					<Route exact path="/EditQuestion/:questionId" component={EditQuestion} />
					<Route exact path="/Article/:articleId" component={Article} />
					<Route exact path="/EditArticle/:articleId" component={EditArticle} />
					<Route exact path="/User/:userId" component={Profile} />
					<Route exact path="/webteam">
						<WebTeam />
					</Route>					
				</Switch>
				<div className={`message-box ${this.props.messageType}`} hidden={!this.props.showMessage}>{this.props.message}</div>
				<Footer />
			</BrowserRouter>
		</div>
	  );		
	}
}

export default connect(mapStateToProps,mapDispatchToProps)(App);