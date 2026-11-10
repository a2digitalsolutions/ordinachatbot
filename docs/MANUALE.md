# Ordinachatbot — manuale di utilizzo

Versione 0.2 (10/11/2026). Descrive il prodotto **come è stato progettato**: va
aggiornato a ogni task chiuso e completato con le schermate nel task OC6-08.
I nomi di pulsanti e menu potranno cambiare leggermente.

Il manuale ha quattro parti: il titolare del locale, il personale, il cliente al
tavolo, noi amministratori.

---

## Parte 1 — Titolare del locale

### 1.1 Primo accesso

1. Ricevi per email l'invito con l'indirizzo del tuo pannello e scegli la password.
2. Parte la **configurazione guidata**, in sei passi. Puoi fermarti e riprendere.
3. Se preferisci, la configurazione la facciamo noi al posto tuo: troverai tutto pronto.

### 1.2 Dati del locale

- Nome, indirizzo, telefono, orari di apertura.
- **Tipologia**: spunta una o più voci tra *Bar*, *Pub*, *Ristorante*, *Pizzeria*.
  In base alla scelta ti proponiamo delle categorie di partenza, che puoi cambiare.
- **Moduli**: vedi quali sono attivi (stampanti, pagamenti dal tavolo, cassa, sito).

### 1.3 Menu

**Categorie** — *Menu → Categorie → Nuova categoria*. Scrivi il nome (Antipasti,
Hamburger, Hamburger XXL, Birre alla spina…), aggiungi se vuoi una foto, trascina
per decidere l'ordine. Puoi indicare gli orari in cui è disponibile.

**Prodotti** — *Menu → Prodotti*. Tre modi per inserirli:

| Modo | Quando conviene |
|---|---|
| **Scheda** del singolo prodotto | pochi prodotti, con foto e dettagli |
| **Griglia veloce** (righe e colonne come un foglio di calcolo) | inserire o correggere tanti prodotti di fila |
| **Importa da Excel** | hai già il menu in un file |

Per ogni prodotto: nome, prezzo, categoria, descrizione, **foto** (facoltativa),
**ingredienti**, varianti e aggiunte.

**Varianti e aggiunte** (per cibi e drink) — *Menu → Varianti e aggiunte*:

| Cosa | Esempio | Il cliente |
|---|---|---|
| **Variante** | Birra: piccola € 3,50 / media € 5,00 — Impasto integrale +€ 1,00 | ne sceglie una |
| **Aggiunta** | Mozzarella extra +€ 1,50 — Bacon +€ 2,00 — Ghiaccio (gratis) | quante ne vuole |
| **Si può togliere** | Senza cipolla, senza ghiaccio | toglie ciò che non vuole |

Crea un **gruppo** una volta sola (es. «Aggiunte pizza» con tutti i prezzi) e
applicalo a un'intera categoria o a singoli prodotti: se cambi un prezzo nel
gruppo, cambia ovunque. Il chatbot dice al cliente tutte le possibilità con i
prezzi («La Margherita costa € 6,00; puoi aggiungere bufala +€ 2,00…») e
calcola il totale.

**Ingredienti** — scrivendo un ingrediente lo scegli dall'elenco o lo crei al
volo. Inserirli bene conviene: è grazie agli ingredienti che il chatbot sa
rispondere a «pizze con i funghi» o «un panino senza cipolla».

**Cambi veloci**
- *Esaurito*: un interruttore accanto al prodotto; sparisce subito dal menu e torna quando lo riaccendi.
- *Prezzi in blocco*: seleziona più prodotti e aumenta/diminuisci di una cifra o di una percentuale.
- *Duplica*: per creare un prodotto simile a uno esistente.

### 1.4 Allergeni e celiachia

- Nella scheda del prodotto trovi le **14 spunte degli allergeni** e la spunta
  **senza glutine**. Se segni l'allergene su un ingrediente (es. *mozzarella →
  latte*), vale da solo per tutti i piatti che lo contengono.
- In *Chatbot → Argomenti delicati* scegli su cosa il chatbot **non deve
  rispondere**: *Allergeni*, *Celiachia*, *Tutti e due*, *Nessuno*. Quando un
  cliente tocca l'argomento, il chatbot risponde subito: «Su questo non posso
  rispondere: chiama il cameriere» e mostra il pulsante di chiamata.
- Il testo del messaggio lo puoi personalizzare.

L'informazione sugli allergeni resta una responsabilità del locale: tieni
aggiornate le spunte e istruisci il personale.

### 1.5 Insegnare al chatbot

Quando il chatbot non sa rispondere a un cliente, glielo dice, gli propone di
chiamare il cameriere e **mette da parte la domanda**.

1. Apri *Chatbot → Domande da rivedere*: trovi le domande rimaste senza
   risposta, con giorno e ora, e quante volte sono state fatte.
2. Con calma, anche nei giorni dopo, scrivi la **risposta giusta** (es. «Avete
   il seggiolone?» → «Sì, chiedilo al personale»), oppure premi *Ignora*.
3. Da quel momento il chatbot risponde così a tutti i clienti.
4. In *Chatbot → Domande e risposte* rivedi, correggi o cancelli ciò che gli hai
   insegnato; puoi anche aggiungere domande di tua iniziativa (parcheggio,
   Wi-Fi, animali ammessi, orari della cucina).

Due limiti: su allergeni e celiachia, se li hai bloccati, il chatbot continua a
rimandare al cameriere; prezzi e piatti si cambiano dal menu, non da qui.

Il chatbot parla italiano e scrive date e orari all'italiana (martedì 10
novembre 2026, ore 22:30) e i prezzi con la virgola (€ 8,50).

### 1.6 Aspetto

*Aspetto*: carica il **logo**, scegli una delle **10 combinazioni di colori** e
uno dei **10 temi**. L'anteprima a destra mostra subito menu e chat come li
vedrà il cliente. Premi *Pubblica* quando ti piace.

### 1.7 Tavoli e QR code

1. *Tavoli → Nuova sala* (Interno, Dehors…), poi aggiungi i tavoli: puoi crearne
   tanti in una volta («da 1 a 20»).
2. *Tavoli → QR code → Genera*. Scegli il formato (cartoncino da tavolo o
   adesivo) e scarica il **PDF da stampare**: ogni QR riporta logo e numero del tavolo.
3. Se un QR si rovina, ristampalo. Se temi che sia stato copiato, premi
   *Rigenera*: il vecchio smette di funzionare.

Il cliente non deve mai scrivere il numero del tavolo: lo dice il QR.

### 1.8 Regole degli ordini

In *Ordini → Regole* scegli:
- **Si paga alla fine** (l'ordine va subito in cucina) oppure **si paga prima**
  (va in cucina solo dopo l'incasso).
- Se il **primo ordine di un tavolo** deve essere accettato dal personale.
- Dopo quanto tempo un tavolo pagato torna *libero* da solo.
- Coperto e servizio, se li applichi.

### 1.9 Stampanti

*Stampanti → Aggiungi stampante*, segui il collegamento guidato, poi:
- crea le **zone** (Cucina, Pizzeria, Bar, Cassa);
- associa ogni **categoria** a una zona: le pizze usciranno al forno, le birre al bar;
- decidi se la stampante di cassa riceve una **copia** di ogni ordine.

Premi *Stampa di prova* per verificare. Se una stampante resta senza carta o si
spegne, ricevi un avviso e la comanda esce su quella di cassa. Lo **schermo
ordini** mostra comunque tutto.

Senza il modulo cassa serve almeno la stampante accanto alla cassa.

### 1.10 Pagamenti dal tavolo (modulo facoltativo)

1. *Pagamenti → Collega il conto*: una procedura guidata del fornitore di
   pagamenti ti chiede i dati dell'attività e l'IBAN. **Gli incassi arrivano
   direttamente sul tuo conto.**
2. Scegli i metodi da mostrare: Apple Pay, Google Pay, Satispay, Revolut Pay,
   Bancomat Pay, carta.
3. Scegli se permettere la divisione del conto e la mancia.

Anche per i pagamenti dal telefono va emesso lo scontrino: con il modulo cassa
lo fai con un tocco dal conto già saldato; senza, dal tuo registratore. Chiedi
al tuo commercialista come registrare questi incassi e il collegamento del
pagamento elettronico al registratore telematico.

### 1.11 Cassa e gestionale (modulo facoltativo)

Ti servono un **monitor touch** e una **stampante fiscale RT** tra i modelli supportati.

**Preparazione** (una volta sola)
- *Cassa → Reparti*: crea i reparti con la loro aliquota IVA e associa le categorie.
- *Cassa → Pagamenti*: contanti, carta, Satispay, buoni pasto…
- *Cassa → Operatori*: un PIN per ciascuno e cosa può fare (sconti, storni).
- *Cassa → Stampante fiscale*: collegamento guidato e scontrino di prova.

**Ogni giorno**
1. **Apri la giornata** e inserisci il fondo cassa.
2. **Banco**: tocca i prodotti, poi *Paga* e il metodo → esce lo scontrino.
3. **Tavoli**: la mappa mostra i tavoli a colori — grigio *libero*, blu
   *occupato*, arancione *conto da pagare*, verde *pagato*. Gli ordini fatti dal
   chatbot compaiono da soli sul tavolo.
4. **Conto di un tavolo**: toccalo, controlla le voci, *Preconto* se lo
   chiedono, *Dividi* se pagano separati, poi *Paga*. Se hanno già pagato dal
   telefono il conto è a zero: premi *Scontrino* e poi *Libera tavolo*.
5. **Chiudi la giornata**: conta la cassa, conferma, esce la chiusura.

**Resoconti**: incassi per giorno, metodo, reparto, prodotto, operatore; si
possono esportare.

Se manca internet la cassa continua a funzionare e si riallinea da sola.

### 1.12 Sito e menu pubblico (facoltativi)

- Il **menu pubblico** ha un indirizzo fisso: mettilo su Google, Instagram, Facebook.
- Il **sito** si compila in *Sito*: descrizione, orari, mappa, contatti, social,
  foto. Il pulsante **Menu** c'è già.

### 1.13 Il tuo indirizzo internet

All'inizio usi un indirizzo sul nostro dominio. Se hai o compri un dominio tuo:
*Impostazioni → Dominio → Usa il mio dominio* e segui i due passaggi indicati (o
chiedi a noi). I QR già stampati continuano a funzionare.

---

## Parte 2 — Personale

- Accedi con le tue credenziali: vedi solo le sezioni del tuo ruolo.
- **Schermo ordini**: ogni nuovo ordine suona e compare con tavolo, ora e voci.
  Tocca *Pronto* quando esce dalla cucina e *Servito* quando è al tavolo.
- **Chiamata dal tavolo**: compare un avviso «Tavolo 7 chiama» (con il motivo,
  es. *domanda su allergeni*). Tocca *Ci vado* per toglierlo agli altri.
- **Primo ordine da accettare** (se il titolare lo ha attivato): controlla che
  al tavolo ci sia davvero qualcuno e premi *Accetta*.
- **Annullare** una voce o un ordine: *Annulla*, scegli il motivo. Se era già
  pagato dal telefono parte il rimborso.
- **Liberare il tavolo** quando i clienti vanno via: la chat del tavolo si azzera.

---

## Parte 3 — Cliente al tavolo

1. **Inquadra il QR code** con la fotocamera: si apre la chat, senza scaricare nulla.
2. Scrivi il tuo nome se vuoi (serve a distinguere chi ha ordinato cosa).
3. Tocca **Menu completo** o una categoria, oppure scrivi: «solo i secondi»,
   «pizze con la salsiccia», «un hamburger senza cipolla».
4. Tocca **Aggiungi** sui piatti che vuoi. Puoi ordinare anche per gli altri.
5. Tutti quelli del tavolo che hanno inquadrato il QR vedono lo stesso carrello.
6. Quando siete pronti, **uno solo** tocca **Conferma per tutto il tavolo**.
7. Scegli **Pago in cassa** oppure **Pago ora** (Apple Pay, Google Pay,
   Satispay, Revolut Pay, Bancomat Pay, carta).
8. Volete altro? Aggiungete e confermate di nuovo: è un nuovo ordine dello stesso tavolo.
9. Per allergie, celiachia o qualsiasi dubbio: **Chiama il cameriere**.

---

## Parte 4 — Amministratori della piattaforma (noi)

- **Nuovo locale**: *Locali → Nuovo*: nome, indirizzo sul nostro dominio,
  tipologie, moduli attivi, email del titolare (riceve l'invito).
- **Lavorare per conto del locale**: *Entra come titolare*. Una fascia colorata
  ricorda che stai operando per conto di altri; ogni modifica resta registrata
  col tuo nome.
- **Avvio tipico di un locale**: dati → menu (importato dal loro file) → foto →
  allergeni con il titolare → aspetto → tavoli e QR → stampanti sul posto →
  pagamenti (li collega il titolare, il conto è suo) → prova completa da un
  tavolo → formazione del personale.
- **Moduli e piano**: si accendono e spengono dalla scheda del locale.
- **Dominio proprio**: si imposta dalla scheda del locale; il certificato si attiva da solo.
- **Sospendere** un locale: menu e chat mostrano «servizio non disponibile», i dati restano.

---

## Domande frequenti

**Due persone confermano insieme?** Passa solo la prima; l'altra vede «ordine già inviato da …».

**Qualcuno ordina da casa con la foto del QR?** Attiva l'accettazione del primo
ordine o il pagamento anticipato; se serve rigenera il QR.

**Un cliente non ha internet?** Ordina dal telefono di un altro al tavolo o chiama il cameriere.

**Finisce un piatto durante il servizio?** Interruttore *Esaurito*.

**La stampante non stampa?** Guarda l'avviso sul pannello; intanto le comande
escono in cassa e sono sullo schermo ordini. *Ristampa* quando è a posto.
