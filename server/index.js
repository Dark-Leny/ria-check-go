require('dotenv').config();
const express = require('express');
const session = require('express-session');
const mistralService = require('./mistralService');
const { riaCategories } = require('./riaRules');
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.static('public'));
app.use(session({
secret: process.env.SESSION_SECRET || 'dev-secret',
resave: false,
saveUninitialized: true
}));
app.post('/api/chat', async (req, res) => {
try {
const { messages } = req.body;
if (!req.session.conversationHistory) {
req.session.conversationHistory = [];
}
req.session.conversationHistory.push(...messages);

const response = await mistralService.chat(
req.session.conversationHistory
);
req.session.conversationHistory.push({
role: 'assistant',
content: response
});
res.json({ response });
} catch (error) {
console.error('Erreur:', error);
res.status(500).json({ error: 'Erreur serveur' });
}
});
app.listen(PORT, () => {
console.log(`Serveur démarré sur http://localhost:${PORT}`);
});