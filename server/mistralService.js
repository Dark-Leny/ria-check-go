require('dotenv').config();
const Mistral = require('@mistralai/mistralai');
const client = new Mistral({
apiKey: process.env.MISTRAL_API_KEY
});
const SYSTEM_PROMPT = `Tu es un expert en conformité
au Règlement sur l'Intelligence Artificielle (RIA / AI Act).
Ta mission est d'aider les entreprises à évaluer
leur conformité en posant des questions pertinentes
sur leur système d'IA.
Les niveaux de risque sont :
- INACCEPTABLE : IA interdite (manipulation, scoring social)
- ÉLEVÉ : IA à haut risque (RH, justice, santé, transport)
- LIMITÉ : Transparence requise (chatbots, deepfakes)
- MINIMAL : Peu ou pas de réglementation
Pose des questions claires et professionnelles.
À la fin, donne une classification et des recommandations.`;
class MistralService {
async chat(messages) {
const fullMessages = [
{ role: 'system', content: SYSTEM_PROMPT },
...messages
];
const response = await client.chat.complete({
model: 'mistral-small-latest',
messages: fullMessages,
temperature: 0.7,
max_tokens: 1000
});
return response.choices[0].message.content;
}
}
module.exports = new MistralService();