/**
 * I 14 allergeni del Reg. UE 1169/2011, allegato II.
 * Regole complete in docs/allergeni.md: questo codice le applica, non le decide.
 */
export const ALLERGENI = [
  'glutine',
  'crostacei',
  'uova',
  'pesce',
  'arachidi',
  'soia',
  'latte',
  'frutta_a_guscio',
  'sedano',
  'senape',
  'sesamo',
  'solfiti',
  'lupini',
  'molluschi',
] as const;

export type Allergene = (typeof ALLERGENI)[number];

export const NOMI_ALLERGENI: Record<Allergene, string> = {
  glutine: 'Cereali contenenti glutine',
  crostacei: 'Crostacei',
  uova: 'Uova',
  pesce: 'Pesce',
  arachidi: 'Arachidi',
  soia: 'Soia',
  latte: 'Latte',
  frutta_a_guscio: 'Frutta a guscio',
  sedano: 'Sedano',
  senape: 'Senape',
  sesamo: 'Sesamo',
  solfiti: 'Anidride solforosa e solfiti',
  lupini: 'Lupini',
  molluschi: 'Molluschi',
};

/** Frasi fisse: non si riformulano e non si generano. */
export const FRASE_FISSA = 'Per allergie e intolleranze chiedi sempre al personale.';
export const FRASE_NON_DICHIARATI = 'Allergeni non dichiarati: chiedi al personale.';
export const MESSAGGIO_BLOCCO = 'Su questo non posso rispondere: chiama il cameriere.';
export const MESSAGGIO_SOLO_DICHIARATI = `Posso riportare solo gli allergeni dichiarati dal locale. ${FRASE_FISSA}`;
export const RIGA_COMANDA_ALLERGIA =
  "ATTENZIONE: IL CLIENTE SEGNALA UN'ALLERGIA — PARLARE COL TAVOLO";
