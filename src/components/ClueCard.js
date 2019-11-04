import React from "react";
import Flippy, { FrontSide, BackSide } from 'react-flippy';
import './ClueCard.css';

// Handles responsiveness of card width.
var factor = 3;
var marginFactor = 35;
var viewportWidth = document.documentElement.clientWidth-350;
if (viewportWidth < 900) {
	viewportWidth += 350;
} 
if (viewportWidth < 600) {
	factor = 1;
	marginFactor = 45;
} else if (viewportWidth < 800) { 
	factor = 2;
} else if (viewportWidth > 1600) {
	factor = Math.trunc(viewportWidth / 400);
} else if (viewportWidth >= 1350) { 
	factor = 4;
}
var cardWidth = viewportWidth / factor - marginFactor;

// Calls listener to add to favorites.
const onCardClick = (id, listener) => (event) => {
  listener(id);
} 

	const ClueCard = (props) => {
    // If it was favorited, the card will have an extra line that says "Favorited".
    // Besides that, this is just general formatting of the card.
    if (props.favorited) {
      return ( 
      <div className="ClueCard">
        <Flippy
          flipOnHover = {true}
          flipOnClick = {false}
          flipDirection = "horizontal"
          style={{ width: cardWidth.toString() + "px", height: "400px" }}
          onClick = {onCardClick(props.id, props.listener)}
        >
          <FrontSide
            style = {{
              backgroundColor: '#0033cc',
              color: 'white',
              textAlign: 'center',
              fontFamily: 'sans-serif',
            }}
            onClick = {onCardClick(props.id, props.listener)}
          >
            <img
              src="https://www.trzcacak.rs/myfile/full/439-4391718_jeopardy-transparent-jeopardy-logo.png"
              alt="jeopardy-logo"
              className="logo"
              style = {{ maxWidth: '60%', maxHeight: '70%'}}
            />
            <hr
              style = {{
                color: '#AEAEAF',
                width: '80%'
              }}
            />
            <div 
              className = "categoryText"
              style = {{
                marginTop: '10px',
                fontSize: '19px'
              }} 
              >
                {props.category}
            </div>
            <div 
              className = "difficultyText"
              style = {{
                marginTop: '10px',
                fontSize: '19px'
              }} 
              >
                {props.difficulty}
            </div>
            <div 
              className = "clueText" 
              style = {{
                marginTop: '10px'
              }} 
              >
                {props.clue}
            </div>
            <div
              className = "favoritedText"
              style = {{
                marginTop: '10px'
              }}
            >
              Favorited
            </div>
          </FrontSide>
          <BackSide
            style = {{
              backgroundColor: '#0033cc',
              color: 'white'
            }}
            onClick = {onCardClick(props.id, props.listener)}
          >
            <div 
              className = "answerText" 
              style = {{
                display: 'flex',
                textAlign: 'center',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: '150px'
              }}
            >
                {props.answer}
            </div>
          </BackSide>
        </Flippy>
      </div>
      );
    }
    return (
      <div className="ClueCard">
        <Flippy
          flipOnHover = {true}
          flipOnClick = {false}
          flipDirection = "horizontal"
          style={{ width: cardWidth.toString() + "px", height: "400px" }}
          onClick = {onCardClick(props.id, props.listener)}
        >
          <FrontSide
            style = {{
              backgroundColor: '#0033cc',
              color: 'white',
              textAlign: 'center',
              fontFamily: 'sans-serif',
            }}
            onClick = {onCardClick(props.id, props.listener)}
          >
            <img
              src="https://www.trzcacak.rs/myfile/full/439-4391718_jeopardy-transparent-jeopardy-logo.png"
              alt="jeopardy-logo"
              className="logo"
              style = {{ maxWidth: '60%', maxHeight: '70%'}}
            />
            <hr
              style = {{
                color: '#AEAEAF',
                width: '80%'
              }}
            />
            <div 
              className = "categoryText"
              style = {{
                marginTop: '10px',
                fontSize: '19px'
              }} 
              >
                {props.category}
            </div>
            <div 
              className = "difficultyText"
              style = {{
                marginTop: '10px',
                fontSize: '19px'
              }} 
              >
                {props.difficulty}
            </div>
            <div 
              className = "clueText" 
              style = {{
                marginTop: '10px'
              }} 
              >
                {props.clue}
            </div>
          </FrontSide>
          <BackSide
            style = {{
              backgroundColor: '#0033cc',
              color: 'white'
            }}
            onClick = {onCardClick(props.id, props.listener)}
          >
            <div 
              className = "answerText" 
              style = {{
                display: 'flex',
                textAlign: 'center',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: '150px'
              }}
            >
                {props.answer}
            </div>
          </BackSide>
        </Flippy>
      </div>
    );
	}

export default ClueCard;