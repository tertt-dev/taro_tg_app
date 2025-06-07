require('dotenv').config({ path: '.env.local' });
const crypto = require('crypto');

// Test user data
const user = {
  id: 123456789,
  first_name: "Test",
  last_name: "User",
  username: "testuser",
  language_code: "ru"
};

// Current timestamp
const auth_date = Math.floor(Date.now() / 1000);

// Create the data object
const data = {
  query_id: "AAHdF6IQAAAAAN0XohDhrOrc",
  user: user,
  auth_date: auth_date
};

// Sort the data object keys
const dataCheckString = Object.keys(data)
  .sort()
  .map(key => `${key}=${JSON.stringify(data[key])}`)
  .join('\n');

// Get the bot token from environment
const BOT_TOKEN = process.env.BOT_TOKEN;
if (!BOT_TOKEN) {
  console.error('BOT_TOKEN environment variable is not set');
  process.exit(1);
}

// Calculate the secret key
const secretKey = crypto
  .createHash('sha256')
  .update(BOT_TOKEN)
  .digest();

// Calculate the hash
const hash = crypto
  .createHmac('sha256', secretKey)
  .update(dataCheckString)
  .digest('hex');

// Add hash to data
data.hash = hash;

// Create the final initData string
const initData = Object.entries(data)
  .map(([key, value]) => `${key}=${encodeURIComponent(typeof value === 'object' ? JSON.stringify(value) : value)}`)
  .join('&');

console.log('Generated initData:');
console.log(initData);
console.log('\nTest URL:');
console.log(`http://localhost:3000/?initData=${initData}`); 