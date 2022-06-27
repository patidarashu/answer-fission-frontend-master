import React,{Component} from 'react';
import './styles.css';
import { Link } from 'react-router-dom';
import SearchModelImage from './../../images/icons/searchModel.png';

export default class OperationSearchQuestion extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<div className="operation operation-search-question">
				<center><img alt="Search Model" className="model-logo" src={SearchModelImage} /></center>
				<p className="operation-description">
					<center><b>Remember!</b><br/><br/></center>
					Before Adding a question to forum try to search it and get the answer immediatly if alredy available.
				</p>
				<br/>
				<Link to="/SearchQuestion">
					<button className="operation-button search-question-button btn">Search for Question</button>
				</Link>

			</div>
		);
	}
}