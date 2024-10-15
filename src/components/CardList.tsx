import React from 'react';
import { MtgCard } from '../types';

interface CardListProps {
  cards: MtgCard[];
  onSelectCard: (card: MtgCard, index: number) => void;
  currentIndex: number;
  onVersionSelect: (version: MtgCard) => void;
  unsuccessfulCards: string[];
  onManualInput: () => void;
}

const CardList: React.FC<CardListProps> = ({
  cards,
  onSelectCard,
  currentIndex,
  onVersionSelect,
  unsuccessfulCards,
  onManualInput
}) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4 text-white">Card List</h2>
      {cards.length === 0 && unsuccessfulCards.length === 0 ? (
        <p className="text-gray-400">No cards recognized yet</p>
      ) : (
        <ul className="space-y-2 text-sm">
          {cards.map((card, index) => (
            <li
              key={card.scryfallId}
              className={`cursor-pointer hover:bg-gray-700 p-2 rounded transition-colors duration-150 ease-in-out ${
                index === currentIndex ? 'bg-blue-600' : ''
              }`}
              onClick={() => onSelectCard(card, index)}
            >
              <span className="text-white">{card.name}</span>
              <span className="text-gray-400 text-xs ml-2">({card.set} #{card.collectorNumber})</span>
            </li>
          ))}
          {unsuccessfulCards.map((cardName, index) => (
            <li
              key={`unrecognized-${index}`}
              className="cursor-pointer hover:bg-gray-700 p-2 rounded transition-colors duration-150 ease-in-out text-red-500"
              onClick={onManualInput}
            >
              {cardName} (Unrecognized)
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CardList;