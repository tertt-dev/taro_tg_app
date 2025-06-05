import { NextResponse } from 'next/server';

const tarotCards = [
  {
    name: "Маг",
    description: "Карта возможностей и силы воли",
    image: "https://api.dicebear.com/7.x/identicon/svg?seed=magician",
    meaning: {
      upright: "Сила воли, мастерство, концентрация, действие",
      reversed: "Манипуляция, нерешительность, задержки"
    }
  },
  {
    name: "Верховная Жрица",
    description: "Карта интуиции и тайных знаний",
    image: "https://api.dicebear.com/7.x/identicon/svg?seed=priestess",
    meaning: {
      upright: "Интуиция, тайные знания, внутренний голос",
      reversed: "Подавленная интуиция, поверхностность"
    }
  },
  {
    name: "Императрица",
    description: "Карта изобилия и материнской энергии",
    image: "https://api.dicebear.com/7.x/identicon/svg?seed=empress",
    meaning: {
      upright: "Изобилие, творчество, материнство",
      reversed: "Блокировка творчества, зависимость"
    }
  },
  {
    name: "Император",
    description: "Карта власти и структуры",
    image: "https://api.dicebear.com/7.x/identicon/svg?seed=emperor",
    meaning: {
      upright: "Авторитет, структура, контроль",
      reversed: "Доминирование, чрезмерный контроль"
    }
  }
];

export async function GET() {
  const randomCard = tarotCards[Math.floor(Math.random() * tarotCards.length)];
  const isReversed = Math.random() > 0.5;
  
  return NextResponse.json({
    ...randomCard,
    isReversed,
    currentMeaning: isReversed ? randomCard.meaning.reversed : randomCard.meaning.upright
  });
} 