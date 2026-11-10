# Ordinachatbot — istruzioni per Claude

SaaS per bar, pub, ristoranti e pizzerie: il cliente inquadra il QR code del
tavolo, chatta con un assistente che mostra il menu, ordina per il tavolo e paga
in cassa o dal telefono; l'ordine arriva su stampanti, schermo ordini e, se
attiva, sulla cassa. Specifiche complete: `docs/SPECIFICHE.md`. Manuale:
`docs/MANUALE.md`.

Il team lavora in italiano e non tutti sono sviluppatori: rispondi in italiano,
con parole semplici, e non chiedere di lanciare comandi sul proprio computer
(alcuni usano Windows 7). Tutti i comandi li esegui tu.

## Regole di prodotto (vincolanti)

- **Il tavolo lo dice il QR.** Il cliente non scrive mai il numero del tavolo.
- **Un solo carrello per tavolo, una sola conferma.** Chiunque al tavolo aggiunge
  voci; uno conferma per tutti; dopo l'invio si riapre un carrello nuovo.
- **Il chatbot non inventa.** Mostra solo prodotti, ingredienti e prezzi presi
  dal menu del locale. Totali, disponibilità e stati li calcola il server.
- **Allergeni e celiachia.** Se il titolare ha bloccato l'argomento, il chatbot
  risponde subito col messaggio fisso e propone di chiamare il cameriere. Il
  blocco è una regola scritta nel codice, non un'istruzione al modello.
- **Stati** di tavolo, ordine e pagamento: quelli di `docs/SPECIFICHE.md` §5,
  controllati lato server. Un pagamento è «Pagato» solo con la conferma del
  fornitore al nostro server.
- **I soldi vanno al locale.** Mai far transitare gli incassi dei clienti su
  conti nostri.
- **Moduli facoltativi** (stampanti, pagamenti, cassa, sito): ogni funzione deve
  comportarsi bene sia col modulo acceso sia spento.
- **Tutto ciò che fa il titolare lo possono fare i super amministratori** per
  suo conto, lasciando traccia.
- **Scontrini fiscali**: li emette solo la stampante RT del locale. Non
  presentare mai come fiscale una ricevuta di cortesia.

## Limiti di lavoro di Claude

- Un task alla volta: alla fine di ogni task fermati, riassumi cosa hai fatto e
  aspetta il via prima di avviare il successivo.
- Prima di operazioni lunghe o ripetute spiega cosa farai e chiedi conferma.
- Se una sessione si allunga molto, salva il lavoro su un ramo con un riepilogo
  di cosa manca e chiedi se continuare.

## Piano di progetto

- `project/tasks.yaml` è la fonte unica di task, dipendenze e stato.
- `docs/GANTT.md` e `docs/STATO.md` si rigenerano con `python3 scripts/piano.py`.
  Non modificarli a mano.
- Comandi: `stato`, `prossimo`, `verifica ID`, `avvia ID NOME`, `chiudi ID`,
  `blocca ID`, `libera ID` (vedi l'intestazione dello script).

## Regola obbligatoria: prima di avviare un task

1. `git pull` per avere lo stato più recente.
2. `python3 scripts/piano.py verifica ID`.
3. Controlla i rami remoti: `git ls-remote --heads origin "task/ID*"`. Se esiste
   un ramo `task/ID-...` di qualcun altro, il task è già preso.
4. Se il task è **già in corso o fatto**, dillo (chi e da quando) e **non
   avviarlo**: proponi i task liberi suggeriti dalla verifica.
5. Se le dipendenze non sono chiuse, spiega cosa manca e proponi i task liberi.
6. Se è libero: `python3 scripts/piano.py avvia ID NOME`, poi committa **subito**
   su `main` solo `project/tasks.yaml`, `docs/GANTT.md`, `docs/STATO.md`
   (messaggio `piano: avvio ID (NOME)`) e fai push. Se il push fallisce, fai
   pull, ripeti la verifica e ricomincia dal punto 4.
7. Lavora su un ramo `task/ID-breve-descrizione` e apri una pull request.

A task finito e unito a `main`: `python3 scripts/piano.py chiudi ID`, committa e
fai push del piano, **suggerisci il prossimo task libero** e aggiorna
`docs/MANUALE.md` se il task ha cambiato ciò che vede un utente.

## Quando chiedono «a che punto siamo»

`git pull`, `python3 scripts/piano.py stato`, poi poche righe: percentuale, date
delle demo, chi fa cosa, cosa è libero, cosa è bloccato, cosa serve dall'esterno
(account, hardware, consulente).

## Regole tecniche

- Ogni dato appartiene a un locale; isolamento nel database **e** lato server.
- Nessun segreto nel repository o nel frontend. `.env.example` senza valori.
- Migrazioni versionate; gli ordini non si cancellano, si annullano con storico.
- Non simulare come funzionanti integrazioni esterne non configurate (pagamenti,
  stampanti, RT): in prova sono sempre etichettate PROVA.
- Stampanti, RT, pagamenti e motore del chatbot stanno dietro interfacce
  intercambiabili.
- Dati dimostrativi separati dai dati reali e etichettati.
- Test per i flussi principali, in particolare stati dell'ordine, conferma unica
  del tavolo, blocco allergeni, conferma dei pagamenti.
