import React, { useState, useCallback, useEffect } from 'react';
import CardInfo from './components/CardInfo';
import CardList from './components/CardList';
import CardStatistics from './components/CardStatistics';
import ExportButton from './components/ExportButton';
import Sidebar from './components/Sidebar';
import { MtgCard, RecognizedCard } from './types';
import { getCardInfo, getCardVersions } from './services/scryfallApi';
import { MenuIcon } from 'lucide-react';
import UploaderModal from './components/UploaderModal';
import ManualInputModal from './components/ManualInputModal';

function App() {
  const [recognizedCards, setRecognizedCards] = useState<MtgCard[]>([]);
  const [selectedCard, setSelectedCard] = useState<MtgCard | null>(null);
  const [preSelectedSet, setPreSelectedSet] = useState<string>('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [unsuccessfulCards, setUnsuccessfulCards] = useState<string[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);
  const [isManualInputOpen, setIsManualInputOpen] = useState(false);

  const handleVersionSelect = useCallback(
    (version: MtgCard) => {
      setRecognizedCards((prevCards) => {
        const updatedCards = [...prevCards];
        const currentCard = updatedCards[currentCardIndex];
        updatedCards[currentCardIndex] = {
          ...version,
          uploadedImageUrl: currentCard.uploadedImageUrl,
          versions: currentCard.versions || [],
        };
        return updatedCards;
      });

      setSelectedCard((prevCard) => ({
        ...version,
        uploadedImageUrl: prevCard?.uploadedImageUrl,
        versions: prevCard?.versions || [],
      }));
    },
    [currentCardIndex]
  );

  const handleCardUpload = useCallback(async (uploadedCards: RecognizedCard[]) => {
    const newCards: MtgCard[] = [];
    const newUnsuccessfulCards: string[] = [];

    for (const card of uploadedCards) {
      if (card.selectedVersion) {
        const cardInfo = await getCardInfo(card.selectedVersion.scryfallId);
        if (cardInfo) {
          const versions = await getCardVersions(cardInfo.name);

          versions.forEach((version) => {
            version.uploadedImageUrl = card.uploadedImage?.preview || null;
            version.price = version.price || cardInfo.price;
            version.manaCost = version.manaCost || cardInfo.manaCost;
            version.type = version.type || cardInfo.type;
            version.rarity = version.rarity || cardInfo.rarity;
          });

          cardInfo.versions = versions;
          newCards.push(cardInfo);
        } else {
          newUnsuccessfulCards.push(card.name);
        }
      } else {
        newUnsuccessfulCards.push(card.name);
      }
    }

    setRecognizedCards((prevCards) => [...prevCards, ...newCards]);
    setUnsuccessfulCards((prevCards) => [...prevCards, ...newUnsuccessfulCards]);
  }, []);

  const handleSelectCard = useCallback((card: MtgCard, index: number) => {
    setSelectedCard(card);
    setCurrentCardIndex(index);
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  const handleManualInput = useCallback(() => {
    setIsManualInputOpen(true);
  }, []);

  const handleManualInputSubmit = useCallback(async (cardName: string) => {
    const versions = await getCardVersions(cardName);
    if (versions.length > 0) {
      const cardInfo = await getCardInfo(versions[0].scryfallId);
      if (cardInfo) {
        cardInfo.versions = versions;
        setRecognizedCards((prevCards) => [...prevCards, cardInfo]);
        setUnsuccessfulCards((prevCards) => prevCards.filter((name) => name !== cardName));
      }
    }
    setIsManualInputOpen(false);
  }, []);

  useEffect(() => {
    if (recognizedCards.length > 0) {
      setSelectedCard(recognizedCards[currentCardIndex]);
    }
  }, [currentCardIndex, recognizedCards]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={toggleSidebar}
            className="text-white hover:text-gray-300 transition-colors duration-150 ease-in-out"
          >
            <MenuIcon size={24} />
          </button>
          <h1 className="text-3xl font-bold">Magic: The Gathering Card Manager</h1>
          <div className="flex items-center">
            <select
              value={preSelectedSet}
              onChange={(e) => setPreSelectedSet(e.target.value)}
              className="mr-4 bg-gray-800 text-white px-4 py-2 rounded"
            >
              <option value="">All Sets</option>
              {/* Add set options here */}
            </select>
            <ExportButton cards={recognizedCards} />
            <button
              onClick={() => setIsUploaderOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded ml-4"
            >
              Upload Cards
            </button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-3">
            <CardList
              cards={recognizedCards}
              onSelectCard={handleSelectCard}
              currentIndex={currentCardIndex}
              onVersionSelect={handleVersionSelect}
              unsuccessfulCards={unsuccessfulCards}
              onManualInput={handleManualInput}
            />
          </div>
          <div className="col-span-6">
            <CardInfo
              card={selectedCard}
              onVersionSelect={handleVersionSelect}
              preSelectedSet={preSelectedSet}
              isUnrecognized={unsuccessfulCards.includes(selectedCard?.name || '')}
            />
          </div>
          <div className="col-span-3">
            <CardStatistics card={selectedCard} />
          </div>
        </div>
      </div>

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={toggleSidebar}
        recognizedCards={recognizedCards}
        unsuccessfulCards={unsuccessfulCards}
        onSelectCard={handleSelectCard}
        onUpload={handleCardUpload}
        preSelectedSet={preSelectedSet}
      />

      <UploaderModal
        isOpen={isUploaderOpen}
        onClose={() => setIsUploaderOpen(false)}
        onUpload={handleCardUpload}
        preSelectedSet={preSelectedSet}
      />

      <ManualInputModal
        isOpen={isManualInputOpen}
        onClose={() => setIsManualInputOpen(false)}
        onSubmit={handleManualInputSubmit}
      />
    </div>
  );
}

export default App;
