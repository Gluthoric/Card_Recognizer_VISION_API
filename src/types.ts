export interface MtgCard {
  id: string;
  name: string;
  imageUrl: string;
  uploadedImageUrl?: string;
  manaCost: string;
  type: string;
  rarity: string;
  set: string;
  text: string;
  flavorText?: string;
  power?: string;
  toughness?: string;
  price?: number;
  scryfallId: string;
  collectorNumber: string;
  setName: string;
  versions?: CardVersion[];
}

export interface CardVersion {
  scryfallId: string;
  name: string;
  set: string;
  collectorNumber: string;
  imageUrl: string;
  setName: string;
  releaseDate: string;
  price?: number;
}

// ... rest of the file remains unchanged