const riaCategories = {
INACCEPTABLE: {
score: 0,
keywords: ['manipulation', 'scoring social',
'subliminal', 'exploitation'],
recommendations: [
'Arrêt immédiat du système',
'Refonte complète du projet',
'Consultation juridique urgente'
]
},
ÉLEVÉ: {
score: 35,
keywords: ['recrutement', 'justice', 'santé',
'biométrique', 'crédit'],
recommendations: [
'Documentation technique complète obligatoire',
'Système de gestion des risques',
'Évaluation de conformité par organisme notifié',
'Enregistrement dans le registre UE'
]
},
LIMITÉ: {
score: 70,
keywords: ['chatbot', 'deepfake', 'génération',
'contenu synthétique'],
recommendations: [
'Informer les utilisateurs de l\'interaction avec IA',
'Marquer les contenus générés par IA',
'Transparence sur les capacités et limites'
]
},
MINIMAL: {
score: 90,
keywords: ['recommandation', 'filtrage',
'analyse', 'automatisation'],
recommendations: [
'Bonnes pratiques de développement',
'Documentation utilisateur claire',
'Tests de qualité réguliers'
]
}
};
module.exports = { riaCategories };