# 📋 MusicNew — Diario di Progetto

> **Istruzioni per Claude:** Leggi questo file all'inizio di ogni sessione per capire lo stato del progetto e continuare il lavoro. L'utente allegherà anche i file del progetto.

---

## 🎯 Cos'è MusicNew

Sito web community-driven per raccogliere **tutti i locali, concerti, feste, festival e jam session musicali in Italia**. Gli utenti si registrano e aggiungono eventi/locali. Ricerca per città.

**Obiettivo reale:** Diventare il punto di riferimento in Italia per chi vuole sapere dove si fa musica live — dalla serata liscio nella piazza del paese, alla festa salsa nel circolo ARCI, al trio jazz nel bar, alla cover band nel pub, fino al festival nazionale. Tutti i generi, tutte le città, tutti gli eventi che non esistono da nessuna parte online.

**Funzioni principali:**
- Database locali (bar, club, venue) con info, genere musicale, città, provincia
- Database eventi (concerti, feste, festival, jam session)
- Filtro per regione tramite mappa interattiva
- Ricerca per città
- Utenti registrati che aggiungono contenuti
- Commenti e recensioni (futuro)

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
- id, nome, citta, provincia, indirizzo, genere, descrizione, sito_web
- ⚠️ NON ha `created_at` — ordinare per `id`
- `provincia` = sigla (es. CB, IS, AN, MC...)

### Tabella `events` (eventi)
- id, titolo, citta, provincia, data, ora, tipo, genere, descrizione
- ⚠️ NON ha `created_at`
- `provincia` = sigla (es. CB, IS, AN, MC...)
- Mancano ancora: `venue_id`, `immagine_url`, `creato_da` (da aggiungere in futuro)

### Tabella `users` (gestita da Supabase Auth)
- id, email, username, avatar_url

### RLS Policies attive
- `venues`: lettura per `anon` e `authenticated` ✅ — scrittura solo `authenticated` ✅
- `events`: lettura per `anon` e `authenticated` ✅ — scrittura solo `authenticated` ✅

### Supabase Keys
- Usare la **publishable key** (`sb_publishable_...`)
- SDK versione: `@supabase/supabase-js@2.49.4`
- Le query usano **fetch diretto** (non Supabase JS) per evitare bug con `.in()` e `.or()`

---

## ✅ Cosa è stato fatto (cronologico)

### Sessione 1 — Pianificazione (2026-03-10)
- Definito il concept e lo stack
- Creato questo diario

### Sessione 2 — Mappa + GitHub Desktop (2026-03-29)
- Creato `italia-map.js` con D3 + TopoJSON
- Integrata mappa in `index.html`
- Deploy su GitHub Pages

### Sessione 3 — Auth + Sicurezza + Province + Fix (2026-03-29)
- Corretta SUPABASE_KEY (publishable key)
- RLS abilitato con policies corrette
- Login/registrazione email + password funzionante
- Bottoni + Locale e + Evento solo se loggati
- Scoperto che venues/events non hanno `created_at` — ordinamento per `id`
- Fix query: passaggio a fetch diretto per evitare errori 400
- Aggiunta colonna `provincia` a venues ed events
- Form inserimento aggiornato con menu a tendina 107 province italiane
- Filtro mappa per regione funzionante tramite sigla provincia
- Grid locali: 6 colonne, 24 card massimo in home
- Inseriti 30 locali di test in Molise (da cancellare)
- Testato inserimento eventi ✅
- Filtro regione: cliccare regione mostra locali ed eventi di quella regione ✅
- Decisione: ogni locale avrà pagina dettaglio con storico eventi + prossimo evento in card

---

## 🗺️ Roadmap — 4 Fasi

### Fase 1 — Struttura base ✅ COMPLETATA

### Fase 2 — Autenticazione e inserimento contenuti ← SIAMO QUI
- [x] Login/registrazione email + password
- [x] Inserimento locali ed eventi funzionante
- [x] Filtro per regione tramite mappa
- [x] Provincia obbligatoria nel form
- [ ] Pagina/modal dettaglio locale con storico eventi
- [ ] Card locale mostra prossimo evento in programma
- [ ] Ricerca per città (barra hero)
- [ ] Aggiungere `venue_id` agli eventi (collegare evento al locale)

### Fase 2b — Login Sociale (dopo creazione pagina FB)
- [ ] Login con Facebook
- [ ] Login con Google

### Fase 3 — UX e community
- [ ] Commenti e recensioni locali
- [ ] Profilo utente con eventi aggiunti
- [ ] Filtri per genere musicale e tipo evento
- [ ] Cancellare i 30 locali di test del Molise

### Fase 4 — Crescita
- [ ] SEO ottimizzato per ogni città/locale
- [ ] Newsletter eventi per città
- [ ] PWA installabile su telefono
- [ ] Moderazione contenuti

---

## 🛠️ Note tecniche importanti

- **Query Supabase:** usare `fetch` diretto invece di Supabase JS per evitare errori 400
- **Filtro regione:** usa `provincia=in.(CB,IS)` nell'URL fetch
- **REGIONE_PROVINCE:** mappa regione → sigle province (non città!)
- **venues.created_at e events.created_at:** NON ESISTONO — usare `id`
- **Grid locali:** `repeat(6, 1fr)` — 6 colonne fisse
- **Supabase SDK:** `2.49.4` esplicita
- **Authentication:** email confirm disabilitata

---

## 💬 Stile di lavoro con l'utente

- Modifica file → push su GitHub Desktop
- Decisioni architetturali discusse prima di implementare
- Un pezzo alla volta
- **Prossimo step:** Pagina dettaglio locale + prossimo evento in card + venue_id negli eventi

---

*Ultimo aggiornamento: 2026-03-29 — Sessione 3 completa*
