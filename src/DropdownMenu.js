import React, { Component } from 'react';
import './DropdownMenu.css';

class DropdownMenu extends Component {
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
			<div className="dropdown" style= {{width:"80px"}}>
			<div className="drop" onClick = {this.showMenu}>
				{this.state.dropdownText}
			</div>
			{
				this.state.showMenu ? (
					<div className="ddMenu">
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

export default DropdownMenu;