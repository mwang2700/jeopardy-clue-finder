import React, { Component } from 'react';
import './FavoritesDropdown.css';

class FavoritesDropdown extends Component {
	constructor(props) {
		super(props);

		this.state = {
			showMenu: false,
			options: props.options,
			listener: props.listener,
			dropdownText: ''
		}

		this.showMenu = this.showMenu.bind(this);
		this.closeMenu = this.closeMenu.bind(this);
		this.updateOperator = this.updateOperator.bind(this);
	}

	updateOperator(event) {
		event.persist();
		this.setState({
			dropdownText: event.target.innerText
		});
		this.state.listener(event.target.innerText);
	}

	showMenu(event) {
		event.preventDefault();

		this.setState({
			showMenu: true
		}, () => {
			document.addEventListener('click', this.closeMenu);
		});
	}

	closeMenu() {
		this.setState({
			showMenu: false
		}, () => {
			document.removeEventListener('click', this.closeMenu);
		});

	}

	render() {
		const buttons = [];
		for (let i = 0; i < this.state.options.length; i++) {
			buttons.push(
				<button key = {i} id = {i} onClick = {this.updateOperator}> 
					{this.state.options[i]} 
				</button>
			);	
		}
		return (
			<div className="favDropdown" style= {{width:"310px"}}>
			<div className="favDrop" onClick = {this.showMenu}>
				{this.state.dropdownText}
			</div>
			{
				this.state.showMenu ? (
					<div className="favddMenu">
						{buttons}
					</div>
				): 
				( 
			  	   null
			    )
			}	
			</div>
		);
	}
}

export default FavoritesDropdown;