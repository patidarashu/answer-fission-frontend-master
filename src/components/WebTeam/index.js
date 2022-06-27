import React, { Component } from 'react';
import './styles.css';
import PhotoNileshPatidar from './../../images/PhotoNileshPatidar.jpg';

export default class WebTeam extends Component {
	constructor(props){
		super(props);
	}
	render() {
		return (
			<div className="web-team-container">
				<div className="web-team-wrapper">
					<div className="member-container">
						<img className="member-photo" alt="Photo" src={PhotoNileshPatidar}/>
						<div className="member-name">Ashish Patidar</div>
						<div className="status">
							<span className="field">Role</span> | Backend and Frontend Developer <br/>
						</div>
							<hr/>
						<div className="contacts">
							<a href="https://www.linkedin.com/in/ashish-patidar-34aa1a218/" target="_blank">
								<i className="fa fa-linkedin-square contact-icon"></i>
							</a>
							<a href="https://www.instagram.com/nileshhh__/" target="_blank">
								<i className="fa fa-instagram contact-icon"></i>
							</a>
							<a href="https://twitter.com/d009d4ab58524c5" target="_blank">
								<i className="fa fa-twitter contact-icon"></i>
							</a>
							<br/>
							<br/>
							<div style={{textAlign: "left"}}>
							<i className="fa fa-envelope "></i>  patidarashish388@gmail.com
							<br/>
							<i className="fa fa-phone "></i>  +91 | 8959199523
							</div>

						</div>
					</div>
				</div>
			</div>
		);
	}
}