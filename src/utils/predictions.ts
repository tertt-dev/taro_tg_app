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
}

export const TAROT_CARDS: Card[] = [
  {
    name: "Шут",
    image: "/cards/fool.jpg",
    description: "Новые начинания, спонтанность, невинность, приключения",
    cardNumber: "0"
  },
  {
    name: "Маг",
    image: "/cards/magician.jpg",
    description: "Проявление, сила воли, мастерство, вдохновение",
    cardNumber: "I"
  },
  {
    name: "Верховная Жрица",
    image: "/cards/high-priestess.jpg",
    description: "Интуиция, тайные знания, внутренняя мудрость",
    cardNumber: "II"
  },
  {
    name: "Императрица",
    image: "/cards/empress.jpg",
    description: "Изобилие, творчество, материнство, природа",
    cardNumber: "III"
  },
  {
    name: "Император",
    image: "/cards/emperor.jpg",
    description: "Власть, структура, стабильность, достижения",
    cardNumber: "IV"
  },
  {
    name: "Иерофант",
    image: "/cards/hierophant.jpg",
    description: "Традиции, духовность, обучение, наставничество",
    cardNumber: "V"
  },
  {
    name: "Влюбленные",
    image: "/cards/lovers.jpg",
    description: "Любовь, гармония, выбор, отношения",
    cardNumber: "VI"
  },
  {
    name: "Колесница",
    image: "/cards/chariot.jpg",
    description: "Движение вперед, победа, сила воли, решительность",
    cardNumber: "VII"
  },
  {
    name: "Сила",
    image: "/cards/strength.jpg",
    description: "Внутренняя сила, храбрость, терпение, сострадание",
    cardNumber: "VIII"
  },
  {
    name: "Отшельник",
    image: "/cards/hermit.jpg",
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