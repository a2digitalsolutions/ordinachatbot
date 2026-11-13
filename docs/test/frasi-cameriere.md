# Frasi per «Chiama il cameriere», fuori menu e bevande

Prova di accettazione di OC2-17, OC2-18 e OC2-19, da passare **tutta** anche
col chatbot vero (OC2-12). Menu di riferimento: quello della demo, con in più
questi fuori menu: *Verdure grigliate* € 5,00 (piatto, Cucina, disponibile
oggi), *Olio extravergine a crudo* gratis (aggiunta), *Pasta in bianco* € 6,00
(piatto, **non** disponibile oggi).

Regole valide per tutte: il pulsante **Chiama il cameriere** è sempre
visibile; la chiamata parte solo dal tocco o da una frase che la chiede
chiaramente, mai da un ordine; nessun ordine parte senza il tocco sul
pulsante di conferma.

## 1. Il cliente chiede il cameriere — la chiamata parte subito

Ognuna deve far partire la chiamata alla Sala (o, se la frase è ambigua,
mostrare il pulsante **Chiama il cameriere** già in evidenza), prima di
qualsiasi altra risposta.

| Frase | Deve |
|---|---|
| «chiamami il cameriere» | chiamata alla Sala |
| «mi chiami il cameriere per favore» | chiamata |
| «cameriere!» | chiamata |
| «può venire qualcuno al tavolo?» | chiamata |
| «posso parlare con una persona?» | chiamata |
| «voglio parlare con qualcuno del personale» | chiamata |
| «c'è un essere umano?» | chiamata |
| «fammi venire la cameriera» | chiamata |
| «chiama il titolare» | chiamata (alla Sala, motivo «Altro») |
| «ho un dubbio, mandami qualcuno» | chiamata |
| «aiuto» | chiamata, motivo «Ho una domanda» |
| «basta chatbot, voglio un cameriere» | chiamata |
| «cammeriere» / «camerere» (errori) | chiamata |
| «waiter please» / «can someone come to the table?» | chiamata |
| «ci portate il conto?» | chiamata con motivo «Il conto» (o pagamento dal telefono se attivo, con il pulsante del cameriere accanto) |
| «chiamami il cameriere, ho un'allergia» | chiamata con motivo «Allergie o intolleranze»; nessuna informazione sugli allergeni se l'argomento è bloccato |

## 2. Il chatbot deve proporre il cameriere (pulsante in evidenza)

| Frase | Deve |
|---|---|
| «sono incinta, cosa posso mangiare?» | non dare consigli di salute; proporre il cameriere |
| «in gravidanza posso prendere il prosciutto crudo?» | non rispondere sì/no; proporre il cameriere |
| «sono a dieta, cosa mi consigli?» | può mostrare piatti leggeri del menu, ma senza promesse di salute; pulsante del cameriere |
| «il piatto è freddo» / «manca una pizza» | scusarsi, proporre il cameriere; non promettere rimborsi o sconti |
| «la cucina è chiusa?» (se non risposto dal gestore) | dire che non lo sa, proporre il cameriere, salvare la domanda |
| qualsiasi domanda bloccata su allergeni o celiachia | messaggio fisso + pulsante del cameriere |

## 3. Frasi che **non** devono far partire la chiamata

| Frase | Deve |
|---|---|
| «il cameriere è stato gentilissimo» | ringraziare; nessuna chiamata |
| «prima il cameriere ci ha detto che c'è la pizza del giorno» | cercare la pizza del giorno nel menu; nessuna chiamata |
| «non serve il cameriere, faccio da solo» | nessuna chiamata |
| «avete i camerieri anche fuori?» | rispondere o salvare la domanda; nessuna chiamata |

## 4. Fuori menu su richiesta

| Frase | Deve |
|---|---|
| «avete verdure grigliate?» | proporre *Verdure grigliate* € 5,00 con **Aggiungi** |
| «c'è qualcosa di verdure alla griglia?» | come sopra (sinonimi) |
| «posso avere un filo d'olio sulla margherita?» | aggiunta *Olio extravergine a crudo*, gratis, sulla margherita |
| «un po' d'olio a parte» | aggiunta olio, gratis |
| «mi fate una pasta in bianco?» | dire che oggi non è disponibile, proporre il primo più vicino e il cameriere |
| «avete il seitan?» (non inserito) | dire che non c'è, proporre il più vicino, cameriere, segnalare al gestore |
| «mostrami il menu completo» | **non** mostrare i fuori menu |
| «avete verdure grigliate? sono celiaca» (celiachia bloccata) | messaggio fisso + cameriere; nessuna informazione sul glutine |

## 5. Proposta delle bevande all'apertura

| Situazione | Deve |
|---|---|
| primo messaggio del tavolo, proposta accesa | chiedere cosa portare da bere con i pulsanti delle bevande più ordinate, più Menu, categorie, Chiama il cameriere |
| «due medie e un'acqua naturale» subito dopo | carrello con 2 bionde medie e 1 acqua naturale; pulsante di conferma; dopo il tocco vanno **solo** al Bar |
| il cliente risponde «prima mangiamo» | non insistere; mostrare categorie e menu |
| secondo cliente che apre la chat dello stesso tavolo dopo che le bevande sono già state ordinate | non riproporre le bevande |
| proposta spenta dal gestore | saluto normale senza domanda sulle bevande |
| ore 8:30, proposta «Colazioni» al mattino | proporre le colazioni invece delle bevande |

## 6. Instradamento ai reparti (prove del server)

| Ordine | Deve arrivare |
|---|---|
| 2 birre, 1 margherita, 1 patatine | birre al Bar, margherita al Forno, patatine alla Friggitrice; la Sala vede l'ordine intero; ogni pezzo indica gli altri reparti |
| 1 hamburger con patatine (patatine del menu spostate alla Friggitrice) | hamburger alla Cucina, patatine alla Friggitrice |
| voce di una categoria senza reparto | alla Cucina, con avviso al gestore |
| reparto senza nessuno collegato e senza stampante | alla Sala con «reparto non presidiato» |
| verdure grigliate fuori menu | alla Cucina (reparto scelto dal gestore), con «FUORI MENU» |
| ogni ordine | nessuna voce persa, nessuna voce in due reparti |
