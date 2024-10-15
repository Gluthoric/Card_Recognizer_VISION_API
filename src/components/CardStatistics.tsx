import React from 'react';
import { MtgCard } from '../types';

interface CardStatisticsProps {
  card: MtgCard | null;
}

const CardStatistics: React.FC<CardStatisticsProps> = ({ card }) => {
  if (!card) {
    return (
      <div className="bg-gray-800 p-4 rounded-lg shadow">
        <p className="text-gray-400">No card selected</p>
      </div>
    );
  }

  const legalityColor = (legality: string) => {
    switch (legality) {
      case 'legal':
        return 'text-green-500';
      case 'not_legal':
        return 'text-red-500';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow text-white">
      <h2 className="text-xl font-bold mb-4">Card Statistics</h2>
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Pricing</h3>
          <p><strong className="text-gray-300">Market Price:</strong> ${card.price?.toFixed(2)}</p>
          {/* Add more pricing information here */}
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Legalities</h3>
          <ul className="grid grid-cols-2 gap-2 text-sm">
            {Object.entries(card.legalities || {}).map(([format, legality]) => (
              <li key={format} className={legalityColor(legality)}>
                {format}: {legality}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Card Details</h3>
          <p><strong className="text-gray-300">Rarity:</strong> {card.rarity}</p>
          <p><strong className="text-gray-300">Mana Cost:</strong> {card.manaCost}</p>
          <p><strong className="text-gray-300">Frame:</strong> {card.frame}</p>
          <p><strong className="text-gray-300">Reserved List:</strong> {card.reserved ? 'Yes' : 'No'}</p>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Export
        </button>
        <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          Print
        </button>
      </div>
    </div>
  );
};

export default CardStatistics;