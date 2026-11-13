# Ordinachatbot — specifiche

Versione 0.2 del 10/11/2026. Scritte a partire dalla richiesta di Paolo; le parti
segnate **[proposta]** sono scelte fatte da Claude e si possono cambiare.

## 1. In una frase

Il cliente inquadra il QR code sul tavolo, chatta con un assistente che gli mostra
il menu (tutto o in parte), ordina per sé o per tutto il tavolo, sceglie come
pagare, e l'ordine arriva in cucina e alla cassa senza che nessuno scriva il
numero del tavolo. Prodotto venduto in abbonamento (SaaS) a bar, pub, ristoranti
e pizzerie.

## 2. Chi usa il sistema

| Chi | Cosa fa |
|---|---|
| **Cliente al tavolo** | Inquadra il QR, guarda il menu, ordina, paga. Non si registra. |
| **Titolare del locale** | Configura locale, menu, aspetto, tavoli, QR, stampanti, pagamenti, personale. |
| **Personale** (cassa, sala, cucina) | Vede gli ordini, li fa avanzare, incassa. Ogni ruolo vede solo ciò che gli serve. |
| **Super amministratori** (noi) | Creano i locali, li configurano per conto del titolare, assegnano piani e moduli. |

## 3. Moduli

Il modulo base è sempre attivo; gli altri si accendono locale per locale.

**Ordine di sviluppo e di vendita.** La **versione 1** (obiettivo: primi di
dicembre 2026) comprende base (con l'area comande su smartphone), pagamenti dal tavolo,
stampa delle comande e sito. Pagamenti e stampanti sono pronti ma **spenti**
alla consegna: li configuriamo insieme al gestore subito dopo (conto Stripe con
il suo IBAN; stampanti termiche se le vuole). Fino ad allora il cliente paga in
cassa e le comande arrivano nell'area comande. **Cassa e gestionale** si sviluppano dopo e si vendono a parte: un
locale con la versione 1 continua a usare il proprio registratore di cassa.

| Modulo | Contenuto | Obbligatorio |
|---|---|---|
| **Base** | Menu, aspetto, tavoli e QR, chatbot, ordini, area comande su smartphone per gestore e camerieri | sì |
| **Stampanti** | Comande su stampanti termiche in cucina, al bar, alla cassa | no* |
| **Pagamenti dal tavolo** | Apple Pay, Google Pay, Satispay, Revolut Pay, PayPal, Bancomat Pay, carta; con Stripe, attivati dal locale con il proprio IBAN | no |
| **Cassa e gestionale** | Cassa touch, mappa tavoli, reparti, stampante fiscale RT, resoconti | no |
| **Sito** | Pagina del locale con social, contatti, orari e pulsante del menu | no |

\* Le comande arrivano sempre nell'area comande, sullo smartphone di gestore
e camerieri. Le stampanti sono un'aggiunta: il locale può usare l'area comande,
le stampanti o tutte e due.

## 4. Configurazione del locale

- **Tipologia**: bar, pub, ristorante, pizzeria — se ne possono spuntare più d'una.
  Serve a proporre categorie di partenza e il tono del chatbot; non blocca nulla.
- **Categorie**: libere e senza limite (Primi, Hamburger, Hamburger XXL…), con
  foto facoltativa, ordine a piacere, orari di disponibilità (es. Colazioni fino
  alle 11).
- **Prodotti**: nome, prezzo, descrizione, foto facoltativa, ingredienti,
  **reparto di preparazione** (dove va la comanda, vedi §6) e, solo con il
  modulo cassa, reparto IVA. Il reparto si imposta sulla categoria e si può
  cambiare sul singolo prodotto.
- **Varianti** (cibi e drink), con il loro prezzo: se ne sceglie una (birra
  piccola/media, impasto integrale +1,00, hamburger doppio +3,00, spritz
  Aperol/Campari/analcolico). Il gestore crea il gruppo una volta e lo applica
  a una categoria o a singoli prodotti.
- **Modifiche agli ingredienti**: il cliente può, su ogni piatto,
  - **togliere** un ingrediente («senza cipolla»),
  - chiederne **poco** («poco pomodoro», «poco ketchup»),
  - chiederne **tanto/doppio** («doppia mozzarella»), al prezzo dell'aggiunta,
  - **aggiungere qualsiasi ingrediente presente nel menu** («con rucola»).
  Il gestore decide, ingrediente per ingrediente: **prezzo come aggiunta**
  oppure **gratis**; se *non si può aggiungere*; se in un piatto è
  *ingrediente base* e non si può togliere (l'impasto della pizza); e quali
  piatti sono *non modificabili* (lasagna, dolci). Per ogni categoria sceglie le
  «aggiunte più richieste» da mostrare come pulsanti. Valori di partenza: tutto
  si può togliere e chiedere «poco»; ogni ingrediente si può aggiungere a € 1,00.
- **Cottura**: per le categorie scelte dal gestore (pizze, hamburger, carne) il
  cliente indica *poco cotta / al sangue*, *media*, *ben cotta*.
- Tutte le modifiche compaiono sulla comanda, riga per riga, e il prezzo si
  aggiorna da solo.
- **Ingredienti**: elenco del locale, riutilizzabile; è ciò che permette al
  chatbot di rispondere a «pizze con i funghi» o «senza cipolla».
- **Fuori menu su richiesta**: piatti, contorni e condimenti che il locale ha
  ma non mette nel menu, perché li chiede solo qualcuno (verdure grigliate,
  olio extravergine a crudo, pasta in bianco, limone, peperoncino). Il gestore
  li inserisce con prezzo (o gratis), reparto di preparazione, ingredienti con
  la stessa scheda allergeni e un interruttore «disponibile oggi». Possono
  essere un piatto a sé (verdure grigliate € 5,00) o un'aggiunta a qualsiasi
  piatto (olio a crudo, gratis). Non compaiono nel menu né nelle proposte del
  chatbot: il chatbot li offre **solo quando il cliente li chiede** (vedi §5).
- **Allergeni e celiachia**: si inseriscono **sugli ingredienti**, con una
  scheda guidata (tre posizioni per ognuno dei 14 allergeni, stato del glutine,
  conferma «ho controllato l'etichetta»); il piatto eredita tutto. Un dato non
  verificato vale «non dichiarato», mai «non contiene». L'etichetta «senza
  glutine» la concede il programma solo a condizioni precise. Regole complete e
  prove obbligatorie in `docs/allergeni.md`. Altre etichette: vegetariano,
  vegano, piccante, surgelato.
- **Inserimento facile**: griglia tipo foglio di calcolo, duplica prodotto,
  importa da Excel/CSV, cambia prezzi in blocco, trascina per riordinare,
  interruttore «esaurito» che toglie subito il prodotto dal menu.
- **Aspetto**: logo, 10 combinazioni di colori, 10 temi (forma delle schede,
  caratteri, sfondi); si combinano liberamente e si vedono in anteprima. Menu,
  chat e sito usano lo stesso aspetto.
- **Tavoli e QR**: sale, tavoli numerati, QR generati e stampabili in fogli PDF
  (con logo e numero del tavolo). Un QR si può rigenerare se viene copiato.
- **Comportamento del chatbot su allergeni e celiachia**: il titolare sceglie
  *allergeni*, *celiachia*, *tutti e due* o *nessuno* (per i locali nuovi è
  acceso *tutti e due*). Sugli argomenti scelti il
  chatbot risponde subito con il messaggio fisso «Su questo non posso
  rispondere: chiama il cameriere» e offre il pulsante di chiamata.

> **Nota sugli allergeni.** Bloccare le risposte del chatbot è prudente, ma non
> sostituisce l'informazione scritta sugli allergeni che il locale deve comunque
> dare ai clienti (Reg. UE 1169/2011). **[proposta]** Le icone degli allergeni
> inserite dal titolare restano visibili nella scheda di ogni piatto anche quando
> il chatbot è bloccato sull'argomento, con la frase «per qualsiasi dubbio chiedi
> al personale». Da confermare col consulente (OC0-07).

## 5. Ordinare dal tavolo

1. Il QR apre la chat già legata al tavolo. Il cliente scrive solo il proprio nome
   (facoltativo) per distinguere le voci.
2. Il chatbot saluta e **propone subito da bere** («Intanto, cosa vi porto da
   bere?») con i pulsanti delle bevande più ordinate e della categoria
   bevande, più **Menu completo**, le **categorie** e **Chiama il cameriere**.
   Le bevande si possono confermare subito, da sole: partono al reparto
   bevande mentre il tavolo sceglie da mangiare (è un ordine come gli altri,
   con la sua conferma). Il gestore può spegnere la proposta o cambiarla per
   fascia oraria (es. al mattino «Colazioni»); se il tavolo ha già ordinato da
   bere non la ripete. Si può anche scrivere liberamente («solo i secondi»,
   «pizze con la salsiccia», «qualcosa sotto i 10 euro»).
3. I prodotti compaiono come schede con foto, prezzo e pulsante **Aggiungi**;
   le varianti e le aggiunte si scelgono con pulsanti.
4. Tutti quelli che hanno inquadrato lo stesso tavolo vedono **un carrello
   comune**, con accanto a ogni voce chi l'ha messa. Ognuno può ordinare per sé
   o per altri.
5. **Uno solo** preme **Conferma per tutto il tavolo**. Gli altri vedono chi ha
   confermato; una seconda conferma dello stesso carrello non è possibile.
6. Scelta del pagamento: **in cassa** oppure **subito dal telefono**.
7. Dopo l'invio si apre un carrello nuovo: chiunque può aggiungere altro, e ogni
   aggiunta è un nuovo ordine dello stesso tavolo.

Il chatbot mostra soltanto prodotti e prezzi presi dal menu del locale. Totali,
disponibilità e stato dell'ordine li decide il server, non il modello linguistico.

### Chiama il cameriere, sempre

- Il pulsante **Chiama il cameriere** è **sempre visibile** in fondo alla chat,
  in ogni momento, anche a carrello aperto, dopo l'ordine e con il chatbot in
  difficoltà. Lo stesso vale se il cliente lo scrive in qualsiasi modo
  («chiamami il cameriere», «posso parlare con qualcuno?», «c'è una persona?»,
  «cameriere!», «waiter please»): è una **regola scritta nel codice**, come il
  blocco allergeni, e viene prima di qualsiasi altra risposta.
- Il chatbot propone il cameriere per **qualsiasi dubbio** che non sa
  risolvere con certezza: allergeni e celiachia bloccati, domande sulla salute
  (gravidanza, diete, intolleranze: il chatbot non dà consigli di salute),
  richieste fuori menu che il gestore non ha inserito, lamentele, conto,
  problemi col telefono.
- Il cliente può aggiungere un motivo facoltativo (pulsanti «Ho una domanda»,
  «Allergie o intolleranze», «Il conto», «Altro»). La chiamata arriva subito,
  con suono, sugli smartphone dei camerieri di **sala** (reparto «Sala», vedi
  §6) con tavolo, ora e motivo; il cliente vede «Il cameriere sta arrivando» e
  poi «Preso in carico da Marco». Una seconda chiamata entro 2 minuti non
  suona di nuovo (anti-abuso), ma resta visibile.

### Fuori menu su richiesta

- Quando il cliente chiede qualcosa che non è nel menu («avete verdure
  grigliate?», «posso avere un filo d'olio?»), il chatbot cerca **prima** tra i
  fuori menu del gestore: se c'è ed è disponibile oggi lo propone con il prezzo
  e il pulsante **Aggiungi** (come piatto o come aggiunta al piatto scelto).
- Se non c'è o non è disponibile oggi: lo dice, propone il prodotto più vicino
  del menu e il pulsante **Chiama il cameriere**, e segnala la richiesta al
  gestore (Domande da rivedere), che così può aggiungerla ai fuori menu.
- I fuori menu seguono tutte le regole degli altri prodotti: prezzo dal
  server, allergeni ereditati dagli ingredienti, blocco allergeni/celiachia,
  stampa nel reparto giusto, «FUORI MENU» scritto sulla comanda.

### Ricerca per ingrediente

Qualsiasi cibo nominato dal cliente va trattato come un possibile ingrediente e
cercato tra gli ingredienti del menu, anche se il gestore non lo ha mai
inserito («dolci con nutella», «pizza con ananas»). Tre esiti possibili:

1. **c'è** → mostra i prodotti che lo contengono;
2. **c'è solo come aggiunta** → lo dice, con il prezzo dell'aggiunta;
3. **non c'è** → lo dice chiaramente («nel menu non c'è nulla con la
   nutella»), propone i prodotti più vicini della stessa categoria e segnala
   la richiesta al gestore, che così scopre cosa chiedono i clienti.

Mai rispondere «non ho capito» a una domanda su un ingrediente.

### Sinonimi, famiglie e richieste non capite

- **Sinonimi**: sugo, salsa, passata = pomodoro; pancetta = bacon; parmigiano =
  grana; nomi di marca e modi di dire comuni. Vale per ingredienti, categorie
  (pasta = primi, panini = hamburger), cotture (cottura alta = ben cotta) e
  quantità (un filo di, appena = poco). Il gestore può aggiungerne di suoi.
- **Famiglie**: «senza formaggio» esclude mozzarella, bufala, cheddar, grana…;
  «senza carne», «senza maiale», «con verdure» funzionano allo stesso modo.
- **Prima ciò che è già così**: a «pizze senza sugo» si mostrano le pizze che non
  hanno il pomodoro; solo dopo, in una riga, si dice che le altre si possono
  preparare senza. Se nessun piatto è già così, si mostrano quelli che lo
  diventano togliendo o aggiungendo, con la nota e il prezzo.
- **Mai ignorare una parola che restringe la richiesta.** Se il chatbot non
  capisce una condizione («pizze leggere», «senza zorbino») non mostra tutta la
  categoria: dice cosa non ha capito, chiede di ripeterlo in altro modo e passa
  la frase al gestore. Vale per qualsiasi richiesta.

### Il chatbot che impara

- Quando non sa rispondere, il chatbot **lo dice**, propone di chiamare il
  cameriere e **mette da parte la domanda** (con le battute intorno, giorno, ora
  e tavolo; nessun dato personale del cliente).
- Il gestore trova l'elenco in **Chatbot → Domande da rivedere**, con le domande
  uguali raggruppate e contate. Con calma, anche nei giorni successivi, scrive
  la risposta giusta oppure segna «da ignorare».
- Le risposte diventano le **domande e risposte del locale**: il chatbot le usa
  da subito con tutti i clienti. Si possono correggere o cancellare in ogni momento.
- Limiti: una risposta del gestore non scavalca il blocco su allergeni e
  celiachia e non modifica prezzi o prodotti (quelli si cambiano nel menu).
- **[proposta]** Le conversazioni messe da parte si cancellano dopo 90 giorni.

### Lingua, date e prezzi

Il chatbot e tutto il programma parlano italiano. Giorni e date sempre in
formato italiano (martedì 10 novembre 2026, 10/11/2026), ore su 24 (22:30),
prezzi con la virgola (€ 8,50), ora italiana. Vale per chat, pannello, comande,
scontrini e resoconti. L'inglese (OC2-10) è una lingua in più per i clienti
stranieri, non sostituisce l'italiano.

### Stati del tavolo

```
Libero → Occupato → Conto da pagare → Pagato → Libero
```

- **Libero → Occupato**: alla prima scansione del QR (o quando lo apre il personale).
- **Occupato → Conto da pagare**: c'è almeno un ordine inviato non ancora pagato.
- **Conto da pagare → Pagato**: tutto pagato (dal tavolo o in cassa). Se arriva un
  altro ordine torna a *Conto da pagare*.
- **Pagato → Libero**: lo libera il personale, oppure da solo dopo un tempo
  impostato dal titolare. Alla liberazione la chat del tavolo si azzera.

### Stati dell'ordine

```
Nel carrello → Confermato → (In attesa di pagamento) → In cucina → Pronto → Servito
                                                  ↘ Annullato (con motivo, prima di Servito)
```

| Stato | Quando | Chi lo cambia |
|---|---|---|
| Nel carrello | i clienti stanno scegliendo | clienti |
| Confermato | qualcuno ha confermato per il tavolo | cliente |
| In attesa di pagamento | solo se il locale vuole l'incasso prima di preparare | sistema |
| In cucina | comanda stampata e visibile sullo schermo ordini | sistema |
| Pronto | la cucina segnala che può uscire (facoltativo) | personale |
| Servito | portato al tavolo | personale |
| Annullato | con motivazione; se già pagato parte il rimborso | personale |

Regola del locale **[proposta]**, scelta dal titolare:
- **Si paga alla fine** (tipico ristorante/pizzeria): scegliendo «in cassa»
  l'ordine va subito in cucina; chi paga dal telefono salda il conto quando vuole.
- **Si paga prima** (tipico pub/bar): l'ordine va in cucina solo dopo il pagamento
  dal telefono o dopo che la cassa lo ha incassato.

### Stati del pagamento

```
Da pagare → In corso → Pagato        Pagato → Rimborsato (tutto o in parte)
                    ↘ Non riuscito → Da pagare
```

Un pagamento è *Pagato* solo quando lo conferma il fornitore al nostro server.

### Protezioni

Una foto del QR permetterebbe di ordinare da casa. Opzioni del titolare:
il personale accetta il primo ordine di un tavolo *libero*; un codice breve
esposto al tavolo; un limite di importo oltre il quale serve il pagamento
anticipato. Limite di messaggi per evitare abusi del chatbot.

## 6. Dove arrivano gli ordini

### Reparti di preparazione

- Il gestore crea i **reparti** che vuole, senza limite: Bar/Bevande, Cucina,
  Pizzeria/Forno, Friggitrice (patatine e fritti), Griglia, Dolci… Di partenza
  ne proponiamo alcuni in base alla tipologia; più **Sala**, che riceve le
  chiamate del cameriere e le comande da servire.
- Ogni **categoria** va in un reparto; un singolo prodotto o fuori menu può
  andare in un reparto diverso (le patatine del menu hamburger alla
  friggitrice). Una voce senza reparto va al reparto «Cucina» di partenza,
  così nessuna comanda si perde.
- Per ogni reparto il gestore sceglie **dove arriva** la comanda: sugli
  **smartphone** del personale assegnato a quel reparto, su una o più
  **stampanti termiche**, o su tutti e due. Una persona può seguire più
  reparti (il barista anche la friggitrice).
- **Instradamento**: un ordine con due birre, una margherita e una porzione di
  patatine si divide da solo: le birre al bar, la pizza al forno, le patatine
  alla friggitrice. Ogni pezzo riporta tavolo, ora, voci, modifiche, note,
  chi ha ordinato e la scritta «Ordine n. 12 — anche: Forno, Friggitrice»,
  così ogni reparto sa che il tavolo aspetta altro.
- Ogni reparto segna i suoi pezzi «in preparazione» e «pronto»; la **Sala**
  vede l'ordine intero e quando tutti i reparti sono pronti (stato dell'ordine
  in §5 calcolato dal server sui pezzi).
- I reparti di preparazione sono **diversi dai reparti IVA della cassa** (§8):
  i primi dicono dove si prepara, i secondi come si tassa.

### Area comande e stampanti

- **Area comande** (smartphone di gestore e camerieri, anche tablet o
  monitor): ognuno vede le comande dei propri reparti appena confermate, con
  avviso sonoro, e le fa avanzare; il gestore e la Sala vedono tutto. È sempre
  attiva ed è il modo principale nella prima consegna.
- **Stampanti termiche** (facoltative, si collegano dopo la prima consegna):
  ogni reparto può avere una o più stampanti. Copia riepilogativa facoltativa
  alla stampante di cassa.
- Se una stampante è spenta o senza carta: la comanda resta comunque
  sull'area comande del reparto, avviso al personale e stampa di riserva sulla
  stampante scelta dal gestore (di solito quella di cassa).
- Se un reparto non ha nessuno collegato e nessuna stampante, la comanda va
  alla Sala con l'avviso «reparto non presidiato».

## 7. Pagamenti dal tavolo

- Metodi: Apple Pay, Google Pay, Satispay, Revolut Pay, Bancomat Pay, carta.
- **I soldi vanno direttamente sul conto del locale**: ogni locale collega il
  proprio conto presso il fornitore di pagamenti. Ordinachatbot è solo la
  piattaforma tecnica e non trattiene denaro dei clienti.
- Il titolare sceglie quali metodi mostrare.
- Conto: paga tutto, paga la tua parte (le tue voci), dividi in parti uguali.
  Mancia facoltativa.
- Ricevuta di cortesia sul telefono. Il documento fiscale lo emette il locale
  (dalla cassa di Ordinachatbot se attiva, altrimenti dal proprio registratore).

## 8. Cassa e gestionale (facoltativo)

Il locale compra a parte monitor touch e stampante fiscale RT (modelli
supportati in `docs/hardware.md`).

- **Reparti** con aliquota IVA (es. Cucina 10%, Bar 10%, Asporto 22%: valori di
  esempio, da impostare col commercialista), collegati alle categorie.
- **Pagamenti**: contanti, carta/POS, Satispay, buoni pasto, pagato dal tavolo,
  non riscosso; pagamenti misti sullo stesso conto.
- **Vendita al banco** veloce a pulsanti grandi (categorie → prodotti).
- **Mappa dei tavoli** per sala, a colori secondo lo stato; apri, sposta, unisci.
- **Ordini del chatbot** compaiono da soli sul tavolo giusto; se il tavolo ha
  pagato dal telefono il conto risulta già saldato e resta solo da emettere lo
  scontrino.
- **Conto**: preconto, coperto e servizio, sconti, divisione, scontrino
  fiscale su RT, annullo e reso, lotteria degli scontrini.
- **Giornata**: apertura con fondo cassa, chiusura giornaliera, turni e
  operatori con PIN, permessi (chi può stornare o scontare), registro delle
  operazioni.
- **Resoconti**: incassi per metodo, reparto, prodotto, fascia oraria,
  operatore; esportazione.
- **Senza internet** la cassa continua a vendere e stampare; si riallinea al
  ritorno della connessione.

## 9. Sito e menu pubblico

- **Menu pubblico**: lo stesso menu, solo da consultare, a un indirizzo fisso.
- **Sito** (facoltativo): logo, descrizione, orari, mappa, contatti, social,
  galleria, pulsante **Menu**.

## 10. SaaS, domini, amministrazione

- Ogni locale ha un indirizzo sul nostro dominio (es. `nomelocale.<nostrodominio>`).
  Può passare in qualsiasi momento a un dominio suo; i QR già stampati
  continuano a funzionare.
- I super amministratori possono fare tutto ciò che fa il titolare, entrando
  «per conto del locale»; ogni operazione resta registrata.
- Piani a moduli (§3). Per la versione 1 i piani li assegniamo noi; iscrizione
  autonoma e pagamento dell'abbonamento arrivano dopo (OC7-01).

## 11. Regole tecniche

- Ogni dato appartiene a un locale; isolamento nel database **e** lato server.
- Nessun segreto nel repository o nel codice che gira sul telefono del cliente.
- Gli ordini non si cancellano: si annullano, con storico.
- Le integrazioni esterne non configurate non vanno mai simulate come funzionanti.
- Dati dimostrativi separati ed etichettati.
- Test per i flussi principali; migrazioni del database versionate.
- Pensato per il telefono: la chat deve aprirsi in un paio di secondi anche con
  rete scarsa, senza installare app.

## 12. Cose aggiunte rispetto alla richiesta

Chiamata del cameriere sempre disponibile; proposta delle bevande all'apertura;
reparti di preparazione con instradamento; fuori menu su richiesta; prodotto esaurito; note per la cucina; orari delle categorie; coperto; divisione del conto e mancia; protezione
dagli ordini da fuori locale; area comande su smartphone;
controllo carta/stampante spenta; ruoli del personale; italiano e inglese;
statistiche; cassa senza internet; privacy e contratto; locale pilota.

## 13. Decisioni aperte

1. Stack e hosting: **deciso**, vedi `docs/decisioni/0001-architettura.md`.
2. Motore del chatbot: **deciso**, gratuito, a regole (stesso documento).
3. Fornitore dei pagamenti: **deciso**, Stripe (`docs/decisioni/0002-pagamenti.md`). Resta la copertura di Bancomat Pay (OC3-04).
4. Modelli di stampanti e RT supportati (OC0-06).
5. Aspetti fiscali e allergeni (OC0-07).
6. Nome commerciale e prezzi dei piani (dominio deciso: `ordina.a2digital.it`).
