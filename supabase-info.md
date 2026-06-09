# CosmoLink — Configurazione Database & Anti-Pausa

Questo documento contiene le informazioni tecniche sul nuovo database di CosmoLink per riferimento futuro. Le chiavi sensibili rimangono salvate esclusivamente in locale nel file `.env.local` (escluso da Git) e nel pannello delle variabili d'ambiente di Vercel.

---

## 🗄️ Informazioni Database Supabase

* **Nome Progetto**: `CosmoLink`
* **Project Reference (ID)**: `gtjjxodaydfjujnzcwog`
* **Regione**: `eu-west-1` (Irlanda)
* **Stato**: `Attivo / Sano`
* **URL di Connessione Database (Pooler IPv4)**:
  `postgresql://postgres.gtjjxodaydfjujnzcwog:[PASSWORD]@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?sslmode=require`

---

## 🕐 Sistema Anti-Pausa (Keep-Alive)

Per evitare che il piano gratuito di Supabase vada in pausa dopo 7 giorni di inattività, è stato configurato un sistema di ping automatico:

1. **Endpoint**: `/api/cron/keep-alive`
   - Esegue un ping combinato sul Database (tabella `profiles`), sull'Auth (`getUser()`) e sullo Storage (bucket `avatars`).
   - Logga le tempistiche di risposta per monitorare la salute dei servizi.
2. **Cron Job su Vercel**:
   - Definito in `vercel.json` per essere eseguito **una volta al giorno** (compatibile con il piano Hobby/gratuito di Vercel).
   - Questo mantiene attivo l'intero stack Supabase costantemente.

---

## 🛠️ Come Ricreare o Ripristinare il Database

In caso di migrazione futura o se devi configurare un ambiente di staging:

1. **Migrazioni Locali**:
   Tutte le tabelle, relazioni, chiavi esterne, policy di sicurezza RLS e configurazioni di storage sono salvate come migrazioni SQL in:
   `supabase/migrations/`
2. **Seed dei Dati**:
   I dati predefiniti dei temi e dei social link si trovano nei file:
   - `007_seed_platforms.sql` (Piattaforme social supportate)
   - `008_seed_themes.sql` (Temi gratuiti e premium)
3. **Applicazione delle Migrazioni**:
   Basta eseguire i file SQL numerati in ordine cronologico sul nuovo database (tramite il SQL Editor di Supabase o tramite CLI).

---

## 🛡️ Controllo Sicurezza (Zero Credenziali su Git)

* Il file `.env.local` (che contiene la password del database, la chiave di sviluppo e la chiave segreta JWT) è correttamente inserito in `.gitignore` ed è **escluso da tutti i push**.
* Non ci sono credenziali o chiavi hardcoded nei file tracciati da Git.
