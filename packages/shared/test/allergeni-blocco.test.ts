import { describe, expect, it } from 'vitest';
import {
  BLOCCO_PREDEFINITO,
  MESSAGGIO_BLOCCO,
  MESSAGGIO_SOLO_DICHIARATI,
  RIGA_COMANDA_ALLERGIA,
  contieneAffermazione,
  controllaMessaggio,
  controllaRisposta,
  normalizza,
  segnalazioneAllergia,
  verificaRispostaInsegnata,
} from '../src/index.js';

describe('impostazione del blocco', () => {
  it('per i locali nuovi è acceso su tutti e due', () => {
    expect(BLOCCO_PREDEFINITO).toBe('tutti_e_due');
  });

  it('il titolare sceglie cosa bloccare', () => {
    const celiaco = 'sono celiaco';
    const noci = 'sono allergico alle noci';
    expect(controllaMessaggio(celiaco, 'celiachia').bloccato).toBe(true);
    expect(controllaMessaggio(celiaco, 'allergeni').bloccato).toBe(false);
    expect(controllaMessaggio(noci, 'allergeni').bloccato).toBe(true);
    expect(controllaMessaggio(noci, 'celiachia').bloccato).toBe(false);
    expect(controllaMessaggio(celiaco, 'nessuno').bloccato).toBe(false);
    expect(controllaMessaggio(noci, 'nessuno').bloccato).toBe(false);
  });

  it('la risposta è sempre il messaggio fisso, con il motivo per il personale', () => {
    expect(controllaMessaggio('è senza glutine?', 'tutti_e_due')).toEqual({
      bloccato: true,
      motivo: 'celiachia',
      messaggio: MESSAGGIO_BLOCCO,
    });
    expect(controllaMessaggio('allergia alle uova', 'tutti_e_due')).toMatchObject({
      motivo: 'allergeni',
    });
  });

  it('riconosce una domanda spezzata su più messaggi', () => {
    expect(controllaMessaggio('glutine?', 'tutti_e_due', ['è senza']).bloccato).toBe(true);
    expect(controllaMessaggio('iaco', 'tutti_e_due', ['sono cel']).bloccato).toBe(true);
    expect(controllaMessaggio('una birra', 'tutti_e_due', ['una margherita']).bloccato).toBe(false);
  });
});

describe('normalizzazione', () => {
  it('toglie accenti, maiuscole e trucchi', () => {
    expect(normalizza('È SENZA Glutine?')).toBe('e senza glutine');
    expect(normalizza('glut1ne')).toBe('glutine');
    expect(normalizza('g l u t i n e')).toBe('glutine');
    expect(normalizza('g.l.u.t.i.n.e')).toBe('glutine');
    expect(normalizza('2 birre e 1 pizza')).toBe('2 birre e 1 pizza');
    expect(normalizza(`glu${String.fromCharCode(0x200b)}tine`)).toBe('glutine');
  });
});

describe('controllo della risposta prima che arrivi al cliente (prova 8)', () => {
  const affermazioni = [
    'La margherita non contiene glutine.',
    'Tranquillo, il tiramisù è sicuro per i celiaci.',
    'Questo piatto è adatto a chi è allergico alle noci.',
    'Sì, puoi mangiarlo.',
    'È senza lattosio.',
    'Il piatto è privo di latte.',
    'Non ci sono uova nella carbonara.',
    'It is gluten free.',
    'La tagliata contiene solo latte, nessun altro allergene.',
  ];

  it.each(affermazioni)('con il blocco acceso sostituisce: %s', (risposta) => {
    const esito = controllaRisposta(risposta, 'tutti_e_due');
    expect(esito.sostituita).toBe(true);
    expect(esito.testo).toBe(MESSAGGIO_BLOCCO);
  });

  it.each(affermazioni)('anche con il blocco spento non lascia passare: %s', (risposta) => {
    const esito = controllaRisposta(risposta, 'nessuno');
    expect(esito.sostituita).toBe(true);
    expect(esito.testo).toBe(MESSAGGIO_SOLO_DICHIARATI);
  });

  const normali = [
    'Ho aggiunto una margherita al carrello del tavolo.',
    'Ecco i primi: carbonara € 9,00, lasagna € 10,00.',
    'Vuoi confermare per tutto il tavolo?',
    'Certo! Aggiungo una birra media.',
    'La pizza con le noci costa € 11,00.',
    'Hamburger senza cipolla: fatto.',
  ];

  it.each(normali)('lascia passare: %s', (risposta) => {
    expect(controllaRisposta(risposta, 'tutti_e_due')).toEqual({
      testo: risposta,
      sostituita: false,
    });
    expect(contieneAffermazione(risposta)).toBe(false);
  });
});

describe('risposte insegnate dal gestore (prova 9)', () => {
  it.each([
    'Tutte le nostre pizze sono senza glutine',
    'Il tiramisù non contiene uova',
    'Per i celiaci consigliamo la tagliata',
    'I fritti sono sicuri per chi è allergico al pesce',
    'Abbiamo anche il latte senza lattosio',
  ])('rifiuta: %s', (risposta) => {
    const esito = verificaRispostaInsegnata(risposta);
    expect(esito.accettata).toBe(false);
    if (!esito.accettata) expect(esito.spiegazione).toMatch(/schede degli ingredienti/);
  });

  it.each([
    'Il parcheggio è dietro il locale',
    'Siamo aperti dal martedì alla domenica, dalle 19:00 alle 24:00',
    'Il coperto costa € 2,00 a persona',
    'Sì, abbiamo i seggioloni',
  ])('accetta: %s', (risposta) => {
    expect(verificaRispostaInsegnata(risposta)).toEqual({ accettata: true });
  });
});

describe("nota d'ordine con allergia (prova 10)", () => {
  it.each([
    'senza cipolla, sono allergico alle noci',
    'per il bimbo: celiaco!',
    'attenzione intolleranza al lattosio',
    'non può mangiare uova',
  ])('riga di attenzione sulla comanda: %s', (nota) => {
    expect(segnalazioneAllergia(nota)).toEqual({
      segnalata: true,
      rigaComanda: RIGA_COMANDA_ALLERGIA,
    });
  });

  it('vale anche se il titolare ha spento il blocco: la segnalazione non dipende dal blocco', () => {
    expect(controllaMessaggio('sono celiaco', 'nessuno').bloccato).toBe(false);
    expect(segnalazioneAllergia('sono celiaco').segnalata).toBe(true);
  });

  it.each(['ben cotta', 'senza cipolla', 'portare insieme ai primi'])(
    'nessuna riga per: %s',
    (nota) => {
      expect(segnalazioneAllergia(nota)).toEqual({ segnalata: false });
    },
  );
});
