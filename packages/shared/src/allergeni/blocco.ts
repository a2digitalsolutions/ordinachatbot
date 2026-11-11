import { MESSAGGIO_BLOCCO, MESSAGGIO_SOLO_DICHIARATI, RIGA_COMANDA_ALLERGIA } from './elenco.js';
import { contieneAffermazione, riconosci } from './riconoscimento.js';

/** Scelta del titolare: su cosa il chatbot rimanda al cameriere. */
export type ImpostazioneBlocco = 'allergeni' | 'celiachia' | 'tutti_e_due' | 'nessuno';

/** Per i locali nuovi il blocco è acceso su tutti e due gli argomenti. */
export const BLOCCO_PREDEFINITO: ImpostazioneBlocco = 'tutti_e_due';

export type EsitoBlocco =
  | { bloccato: false }
  | {
      bloccato: true;
      motivo: 'allergeni' | 'celiachia';
      /** messaggio fisso da mostrare, insieme al pulsante «Chiama il cameriere» */
      messaggio: string;
    };

function argomentoBloccato(
  testo: string,
  impostazione: ImpostazioneBlocco,
): 'allergeni' | 'celiachia' | undefined {
  if (impostazione === 'nessuno') return undefined;
  const a = riconosci(testo);
  if (a.celiachia && impostazione !== 'allergeni') return 'celiachia';
  if (a.allergeni && impostazione !== 'celiachia') return 'allergeni';
  return undefined;
}

/**
 * Primo controllo: il messaggio del cliente, prima di qualsiasi altra cosa.
 * `precedenti` sono gli ultimi messaggi dello stesso cliente: servono a
 * riconoscere una domanda spezzata su più messaggi.
 */
export function controllaMessaggio(
  testo: string,
  impostazione: ImpostazioneBlocco,
  precedenti: readonly string[] = [],
): EsitoBlocco {
  const ultimi = precedenti.slice(-3);
  const candidati = [testo, [...ultimi, testo].join(' '), [...ultimi, testo].join('')];
  for (const candidato of candidati) {
    const motivo = argomentoBloccato(candidato, impostazione);
    if (motivo) return { bloccato: true, motivo, messaggio: MESSAGGIO_BLOCCO };
  }
  return { bloccato: false };
}

/**
 * Secondo controllo: la risposta, prima che arrivi al cliente.
 * - Argomento bloccato → messaggio fisso.
 * - In ogni caso, mai affermazioni («non contiene», «sicuro», «adatto»…):
 *   vengono sostituite, anche con il blocco spento.
 */
export function controllaRisposta(
  risposta: string,
  impostazione: ImpostazioneBlocco,
): { testo: string; sostituita: boolean; motivo?: 'allergeni' | 'celiachia' | 'affermazione' } {
  const motivo = argomentoBloccato(risposta, impostazione);
  if (motivo) return { testo: MESSAGGIO_BLOCCO, sostituita: true, motivo };
  if (contieneAffermazione(risposta)) {
    return {
      testo: impostazione === 'nessuno' ? MESSAGGIO_SOLO_DICHIARATI : MESSAGGIO_BLOCCO,
      sostituita: true,
      motivo: 'affermazione',
    };
  }
  return { testo: risposta, sostituita: false };
}

/** Le risposte insegnate dal gestore non possono parlare di allergeni o glutine. */
export function verificaRispostaInsegnata(
  risposta: string,
): { accettata: true } | { accettata: false; spiegazione: string } {
  const a = riconosci(risposta);
  if (a.allergeni || a.celiachia || contieneAffermazione(risposta)) {
    return {
      accettata: false,
      spiegazione:
        'Questa risposta parla di allergeni, intolleranze o glutine. Per sicurezza il chatbot ' +
        'non può impararla: queste informazioni si inseriscono solo nelle schede degli ingredienti.',
    };
  }
  return { accettata: true };
}

/**
 * Note dell'ordine e messaggi: se il cliente segnala un'allergia o la
 * celiachia, la comanda esce con la riga di attenzione e parte l'avviso al
 * personale. Vale sempre, qualunque sia l'impostazione del blocco.
 */
export function segnalazioneAllergia(
  testo: string,
): { segnalata: false } | { segnalata: true; rigaComanda: string } {
  const a = riconosci(testo);
  return a.allergeni || a.celiachia
    ? { segnalata: true, rigaComanda: RIGA_COMANDA_ALLERGIA }
    : { segnalata: false };
}
