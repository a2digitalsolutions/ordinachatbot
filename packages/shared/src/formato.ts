/**
 * Formati italiani usati ovunque nel programma (regola di prodotto):
 * martedì 10 novembre 2026, 10/11/2026, 22:30, € 8,50.
 * Gli importi viaggiano sempre in centesimi interi, mai con la virgola.
 */

export const FUSO_ORARIO = 'Europe/Rome';
const LINGUA = 'it-IT';

const numeroConVirgola = new Intl.NumberFormat(LINGUA, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  // in italiano Intl non separa le migliaia sotto 10.000: noi le vogliamo sempre
  useGrouping: 'always',
});

const dataLunga = new Intl.DateTimeFormat(LINGUA, {
  timeZone: FUSO_ORARIO,
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

const dataBreve = new Intl.DateTimeFormat(LINGUA, {
  timeZone: FUSO_ORARIO,
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

const ora = new Intl.DateTimeFormat(LINGUA, {
  timeZone: FUSO_ORARIO,
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

/** 850 → «€ 8,50». Accetta solo centesimi interi. */
export function formattaPrezzo(centesimi: number): string {
  if (!Number.isInteger(centesimi)) {
    throw new RangeError('Il prezzo va espresso in centesimi interi');
  }
  const segno = centesimi < 0 ? '-' : '';
  return `${segno}€ ${numeroConVirgola.format(Math.abs(centesimi) / 100)}`;
}

/** «martedì 10 novembre 2026» */
export function formattaData(data: Date): string {
  return dataLunga.format(data);
}

/** «10/11/2026» */
export function formattaDataBreve(data: Date): string {
  return dataBreve.format(data);
}

/** «22:30» */
export function formattaOra(data: Date): string {
  return ora.format(data);
}

/** «10/11/2026 22:30» */
export function formattaDataOra(data: Date): string {
  return `${formattaDataBreve(data)} ${formattaOra(data)}`;
}
