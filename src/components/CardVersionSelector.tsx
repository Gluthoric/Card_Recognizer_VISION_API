import React from 'react';
import { MtgCard, CardVersion } from '../types';

interface CardVersionSelectorProps {
  versions: CardVersion[];
  selectedVersion: MtgCard | null;
  onSelectVersion: (version: CardVersion) => void;
  preSelectedSet?: string;
}

const CardVersionSelector: React.FC<CardVersionSelectorProps> = ({
  versions,
  selectedVersion,
  onSelectVersion,
  preSelectedSet,
}) => {
  const sortedVersions = [...versions].sort((a, b) => {
    if (preSelectedSet) {
      if (a.set === preSelectedSet && b.set !== preSelectedSet) return -1;
      if (b.set === preSelectedSet && a.set !== preSelectedSet) return 1;
    }
    return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
  });

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {sortedVersions.map((version) => (
        <div
          key={version.scryfallId}
          className={`cursor-pointer border-2 rounded-lg overflow-hidden ${
            selectedVersion?.scryfallId === version.scryfallId
              ? 'border-blue-500'
              : 'border-gray-700 hover:border-gray-500'
          }`}
          onClick={() => onSelectVersion(version)}
        >
          <img src={version.imageUrl} alt={version.name} className="w-full h-auto" />
          <div className="p-2 bg-gray-800">
            <p className="text-sm font-semibold">{version.setName}</p>
            <p className="text-xs text-gray-400">#{version.collectorNumber}</p>
            <p className="text-xs text-gray-300 mt-1">Price: ${version.price?.toFixed(2) || 'N/A'}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardVersionSelector;