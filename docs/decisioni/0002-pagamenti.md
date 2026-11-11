# Decisione 0002 — Fornitore dei pagamenti dal tavolo

- **Task:** OC0-03
- **Data:** mercoledì 11 novembre 2026
- **Stato:** fornitore deciso da Paolo. Il conto Stripe si apre alla consegna
  del primo locale; lo sviluppo dei pagamenti parte allora.

## Decisione

- **Fornitore: Stripe**, nella formula per piattaforme (Stripe Connect).
- **Ogni locale ha il suo conto Stripe**, collegato alla nostra piattaforma. Il
  pagamento del cliente va direttamente sul conto del locale («addebito
  diretto»): gli incassi non passano mai da un conto nostro, come vogliono le
  regole di prodotto.
- **Attivazione dopo la consegna, a cura del locale:** dal pannello il titolare
  apre il collegamento a Stripe, inserisce i dati dell'attività e l'IBAN, e
  sceglie i metodi di pagamento da offrire. Finché non lo fa, il locale lavora
  con il solo pagamento in cassa (modulo pagamenti spento).

## Metodi di pagamento richiesti

| Metodo | Con Stripe | Note |
|---|---|---|
| Carta | Sì | Sempre attiva |
| Apple Pay | Sì | Compare da solo sugli iPhone; va registrato il dominio |
| Google Pay | Sì | Compare da solo su Android |
| Satispay | Sì | Previsto anche per i conti collegati a una piattaforma; va richiesto per ogni locale |
| PayPal | Sì | Previsto per le piattaforme; può servire un'approvazione |
| Revolut Pay | Sì | Presente tra i metodi di Stripe; da provare sul conto di prova con i conti collegati |
| Bancomat Pay | Da verificare | Non confermato nella documentazione di Stripe: si verifica nel task OC3-04. Se non c'è, le carte Bancomat con doppio circuito passano comunque come carte |

Regola: nella chat il cliente vede solo i metodi che il locale ha davvero
attivi. Un metodo non configurato non si mostra e non si simula.

## Quando si apre il conto Stripe

Deciso da Paolo l'11/11/2026: nessun conto Stripe adesso; si apre alla consegna
del primo locale. Di conseguenza:

- la prima consegna esce con il solo pagamento in cassa;
- i pagamenti dal tavolo si sviluppano dopo, tutti insieme, perché senza un
  conto di prova non si possono provare e non vanno mai simulati come
  funzionanti;
- quando si aprirà il conto servono: Connect attivo in modalità di prova e le
  chiavi di prova consegnate in modo sicuro (mai in chat o nel repository).

## Da sapere prima dei pagamenti veri

- Per passare dalla prova ai pagamenti veri Stripe chiede i dati di chi intesta
  la piattaforma (attività, rappresentante, conto). Va deciso a chi intestarla.
- Ogni locale, per incassare, deve completare la verifica di Stripe con i propri
  dati e documenti: qualche minuto di compilazione, poi i tempi di Stripe.
- Commissioni, rimborsi e contestazioni sono a carico del conto del locale. Le
  commissioni aggiornate vanno lette sul listino di Stripe al momento
  dell'attivazione e scritte nel foglio che il locale firma.
- Un pagamento è «Pagato» solo quando Stripe lo conferma al nostro server.

## Fonti

- Satispay su Stripe: https://docs.stripe.com/payments/satispay
- PayPal su Stripe: https://docs.stripe.com/payments/paypal
- Addebiti diretti con Connect: https://docs.stripe.com/connect/direct-charges
