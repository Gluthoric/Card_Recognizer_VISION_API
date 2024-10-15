import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Card } from '../types';

interface CardItemProps {
  card: Card;
  index: number;
}

const CardItem: React.FC<CardItemProps> = ({ card, index }) => {
  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-white p-4 mb-2 rounded shadow"
        >
          <h3 className="font-bold">{card.name}</h3>
          <p>Set: {card.set}</p>
          <p>Rarity: {card.rarity}</p>
          <p>Market Price: ${card.marketPrice.toFixed(2)}</p>
          <p>Low Price: ${card.lowPrice.toFixed(2)}</p>
        </div>
      )}
    </Draggable>
  );
};

export default CardItem;