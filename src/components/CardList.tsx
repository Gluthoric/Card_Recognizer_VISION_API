import React, { useEffect } from 'react';
import { MtgCard } from '../types';
import { useFetchSets } from '../utils/commonHooks';

interface CardListProps {
  cards: MtgCard[];
  onSelectCard: (card: MtgCard, index: number) => void;
  currentIndex: number;
  onVersionSelect: (version: MtgCard) => void;
  unsuccessfulCards: string[];
  onManualInput: () => void;
}

interface Set {
  id: string;
  name: string;
  code: string;
}

const CardList: React.FC<CardListProps> = ({
  cards,
  onSelectCard,
  currentIndex,
  onVersionSelect,
  unsuccessfulCards,
  onManualInput
}) => {
  const { sets, fetchSets, loading, error } = useFetchSets<Set>();

  useEffect(() => {
    fetchSets();
  }, [fetchSets]);

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

      <h3 className="text-lg font-bold mt-6 mb-2 text-white">Available Sets</h3>
      {loading ? (
        <p className="text-gray-400">Loading sets...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <ul className="space-y-1 text-sm">
          {sets.map((set) => (
            <li key={set.id} className="text-gray-300">
              {set.name} ({set.code})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CardList;
