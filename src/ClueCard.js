import React from "react";
import styled from "@emotion/styled/macro";
import './ClueCard.css';

const Hover = styled.div({
  opacity: 0,
  transition: "opacity 350ms ease",
});

const DisplayOver = styled.div({
  height: "100%",
  left: "0",
  position: "absolute",
  top: "0",
  width: "100%",
  zIndex: 2,
  transition: "background-color 350ms ease",
  backgroundColor: "transparent",
  padding: "0px 0px 0px 15px",
  boxSizing: "border-box",
});

const BigTitle = styled.h2({
  fontFamily: "Roboto",
});

const MidParagraph = styled.h4({
  fontFamily: "Roboto",
})

const SubTitle = styled.h4({
  fontFamily: "Roboto",
  transform: "translate3d(0,50px,0)",
  transition: "transform 350ms ease",
});

const Paragraph = styled.p({
  fontFamily: "Roboto",
  transform: "translate3d(0,50px,0)",
  transition: "transform 350ms ease",
});

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
// var cardWidth = Math.max(viewportWidth / factor - 32, 350);
//cardWidth = Math.min(cardWidth, 500);

const Background = styled.div({
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  color: "#FFF",
  position: "relative",
  width: cardWidth.toString() + "px",
  height: "425px",
  cursor: "pointer",
  backgroundImage: "url(https://images.unsplash.com/photo-1523362500701-326a87b9f69b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80)",
  [`:hover ${DisplayOver}`]: {
    backgroundColor: "rgba(0,0,0,.5)",
  },
  [`:hover ${SubTitle}, :hover ${Paragraph}`]: {
    transform: "translate3d(0,0,0)",
  },
  [`:hover ${Hover}`]: {
    opacity: 1,
  },
});

	const ClueCard = (props) => {
	    return (
	      <div className="ClueCard">
	        <Background>
	          <DisplayOver>
	            <BigTitle>Clue:</BigTitle>
	            <MidParagraph> 
	            	{props.clue}
      	 			</MidParagraph>
      	 			<BigTitle>Category:</BigTitle>
      	 			<MidParagraph>
      	 			 	{props.category}
      	 			</MidParagraph>
      	 			<BigTitle> Difficulty:</BigTitle>
      	 			<MidParagraph>
      	 			 	{props.difficulty}
      	 			</MidParagraph>
	            <Hover>
	              <SubTitle>Answer:</SubTitle>
	              <Paragraph>
	                {props.answer}
	              </Paragraph>
	            </Hover>
	          </DisplayOver>
	        </Background>
	      </div>
	    );
	}

export default ClueCard;