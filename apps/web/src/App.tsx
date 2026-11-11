import { formattaData } from '@ordinachatbot/shared';

type Props = { oggi?: Date };

/** Pagina provvisoria: serve solo a verificare che la struttura funzioni. */
export function App({ oggi = new Date() }: Props) {
  return (
    <main>
      <h1>Ordinachatbot</h1>
      <p>Struttura del progetto pronta. Oggi è {formattaData(oggi)}.</p>
    </main>
  );
}
