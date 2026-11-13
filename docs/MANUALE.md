# Ordinachatbot — manuale di utilizzo

Versione 0.5 (13/11/2026). Descrive il prodotto **come è stato progettato**: va
aggiornato a ogni task chiuso e completato con le schermate nel task OC5-08.
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
**ingredienti**, varianti e aggiunte. Il **reparto** (dove va la comanda) lo
prende dalla categoria; puoi cambiarlo sul singolo prodotto (vedi 1.9).

**Varianti** (per cibi e drink) — *Menu → Varianti*: scelte in cui il cliente
ne prende una, con il prezzo (Birra: piccola € 3,50 / media € 5,00; Impasto
integrale +€ 1,00; Hamburger doppio +€ 3,00). Crea il gruppo una volta e
applicalo a una categoria o a singoli prodotti.

**Aggiunte e modifiche** — *Menu → Ingredienti*, una riga per ingrediente:

| Colonna | Cosa scegli |
|---|---|
| **Come aggiunta** | *a pagamento* (scrivi il prezzo), *gratis*, oppure *non si aggiunge* |
| **Si può togliere / chiedere poco** | sì per tutti, salvo dove indichi *ingrediente base* del piatto |

Poi, per categoria: le **aggiunte più richieste** da mostrare come pulsanti, se
il cliente può scegliere la **cottura** (poco cotta o al sangue, media, ben
cotta), e quali piatti sono **non modificabili** (lasagna, dolci).

Così il cliente può scrivere «una margherita poco cotta con poco pomodoro e
doppia mozzarella» oppure toccare i pulsanti: il prezzo si aggiorna da solo e la
comanda riporta ogni modifica. Il chatbot capisce anche i sinonimi (sugo =
pomodoro, pancetta = bacon) e ne puoi aggiungere di tuoi in *Chatbot → Sinonimi*.

**Ingredienti** — scrivendo un ingrediente lo scegli dall'elenco o lo crei al
volo. Inserirli bene conviene: è grazie agli ingredienti che il chatbot sa
rispondere a «pizze con i funghi» o «un panino senza cipolla».

**Fuori menu su richiesta** — *Menu → Fuori menu*: le cose che hai ma non
metti nel menu, perché le chiede solo qualcuno (verdure grigliate, olio a
crudo, pasta in bianco, limone, peperoncino). Per ognuna scegli:

| Campo | Cosa scegli |
|---|---|
| **Tipo** | *piatto a sé* (verdure grigliate € 5,00) oppure *aggiunta a qualsiasi piatto* (olio a crudo) |
| **Prezzo** | una cifra oppure *gratis* |
| **Reparto** | dove va la comanda (Cucina, Griglia, Bar…) |
| **Ingredienti** | con la stessa scheda allergeni degli altri |
| **Disponibile oggi** | un interruttore: spento, il chatbot dice che oggi non c'è |

Il cliente non li vede nel menu: il chatbot li propone **solo se li chiede**
(«avete verdure grigliate?», «posso avere un filo d'olio?»). Se un cliente
chiede qualcosa che non hai inserito, la trovi in *Chatbot → Domande da
rivedere* e puoi aggiungerla ai fuori menu.

**Cambi veloci**
- *Esaurito*: un interruttore accanto al prodotto; sparisce subito dal menu e torna quando lo riaccendi.
- *Prezzi in blocco*: seleziona più prodotti e aumenta/diminuisci di una cifra o di una percentuale.
- *Duplica*: per creare un prodotto simile a uno esistente.

### 1.4 Allergeni e celiachia

Gli allergeni si indicano **sugli ingredienti**, una volta sola: ogni piatto li
prende da solo dai suoi ingredienti e dalle aggiunte.

**Scheda dell'ingrediente** — *Menu → Ingredienti*

1. Scrivi il nome. Il programma **propone** in giallo allergeni e glutine tipici
   (mozzarella → latte). Sono solo proposte: valgono dopo la tua conferma.
2. Per ognuno dei **14 allergeni** scegli una di tre posizioni: **Contiene**,
   **Può contenere tracce**, **Non contiene**. Guarda l'etichetta del prodotto.
3. **Glutine**: scegli tra *Contiene glutine*, *Senza glutine per natura*,
   *Senza glutine con dicitura in etichetta*, *Non verificato*.
4. Premi **«Ho controllato l'etichetta»**: resta scritto chi l'ha fatto e quando.

Scorciatoie: *Non contiene nessun allergene* (acqua, sale, verdure fresche),
*Copia da un altro ingrediente*, elenco *Da verificare* con ciò che manca.

Finché un ingrediente non è verificato, sui piatti che lo contengono il cliente
legge «Allergeni non dichiarati: chiedi al personale». Se cambi marca o
fornitore, premi *Cambiato fornitore*: l'ingrediente torna da verificare.

**Scheda del piatto** — vedi il riepilogo già calcolato e aggiungi solo:
- *Lavorazione condivisa* (stessa friggitrice, stesso forno, stesso piano);
- la conferma *Preparazione separata*, necessaria per l'etichetta **Senza
  glutine**. L'etichetta compare solo se tutti gli ingredienti sono senza
  glutine e verificati e non c'è lavorazione condivisa; se una di queste cose
  cambia, sparisce da sola e ricevi un avviso.

In *Impostazioni* trovi l'avviso generale «In cucina si usa farina: tutti i
piatti possono contenere tracce di glutine».

**Cosa fa il chatbot** — in *Chatbot → Argomenti delicati* scegli su cosa **non
deve rispondere**: *Allergeni*, *Celiachia*, *Tutti e due* (già acceso per i
locali nuovi), *Nessuno*. Quando un cliente tocca l'argomento, il chatbot
risponde subito «Su questo non posso rispondere: chiama il cameriere» e il
personale riceve l'avviso. Il testo lo puoi personalizzare. Se un cliente
scrive di un'allergia, la comanda esce con una riga di **ATTENZIONE**.

Il programma riporta ciò che dichiari tu: tieni aggiornati gli ingredienti e
istruisci il personale. La responsabilità delle informazioni resta del locale.

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

**Proposta delle bevande** — *Chatbot → Accoglienza*: appena il cliente apre
la chat, il chatbot chiede subito «Intanto, cosa vi porto da bere?» con i
pulsanti delle bevande più ordinate. Le bevande si possono confermare subito e
arrivano al bar mentre il tavolo sceglie il resto. Puoi spegnere la proposta o
cambiarla per fascia oraria (es. al mattino «Colazioni»).

Il pulsante **Chiama il cameriere** è sempre visibile al cliente e il chatbot
lo propone per qualsiasi dubbio che non sa risolvere: non si può togliere.

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

### 1.9 Reparti e stampanti

**Reparti** — *Comande → Reparti*: crea i reparti del tuo locale, quanti ne
vuoi (Bar, Cucina, Forno, Friggitrice, Griglia, Dolci…). Ne trovi già alcuni
pronti in base alla tipologia, più **Sala**, che riceve le chiamate del
cameriere e vede gli ordini interi.

1. Associa ogni **categoria** a un reparto: le birre al Bar, le pizze al Forno,
   le patatine alla Friggitrice. Se serve, cambia il reparto di un singolo
   prodotto.
2. Per ogni reparto scegli **dove arriva la comanda**: sugli **smartphone** delle
   persone che ci lavorano, su una **stampante**, o su tutti e due.
3. In *Personale* indica chi segue quale reparto (una persona può seguirne più d'uno).

Un ordine con birre, pizza e patatine si divide da solo: ogni reparto riceve
solo le sue voci, con la nota degli altri reparti coinvolti; la Sala vede
l'ordine intero e quando è tutto pronto.

**Stampanti** (si collegano dopo la prima consegna) — *Stampanti → Aggiungi
stampante*, segui il collegamento guidato, poi scegli a quale reparto serve e
se la stampante di cassa riceve una **copia** di ogni ordine.

Premi *Stampa di prova* per verificare. Se una stampante resta senza carta o si
spegne, ricevi un avviso e la comanda esce sulla stampante di riserva che hai
scelto. L'**area comande** mostra comunque tutto.

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
- **Area comande** (sullo smartphone di gestore e camerieri): vedi le comande
  dei **tuoi reparti** (il barista le bevande, la cucina i piatti); ogni nuova
  comanda suona e compare con tavolo, ora, voci e gli altri reparti coinvolti.
  Tocca *In preparazione* e *Pronto*; la Sala tocca *Servito* quando è al tavolo.
- **Chiamata dal tavolo** (arriva alla Sala): compare un avviso «Tavolo 7
  chiama» con il motivo, se indicato (*domanda*, *allergie o intolleranze*,
  *il conto*). Tocca *Ci vado* per toglierlo agli altri: il cliente vede che
  stai arrivando.
- **Primo ordine da accettare** (se il titolare lo ha attivato): controlla che
  al tavolo ci sia davvero qualcuno e premi *Accetta*.
- **Annullare** una voce o un ordine: *Annulla*, scegli il motivo. Se era già
  pagato dal telefono parte il rimborso.
- **Liberare il tavolo** quando i clienti vanno via: la chat del tavolo si azzera.

---

## Parte 3 — Cliente al tavolo

1. **Inquadra il QR code** con la fotocamera: si apre la chat, senza scaricare nulla.
2. Scrivi il tuo nome se vuoi (serve a distinguere chi ha ordinato cosa).
   Il chatbot ti chiede subito cosa vuoi da bere: puoi ordinare le bevande
   subito e scegliere il resto con calma.
3. Tocca **Menu completo** o una categoria, oppure scrivi: «solo i secondi»,
   «pizze con la salsiccia», «un hamburger senza cipolla».
4. Tocca **Aggiungi** sui piatti che vuoi. Puoi ordinare anche per gli altri.
5. Tutti quelli del tavolo che hanno inquadrato il QR vedono lo stesso carrello.
6. Quando siete pronti, **uno solo** tocca **Conferma per tutto il tavolo**.
7. Scegli **Pago in cassa** oppure **Pago ora** (Apple Pay, Google Pay,
   Satispay, Revolut Pay, Bancomat Pay, carta).
8. Volete altro? Aggiungete e confermate di nuovo: è un nuovo ordine dello stesso tavolo.
9. Per allergie, celiachia o qualsiasi dubbio: **Chiama il cameriere**, il
   pulsante è sempre in fondo alla chat; oppure scrivi «chiamami il cameriere».
10. Cerchi qualcosa che non è nel menu (verdure grigliate, un filo d'olio)?
    Chiedilo al chatbot: se il locale ce l'ha te lo propone con il prezzo.

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
escono in cassa e sono nell'area comande. *Ristampa* quando è a posto.
