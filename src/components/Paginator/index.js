import React, { Component } from 'react';
import './styles.css';

export default class Paginator extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		const STYLE={
			default: {
				border: `1px solid ${this.props.theme.foreground}`,
				color: this.props.theme.foreground,
				backgroundColor: this.props.theme.background,
			},
			active: {
				border: `1px solid ${this.props.theme.foreground}`,
				color: this.props.theme.background,
				backgroundColor: this.props.theme.foreground,
			},
		}
		return (
			(this.props.totalPages>1)?
			<>
			<div className="paginator" style={{backgroundColor: this.props.theme.background,borderRadius: "2px"}}>
				<button type="button" className="paginator-button" style={STYLE.active} onClick={(evt)=>this.props.onPageChange(evt,this.props.activePageNumber-1)} disabled={this.props.activePageNumber===1}>Prev</button>
				{
					new Array(this.props.totalPages).fill("").map((item,index)=>{
						const pageNumber=index+1;
						if((pageNumber<this.props.activePageNumber-2 || pageNumber>this.props.activePageNumber+2) && pageNumber!==1 && pageNumber!==this.props.totalPages) return null;
						const postsets=(pageNumber===1 && this.props.activePageNumber>3)?<><i className="fa fa-square" style={{fontSize: "4px",paddingLeft: "10px"}}></i> <i className="fa fa-square" style={{fontSize: "4px"}}></i> <i className="fa fa-square" style={{fontSize: "4px", paddingRight: "10px"}}></i></>:"";
						const presets=(pageNumber===this.props.totalPages && this.props.activePageNumber<(this.props.totalPages-2))?<><i className="fa fa-square" style={{fontSize: "4px", paddingLeft: "10px"}}></i> <i className="fa fa-square" style={{fontSize: "4px"}}></i> <i className="fa fa-square" style={{fontSize: "4px", paddingRight: "10px"}}></i></>:"";
						const buttonStyle=((pageNumber)===(this.props.activePageNumber))?STYLE.active:STYLE.default;
						return 	(
							<>
							<span>{presets}</span>
							<button type="button" className="paginator-button" style={buttonStyle} onClick={(evt)=>this.props.onPageChange(evt,pageNumber)}>{pageNumber}</button>
							<span>{postsets}</span>
							</>
						)
					})
				}
				<button type="button" className="paginator-button" style={STYLE.active} onClick={(evt)=>this.props.onPageChange(evt,this.props.activePageNumber+1)} disabled={this.props.activePageNumber===this.props.totalPages}>Next</button>
			</div>
			</>
			:
			null
		);
	}
}