import React from 'react';
import { Link } from 'react-router-dom';
import './styles.css';

export default class Header extends React.Component
{
	constructor(props)
	{
		super(props);
	}
	render()
	{
		return(
			<div className="footer">
				<center>&copy; All the copyrights are reserved. | <Link to="/webteam"><span className="webteam-link">Webteam</span></Link></center>
			</div>
		);
	}
}