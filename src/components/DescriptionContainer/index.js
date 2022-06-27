import React,{Component} from 'react';
import './styles.css';
export default class DescriptionContainer extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<div className="description-container">
				<p className="description-text">
					<b>Answer Fission</b> is a Question and Answer Forum for passionate and professional learners.<br/>
					You are the backbone of the forum as your contribution is essential to spread the knowledge.
				</p>
			</div>
		);
	}
}