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
- id, nome, citta, indirizzo, genere, descrizione, sito_web
- ⚠️ NON ha `created_at` — ordinare per `id` non per `created_at`

### Tabella `events` (eventi)
- id, titolo, venue_id, citta, data, ora, tipo, genere, descrizione, immagine_url, creato_da

### Tabella `users` (gestita da Supabase Auth)
- id, email, username, avatar_url

### RLS Policies attive
- `venues`: lettura per `anon` e `authenticated` ✅ — scrittura solo `authenticated` ✅
- `events`: lettura per `anon` e `authenticated` ✅ — scrittura solo `authenticated` ✅

### Supabase Keys
- Usare la **publishable key** (`sb_publishable_...`) — è la chiave corretta per progetti nuovi
- La legacy anon key (`eyJhbGci...`) non funziona con i nuovi progetti
- SDK versione: `@supabase/supabase-js@2.49.4`

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
- Integrata la mappa in `index.html` con tema rosso/nero MusicNew
- Risolto conflitto React + Web Component con `MutationObserver`
- Configurato GitHub Desktop e deploy su GitHub Pages

### Sessione 3 — Auth + Sicurezza + Fix Database (2026-03-29)
- Corretta la SUPABASE_KEY (publishable key per progetti nuovi)
- Abilitato RLS su `venues` ed `events` con policies corrette
- Implementato sistema login/registrazione con Supabase Auth (email + password)
- Header aggiornato: avatar + logout se loggato, bottone Accedi se non loggato
- Bottoni `+ Locale` e `+ Evento` visibili solo se autenticati
- Scoperto che la tabella `venues` non ha `created_at` — ordinamento cambiato a `id`
- Filtro regione mappa temporaneamente disabilitato (da rifare)
- Locali visibili e inserimento funzionanti ✅
- Decisione: login Facebook e Google dopo creazione pagina FB ufficiale

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
- [x] Login/registrazione utenti con email + password
- [x] Bottoni + Locale e + Evento solo se loggati
- [x] Locali visibili sul sito
- [x] Inserimento locali funzionante
- [ ] Aggiungere colonna `created_at` alle tabelle `venues` ed `events`
- [ ] Ripristinare filtro mappa per regione
- [ ] Testare inserimento eventi
- [ ] Pagina dettaglio locale con lista eventi
- [ ] Ricerca per città

### Fase 2b — Login Sociale (dopo creazione pagina FB)
- [ ] Login con Facebook
- [ ] Login con Google

### Fase 3 — UX e community
- [ ] Commenti e recensioni locali
- [ ] Profilo utente con eventi aggiunti
- [ ] Filtri per genere musicale e tipo evento
- [ ] Zoom su regione cliccata nella mappa

### Fase 4 — Crescita
- [ ] SEO ottimizzato per ogni città/locale
- [ ] Newsletter eventi per città
- [ ] PWA installabile su telefono
- [ ] Moderazione contenuti

---

## 🛠️ Note tecniche importanti

- **Web Component mappa:** vive fuori da React nel DOM, gestito con `MutationObserver`
- **Supabase SDK:** usare versione `2.49.4` esplicita, non `@2` generico
- **Publishable key:** i nuovi progetti Supabase usano `sb_publishable_...` non `eyJhbGci...`
- **venues.created_at:** NON ESISTE — usare `id` per ordinare
- **Filtro regione mappa:** temporaneamente disabilitato, da rifare con fetch diretto
- **React via CDN** — nessun build step
- **GitHub Pages** — deploy automatico ad ogni push su `main`
- **Authentication:** email confirm disabilitata — accesso immediato dopo registrazione

---

## 💬 Stile di lavoro con l'utente

- Modifica file → push su GitHub Desktop
- Decisioni architetturali discusse prima di implementare
- Un pezzo alla volta
- **Prossimo step:** Aggiungere `created_at` alle tabelle + ripristinare filtro mappa + testare eventi

---

*Ultimo aggiornamento: 2026-03-29 — Sessione 3 — Auth + Sicurezza + Fix Database*
