export interface Card {
  name: string;
  description: string;
  image: string;
  cardNumber: string;
}

export interface Prediction {
  date: string;
  cards: Card[];
  text: string;
}

export const TAROT_CARDS: Card[] = [
  {
    name: 'Шут',
    description: 'Новые начинания, спонтанность, свобода',
    image: '/Cards-png/00-TheFool.png',
    cardNumber: '0'
  },
  {
    name: 'Маг',
    description: 'Сила воли, мастерство, проявление',
    image: '/Cards-png/01-TheMagician.png',
    cardNumber: 'I'
  },
  {
    name: 'Верховная Жрица',
    description: 'Интуиция, тайны, внутренняя мудрость',
    image: '/Cards-png/02-TheHighPriestess.png',
    cardNumber: 'II'
  },
  {
    name: 'Императрица',
    description: 'Изобилие, творчество, материнство',
    image: '/Cards-png/03-TheEmpress.png',
    cardNumber: 'III'
  },
  {
    name: 'Император',
    description: 'Власть, структура, стабильность',
    image: '/Cards-png/04-TheEmperor.png',
    cardNumber: 'IV'
  },
  {
    name: 'Иерофант',
    description: 'Духовное руководство, традиции, обучение',
    image: '/Cards-png/05-TheHierophant.png',
    cardNumber: 'V'
  },
  {
    name: 'Влюбленные',
    description: 'Любовь, гармония, выбор',
    image: '/Cards-png/06-TheLovers.png',
    cardNumber: 'VI'
  },
  {
    name: 'Колесница',
    description: 'Движение вперед, победа, контроль',
    image: '/Cards-png/07-TheChariot.png',
    cardNumber: 'VII'
  },
  {
    name: 'Сила',
    description: 'Внутренняя сила, мужество, самоконтроль',
    image: '/Cards-png/08-Strength.png',
    cardNumber: 'VIII'
  },
  {
    name: 'Отшельник',
    description: 'Самопознание, поиск истины, уединение',
    image: '/Cards-png/09-TheHermit.png',
    cardNumber: 'IX'
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