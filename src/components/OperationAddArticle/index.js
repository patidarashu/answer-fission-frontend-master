import React,{Component} from 'react';
import { Link } from 'react-router-dom';
import './styles.css';
import ArticleModelImage from './../../images/icons/articleModel.png';

export default class OperationAddArticle extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<div className="operation operation-add-article">
				<center><img alt="ArticleModel" className="model-logo" src={ArticleModelImage} /></center>
				<p className="operation-description">
					<center><b>Good at Writing?</b></center><br/>
					Showcase your skills and contribute your talent for others to learn.
				</p>
				<br/>
				<br/>
				<Link to="/AddArticle">
					<button className="operation-button add-article-button btn">Add An Article</button>
				</Link>

			</div>
		);
	}
}