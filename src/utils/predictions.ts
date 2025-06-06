export interface Card {
  name: string;
  description: string;
}

export interface Prediction {
  date: string;
  cards: Card[];
  text: string;
}

export const TAROT_CARDS: Card[] = [
  {
    name: 'Шут',
    description: 'Новые начинания, спонтанность, свобода'
  },
  {
    name: 'Маг',
    description: 'Сила воли, мастерство, проявление'
  },
  {
    name: 'Верховная Жрица',
    description: 'Интуиция, тайны, внутренняя мудрость'
  },
  {
    name: 'Императрица',
    description: 'Изобилие, творчество, материнство'
  },
  {
    name: 'Император',
    description: 'Власть, структура, стабильность'
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