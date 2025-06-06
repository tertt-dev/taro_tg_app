import { NextResponse } from 'next/server';

const PLACEHOLDER_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjgwIiBoZWlnaHQ9IjQ4MCIgdmlld0JveD0iMCAwIDI4MCA0ODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjI4MCIgaGVpZ2h0PSI0ODAiIGZpbGw9IiMxYTFhMmUiLz48L3N2Zz4=';

const tarotCards = [
  {
    name: "Маг",
    description: "Карта возможностей и силы воли",
    image: PLACEHOLDER_IMAGE,
    meaning: {
      upright: "Сила воли, мастерство, концентрация, действие",
      reversed: "Манипуляция, нерешительность, задержки"
    }
  },
  {
    name: "Верховная Жрица",
    description: "Карта интуиции и тайных знаний",
    image: PLACEHOLDER_IMAGE,
    meaning: {
      upright: "Интуиция, тайные знания, внутренний голос",
      reversed: "Подавленная интуиция, поверхностность"
    }
  },
  {
    name: "Императрица",
    description: "Карта изобилия и материнской энергии",
    image: PLACEHOLDER_IMAGE,
    meaning: {
      upright: "Изобилие, творчество, материнство",
      reversed: "Блокировка творчества, зависимость"
    }
  },
  {
    name: "Император",
    description: "Карта власти и структуры",
    image: PLACEHOLDER_IMAGE,
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