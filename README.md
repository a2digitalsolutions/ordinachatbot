# Ordinachatbot

Ordini dal tavolo con un chatbot: il cliente inquadra il QR code, vede il menu
con la grafica del locale, ordina per sé o per tutto il tavolo e paga in cassa o
dal telefono. Per bar, pub, ristoranti e pizzerie, in abbonamento (SaaS).

## Dove trovare cosa

| Documento | Contenuto |
|---|---|
| [Stato del progetto](docs/STATO.md) | Avanzamento, chi sta facendo cosa, prossimi task liberi |
| [Gantt](docs/GANTT.md) | Diagramma con le date previste di task e demo |
| [Specifiche](docs/SPECIFICHE.md) | Come funziona il prodotto, stati di tavolo, ordine e pagamento |
| [Manuale di utilizzo](docs/MANUALE.md) | Guida per titolare, personale, clienti e amministratori |
| [Allergeni e celiachia](docs/allergeni.md) | Cosa inserisce il gestore, regole di sicurezza, prove obbligatorie |
| [Demo cliccabile](demo/index.html) | Prototipo dimostrativo: sito, menu, chatbot del tavolo, vista gestore |
| [Elenco task](project/tasks.yaml) | Fonte unica di task, dipendenze e stato |
| [Regole di lavoro](CLAUDE.md) | Come avviare, chiudere e verificare i task |

## Fasi e demo

0. **Avvio** — decisioni e struttura del progetto
1. **Locale, menu, aspetto, QR** → *Demo 1*
2. **Chatbot, ordini e area comande su smartphone** → *Demo 2*
3. **Pagamenti dal tavolo con Stripe** — pronti, spenti finché il locale non li configura
4. **Stampanti per le comande** — pronte, spente finché il locale non le collega
5. **Sito, domini, SaaS** → ***prima consegna (versione 1)***
6. **Cassa e gestionale** — dopo la consegna, modulo vendibile a parte
7. **Dopo la consegna** — configurazione di Stripe e stampanti insieme al locale, altre funzioni

Le decisioni prese sono in [docs/decisioni](docs/decisioni).

## Struttura del codice

| Cartella | Contenuto |
|---|---|
| `apps/server` | Server (Node.js + TypeScript): regole, totali, stati, migrazioni del database |
| `apps/web` | Schermate (React + TypeScript): chat del cliente, pannello, area comande |
| `packages/shared` | Codice comune a server e schermate (per ora i formati italiani di date e prezzi) |
| `infra` | File Docker e Caddy; `docker-compose.yml` avvia database, server e schermate insieme |
| `.github/workflows` | Controlli automatici a ogni modifica: regole del codice, tipi, prove, build, immagini Docker |

A ogni pull request GitHub esegue da solo tutti i controlli (`npm run controlli`
li esegue tutti insieme). Una modifica si unisce a `main` solo se sono verdi.

## Come lavoriamo

Chiedete a Claude, in qualsiasi sessione collegata al repository:

- *«A che punto siamo?»* → riepilogo aggiornato.
- *«Voglio iniziare OC1-03»* → Claude verifica che nessuno l'abbia già preso e,
  se è occupato o non ancora avviabile, propone il task libero successivo.
- *«Ho finito OC1-03»* → Claude lo chiude, aggiorna il Gantt e suggerisce il prossimo.

Non serve installare nulla sul proprio computer.
