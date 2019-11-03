 import React from 'react';
 import './SearchBox.css';

 const SearchBox = ({ searchfield, searchChange, text }) => {
 	return(
 		<input
 			className='pa3 ba b--green bg-lightest-blue'
 			type='search' 
 			placeholder= {text} 
 			onChange = {searchChange}
 		/>
 	);	
 }

 export default SearchBox;