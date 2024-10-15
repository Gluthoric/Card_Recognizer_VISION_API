import React from 'react';
import { RecognizedCard, MtgCard } from '../types';
import { XIcon } from 'lucide-react';
import CardUploader from './CardUploader';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  recognizedCards: RecognizedCard[];
  unsuccessfulCards: string[];
  onSelectCard: (card: MtgCard, index: number) => void;
  onUpload: (recognizedCards: RecognizedCard[]) => void;
  onCardSelect: (card: RecognizedCard) => void;
  preSelectedSet?: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  recognizedCards,
  unsuccessfulCards,
  onSelectCard,
  onUpload,
  onCardSelect,
  preSelectedSet
}) => {
  return (
    <div
      className={`fixed top-0 left-0 h-full w-80 bg-gray-800 text-white p-4 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } overflow-y-auto`}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Card Information</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <XIcon size={24} />
        </button>
      </div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Recognized Cards</h3>
        <ul className="space-y-2">
          {recognizedCards.map((card, index) => (
            <li
              key={`${card.name}-${card.selectedVersion?.collector_number || index}`}
              className="text-sm cursor-pointer hover:bg-gray-700 p-2 rounded transition-colors duration-150 ease-in-out"
              onClick={() => card.selectedVersion && onSelectCard(card.selectedVersion as MtgCard, index)}
            >
              {card.name} ({card.selectedVersion?.set})
              {card.uploadedImage && (
                <img src={card.uploadedImage.preview} alt={card.name} className="w-full h-auto mt-1 rounded" />
              )}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Unsuccessful Card Pulls</h3>
        <ul className="space-y-2">
          {unsuccessfulCards.map((cardName, index) => (
            <li key={index} className="text-sm text-red-400">
              {cardName}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;