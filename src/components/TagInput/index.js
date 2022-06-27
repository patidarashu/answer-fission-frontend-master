import React, {Component} from 'react';
import './styles.css';
export default class TagInput extends Component {
	constructor(props) {
		super(props);
		this.selectedLi=React.createRef();
		this.tagInput=React.createRef();
		this.state={
			filteredSuggestions:[],
			activeIndex:-1,
		}
		this.onLiClickHandler=(evt)=>{
			const index=Number(evt.target.id);
			const value=this.state.filteredSuggestions[index];
			if(value.length>0) {
				this.props.onAdd(value);
			}
			this.tagInput.current.value="";
			this.tagInput.current.autofocus=true;
			this.setState({
				filteredSuggestions: [],
				activeIndex: -1
			});				
		}
		this.onChangeHandler=(evt)=>{
			const value=evt.target.value.toLowerCase();
			if(value.trim().length===0) {
				this.setState({
					filteredSuggestions: [],
					activeIndex: -1
				});								
				return;
			}
			const filteredSuggestionsTemp=this.props.suggestions.filter((sg)=>{
				return sg.toLowerCase().indexOf(value)>-1;
			});
			if(filteredSuggestionsTemp.length>0) {
				this.setState({
					filteredSuggestions: filteredSuggestionsTemp,
					activeIndex: 0
				});
			}
			else {
				this.setState({
					filteredSuggestions: [],
					activeIndex: -1
				});				
			}	

		}
		this.onInputHandler=(evt)=>{
			if(evt.keyCode===13) {
				const index=this.state.activeIndex;
				if(index<0) return;
				const value=this.state.filteredSuggestions[index];
				if(value.length>0) {
					this.props.onAdd(value);
				}
				evt.target.value="";
				this.setState({
					filteredSuggestions: [],
					activeIndex: -1
				});				
			}
			else if(evt.keyCode===38) {
				const ai=this.state.activeIndex;
				if(ai>0) {
					this.setState({
						activeIndex: ai-1
					});
				}
			}
			else if(evt.keyCode===40) {
				const ai=this.state.activeIndex;
				if(ai>-1 && ai<this.state.filteredSuggestions.length-1) {
					this.setState({
						activeIndex: ai+1
					});
				}
			}
			
		}
		this.onRemoveClickHandler=(evt)=>{
			const index=Number(evt.target.id);
			props.onRemove(index);
		}
	}
	componentDidUpdate() {
		if(this.state.activeIndex>-1) {
			this.selectedLi.current.scrollIntoView();
		}
		
	}
	render()
	{
		let placeholder=this.props.placeholder;
		if(this.props.tags.length>0) placeholder="";
		return (
			<div>

				<div className="tag-input">
					<ul className="tag-list">
						{
							this.props.tags.map((item,index)=>{
								return (<li key={index} className="tag-li">{item} <button type="button" id={index} className="remove-button" onClick={this.onRemoveClickHandler} style={{outline: "none"}}>X</button></li>);
							})
						}
						<li key="inputLi" className="input-li"><input type="text" ref={this.tagInput} className="tag-input-text" onKeyDown={this.onInputHandler} onChange={this.onChangeHandler} placeholder={placeholder} /></li>
					</ul>
				</div>
				{
					(this.state.activeIndex>-1)?
						<ul className="suggestion-list" ref={this.suggestionsList}>
						{
							this.state.filteredSuggestions.map((item,index)=>{
								const classNameForLi=(index===this.state.activeIndex)?"active-suggestion":"non-active-suggestion";
								const refForLi=(index===this.state.activeIndex)?this.selectedLi:null;
								let li=(<li key={index} id={index} className={classNameForLi} ref={refForLi} onClick={this.onLiClickHandler}>{item}</li>)
								return li;
							})
						}
						</ul>
					:null
				}
			</div>
		);
	}
}