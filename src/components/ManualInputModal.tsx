import React, { useState } from 'react';
import { XIcon } from 'lucide-react';

interface ManualInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (cardName: string) => void;
}

const ManualInputModal: React.FC<ManualInputModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [cardName, setCardName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(cardName);
    setCardName('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex">
      <div className="relative p-8 bg-gray-900 w-full max-w-md m-auto flex-col flex rounded-lg text-white">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Manual Card Input</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors duration-150 ease-in-out"
          >
            <XIcon size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="cardName" className="block text-sm font-medium text-gray-300 mb-2">
              Card Name
            </label>
            <input
              type="text"
              id="cardName"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              className="w-full p-2 bg-gray-800 rounded text-white"
              placeholder="Enter card name"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-150 ease-in-out"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default ManualInputModal;