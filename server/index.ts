import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import TelegramBot from 'node-telegram-bot-api';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Telegram Bot setup
const botToken = process.env.TELEGRAM_BOT_TOKEN;
let bot: TelegramBot | null = null;

if (botToken) {
  try {
    bot = new TelegramBot(botToken, { polling: true });
    
    // Bot commands
    bot.onText(/\/start/, (msg: TelegramBot.Message) => {
      if (bot) {
        const chatId = msg.chat.id;
        bot.sendMessage(chatId, 'Добро пожаловать в Таро-бот! Нажмите кнопку ниже, чтобы получить предсказание.', {
          reply_markup: {
            inline_keyboard: [[
              { text: 'Открыть Web App', web_app: { url: process.env.NEXT_PUBLIC_WEBAPP_URL || 'https://your-webapp-url.com' } }
            ]]
          }
        });
      }
    });
  } catch (error) {
    console.error('Error initializing Telegram bot:', error);
  }
} else {
  console.log('Warning: TELEGRAM_BOT_TOKEN not provided. Bot functionality will be disabled.');
}

interface TarotCard {
  name: string;
  description: string;
  image: string;
  meaning: {
    upright: string;
    reversed: string;
  };
}

// Tarot cards data
const tarotCards: TarotCard[] = [
  {
    name: 'Шут',
    description: 'Новые начинания, спонтанность, свобода',
    image: 'https://api.dicebear.com/7.x/identicon/svg?seed=fool',
    meaning: {
      upright: 'Новые начинания, невинность, спонтанность, свободный дух',
      reversed: 'Безрассудство, риск, безответственность'
    }
  },
  {
    name: 'Маг',
    description: 'Сила воли, мастерство, проявление',
    image: 'https://api.dicebear.com/7.x/identicon/svg?seed=magician',
    meaning: {
      upright: 'Мастерство, проявление, сила воли, концентрация',
      reversed: 'Манипуляция, нерешительность, отсутствие действий'
    }
  },
  {
    name: 'Верховная Жрица',
    description: 'Интуиция, тайные знания, внутренняя мудрость',
    image: 'https://api.dicebear.com/7.x/identicon/svg?seed=highpriestess',
    meaning: {
      upright: 'Интуиция, тайные знания, внутренняя мудрость, мистерия',
      reversed: 'Секреты, отключение от интуиции, поверхностность'
    }
  },
  {
    name: 'Императрица',
    description: 'Изобилие, творчество, плодородие',
    image: 'https://api.dicebear.com/7.x/identicon/svg?seed=empress',
    meaning: {
      upright: 'Изобилие, творчество, забота, природа, роскошь',
      reversed: 'Блокировка творчества, зависимость, пустота'
    }
  },
  {
    name: 'Император',
    description: 'Власть, структура, стабильность',
    image: 'https://api.dicebear.com/7.x/identicon/svg?seed=emperor',
    meaning: {
      upright: 'Авторитет, структура, контроль, отцовская фигура',
      reversed: 'Доминирование, чрезмерный контроль, незрелость'
    }
  },
  {
    name: 'Иерофант',
    description: 'Духовное руководство, традиции, образование',
    image: 'https://api.dicebear.com/7.x/identicon/svg?seed=hierophant',
    meaning: {
      upright: 'Духовное наставничество, традиционные ценности, обучение',
      reversed: 'Догматизм, ограничения, бунт против традиций'
    }
  },
  {
    name: 'Влюбленные',
    description: 'Любовь, гармония, отношения, выбор',
    image: 'https://api.dicebear.com/7.x/identicon/svg?seed=lovers',
    meaning: {
      upright: 'Любовь, гармония, партнерство, важный выбор',
      reversed: 'Дисгармония, разрыв, неверный выбор'
    }
  },
  {
    name: 'Колесница',
    description: 'Движение вперед, победа, сила воли',
    image: 'https://api.dicebear.com/7.x/identicon/svg?seed=chariot',
    meaning: {
      upright: 'Прогресс, победа, сила воли, самоконтроль',
      reversed: 'Отсутствие направления, агрессия, поражение'
    }
  },
  {
    name: 'Сила',
    description: 'Внутренняя сила, храбрость, терпение',
    image: 'https://api.dicebear.com/7.x/identicon/svg?seed=strength',
    meaning: {
      upright: 'Внутренняя сила, мужество, убеждение, терпение',
      reversed: 'Слабость, неуверенность, отсутствие веры в себя'
    }
  },
  {
    name: 'Отшельник',
    description: 'Самопознание, поиск истины, уединение',
    image: 'https://api.dicebear.com/7.x/identicon/svg?seed=hermit',
    meaning: {
      upright: 'Самопознание, внутренний поиск, мудрость, одиночество',
      reversed: 'Изоляция, одиночество, потеря пути'
    }
  }
];

// API endpoints
app.get('/api/get-prediction', (_req: Request, res: Response) => {
  const randomCard = tarotCards[Math.floor(Math.random() * tarotCards.length)];
  const isReversed = Math.random() < 0.5;
  
  res.json({
    ...randomCard,
    isReversed,
    currentMeaning: isReversed ? randomCard.meaning.reversed : randomCard.meaning.upright
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 