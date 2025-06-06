export interface Card {
  name: string;
  description: string;
  image: string;
}

export interface Prediction {
  date: string;
  cards: Card[];
  text: string;
}

const PLACEHOLDER_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjgwIiBoZWlnaHQ9IjQ4MCIgdmlld0JveD0iMCAwIDI4MCA0ODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjI4MCIgaGVpZ2h0PSI0ODAiIGZpbGw9IiMxYTFhMmUiLz48L3N2Zz4=';

export const TAROT_CARDS: Card[] = [
  {
    name: 'Шут',
    description: 'Новые начинания, спонтанность, свобода',
    image: PLACEHOLDER_IMAGE
  },
  {
    name: 'Маг',
    description: 'Сила воли, мастерство, проявление',
    image: PLACEHOLDER_IMAGE
  },
  {
    name: 'Верховная Жрица',
    description: 'Интуиция, тайны, внутренняя мудрость',
    image: PLACEHOLDER_IMAGE
  },
  {
    name: 'Императрица',
    description: 'Изобилие, творчество, материнство',
    image: PLACEHOLDER_IMAGE
  },
  {
    name: 'Император',
    description: 'Власть, структура, стабильность',
    image: PLACEHOLDER_IMAGE
  }
];

export async function generatePrediction(): Promise<Prediction> {
  // Select 3 random cards
  const selectedCards: Card[] = [];
  while (selectedCards.length < 3) {
    const randomIndex = Math.floor(Math.random() * TAROT_CARDS.length);
    if (!selectedCards.includes(TAROT_CARDS[randomIndex])) {
      selectedCards.push(TAROT_CARDS[randomIndex]);
    }
  }

  return {
    date: new Date().toLocaleDateString('ru-RU', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    cards: selectedCards,
    text: `Карты говорят о важных изменениях в вашей жизни. ${selectedCards.map(card => card.name).join(', ')} указывают на необходимость прислушаться к своей интуиции и быть готовым к новым возможностям.`
  };
} 