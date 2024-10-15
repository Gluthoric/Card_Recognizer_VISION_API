import React from 'react';
import { MtgCard } from '../types';

interface ExportButtonProps {
  cards: MtgCard[];
}

const ExportButton: React.FC<ExportButtonProps> = ({ cards }) => {
  const exportToCSV = () => {
    const headers = [
      'Scryfall ID',
      'Name',
      'Set',
      'Collector Number',
      'Mana Cost',
      'Type',
      'Rarity',
      'Power',
      'Toughness',
      'Price',
      'Quantity',
      'Quantity Foil'
    ];

    const csvContent = [
      headers.join(','),
      ...cards.map((card) =>
        [
          card.scryfallId || '',
          `"${(card.name || '').replace(/"/g, '""')}"`,
          card.set || '',
          card.collectorNumber || '',
          card.manaCost || '',
          `"${(card.type || '').replace(/"/g, '""')}"`,
          card.rarity || '',
          card.power || '',
          card.toughness || '',
          card.price?.toFixed(2) || '',
          '1', // Default quantity to 1
          '0'  // Default foil quantity to 0
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'mtg_cards_export.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <button
      onClick={exportToCSV}
      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors duration-150 ease-in-out"
      disabled={cards.length === 0}
    >
      Export to CSV
    </button>
  );
};

export default ExportButton;