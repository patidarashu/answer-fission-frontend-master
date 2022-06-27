import React, {Component} from 'react';
import './styles.css';
import OperationAskQuestion from './../OperationAskQuestion';
import OperationSearchQuestion from './../OperationSearchQuestion';
import OperationAddArticle from './../OperationAddArticle';

export default class OperationContainer extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<div className="operation-container container">
			<div className="row">
			<OperationAskQuestion />
			<OperationSearchQuestion />
			<OperationAddArticle />
			</div>
				
			</div>
		);
	}
}