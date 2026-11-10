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
| [Elenco task](project/tasks.yaml) | Fonte unica di task, dipendenze e stato |
| [Regole di lavoro](CLAUDE.md) | Come avviare, chiudere e verificare i task |

## Fasi e demo

0. **Avvio** — decisioni, fornitori, hardware di prova, consulente
1. **Locale, menu, aspetto, QR** → *Demo 1*
2. **Chatbot e ordini dal tavolo** → *Demo 2*
3. **Stampanti** → *Demo 3*
4. **Pagamenti dal tavolo** → *Demo 4*
5. **Cassa e gestionale** (facoltativo per il locale) → *Demo 5*
6. **Sito, domini, SaaS, rilascio** → *Versione 1*
7. **Dopo il rilascio** — iscrizione autonoma, prenotazioni, asporto

## Come lavoriamo

Chiedete a Claude, in qualsiasi sessione collegata al repository:

- *«A che punto siamo?»* → riepilogo aggiornato.
- *«Voglio iniziare OC1-03»* → Claude verifica che nessuno l'abbia già preso e,
  se è occupato o non ancora avviabile, propone il task libero successivo.
- *«Ho finito OC1-03»* → Claude lo chiude, aggiorna il Gantt e suggerisce il prossimo.

Non serve installare nulla sul proprio computer.
