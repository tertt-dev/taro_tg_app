export interface Card {
  name: string;
  description: string;
  isReversed: boolean;
  image?: string;
}

export interface Prediction {
  id: string;
  cards: Card[];
  date: string;
  text: string;
}

const CARDS = [
  {
    name: 'Шут',
    description: 'Новые начинания, спонтанность, свобода',
    image: 'https://api.dicebear.com/7.x/identicon/svg?seed=fool'
  },
  {
    name: 'Маг',
    description: 'Сила воли, мастерство, проявление',
    image: 'https://api.dicebear.com/7.x/identicon/svg?seed=magician'
  },
  {
    name: 'Верховная Жрица',
    description: 'Интуиция, тайны, внутреннее знание',
    image: 'https://api.dicebear.com/7.x/identicon/svg?seed=priestess'
  },
  // Добавьте остальные карты по аналогии
];

export const generatePrediction = async (): Promise<Prediction> => {
  // Выбираем 3 случайные карты
  const selectedCards = Array.from({ length: 3 }, () => {
    const card = CARDS[Math.floor(Math.random() * CARDS.length)];
    return {
      ...card,
      isReversed: Math.random() > 0.5,
    };
  });

  // Генерируем текст предсказания
  const text = `На основе выпавших карт: ${selectedCards.map(card => 
    `${card.name}${card.isReversed ? ' (в перевернутом положении)' : ''}`
  ).join(', ')}. Это указывает на период трансформации и новых возможностей в вашей жизни.`;

  return {
    id: Date.now().toString(),
    cards: selectedCards,
    date: new Date().toLocaleDateString('ru-RU', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    text,
  };
}; 