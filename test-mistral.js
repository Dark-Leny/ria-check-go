require('dotenv').config();
const Mistral = require('@mistralai/mistralai');
const client = new Mistral({
apiKey: process.env.MISTRAL_API_KEY
});
async function testMistral() {
const response = await client.chat.complete({
model: 'mistral-small-latest',
messages: [{
role: 'user',
content: 'Bonjour ! Peux-tu te présenter ?'
}]
});
console.log(response.choices[0].message.content);
}
testMistral();