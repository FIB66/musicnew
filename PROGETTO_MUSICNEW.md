# 📋 MusicNew — Diario di Progetto

> **Istruzioni per Claude:** Leggi questo file all'inizio di ogni sessione per capire lo stato del progetto e continuare il lavoro. L'utente allegherà anche i file del progetto.

---

## 🎯 Cos'è MusicNew

Sito web community-driven per raccogliere **tutti i locali, concerti, feste, festival e jam session musicali in Italia**. Gli utenti si registrano e aggiungono eventi/locali. Ricerca per città.

**Obiettivo reale:** Diventare il punto di riferimento in Italia per chi vuole sapere dove si fa musica live — dalla serata liscio nella piazza del paese, alla festa salsa nel circolo ARCI, al trio jazz nel bar, alla cover band nel pub, fino al festival nazionale. Tutti i generi, tutte le città, tutti gli eventi che non esistono da nessuna parte online.

**Funzioni principali:**
- Database locali (bar, club, venue) con info, genere musicale, città
- Database eventi (concerti, feste, festival, jam session)
- Ricerca per città
- Utenti registrati che aggiungono contenuti
- Commenti e recensioni

**Stack:**
- **Frontend:** HTML + React (CDN) + Babel standalone
- **Backend:** Supabase (database + autenticazione gratuiti)
- **Deploy:** GitHub Pages
- **Repo:** `MUSICNEW` su GitHub (Documenti → GitHub → musicnew)

---

## 📁 Struttura del Progetto

```
musicnew/
├── index.html          ← App completa (UI + logica React + Supabase)
├── italia-map.js       ← Web Component mappa interattiva delle regioni
└── database supabase   ← Note configurazione Supabase
```

---

## 🗄️ Schema Database Supabase

### Tabella `venues` (locali)
- id, nome, città, indirizzo, genere_musicale, descrizione, sito_web, immagine_url, creato_da, created_at

### Tabella `events` (eventi)
- id, titolo, venue_id, città, data, ora, tipo (concerto/festa/festival/jam), genere_musicale, descrizione, immagine_url, creato_da, created_at

### Tabella `users` (gestita da Supabase Auth)
- id, email, username, avatar_url

### RLS Policies attive
- `venues`: lettura pubblica ✅ — scrittura solo autenticati ✅
- `events`: lettura pubblica ✅ — scrittura solo autenticati ✅

---

## ✅ Cosa è stato fatto (cronologico)

### Sessione 1 — Pianificazione (2026-03-10)
- Definito il concept: database italiano di locali e eventi musicali
- Community-driven: gli utenti aggiungono i contenuti
- Scelto lo stack: React CDN + Supabase + GitHub Pages
- Definito schema database base
- Creato questo diario

### Sessione 2 — Mappa + GitHub Desktop (2026-03-29)
- Creato `italia-map.js` — Web Component riutilizzabile con D3 + TopoJSON
  - Mappa interattiva delle 20 regioni italiane
  - Colori personalizzabili, eventi custom (`region-select`, `region-navigate`)
  - Metodi pubblici: `setData()`, `selectRegion()`, `getSelected()`
- Integrata la mappa in `index.html` con tema rosso/nero MusicNew
- Risolto conflitto React + Web Component: mappa gestita fuori da React con `MutationObserver`
- La mappa rimane stabile navigando tra i tab (Home → Locali → Eventi → Home)
- Cliccando una regione filtra locali ed eventi per quella zona
- Configurato GitHub Desktop (cartella: Documenti → GitHub → musicnew)
- Deploy funzionante su GitHub Pages

### Sessione 3 — Supabase Auth + Sicurezza (2026-03-29)
- Corretta la SUPABASE_KEY (sostituita secret key con anon/legacy key)
- Abilitato RLS su `venues` ed `events`
- Configurate RLS policies corrette:
  - Lettura pubblica per tutti
  - Scrittura solo per utenti autenticati (`auth.uid() IS NOT NULL`)
- Decisione: autenticazione con **email + password** come base
- In agenda: login sociale con **Facebook** e **Google** (dopo creazione pagina FB ufficiale)
- Prossimo step: implementare login/registrazione email + password in `index.html`

---

## 🗺️ Roadmap — 4 Fasi

### Fase 1 — Struttura base ✅ COMPLETATA
- [x] Creare repo GitHub `MUSICNEW`
- [x] Creare account Supabase + progetto
- [x] Creare tabelle `venues` ed `events` su Supabase
- [x] Creare `index.html` con layout base
- [x] Deploy su GitHub Pages
- [x] Mappa interattiva delle regioni
- [x] RLS e sicurezza database configurati

### Fase 2 — Autenticazione e inserimento contenuti ← SIAMO QUI
- [ ] Login/registrazione utenti con email + password (Supabase Auth)
- [ ] I bottoni + Locale e + Evento visibili solo se loggato
- [ ] Form aggiunta locale (solo autenticati)
- [ ] Form aggiunta evento (solo autenticati)
- [ ] Pagina dettaglio locale con lista eventi
- [ ] Ricerca per città

### Fase 2b — Login Sociale (dopo creazione pagina FB)
- [ ] Login con Facebook (dopo creazione pagina ufficiale MusicNew)
- [ ] Login con Google

### Fase 3 — UX e community
- [ ] Commenti e recensioni locali
- [ ] Profilo utente con eventi aggiunti
- [ ] Filtri per genere musicale e tipo evento
- [ ] Zoom su regione cliccata nella mappa (idea per futuro)

### Fase 4 — Crescita
- [ ] SEO ottimizzato per ogni città/locale
- [ ] Newsletter eventi per città
- [ ] PWA installabile su telefono
- [ ] Moderazione contenuti

---

## 🛠️ Note tecniche importanti

- **Web Component mappa:** vive fuori da React nel DOM, gestito con `MutationObserver` che lo riattacca ogni volta che l'anchor `#map-inline-anchor` riappare
- **Supabase** — usare `@supabase/supabase-js` via CDN
- **Supabase ANON KEY** — è la legacy anon key (`eyJhbGci...`), NON la publishable key (`sb_publishable_...`)
- **RLS** — abilitato su tutte le tabelle, NON disabilitare mai
- **React via CDN** — nessun build step
- **GitHub Pages** — deploy automatico ad ogni push su `main`
- **Download file:** usare sempre lo ZIP per scaricare più file insieme

---

## 💬 Stile di lavoro con l'utente

- Modifica file → push su GitHub Desktop
- Decisioni architetturali discusse prima di implementare
- Un pezzo alla volta
- Scaricare sempre i file come ZIP
- **Prossimo step:** Implementare login/registrazione email + password

---

*Ultimo aggiornamento: 2026-03-29 — Sessione 3 — Supabase Auth + Sicurezza*
