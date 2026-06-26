# TimeTravel Agency — Webapp Interactive 🕰️

Webapp pour une agence de voyage temporel fictive, créée avec l'IA générative dans le cadre du **Projet Supervisé IA M1/M2 — Session 2 (Webapp & IA Agents)**.

Trois époques légendaires : **Paris 1889**, le **Crétacé −65M** et **Florence 1504**.

> 🔗 **Démo en ligne :** _à compléter après déploiement_ (Vercel)
> 📦 **Repo de déploiement :** https://github.com/Joel-happy/TimeTravel-Agency

---

## 🛠️ Stack technique

- **HTML5 + Tailwind CSS** (via CDN) — pas de build, déploiement instantané
- **JavaScript vanilla** — animations, modals, quiz, chatbot
- **Polices** : Playfair Display + Inter (Google Fonts)
- **Backend** : fonction serverless Vercel (`/api/chat`) → **Mistral AI API** (`mistral-small-latest`)
- **Hébergement** : **Vercel** (lié au repo GitHub, déploiement automatique)
- **Assets** : images et vidéo hébergées directement dans le repo (`/images`, `/assets`)

## ✨ Features implémentées

| Feature | Statut |
|---|---|
| Landing page immersive (thème sombre, accents dorés) | ✅ |
| Hero avec **vidéo de fond** + champ d'étoiles animé | ✅ |
| Section **présentation de l'agence** | ✅ |
| **Galerie des 3 destinations** (cards interactives) | ✅ |
| **Modals détaillées** par destination (points forts, inclus, prix, durée) | ✅ |
| **Chatbot IA** (widget flottant) connecté à Mistral, avec repli local | ✅ |
| **Quiz de personnalisation** (recommande une destination) | ✅ (optionnel 3.2) |
| **Formulaire de réservation** (destination + date) | ✅ |
| Animations au scroll, hover, micro-interactions | ✅ (optionnel 2.3) |
| Responsive **mobile-first** + menu mobile | ✅ |
| `prefers-reduced-motion`, lazy-loading des images | ✅ |

## 🤖 IA utilisées (transparence)

- **Génération du code** : Claude (Anthropic) — Claude Code / Opus 4.8
- **Chatbot** : Mistral Small (`mistral-small-latest`) via l'API Mistral AI
- **Visuels des destinations** : générés en projet précédent (`/images/*.png`)
- **Vidéo de fond** : `/assets/animations.mp4`

## 📁 Structure

```
webapp/
├─ index.html          # La webapp complète (UI + logique front)
├─ api/
│  └─ chat.js          # Fonction serverless Vercel → Mistral AI
├─ images/             # paris.png, cretace.png, florence.png
├─ assets/
│  └─ animations.mp4   # Vidéo de fond du hero
├─ vercel.json         # Config Vercel (cleanUrls, cache)
├─ package.json
├─ .env.example        # Modèle de variables d'environnement
└─ .gitignore
```

## 🚀 Installation & lancement

### En local (aperçu statique simple)
Le chatbot fonctionne en **mode repli** (réponses locales par mots-clés) sans rien configurer.

```bash
# Depuis le dossier webapp/
python -m http.server 8000
# puis ouvrir http://localhost:8000
```

### En local avec l'IA Mistral (fonction serverless)
```bash
npm i -g vercel
cp .env.example .env.local      # puis renseigner MISTRAL_API_KEY
vercel dev                      # sert le site + /api/chat
```

### Déploiement (Vercel)
1. Pousser le contenu de `webapp/` sur le repo GitHub lié à Vercel.
2. Dans **Vercel → Project Settings → Environment Variables**, ajouter
   `MISTRAL_API_KEY` (clé obtenue sur https://console.mistral.ai/).
3. Vercel redéploie automatiquement à chaque push sur `main`.

> ⚠️ **Sécurité** : la clé API n'est jamais dans le code ni exposée au navigateur.
> Elle est lue côté serveur dans `api/chat.js` via `process.env.MISTRAL_API_KEY`.

## 🔑 Configuration requise

| Variable | Où | Rôle |
|---|---|---|
| `MISTRAL_API_KEY` | Vercel (env vars) / `.env.local` | Active les vraies réponses IA du chatbot |

Sans cette clé, le site reste **100 % fonctionnel** grâce au repli local du chatbot.

## 📝 Licence

Projet pédagogique — M1/M2 Digital & IA. Usage éducatif.
