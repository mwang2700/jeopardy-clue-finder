import React from 'react';
import Card from './ClueCard';

const CardList = ({ cards, favorited }) => {
    return (
      <div>
        {
         cards.map((card,i) => {
          let isFavorited = favorited.has(cards[i].id);
          return (
            <Card 
              listener = {cards[i].listener}
              key = {cards[i].key}
              id = {cards[i].id}
              clue = {cards[i].clue}
              category = {cards[i].category}
              difficulty = {cards[i].difficulty}
              answer = {cards[i].answer}
              airDate = {cards[i].airDate}
              favorited = {isFavorited}
            />
          );
        })
        }
      </div>
    );
 }

 export default CardList;