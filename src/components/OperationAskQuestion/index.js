import React,{Component} from 'react';
import { Link } from 'react-router-dom';
import './styles.css';
import QuestionModelImage from './../../images/icons/questionModel.png';

export default class OperationAskQuestion extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<div className="operation operation-ask-question">
				<center><img alt="ArticleModel" className="model-logo" src={QuestionModelImage} /></center>
				<p className="operation-description">
					<center><b>Have Question in mind?</b></center><br/>
					Add your question to the forum and get the answer from the experts of their fields.
				</p>
				<br/>
				<Link to="/AskQuestion">
					<button className="operation-button ask-question-button btn">Ask A Question</button>
				</Link>

			</div>
		);
	}
}