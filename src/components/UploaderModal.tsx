import React, { useState } from 'react';
import CardUploader from './CardUploader';
import { RecognizedCard } from '../types';
import { XIcon } from 'lucide-react';

interface UploaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (recognizedCards: RecognizedCard[]) => void;
  onCardSelect: (card: RecognizedCard) => void;
  preSelectedSet?: string;
}

const UploaderModal: React.FC<UploaderModalProps> = ({
  isOpen,
  onClose,
  onUpload,
  onCardSelect,
  preSelectedSet
}) => {
  const [uploadedCards, setUploadedCards] = useState<RecognizedCard[]>([]);

  if (!isOpen) return null;

  const handleUpload = (cards: RecognizedCard[]) => {
    setUploadedCards(cards);
  };

  const handleConfirm = () => {
    onUpload(uploadedCards);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex">
      <div className="relative p-8 bg-gray-900 w-full max-w-6xl m-auto flex-col flex rounded-lg text-white">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Upload Cards</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors duration-150 ease-in-out"
          >
            <XIcon size={24} />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-8">
          <div>
            <CardUploader
              onUpload={handleUpload}
              onCardSelect={onCardSelect}
              preSelectedSet={preSelectedSet}
            />
          </div>
          <div className="space-y-4">
            <div>
              <label className="block mb-2">Select Game (Required)</label>
              <select
                className="w-full p-2 bg-gray-800 rounded text-white"
              >
                <option value="Magic: The Gathering">Magic: The Gathering</option>
              </select>
            </div>
            <div>
              <label className="block mb-2">Select Expansion (Optional)</label>
              <select
                className="w-full p-2 bg-gray-800 rounded text-white"
              >
                <option value="">Select expansion</option>
                {/* Add more expansion options here */}
              </select>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block mb-2">Condition</label>
                <select
                  className="w-full p-2 bg-gray-800 rounded text-white"
                >
                  <option value="NM">NM</option>
                  {/* Add more condition options here */}
                </select>
              </div>
              <div>
                <label className="block mb-2">Language</label>
                <select
                  className="w-full p-2 bg-gray-800 rounded text-white"
                >
                  <option value="English">English</option>
                  {/* Add more language options here */}
                </select>
              </div>
              <div>
                <label className="block mb-2">Printing Type</label>
                <select
                  className="w-full p-2 bg-gray-800 rounded text-white"
                >
                  <option value="Normal">Normal</option>
                  {/* Add more printing type options here */}
                </select>
              </div>
            </div>
            <button 
              className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-150 ease-in-out"
              onClick={handleConfirm}
              disabled={uploadedCards.length === 0}
            >
              Confirm Cards
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploaderModal;