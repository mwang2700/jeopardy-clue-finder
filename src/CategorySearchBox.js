 import React from 'react';
 import './CategorySearchBox.css';

 const CategorySearchBox = ({ categoryfield, searchChange }) => {
 	return(
 		<input
 			className='pa3 ba b--green bg-lightest-blue'
 			type='search' 
 			placeholder='Search category name' 
 			onChange = {searchChange}
 		/>
 	);	
 }

 export default CategorySearchBox;