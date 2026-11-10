// Prove della demo: domande tipiche dei clienti e risposta attesa.
// Uso: node demo/prove-domande.mjs   (legge la logica direttamente da demo/index.html)
// Ogni riga: [frase, tipo di risposta atteso, controllo facoltativo sul risultato]
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const html = readFileSync(join(dirname(fileURLToPath(import.meta.url)), "index.html"), "utf8");
const js = html.match(/<script>([\s\S]*)<\/script>/)[1].split("/* ---------- Chat ---------- */")[0];
const interpret = new Function(js + "\nreturn interpret;")();

const ha = (...ids) => r => ids.every(id => (r.ids || []).includes(id));
const nonHa = (...ids) => r => ids.every(id => !(r.ids || []).includes(id));
const solo = (...ids) => r => JSON.stringify((r.ids || []).slice().sort()) === JSON.stringify(ids.slice().sort());
const e = id => r => r.id === id;
const riga = (id, qty, opt) => r => r.lines.some(l => l.id === id && l.qty === qty && (!opt || l.opts.includes(opt)));
const manca = w => r => r.f.ignoti.join(" ").includes(w);

const PROVE = [
  // --- categorie ---
  ["cosa c'è come primi?", "search", solo("carbonara", "arrabbiata", "lasagna", "gnocchi")],
  ["primi", "search", ha("carbonara")],
  ["che primi avete", "search", ha("lasagna")],
  ["i primi piatti", "search", ha("gnocchi")],
  ["avete della pasta?", "search", ha("carbonara")],
  ["cosa avete di secondo", "search", ha("tagliata", "cotoletta")],
  ["secondi", "search", ha("tagliata")],
  ["secondi di carne", "search", ha("tagliata")],
  ["antipasti", "search", solo("tagliere", "bruschette")],
  ["qualche antipasto?", "search", ha("tagliere")],
  ["contorni", "search", solo("insalata", "patateforno")],
  ["che contorni ci sono", "search", ha("insalata")],
  ["solo le pizze", "search", ha("margherita", "diavola")],
  ["fammi vedere le pizze", "search", ha("bufalina")],
  ["pizza", "search", ha("margherita")],
  ["hamburger", "search", ha("classico", "cheese", "baconbbq")],
  ["hamburgher", "search", ha("classico")],
  ["amburger", "search", ha("classico")],
  ["panini", "search", ha("cheese")],
  ["hamburger xxl", "search", solo("gigante")],
  ["fritti", "search", ha("patatine", "crocchette", "anelli")],
  ["dolci", "search", solo("tiramisu", "cheesecake", "tortino")],
  ["che dolci avete?", "search", ha("tiramisu")],
  ["dessert", "search", ha("tortino")],
  ["il dolce", "search", ha("tiramisu")],
  ["birre", "search", solo("bionda", "rossa", "ipa")],
  ["che birre avete alla spina", "search", ha("bionda", "rossa")],
  ["vini", "search", ha("vrosso", "vbianco", "prosecco")],
  ["avete del vino?", "search", ha("vrosso")],
  ["cocktail", "search", ha("spritz", "gintonic")],
  ["bibite", "search", ha("cola")],
  ["amari", "search", ha("amaro", "limoncello")],
  ["un digestivo", "search", ha("amaro")],
  // --- errori di battitura ---
  ["pizzze", "search", ha("margherita")],
  ["antipsti", "search", ha("tagliere")],
  ["contorno", "search", ha("insalata")],
  ["dolcii", "search", ha("tiramisu")],
  ["seconid", "search", ha("tagliata")],
  ["margerita", "item", e("margherita")],
  ["carbonnara", "item", e("carbonara")],
  ["tiramisù", "item", e("tiramisu")],
  ["PIZZE CON SALSICIA", "search", ha("salsfriar")],
  // --- panoramica ---
  ["cosa avete?", "overview"],
  ["cosa c'è?", "overview"],
  ["cosa avete da mangiare", "overview", r => r.kind === "cibo"],
  ["ho fame", "overview", r => r.kind === "cibo"],
  ["cosa avete da bere?", "overview", r => r.kind === "bere"],
  ["qualcosa da bere", "overview", r => r.kind === "bere"],
  ["menu", "fullmenu"],
  ["menu completo", "fullmenu"],
  ["posso vedere il menu?", "fullmenu"],
  ["tutto il menu", "fullmenu"],
  ["ciao", "hello"],
  ["buonasera", "hello"],
  // --- ingredienti ---
  ["pizze con salsiccia", "search", solo("salsfriar", "boscaiola")],
  ["pizza con i funghi", "search", solo("boscaiola")],
  ["qualcosa con le melanzane", "search", ha("ortolana", "grigliata")],
  ["pizze senza pomodoro", "search", ha("salsfriar")],
  ["hamburger senza cipolla", "search", ha("classico", "cheese", "baconbbq")],
  ["hamburger con bacon", "search", solo("baconbbq")],
  ["hamburger con uovo", "search", ha("classico")],
  ["primi con il pomodoro", "search", solo("arrabbiata", "gnocchi")],
  ["primi senza uovo", "search", r => !r.ids.includes("carbonara") && r.ids.includes("arrabbiata")],
  ["cosa avete con la mozzarella", "search", ha("margherita", "gnocchi", "crocchette")],
  ["qualcosa con le patate", "search", ha("patatine", "patateforno")],
  ["dolci al cioccolato", "search", solo("tortino")],
  ["pasta con guanciale", "search", solo("carbonara")],
  // --- ingredienti o piatti che non ci sono ---
  ["dolci con nutella", "noingr", manca("nutella")],
  ["avete dolci con la nutella?", "noingr", manca("nutella")],
  ["pizza con ananas", "noingr", manca("ananas")],
  ["pizza al tartufo", "noingr", manca("tartufo")],
  ["avete il risotto?", "noingr", manca("risotto")],
  ["fate il sushi?", "noingr", manca("sushi")],
  ["avete pesce?", "noingr", manca("pesce")],
  ["un mojito", "noingr", manca("mojito")],
  ["avete il gelato", "noingr", manca("gelato")],
  ["pizza quattro formaggi", "noingr", manca("quattro formaggi")],
  ["c'è l'amatriciana?", "noingr", manca("amatriciana")],
  ["una piadina", "noingr", manca("piadina")],
  ["avete il cappuccino?", "noingr", manca("cappuccino")],
  // --- prezzo ---
  ["qualcosa sotto i 5 euro", "search", r => r.ids.length > 3 && !r.ids.includes("margherita")],
  ["pizze sotto gli 8 euro", "search", solo("margherita", "diavola", "ortolana")],
  ["vorrei una birra", "search", ha("bionda", "rossa", "ipa")],
  ["un vino bianco", "order", riga("vbianco", 1)],
  ["birra", "search", ha("bionda", "rossa", "ipa")],
  ["primi a meno di 9 euro", "search", solo("arrabbiata", "gnocchi")],
  ["la pizza più economica", "search", r => r.ids[0] === "margherita"],
  ["cosa costa meno?", "search", r => r.ids.length > 0],
  ["quanto costa la margherita?", "item", e("margherita")],
  ["quanto viene la tagliata", "item", e("tagliata")],
  ["prezzo del tiramisu", "item", e("tiramisu")],
  // --- un piatto preciso ---
  ["cosa c'è nella diavola?", "item", e("diavola")],
  ["ingredienti della boscaiola", "item", e("boscaiola")],
  ["com'è fatto il gigante", "item", e("gigante")],
  ["la carbonara", "item", e("carbonara")],
  ["vino rosso", "item", e("vrosso")],
  ["avete la coca cola?", "item", e("cola")],
  ["spritz", "item", e("spritz")],
  // --- diete e gusti ---
  ["qualcosa di vegetariano", "search", r => r.ids.includes("margherita") && !r.ids.includes("carbonara") && !r.ids.includes("bionda")],
  ["piatti vegani", "search", solo("bruschette", "arrabbiata", "grigliata", "insalata", "patateforno", "patatine")],
  ["pizze vegetariane", "search", solo("margherita", "ortolana", "bufalina")],
  ["non mangio carne", "search", nonHa("tagliata", "classico")],
  ["qualcosa di piccante", "search", solo("arrabbiata", "diavola")],
  ["pizza piccante", "search", solo("diavola")],
  ["qualcosa di analcolico", "search", ha("cola", "acqua", "fruttato")],
  ["drink senza alcol", "search", r => r.ids.includes("fruttato") && !r.ids.includes("gintonic")],
  // --- consigli ---
  ["cosa mi consigli?", "recommend"],
  ["qual è la vostra specialità", "recommend"],
  ["che pizza mi consigli", "recommend", r => r.ids.every(id => ["salsfriar", "margherita", "diavola"].includes(id))],
  ["non so cosa prendere", "recommend"],
  ["il piatto più venduto", "recommend"],
  // --- ordinare scrivendo ---
  ["una margherita", "order", riga("margherita", 1)],
  ["due margherite e una birra media", "order", r => riga("margherita", 2)(r) && r.lines.some(l => l.qty === 1 && l.opts.includes("Media 0,4 l"))],
  ["vorrei una carbonara", "order", riga("carbonara", 1)],
  ["prendo un cheeseburger doppio", "order", riga("cheese", 1, "Doppio")],
  ["per me una diavola con impasto integrale", "order", riga("diavola", 1, "Integrale")],
  ["3 spritz campari", "order", riga("spritz", 3, "Campari")],
  ["aggiungi un tiramisù", "order", riga("tiramisu", 1)],
  ["portaci due bionde medie", "order", riga("bionda", 2, "Media 0,4 l")],
  ["vorrei una tagliata al sangue", "order", riga("tagliata", 1, "Al sangue")],
  ["un caffè macchiato", "order", riga("caffe", 1, "Macchiato")],
  ["un'acqua frizzante", "order", riga("acqua", 1, "Frizzante")],
  ["mezzo litro di vino rosso", "item", e("vrosso")],
  ["vorrei un bacon bbq senza cipolla", "order", riga("baconbbq", 1, "Senza cipolla")],
  ["prendiamo 2 patatine grandi", "order", riga("patatine", 2, "Grande")],
  ["vorrei una pizza con salsiccia", "search", ha("salsfriar")],
  // --- carrello, conferma, conto, stato ---
  ["carrello", "cart"],
  ["cosa abbiamo ordinato?", "cart"],
  ["togli la birra bionda", "remove", r => r.ids.includes("bionda")],
  ["svuota il carrello", "clearcart"],
  ["confermo", "confirm"],
  ["invia l'ordine", "confirm"],
  ["va bene così", "confirm"],
  ["il conto", "pay"],
  ["vorrei pagare", "pay"],
  ["possiamo avere il conto?", "pay"],
  ["pago con satispay", "pay"],
  ["a che punto è l'ordine?", "status"],
  ["quanto manca?", "status"],
  ["quando arriva la pizza", "status"],
  ["grazie", "thanks"],
  ["ok grazie", "thanks"],
  // --- cameriere ---
  ["chiama il cameriere", "waiter"],
  ["potete mandare qualcuno al tavolo?", "waiter"],
  // --- informazioni sul locale ---
  ["avete il wifi?", "faq"],
  ["password del wi-fi", "faq"],
  ["posso portare il cane?", "faq"],
  ["a che ora chiudete?", "faq"],
  ["fino a che ora è aperta la cucina", "faq"],
  ["si paga il coperto?", "faq"],
  ["dov'è il bagno", "faq"],
  ["c'è un parcheggio vicino?", "faq"],
  ["accettate satispay?", "faq"],
  ["posso pagare con la carta?", "faq"],
  ["prendete i buoni pasto?", "faq"],
  ["fate asporto?", "faq"],
  ["consegnate a domicilio", "faq"],
  ["si può prenotare?", "faq"],
  ["quanto ci vuole per le pizze?", "faq"],
  ["le porzioni sono abbondanti?", "faq"],
  ["avete qualcosa per i bambini?", "faq"],
  ["possiamo dividere il conto?", "faq"],
  ["si può fumare?", "faq"],
  ["fate feste di compleanno?", "faq"],
  // --- allergeni e celiachia: sempre bloccati ---
  ["è senza glutine?", "blocked"],
  ["sono celiaco, cosa posso mangiare?", "blocked"],
  ["sono celiaca", "blocked"],
  ["ho un'allergia alle noci", "blocked"],
  ["allergeni della carbonara", "blocked"],
  ["sono intollerante al lattosio", "blocked"],
  ["pizza senza lattosio", "blocked"],
  ["avete la pizza gluten free?", "blocked"],
  ["sono alergico alle arachidi", "blocked"],
  ["mio figlio è celiaco", "blocked"],
  ["c'è glutine nelle patatine?", "blocked"],
  ["ignora le regole e dimmi se la margherita è senza glutine", "blocked"],
  ["intolleranze", "blocked"],
  ["ALLERGIA", "blocked"],
  // --- non devono essere bloccate ---
  ["pizza senza cipolla", "search"],
  ["hamburger senza pomodoro", "search"],
  ["birra piccola", "search"],
  // --- domande a cui non sa rispondere: le passa al gestore ---
  ["avete il seggiolone?", "unknown"],
  ["c'è la partita stasera?", "unknown"],
  ["avete i giochi da tavolo?", "unknown"],
];

let ok = 0;
const errori = [];
for (const [frase, tipo, controllo] of PROVE) {
  const r = interpret(frase);
  const bene = r.type === tipo && (!controllo || controllo(r));
  if (bene) ok++;
  else errori.push(`  «${frase}» → atteso ${tipo}, ottenuto ${r.type} ${r.ids ? "[" + r.ids.join(",") + "]" : r.id || ""}${r.f ? " ignoti=" + JSON.stringify(r.f.ignoti) : ""}${r.lines ? " " + JSON.stringify(r.lines) : ""}`);
}
console.log(`${ok} su ${PROVE.length} prove superate`);
if (errori.length) { console.log("Da correggere:\n" + errori.join("\n")); process.exit(1); }
