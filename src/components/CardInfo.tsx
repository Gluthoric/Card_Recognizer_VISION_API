import React from 'react';
import { MtgCard } from '../types';
import CardVersionSelector from './CardVersionSelector';

interface CardInfoProps {
  card: MtgCard | null;
  onVersionSelect: (version: MtgCard) => void;
  preSelectedSet?: string;
  isUnrecognized: boolean;
}

const CardInfo: React.FC<CardInfoProps> = ({ card, onVersionSelect, preSelectedSet, isUnrecognized }) => {
  if (!card) {
    return (
      <div className="bg-gray-800 p-4 rounded-lg shadow">
        <p className="text-gray-400">No card selected</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow text-white">
      {isUnrecognized && (
        <p className="text-red-500 mb-4">Unrecognized Card: Please Input Details</p>
      )}
      <div className="flex flex-col space-y-4">
        <div className="flex justify-center space-x-4">
          {card.uploadedImageUrl && (
            <img src={card.uploadedImageUrl} alt={`${card.name} (Uploaded)`} className="w-1/2 rounded" />
          )}
          <img src={card.imageUrl} alt={`${card.name} (Scryfall)`} className="w-1/2 rounded" />
        </div>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p><strong className="text-gray-300">Name:</strong> {card.name}</p>
            <p><strong className="text-gray-300">Set:</strong> {card.set} ({card.setName})</p>
            <p><strong className="text-gray-300">Collector Number:</strong> {card.collectorNumber}</p>
            <p><strong className="text-gray-300">Rarity:</strong> {card.rarity}</p>
          </div>
          <div>
            <p><strong className="text-gray-300">Mana Cost:</strong> {card.manaCost}</p>
            <p><strong className="text-gray-300">Type:</strong> {card.type}</p>
            {card.power && card.toughness && (
              <p><strong className="text-gray-300">Power/Toughness:</strong> {card.power}/{card.toughness}</p>
            )}
          </div>
          <div>
            <p><strong className="text-gray-300">Market Price:</strong> ${card.price?.toFixed(2) || 'N/A'}</p>
          </div>
        </div>
        <div>
          <p><strong className="text-gray-300">Text:</strong> {card.text}</p>
          {card.flavorText && <p><strong className="text-gray-300">Flavor Text:</strong> <em>{card.flavorText}</em></p>}
        </div>
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-300">Comment</label>
          <textarea
            id="comment"
            rows={3}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
            placeholder="Add your comments here..."
          ></textarea>
        </div>
      </div>
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Card Versions</h3>
        <CardVersionSelector
          versions={card.versions || []}
          selectedVersion={card}
          onSelectVersion={onVersionSelect}
          preSelectedSet={preSelectedSet}
        />
      </div>
    </div>
  );
};

export default CardInfo;