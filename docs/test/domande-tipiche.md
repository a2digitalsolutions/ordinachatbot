# Domande tipiche dei clienti — elenco di prova

L'elenco vero sta in `demo/prove-domande.mjs`: 237 frasi con la risposta attesa.
Oggi verifica la demo (`node demo/prove-domande.mjs`); **le stesse frasi sono la
prova di accettazione del chatbot vero** (OC2-03, OC2-12): nessuna può dare
«non ho capito» se la risposta è nel menu o tra le informazioni del locale.

Ogni frase sfuggita, in prova o dal vivo, si aggiunge all'elenco.

| Gruppo | Esempi | Il chatbot deve |
|---|---|---|
| Categorie, con sinonimi | «cosa c'è come primi?», «avete della pasta?», «panini», «un digestivo» | mostrare la categoria giusta |
| Errori di battitura | «hamburgher», «pizzze», «margerita», «antipsti» | capire lo stesso |
| Panoramica | «cosa avete?», «ho fame», «qualcosa da bere» | proporre le categorie |
| Ingredienti | «pizze con salsiccia», «primi senza uovo», «hamburger con uovo» | cercare tra ingredienti e aggiunte |
| Sinonimi e famiglie | «pizze senza sugo», «pizze bianche», «senza formaggio», «con verdure» | capire il sinonimo; mostrare prima ciò che è già così |
| Modifiche | «poco pomodoro», «doppia mozzarella», «con rucola», «ben cotta», «cottura bassa» | applicarle con il prezzo giusto; avvisare se non si può |
| Condizioni non capite | «pizze leggere», «senza zorbino» | non mostrare tutto: chiedere e segnalare al gestore |
| Cose che non ci sono | «dolci con nutella», «avete il sushi?», «un mojito» | dirlo chiaramente, proporre il più vicino, segnalarlo al gestore |
| Prezzo | «sotto i 5 euro», «la pizza più economica», «quanto costa la margherita?» | filtrare o dire il prezzo |
| Un piatto preciso | «cosa c'è nella diavola?», «vino rosso» | mostrare la scheda con varianti e aggiunte |
| Diete e gusti | «vegetariano», «vegano», «piccante», «senza alcol» | filtrare con le etichette del gestore |
| Consigli | «cosa mi consigli?», «la specialità» | proporre i più richiesti |
| Ordinare scrivendo | «due margherite e una birra media», «un cheeseburger doppio senza cipolla» | mettere nel carrello quantità e varianti giuste |
| Carrello, conferma, conto | «togli la birra», «confermo», «il conto», «quanto manca?» | fare l'azione giusta |
| Informazioni sul locale | orari, coperto, bagno, Wi-Fi, cani, parcheggio, pagamenti, asporto, bambini | rispondere con ciò che ha inserito il gestore |
| Allergeni e celiachia | «è senza glutine?», «sono alergico alle arachidi», tentativi di aggirare | **bloccare sempre** e proporre il cameriere |
| Frasi innocenti | «pizza senza cipolla», «birra piccola» | non bloccarle |
| Domande senza risposta | «avete il seggiolone?» | dirlo e passarle al gestore |
