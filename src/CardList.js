import React from 'react';
import Card from './ClueCard';

const CardList = ({ cards }) => {
    return (
      <div>
        {
         cards.map((card,i) => {
          return (
            <Card 
              key = {cards[i].key}
              clue = {cards[i].clue}
              category = {cards[i].category}
              difficulty = {cards[i].difficulty}
              answer = {cards[i].answer}
              airDate = {cards[i].airDate}
            />
          );
        })
        }
      </div>
    );
 }

 export default CardList;