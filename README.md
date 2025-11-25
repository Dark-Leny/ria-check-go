# ria-check-go

# Documentation Technique du Projet : RIA Check & Go 🤖

## 1. Introduction et Spécifications Fonctionnelles

### 1.1. Présentation du Projet
**RIA Check & Go** est une application web intelligente utilisant un chatbot conversationnel pour aider les entreprises à évaluer leur **conformité au Règlement sur l'Intelligence Artificielle (RIA / AI Act)**. Elle utilise les modèles de Mistral AI pour l'analyse des risques.

### 1.2. Objectifs Fonctionnels
Le projet vise à :
* Créer un chatbot intelligent capable de classifier les systèmes d'IA selon leur **niveau de risque**.
* Générer automatiquement un **rapport de conformité personnalisé**.
* Proposer des **recommandations concrètes** basées sur le diagnostic.
* Faciliter la demande de devis pour un accompagnement à la conformité.

---

## 2. Architecture Détaillée de l'Application

### 2.1. Vue d'ensemble (Architecture Client-Serveur en Trois Couches)

L'application est basée sur une architecture **client-serveur en trois couches** (Frontend, Backend, et IA).

| Couche | Composants | Technologies |
| :--- | :--- | :--- |
| **Frontend** | Interface chatbot, Affichage du score, Génération PDF | HTML5/CSS3, JavaScript vanilla, `jsPDF` |
| **Backend** | Serveur API, Gestion de sessions, Logique métier RIA | Node.js + Express, `Express-session` |
| **IA** | Service Mistral AI, Classification risques, Analyse conformité | Mistral API, `mistral-small-latest` |

### 2.2. Flux de Données

1.  L'utilisateur accède à l'interface web.
2.  Le Frontend envoie les messages au Backend via **API REST**.
3.  Le Backend transmet la conversation à Mistral AI avec le **contexte RIA**.
4.  Mistral analyse et génère une réponse contextualisée.
5.  Le Backend enrichit la réponse avec les **règles métier RIA**.
6.  Le Frontend affiche la réponse et met à jour l'interface.
7.  À la fin du diagnostic, génération du rapport PDF.

### 2.3. Structure des Dossiers

La structure des dossiers pour le projet est la suivante :

ria-check-go/ ├── server/ │ ├── index.js # Serveur Express principal │ ├── mistralService.js # Service Mistral AI │ └── riaRules.js # Règles métier RIA ├── public/ │ ├── index.html # Interface principale │ ├── styles.css # Styles CSS │ └── app.js # JavaScript frontend ├── .env # Variables d'environnement ├── .gitignore ├── package.json └── README.md

---

## 3. Spécifications Techniques et Modèle de Données

### 3.1. Prérequis Techniques

| Catégorie | Éléments Requis |
| :--- | :--- |
| **Langages** | JavaScript / Node.js (v18+), HTML5/CSS3 |
| **Outils** | Visual Studio Code ou équivalent, Git/GitHub, Postman ou curl (tests API) |
| **Connaissances** | APIs REST et requêtes HTTP, Prompting (ingénierie de prompts), JSON et manipulation de données |

### 3.2. Modèle de Données (Règles RIA)

Les règles de classification sont définies dans `server/riaRules.js`, avec quatre catégories de risque :

| Niveau de Risque | Score | Mots-clés (Exemples) | Recommandations (Exemples) |
| :--- | :--- | :--- | :--- |
| **INACCEPTABLE** | 0 | `manipulation`, `scoring social` | Arrêt immédiat du système, Consultation juridique urgente |
| **ÉLEVÉ** | 35 | `recrutement`, `justice`, `santé` | Documentation technique complète obligatoire, Enregistrement dans le registre UE |
| **LIMITÉ** | 70 | `chatbot`, `deepfake`, `génération` | Informer les utilisateurs de l'interaction avec IA, Marquer les contenus générés par IA |
| **MINIMAL** | 90 | `recommandation`, `filtrage`, `analyse` | Bonnes pratiques de développement, Documentation utilisateur claire |

### 3.3. Gestion de Session et Historique

Le Backend utilise `express-session` pour maintenir le contexte de conversation. L'historique est stocké dans `req.session.conversationHistory` et est envoyé à Mistral pour chaque appel API.

---

## 4. Guide d'Installation et de Déploiement

### 4.1. Installation des Dépendances

1.  Créez et accédez au dossier du projet :
    ```bash
    mkdir ria-check-go
    cd ria-check-go
    ```
2.  Initialisez Node.js et installez les dépendances :
    ```bash
    npm init -y
    npm install @mistralai/mistralai express dotenv express-session
    ```

### 4.2. Configuration de l'Environnement

1.  Créez un fichier `.env` à la racine pour stocker votre clé API :
    ```
    MISTRAL_API_KEY=votre clé api ici
    SESSION_SECRET=un-secret-unique-pour-la-session
    PORT=3000
    ```

### 4.3. Démarrage de l'Application

* Lancez le serveur Express principal :
    ```bash
    node server/index.js
    ```
* Le serveur démarrera sur l'URL : `http://localhost:${PORT}`.

---

## 5. Documentation des Tests Réalisés

### 5.1. Scénarios de Test Fonctionnel

Les tests visent à valider la cohérence de la classification de l'IA en fonction de son usage.

| Scénario | Description | Résultat Attendu (Classification / Score) |
| :--- | :--- | :--- |
| **Test 1** | IA de recrutement pour filtrage de CV | ÉLEVÉ - Score : 35/100 |
| **Test 2** | Chatbot de service client | LIMITÉ - Score : 70/100 |
| **Test 3** | Système de recommandation de produits | MINIMAL - Score : 90/100 |
| **Test 4** | Système de scoring social | INACCEPTABLE - Score : 0/100 |

### 5.2. Critères de Validation

Le succès du projet est validé si :
* Le chatbot pose au minimum **5 questions pertinentes**.
* La classification est **cohérente** avec les réponses données.
* Les recommandations correspondent au **niveau de risque** identifié.
* Le rapport PDF contient toutes les informations nécessaires.
* L'interface est intuitive et responsive.

### 5.3. Maquettes Visuelles (Livrables)

Les maquettes à fournir (Figma, Adobe XD, ou captures d'écran) incluent :
* Écran d'accueil avec QR Code
* Interface de conversation chatbot
* Écran de résultats avec score et visualisation
* Formulaire de demande de devis