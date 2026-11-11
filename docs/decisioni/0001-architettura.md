# Decisione 0001 — Architettura (stack, hosting, motore del chatbot, dominio)

- **Task:** OC0-02
- **Data:** mercoledì 11 novembre 2026
- **Stato:** decisa da Paolo l'11/11/2026. Restano da avere da Enrico i dati del
  server (vedi «Cosa serve da Enrico»), che servono al task OC0-05.

## In breve

| # | Argomento | Scelta |
|---|---|---|
| 1 | Stack | React + TypeScript, server Node.js + TypeScript, PostgreSQL, tutto in contenitori Docker. Come FarmacoFacile, senza Supabase |
| 2 | Hosting | VPS di Enrico, anche per i primi locali veri; poi VPS nostra, con trasloco completo (database compreso) |
| 3 | Motore del chatbot | Gratuito: motore a regole scritto da noi, dietro un'interfaccia sostituibile |
| 4 | Dominio | `a2digital.it`, con il prodotto su `ordina.a2digital.it` |

## 1. Stack

**Deciso:** stesso linguaggio e stessa base di FarmacoFacile (React + TypeScript,
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

**Deciso:** si parte sulla VPS di Enrico, **anche con i primi locali veri**. Più
avanti compriamo una VPS nostra e trasferiamo tutto, database compreso.

Regole che ne derivano:

- Dal primo locale vero sul server ci sono ordini e incassi reali: la **copia di
  sicurezza** del database ogni notte, conservata anche fuori dal server, è
  obbligatoria prima di accendere il primo locale. Va provato anche il
  ripristino.
- Dati dimostrativi e dati reali restano separati ed etichettati, come da
  regole tecniche.
- Il **trasloco** si prova almeno una volta prima di farlo davvero: copia del
  database, copia delle foto, avvio sul server nuovo, cambio dell'indirizzo. Si
  fa in orario di chiusura dei locali; fermo previsto di pochi minuti.
- L'indirizzo pubblico non cambia con il trasloco, quindi i **QR già stampati
  continuano a funzionare**.
- Le chiavi (database, pagamenti) stanno solo sul server e nei segreti di
  GitHub, mai nel repository.
- Da chiedere al consulente (OC0-07): dati dei clienti dei locali su un server
  intestato a Enrico — cosa va scritto nel contratto e nell'informativa.

## 3. Motore del chatbot

**Deciso:** il motore deve essere **gratuito**. Niente modelli a pagamento a
consumo.

**Come:** un motore a regole scritto da noi, che parte da quello della demo
(`demo/index.html`, già provato con 512 frasi). Riconosce categorie,
ingredienti, sinonimi e famiglie (sugo = pomodoro), quantità, varianti,
aggiunte, «senza», «poco», cottura, fasce di prezzo, anche con errori di
battitura.

| | Motore a regole nostro | Modello open source sul server | Modello a consumo |
|---|---|---|---|
| Costo | Zero | Zero, ma su una VPS senza scheda grafica è troppo lento | Circa 0,004 $ a conversazione |
| Tempo di risposta | Immediato | Molti secondi | 1-2 secondi |
| Frasi libere e strane | Capisce quelle previste; il resto lo chiede | Discreto | Molto buono |
| Risposte prevedibili (allergeni) | Sempre uguali, provabili una per una | No | No |

**Limite da conoscere:** un motore a regole capisce meno frasi libere di un
modello linguistico. Lo compensiamo così:

- quando non capisce **chiede** e propone i pulsanti, non mostra mai tutto;
- la frase finisce in «Domande da rivedere» e il gestore insegna la risposta;
- sinonimi e modi di dire nuovi si aggiungono a un dizionario comune a tutti i
  locali, e ogni frase aggiunta diventa una prova automatica
  (`docs/test/frasi-difficili.md`).

**Sostituibile:** il motore sta dietro un'interfaccia. Se un giorno servirà, si
può affiancare un modello linguistico (open source su una VPS più potente, o a
consumo) senza riscrivere il chatbot. Per confronto, il listino di ottobre 2026
di un modello a consumo economico è 0,10 $ per milione di token in ingresso e
0,50 $ in uscita.

## 4. Nome e dominio

**Deciso:** dominio `a2digital.it` (sito di A2Digital Solutions).

- prodotto: `ordina.a2digital.it`
- ogni locale: `nomelocale.ordina.a2digital.it`
- pannello dei super amministratori: `admin.ordina.a2digital.it`

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
5. Chi gestisce il DNS di `a2digital.it`: servono due voci, `ordina` e `*.ordina`,
   che puntano all'indirizzo della VPS.

## Cosa sblocca

Parte subito OC0-04 (struttura del progetto, test e CI); OC2-03 (motore del
chatbot) non aspetta più questa decisione. Con le
risposte di Enrico parte OC0-05 (ambiente di sviluppo) e più avanti OC5-02
(indirizzi dei locali).
