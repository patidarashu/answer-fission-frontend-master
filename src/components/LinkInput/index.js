import React, {Component} from 'react';
import './styles.css';

export default class LinkInput extends Component {
	constructor(props) {
		super(props);
		this.state={
			linkText: "",
			linkFormatError: ""
		}
		this.isURL=(str)=>{
			let url;
			try {
				url=new URL(str);
			}catch (_) {
				return false;
			}
			return true;
		}
		this.onInputHandler=(evt)=>{
			if(evt.keyCode===13) {
				const value=evt.target.value.trim();
				if(value.length>0) {
					const valid=this.isURL(value);
					if(!valid) {
						// show error
						this.setState({linkFormatError: "Invalid link format. Sample: https://example.com/"});
						return;
					}
					else {
						this.props.onAdd(value);
					}
				}
				this.setState({linkText: "",linkFormatError: ""});
			}
			
		}
		this.onRemoveClickHandler=(evt)=>{
			const index=Number(evt.target.id);
			props.onRemove(index);
		}
	}
	componentDidUpdate() {
		
	}
	render()
	{
		let placeholder=this.props.placeholder;
		return (
			<div>

				<div className="link-input">
					{
						(this.state.linkFormatError.length>0)?
						<label  className="errorLabel">
							<span className="errorLogo">&nbsp; ! &nbsp;</span>
							{this.state.linkFormatError}
						</label>
						:null
					}

					<input type="text" className="form-control" onKeyDown={this.onInputHandler} placeholder={placeholder} value={this.state.linkText} onChange={(evt)=>{this.setState({linkText: evt.target.value,linkFormatError: ""});
}} />
					<ul className="link-list">
						{
							this.props.links.map((item,index)=>{
								return (<li key={index} className="link-li"><a href={item} target="_blank" rel="noreferrer">{item}</a> <button type="button" id={index} className="remove-button" onClick={this.onRemoveClickHandler} style={{outline: "none"}}>X</button></li>);
							})
						}
					</ul>
				</div>
			</div>
		);
	}
}