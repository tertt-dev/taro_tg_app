import { type SpreadType } from '@/components/SpreadSelector'

export interface Card {
  name: string;
  image: string;
  description: string;
  cardNumber: string;
}

export interface Prediction {
  date: string;
  cards: Card[];
  text: string;
  spreadType: SpreadType;
}

export const TAROT_CARDS: Card[] = [
  {
    name: "Шут",
    image: "/Cards-png/00-TheFool.png",
    description: "Новые начинания, спонтанность, невинность, приключения",
    cardNumber: "0"
  },
  {
    name: "Маг",
    image: "/Cards-png/RWS_Tarot_01_Magician.png",
    description: "Мастерство, сила воли, проявление",
    cardNumber: "I"
  },
  {
    name: "Верховная Жрица",
    image: "/Cards-png/RWS_Tarot_02_High_Priestess.png",
    description: "Интуиция, тайны, внутренняя мудрость",
    cardNumber: "II"
  },
  {
    name: "Императрица",
    image: "/Cards-png/RWS_Tarot_03_Empress.png",
    description: "Изобилие, творчество, материнство",
    cardNumber: "III"
  },
  {
    name: "Император",
    image: "/Cards-png/RWS_Tarot_04_Emperor.png",
    description: "Власть, структура, стабильность",
    cardNumber: "IV"
  },
  {
    name: "Иерофант",
    image: "/Cards-png/05-TheHierophant.png",
    description: "Традиции, духовность, обучение, наставничество",
    cardNumber: "V"
  },
  {
    name: "Влюбленные",
    image: "/Cards-png/06-TheLovers.png",
    description: "Любовь, гармония, выбор, отношения",
    cardNumber: "VI"
  },
  {
    name: "Колесница",
    image: "/Cards-png/07-TheChariot.png",
    description: "Движение вперед, победа, сила воли, решительность",
    cardNumber: "VII"
  },
  {
    name: "Сила",
    image: "/Cards-png/08-Strength.png",
    description: "Внутренняя сила, храбрость, терпение, сострадание",
    cardNumber: "VIII"
  },
  {
    name: "Отшельник",
    image: "/Cards-png/09-TheHermit.png",
    description: "Самопознание, мудрость, уединение, внутренний поиск",
    cardNumber: "IX"
  },
  {
    name: 'Колесо Фортуны',
    description: 'Судьба, циклы, поворотные моменты',
    image: '/Cards-png/10-WheelOfFortune.png',
    cardNumber: 'X'
  },
  {
    name: 'Справедливость',
    description: 'Равновесие, честность, причина и следствие',
    image: '/Cards-png/11-Justice.png',
    cardNumber: 'XI'
  },
  {
    name: 'Повешенный',
    description: 'Жертвенность, новый взгляд, ожидание',
    image: '/Cards-png/12-TheHangedMan.png',
    cardNumber: 'XII'
  },
  {
    name: 'Смерть',
    description: 'Трансформация, окончание, новое начало',
    image: '/Cards-png/13-Death.png',
    cardNumber: 'XIII'
  },
  {
    name: 'Умеренность',
    description: 'Баланс, гармония, умеренность',
    image: '/Cards-png/14-Temperance.png',
    cardNumber: 'XIV'
  },
  {
    name: 'Дьявол',
    description: 'Искушение, зависимость, материализм',
    image: '/Cards-png/15-TheDevil.png',
    cardNumber: 'XV'
  },
  {
    name: 'Башня',
    description: 'Внезапные изменения, разрушение, освобождение',
    image: '/Cards-png/16-TheTower.png',
    cardNumber: 'XVI'
  },
  {
    name: 'Звезда',
    description: 'Надежда, вдохновение, обновление',
    image: '/Cards-png/17-TheStar.png',
    cardNumber: 'XVII'
  },
  {
    name: 'Луна',
    description: 'Интуиция, иллюзии, подсознание',
    image: '/Cards-png/18-TheMoon.png',
    cardNumber: 'XVIII'
  },
  {
    name: 'Солнце',
    description: 'Радость, успех, жизненная сила',
    image: '/Cards-png/19-TheSun.png',
    cardNumber: 'XIX'
  },
  {
    name: 'Суд',
    description: 'Возрождение, внутренний зов, пробуждение',
    image: '/Cards-png/20-Judgement.png',
    cardNumber: 'XX'
  },
  {
    name: 'Мир',
    description: 'Завершение, интеграция, достижение',
    image: '/Cards-png/21-TheWorld.png',
    cardNumber: 'XXI'
  }
];

const SPREAD_POSITIONS: Record<SpreadType, string[]> = {
  'daily': ['Карта дня'],
  'past-present-future': ['Прошлое', 'Настоящее', 'Будущее'],
  'celtic-cross': [
    'Текущая ситуация',
    'Препятствие',
    'Основа ситуации',
    'Прошлое',
    'Возможное будущее',
    'Ближайшее будущее',
    'Ваше отношение',
    'Внешние влияния',
    'Надежды и страхи',
    'Итог'
  ],
  'relationship': [
    'Вы',
    'Партнер',
    'Ваши отношения',
    'Препятствия',
    'Потенциал развития'
  ]
};

const SPREAD_DESCRIPTIONS: Record<SpreadType, (cards: Card[]) => string> = {
  'daily': (cards) => 
    `${cards[0].name} говорит о том, что сегодня вам следует обратить внимание на ${cards[0].description.toLowerCase()}.`,
  
  'past-present-future': (cards) =>
    `В прошлом ${cards[0].name.toLowerCase()} показывает ${cards[0].description.toLowerCase()}. ` +
    `В настоящем ${cards[1].name.toLowerCase()} указывает на ${cards[1].description.toLowerCase()}. ` +
    `В будущем ${cards[2].name.toLowerCase()} предвещает ${cards[2].description.toLowerCase()}.`,
  
  'celtic-cross': (cards) =>
    `Ключевой аспект ситуации - ${cards[0].name.toLowerCase()}, что говорит о ${cards[0].description.toLowerCase()}. ` +
    `Основное препятствие - ${cards[1].name.toLowerCase()}. ` +
    `Итог ситуации может привести к ${cards[9].name.toLowerCase()}, что означает ${cards[9].description.toLowerCase()}.`,
  
  'relationship': (cards) =>
    `Ваша позиция отражена в карте ${cards[0].name.toLowerCase()}, что указывает на ${cards[0].description.toLowerCase()}. ` +
    `Партнёр представлен картой ${cards[1].name.toLowerCase()}. ` +
    `Ваши отношения характеризует ${cards[2].name.toLowerCase()}, ` +
    `а потенциал развития показывает ${cards[4].name.toLowerCase()}.`
};

export async function generatePrediction(spreadType: SpreadType = 'daily'): Promise<Prediction> {
  const positions = SPREAD_POSITIONS[spreadType];
  const cardCount = positions.length;
  
  // Select random cards for the spread
  const selectedCards: Card[] = [];
  while (selectedCards.length < cardCount) {
    const randomIndex = Math.floor(Math.random() * TAROT_CARDS.length);
    if (!selectedCards.includes(TAROT_CARDS[randomIndex])) {
      selectedCards.push(TAROT_CARDS[randomIndex]);
    }
  }

  // Add position information to each card
  const cardsWithPositions = selectedCards.map((card, index) => ({
    ...card,
    position: positions[index]
  }));

  return {
    date: new Date().toLocaleDateString('ru-RU', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    cards: cardsWithPositions,
    text: SPREAD_DESCRIPTIONS[spreadType](selectedCards),
    spreadType
  };
}

export function getRandomCards(count: number): Card[] {
  const shuffled = [...TAROT_CARDS].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

export type SpreadId = 'daily' | 'past-present-future' | 'celtic-cross' | 'relationship'

const POSITION_LABELS: Record<SpreadId, string[]> = {
  'daily': ['Карта дня'],
  'past-present-future': ['Прошлое', 'Настоящее', 'Будущее'],
  'celtic-cross': [
    'Текущая ситуация',
    'Влияющие силы',
    'Прошлое',
    'Будущее',
    'Сознательные мысли',
    'Подсознательные влияния',
    'Ваше влияние',
    'Влияние окружения',
    'Надежды и страхи',
    'Итог'
  ],
  'relationship': [
    'Вы',
    'Партнер',
    'Ваши чувства',
    'Чувства партнера',
    'Потенциал отношений'
  ]
}

export function getPositionLabel(spreadId: SpreadId, position: number): string {
  return POSITION_LABELS[spreadId]?.[position] || ''
} 