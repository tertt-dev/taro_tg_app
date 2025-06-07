# Taro Telegram Mini App

A Telegram Mini App for Tarot card readings.

## Environment Setup

This application requires the following environment variables to be set:

```bash
BOT_TOKEN=your_bot_token_here      # Your Telegram Bot Token
JWT_SECRET=your_jwt_secret_here    # A secure random string for JWT signing
```

### Local Development

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env .env.local
   ```

2. Update `.env.local` with your actual values:
   - `BOT_TOKEN`: Get this from [@BotFather](https://t.me/botfather) on Telegram
   - `JWT_SECRET`: Generate a secure random string (at least 32 characters)

### Production Deployment

When deploying to Vercel:

1. Go to your project settings
2. Navigate to the "Environment Variables" section
3. Add the following variables:
   - `BOT_TOKEN`
   - `JWT_SECRET`

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Features

- Real-time Tarot card readings
- Beautiful card animations
- Prediction history
- User authentication via Telegram
- Dark/Light theme support

## Tech Stack

- Next.js 15.3
- React
- TypeScript
- Tailwind CSS
- Framer Motion
- Telegram Mini App SDK

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.=

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
