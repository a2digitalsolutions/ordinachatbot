# Decisione 0001 — Architettura (stack, hosting, motore del chatbot, dominio)

- **Task:** OC0-02
- **Data:** mercoledì 11 novembre 2026
- **Stato:** proposta — i punti 2 e 4 li ha decisi Paolo; i punti 1 e 3 aspettano
  il suo sì; i dettagli del server aspettano Enrico (vedi «Cosa serve da Enrico»).

## In breve

| # | Argomento | Scelta | Stato |
|---|---|---|---|
| 1 | Stack | React + TypeScript, server Node.js + TypeScript, PostgreSQL, tutto in contenitori Docker | proposta |
| 2 | Hosting | VPS di Enrico adesso; VPS nostra dopo le prime demo, con trasloco completo (database compreso) | decisa da Paolo |
| 3 | Motore del chatbot | Modello linguistico a consumo (Claude Haiku 5.5), dietro un'interfaccia sostituibile | proposta |
| 4 | Dominio | Dominio A2 Digital Solutions, con un sottodominio per il prodotto | decisa da Paolo, manca l'indirizzo esatto |

## 1. Stack

**Proposta:** stesso linguaggio e stessa base di FarmacoFacile (React + TypeScript,
PostgreSQL), ma **senza servizi gestiti esterni**: database, accessi e foto
stanno tutti sul nostro server.

- **Schermate** (chat del cliente, pannello del gestore, schermo ordini, sito
  del locale): React + TypeScript. La chat è una pagina web leggera, nessuna app
  da installare.
- **Server:** Node.js + TypeScript. Calcola totali, disponibilità e stati; qui
  stanno il blocco allergeni e la conferma unica del tavolo.
- **Database:** PostgreSQL, con migrazioni versionate. Ogni riga appartiene a un
  locale; l'isolamento è controllato nel database e nel server.
- **Carrello comune in tempo reale:** connessione diretta tra telefoni e server
  (WebSocket), senza servizi esterni.
- **Foto e loghi:** una cartella sul server, dietro un'interfaccia; in futuro si
  può passare a un archivio esterno senza toccare il resto.
- **Indirizzi e certificati:** Caddy davanti a tutto. Rilascia da solo i
  certificati https, anche per i sottodomini dei locali e per i domini propri
  dei locali (serve a OC5-02).
- **Confezione:** Docker Compose. Tutto il programma parte con un comando solo
  ed è uguale in sviluppo, in demo e in produzione.

**Perché:** il trasloco deciso al punto 2 diventa semplice solo se non
dipendiamo da nessun servizio esterno. Con Docker si copiano il database e la
cartella delle foto, si avvia sul server nuovo e si cambia l'indirizzo.

**Alternativa scartata:** Supabase come in FarmacoFacile. Si parte più in
fretta, ma accessi, foto e tempo reale resterebbero legati a quel servizio e il
trasloco non sarebbe più «copia e avvia».

## 2. Hosting

**Deciso da Paolo (11/11/2026):** si parte sulla VPS di Enrico. Dopo le prime
demo compriamo una VPS nostra e trasferiamo tutto, database compreso.

Regole che ne derivano:

- Sulla VPS di Enrico vanno **solo dati dimostrativi e di prova**. I locali veri
  con clienti veri (locale pilota, OC5-09) partono sulla VPS nostra.
- **Copia di sicurezza** del database ogni notte, conservata anche fuori dal
  server.
- Il **trasloco** si prova almeno una volta prima di farlo davvero: copia del
  database, copia delle foto, avvio sul server nuovo, cambio dell'indirizzo.
  Durata prevista del fermo: pochi minuti.
- L'indirizzo pubblico non cambia con il trasloco, quindi i **QR già stampati
  continuano a funzionare**.
- Le chiavi (database, modello linguistico, pagamenti) stanno solo sul server e
  nei segreti di GitHub, mai nel repository.

## 3. Motore del chatbot

**Proposta:** modello linguistico a pagamento a consumo, **Claude Haiku 5.5**.

| | A consumo | Open source sul nostro server |
|---|---|---|
| Tempo di risposta | 1-2 secondi | Su una VPS normale (senza scheda grafica) molti secondi: l'obiettivo di 2-3 secondi non si raggiunge |
| Costo fisso | Nessuno | Server con scheda grafica: qualche centinaio di euro al mese |
| Costo per uso | Meno di un centesimo a conversazione | Nessuno |
| Qualità in italiano (sinonimi, richieste strane) | Alta | Più bassa con i modelli che stanno su un server piccolo |
| Manutenzione | Nessuna | Aggiornamenti e sorveglianza a carico nostro |

**Stima dei costi** (prezzi di listino di ottobre 2026: 0,10 $ per milione di
token in ingresso, 0,50 $ in uscita): una conversazione di una decina di
messaggi con il menu del locale costa circa 0,004 $. Un locale con 100
conversazioni al giorno spende circa 12 $ al mese. È una stima: va misurata con
la Demo 2.

**Il modello fa solo due cose:** capire cosa chiede il cliente e scrivere la
risposta. Prodotti, prezzi, totali, stati e blocco allergeni restano nel codice
del server, come vogliono le regole di prodotto.

**Sostituibile:** il motore sta dietro un'interfaccia. Si può cambiare modello o
fornitore (altri hanno prezzi simili), o passare all'open source più avanti,
senza riscrivere il chatbot.

**Serve:** un account API con carta di credito e un tetto di spesa mensile.

## 4. Nome e dominio

**Deciso da Paolo (11/11/2026):** si usa il dominio di A2 Digital Solutions.

**Proposta di struttura** (da confermare con l'indirizzo esatto del dominio):

- prodotto: `ordina.<dominio>`
- ogni locale: `nomelocale.ordina.<dominio>`
- pannello dei super amministratori: `admin.ordina.<dominio>`

Da tenere presente: se più avanti compriamo un dominio dedicato al prodotto, i
vecchi indirizzi devono continuare a rispondere, perché sono stampati sui QR dei
tavoli.

Nome commerciale e prezzi dei piani restano aperti (SPECIFICHE §13, punto 6).

## Cosa serve da Enrico

1. Dati della VPS: sistema operativo, memoria, spazio libero su disco.
2. Docker è installato? Se no, si può installare?
3. Le porte 80 e 443 sono libere, oppure c'è già un altro sito o programma che
   le usa? In quel caso va deciso come far convivere le due cose.
4. Un utente sul server per le pubblicazioni automatiche da GitHub (chiave SSH
   da mettere nei segreti del repository).
5. Chi gestisce il DNS del dominio: servono due voci, `ordina` e `*.ordina`,
   che puntano all'indirizzo della VPS.

## Cosa sblocca

Con il sì ai punti 1 e 3 partono OC0-04 (struttura del progetto, test e CI) e
OC2-03. Con le risposte di Enrico parte OC0-05 (ambiente di sviluppo) e più
avanti OC5-02 (indirizzi dei locali).
