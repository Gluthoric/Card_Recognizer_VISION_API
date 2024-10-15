import axios from 'axios';
import { MtgCard, CardVersion } from '../types';

const API_URL = 'https://api.scryfall.com';

export async function getCardVersions(cardName: string): Promise<CardVersion[]> {
  try {
    let query = `!"${cardName}" -is:promo`;

    // Special handling for basic lands
    if (['Plains', 'Island', 'Swamp', 'Mountain', 'Forest'].includes(cardName)) {
      query += ' game:paper -digital';
    }

    const response = await axios.get(`${API_URL}/cards/search`, {
      params: {
        q: query,
        unique: 'prints',
        order: 'released',
        dir: 'desc'
      },
    });

    return response.data.data.map((card: any) => ({
      scryfallId: card.id,
      name: card.name,
      set: card.set,
      collectorNumber: card.collector_number,
      imageUrl: card.image_uris?.normal || card.card_faces?.[0]?.image_uris?.normal,
      setName: card.set_name,
      releaseDate: card.released_at,
      price: card.prices?.usd ? parseFloat(card.prices.usd) : undefined,
    }));
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      console.warn(`No versions found for card: ${cardName}`);
      return [];
    }
    console.error('Error fetching card versions:', error instanceof Error ? error.message : 'Unknown error');
    return [];
  }
}

export const getCardInfo = async (scryfallId: string): Promise<MtgCard | null> => {
  const response = await fetch(`https://api.scryfall.com/cards/${scryfallId}`);
  const data = await response.json();

  if (response.ok) {
    return {
      id: data.id,
      name: data.name,
      set: data.set,
      setName: data.set_name,
      collectorNumber: data.collector_number,
      manaCost: data.mana_cost || '',
      type: data.type_line || '',
      rarity: data.rarity || '',
      power: data.power || null,
      toughness: data.toughness || null,
      price: data.prices?.usd || 0,
      priceFoil: data.prices?.usd_foil || 0,
      versions: [], // To be populated later with getCardVersions
    };
  }
  return null;
};
