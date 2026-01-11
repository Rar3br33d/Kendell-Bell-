
export interface ZodiacSign {
  id: string;
  name: string;
  dateRange: string;
  icon: string;
  element: 'Fire' | 'Earth' | 'Air' | 'Water';
}

export interface LuckPrediction {
  numbers: number[];
  horoscope: string;
  detailedHoroscope: string;
  powerColor: string;
  favoriteColors: string[];
  luckyTime: string;
  strongTraits: string[];
  weakTraits: string[];
  motivationalMessage: string;
  affirmations: string[];
  chantingSpell: string;
}

export interface CharmImage {
  url: string;
  base64: string;
}
