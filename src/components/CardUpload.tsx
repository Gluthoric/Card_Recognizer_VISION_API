import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Card } from '../types';

interface CardUploadProps {
  onUpload: (card: Card) => void;
}

const CardUpload: React.FC<CardUploadProps> = ({ onUpload }) => {
  const [cardData, setCardData] = useState({
    name: '',
    set: '',
    rarity: '',
    marketPrice: '',
    lowPrice: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCard: Card = {
      id: uuidv4(),
      name: cardData.name,
      set: cardData.set,
      rarity: cardData.rarity,
      marketPrice: parseFloat(cardData.marketPrice),
      lowPrice: parseFloat(cardData.lowPrice),
    };
    onUpload(newCard);
    setCardData({ name: '', set: '', rarity: '', marketPrice: '', lowPrice: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-4">
      <h2 className="text-xl font-bold mb-4">Add New Card</h2>
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          name="name"
          value={cardData.name}
          onChange={handleChange}
          placeholder="Card Name"
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          name="set"
          value={cardData.set}
          onChange={handleChange}
          placeholder="Set"
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          name="rarity"
          value={cardData.rarity}
          onChange={handleChange}
          placeholder="Rarity"
          className="border p-2 rounded"
          required
        />
        <input
          type="number"
          name="marketPrice"
          value={cardData.marketPrice}
          onChange={handleChange}
          placeholder="Market Price"
          className="border p-2 rounded"
          required
          step="0.01"
        />
        <input
          type="number"
          name="lowPrice"
          value={cardData.lowPrice}
          onChange={handleChange}
          placeholder="Low Price"
          className="border p-2 rounded"
          required
          step="0.01"
        />
      </div>
      <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Add Card
      </button>
    </form>
  );
};

export default CardUpload;