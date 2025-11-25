// app.js - Logique frontend pour RIA Check & Go

// État global de l'application
let conversationHistory = [];
let currentScore = 0;
let riskLevel = 'minimal';

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    initializeChat();
    setupEventListeners();
});

// Configuration du chat
function initializeChat() {
    displayMessage('assistant', 
        'Bonjour ! Je suis votre assistant de conformité RIA. ' +
        'Je vais vous aider à évaluer le niveau de risque de votre système d\'IA. ' +
        'Pouvez-vous me décrire brièvement votre système ?'
    );
}

// Gestion des événements
function setupEventListeners() {
    const input = document.getElementById('user-input');
    
    // Envoi avec le bouton
    document.querySelector('button[onclick="sendMessage()"]').addEventListener('click', sendMessage);
    
    // Envoi avec la touche Entrée
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}

// Envoi d'un message
async function sendMessage() {
    const input = document.getElementById('user-input');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Afficher le message utilisateur
    displayMessage('user', message);
    input.value = '';
    
    // Ajouter à l'historique
    conversationHistory.push({
        role: 'user',
        content: message
    });
    
    // Afficher l'indicateur de chargement
    showTypingIndicator();
    
    try {
        // Appel à l'API backend
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messages: conversationHistory
            })
        });
        
        if (!response.ok) {
            throw new Error('Erreur lors de la communication avec le serveur');
        }
        
        const data = await response.json();
        
        // Masquer l'indicateur de chargement
        hideTypingIndicator();
        
        // Afficher la réponse
        displayMessage('assistant', data.response);
        
        // Ajouter à l'historique
        conversationHistory.push({
            role: 'assistant',
            content: data.response
        });
        
        // Analyser la réponse pour détecter la fin du diagnostic
        checkForDiagnosticComplete(data.response);
        
    } catch (error) {
        hideTypingIndicator();
        displayMessage('assistant', 
            'Désolé, une erreur est survenue. Veuillez réessayer.'
        );
        console.error('Erreur:', error);
    }
}

// Affichage d'un message dans le chat
function displayMessage(role, content) {
    const chatContainer = document.getElementById('chat-container');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', `${role}-message`);
    
    // Icône du message
    const icon = document.createElement('div');
    icon.classList.add('message-icon');
    icon.textContent = role === 'user' ? '👤' : '🤖';
    
    // Contenu du message
    const contentDiv = document.createElement('div');
    contentDiv.classList.add('message-content');
    contentDiv.textContent = content;
    
    messageDiv.appendChild(icon);
    messageDiv.appendChild(contentDiv);
    chatContainer.appendChild(messageDiv);
    
    // Scroll automatique vers le bas
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Indicateur de saisie
function showTypingIndicator() {
    const chatContainer = document.getElementById('chat-container');
    const indicator = document.createElement('div');
    indicator.id = 'typing-indicator';
    indicator.classList.add('message', 'assistant-message', 'typing');
    indicator.innerHTML = `
        <div class="message-icon">🤖</div>
        <div class="message-content">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
        </div>
    `;
    chatContainer.appendChild(indicator);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function hideTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) {
        indicator.remove();
    }
}

// Vérification de la fin du diagnostic
function checkForDiagnosticComplete(response) {
    const lowerResponse = response.toLowerCase();
    
    // Mots-clés indiquant une classification
    const completionKeywords = [
        'classification',
        'niveau de risque',
        'votre système est classé',
        'diagnostic terminé',
        'recommandations'
    ];
    
    const isComplete = completionKeywords.some(keyword => 
        lowerResponse.includes(keyword)
    );
    
    if (isComplete) {
        // Extraire le niveau de risque
        extractRiskLevel(response);
        
        // Afficher le bouton de génération de rapport
        setTimeout(() => {
            showReportButton();
        }, 1000);
    }
}

// Extraction du niveau de risque
function extractRiskLevel(response) {
    const lowerResponse = response.toLowerCase();
    
    if (lowerResponse.includes('inacceptable')) {
        riskLevel = 'inacceptable';
        currentScore = 0;
    } else if (lowerResponse.includes('élevé') || lowerResponse.includes('haut risque')) {
        riskLevel = 'élevé';
        currentScore = 35;
    } else if (lowerResponse.includes('limité') || lowerResponse.includes('transparence')) {
        riskLevel = 'limité';
        currentScore = 70;
    } else {
        riskLevel = 'minimal';
        currentScore = 90;
    }
}

// Affichage du bouton de rapport
function showReportButton() {
    const chatContainer = document.getElementById('chat-container');
    
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('report-actions');
    buttonContainer.innerHTML = `
        <div class="score-display">
            <h3>Score de conformité : ${currentScore}/100</h3>
            <p>Niveau de risque : <strong>${riskLevel.toUpperCase()}</strong></p>
        </div>
        <button onclick="generatePDF()" class="btn-primary">
            📄 Télécharger le rapport PDF
        </button>
        <button onclick="requestQuote()" class="btn-secondary">
            📧 Demander un devis
        </button>
        <button onclick="resetChat()" class="btn-secondary">
            🔄 Nouveau diagnostic
        </button>
    `;
    
    chatContainer.appendChild(buttonContainer);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Génération du PDF
async function generatePDF() {
    // Utilisation de jsPDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // En-tête
    doc.setFontSize(20);
    doc.text('Rapport de Conformité RIA', 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, 20, 35);
    doc.text(`Score: ${currentScore}/100`, 20, 45);
    doc.text(`Niveau de risque: ${riskLevel.toUpperCase()}`, 20, 55);
    
    // Ligne de séparation
    doc.line(20, 60, 190, 60);
    
    // Historique de conversation
    doc.setFontSize(14);
    doc.text('Diagnostic:', 20, 70);
    
    let yPosition = 80;
    doc.setFontSize(10);
    
    conversationHistory.forEach((msg, index) => {
        if (yPosition > 270) {
            doc.addPage();
            yPosition = 20;
        }
        
        const role = msg.role === 'user' ? 'Vous' : 'Assistant';
        const lines = doc.splitTextToSize(`${role}: ${msg.content}`, 170);
        
        doc.text(lines, 20, yPosition);
        yPosition += (lines.length * 7) + 5;
    });
    
    // Recommandations
    if (yPosition > 240) {
        doc.addPage();
        yPosition = 20;
    }
    
    doc.setFontSize(14);
    yPosition += 10;
    doc.text('Recommandations:', 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(10);
    const recommendations = getRecommendations(riskLevel);
    recommendations.forEach(rec => {
        if (yPosition > 270) {
            doc.addPage();
            yPosition = 20;
        }
        const lines = doc.splitTextToSize(`• ${rec}`, 170);
        doc.text(lines, 20, yPosition);
        yPosition += (lines.length * 7) + 3;
    });
    
    // Téléchargement
    doc.save(`RIA-Rapport-${Date.now()}.pdf`);
    
    displayMessage('assistant', 'Votre rapport PDF a été téléchargé avec succès !');
}

// Recommandations selon le niveau de risque
function getRecommendations(level) {
    const recommendations = {
        'inacceptable': [
            'Arrêt immédiat du système',
            'Refonte complète du projet',
            'Consultation juridique urgente',
            'Révision des objectifs du système'
        ],
        'élevé': [
            'Documentation technique complète obligatoire',
            'Mise en place d\'un système de gestion des risques',
            'Évaluation de conformité par organisme notifié',
            'Enregistrement dans le registre UE',
            'Tests réguliers et validation continue'
        ],
        'limité': [
            'Informer les utilisateurs de l\'interaction avec IA',
            'Marquer les contenus générés par IA',
            'Transparence sur les capacités et limites',
            'Documentation utilisateur claire'
        ],
        'minimal': [
            'Bonnes pratiques de développement',
            'Documentation utilisateur claire',
            'Tests de qualité réguliers',
            'Veille réglementaire continue'
        ]
    };
    
    return recommendations[level] || recommendations['minimal'];
}

// Demande de devis
function requestQuote() {
    const form = `
        <div class="quote-form">
            <h3>Demande de devis</h3>
            <input type="text" id="quote-name" placeholder="Nom complet" required>
            <input type="email" id="quote-email" placeholder="Email" required>
            <input type="tel" id="quote-phone" placeholder="Téléphone">
            <textarea id="quote-message" placeholder="Message (optionnel)" rows="4"></textarea>
            <button onclick="submitQuote()" class="btn-primary">Envoyer</button>
            <button onclick="cancelQuote()" class="btn-secondary">Annuler</button>
        </div>
    `;
    
    const chatContainer = document.getElementById('chat-container');
    const formDiv = document.createElement('div');
    formDiv.id = 'quote-form-container';
    formDiv.innerHTML = form;
    chatContainer.appendChild(formDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function submitQuote() {
    const name = document.getElementById('quote-name').value;
    const email = document.getElementById('quote-email').value;
    const phone = document.getElementById('quote-phone').value;
    const message = document.getElementById('quote-message').value;
    
    if (!name || !email) {
        alert('Veuillez remplir les champs obligatoires');
        return;
    }
    
    // Simulation d'envoi (à remplacer par un vrai appel API)
    console.log('Demande de devis:', { name, email, phone, message, riskLevel, currentScore });
    
    document.getElementById('quote-form-container').remove();
    displayMessage('assistant', 
        'Merci ! Votre demande de devis a été envoyée. ' +
        'Notre équipe vous contactera sous 48h.'
    );
}

function cancelQuote() {
    document.getElementById('quote-form-container').remove();
}

// Réinitialisation du chat
function resetChat() {
    conversationHistory = [];
    currentScore = 0;
    riskLevel = 'minimal';
    
    document.getElementById('chat-container').innerHTML = '';
    initializeChat();
}