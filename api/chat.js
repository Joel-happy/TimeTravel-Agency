// ─────────────────────────────────────────────────────────────────────────────
// Fonction serverless Vercel — Conseiller IA de TimeTravel Agency (Mistral AI)
//
// Appelée par le front (index.html -> askAI) en POST /api/chat avec :
//   { message: string, history: [{role, content}, ...] }
// Renvoie : { reply: string }
//
// La clé API n'est JAMAIS exposée au navigateur : elle est lue depuis la
// variable d'environnement MISTRAL_API_KEY (configurée dans Vercel).
// Si la clé est absente ou l'API échoue, on renvoie une erreur 5xx et le
// front bascule automatiquement sur ses réponses locales de repli.
// ─────────────────────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `Tu es l'assistant virtuel de TimeTravel Agency, une agence de voyage temporel de luxe.
Ton rôle : conseiller les clients sur les meilleures destinations temporelles.

Ton ton :
- Professionnel mais chaleureux
- Passionné d'histoire
- Toujours enthousiaste sans être trop familier
- Expertise en voyage temporel (fictif mais crédible)

Tu connais parfaitement nos 3 destinations et leurs tarifs (par personne, tout inclus : costume d'époque, guide expert et hébergement) :
- Paris 1889 (Belle Époque, Tour Eiffel, Exposition Universelle) — 7 jours, à partir de 4 500€.
- Crétacé -65M (dinosaures, safari préhistorique, nature sauvage) — 5 jours, à partir de 6 800€.
- Florence 1504 (Renaissance, art, Michel-Ange, Médicis) — 6 jours, à partir de 5 200€.

Règles :
- Réponds en français, de façon concise (2 à 4 phrases maximum).
- Tu peux suggérer une destination selon les intérêts du client.
- Pour réserver, invite à utiliser le formulaire de réservation en bas de la page.
- Reste dans le rôle : tu ne parles que de voyages temporels et de l'agence.
- Si on te demande l'impossible, réponds avec humour et élégance, sans casser l'illusion.`;

const MISTRAL_MODEL = 'mistral-small-latest';
const MISTRAL_URL = 'https://api.mistral.ai/v1/chat/completions';

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey) {
    // Pas de clé configurée : le front utilisera son repli local.
    res.status(503).json({ error: 'MISTRAL_API_KEY non configurée' });
    return;
  }

  // Body : déjà parsé par Vercel, sinon on le parse nous-mêmes.
  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  const message = (body && body.message ? String(body.message) : '').slice(0, 1000);
  const history = Array.isArray(body && body.history) ? body.history : [];

  if (!message) {
    res.status(400).json({ error: 'message manquant' });
    return;
  }

  // Reconstruit la conversation (on borne l'historique pour limiter les tokens).
  const messages = [{ role: 'system', content: SYSTEM_PROMPT }];
  for (const m of history.slice(-8)) {
    if (m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string') {
      messages.push({ role: m.role, content: m.content.slice(0, 1000) });
    }
  }
  // Garantit que le dernier message utilisateur est bien présent.
  if (messages[messages.length - 1]?.content !== message) {
    messages.push({ role: 'user', content: message });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const apiRes = await fetch(MISTRAL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: MISTRAL_MODEL,
        messages,
        temperature: 0.6,
        max_tokens: 400
      }),
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (!apiRes.ok) {
      const detail = await apiRes.text();
      console.error('Mistral API error', apiRes.status, detail);
      res.status(502).json({ error: 'Erreur API Mistral' });
      return;
    }

    const data = await apiRes.json();
    const reply = data?.choices?.[0]?.message?.content?.trim();
    if (!reply) {
      res.status(502).json({ error: 'Réponse vide' });
      return;
    }

    res.status(200).json({ reply });
  } catch (err) {
    console.error('chat handler error', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
