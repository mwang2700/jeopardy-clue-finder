 import React from 'react';
 import './DifficultySearchBox.css';

 const DifficultySearchBox = ({ categoryfield, searchChange }) => {
 	return(
 		<input
 			className='sb'
 			type='search' 
 			placeholder='Difficulty (only whole numbers)'
 			onChange = {searchChange}
 		/>
 	);	
 }

 export default DifficultySearchBox;