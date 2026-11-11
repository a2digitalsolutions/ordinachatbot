#!/usr/bin/env python3
"""
Piano di progetto Ordinachatbot.

Legge project/tasks.yaml e:
  - rigenera docs/GANTT.md (diagramma Gantt Mermaid, visibile su GitHub)
  - rigenera docs/STATO.md (avanzamento, task in corso, prossimi task liberi)

Comandi:
  python3 scripts/piano.py                  rigenera Gantt e stato
  python3 scripts/piano.py stato            stampa il riepilogo dell'avanzamento
  python3 scripts/piano.py prossimo         elenca i task che si possono avviare ora
  python3 scripts/piano.py verifica ID      dice se ID è libero, già preso o bloccato
  python3 scripts/piano.py avvia ID NOME    assegna ID a NOME e lo mette in corso
  python3 scripts/piano.py chiudi ID        segna ID come fatto
  python3 scripts/piano.py blocca ID        segna ID come bloccato
  python3 scripts/piano.py libera ID        rimette ID tra i task da fare

Opzione --oggi AAAA-MM-GG per simulare un'altra data.
"""

from __future__ import annotations

import datetime as dt
import math
import re
import sys
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parent.parent
TASKS = ROOT / "project" / "tasks.yaml"
GANTT = ROOT / "docs" / "GANTT.md"
STATO = ROOT / "docs" / "STATO.md"

ULTIMA_FASE_V1 = 3  # le fasi successive sono "dopo il rilascio"
STATI = {"da_fare", "in_corso", "fatto", "bloccato"}
ETICHETTA = {
    "da_fare": "da fare",
    "in_corso": "in corso",
    "fatto": "fatto",
    "bloccato": "bloccato",
}


# --------------------------------------------------------------------------
# Lettura e validazione
# --------------------------------------------------------------------------

def to_date(v) -> dt.date | None:
    if v in (None, ""):
        return None
    if isinstance(v, dt.date):
        return v
    return dt.date.fromisoformat(str(v))


def carica(oggi: dt.date | None = None) -> dict:
    data = yaml.safe_load(TASKS.read_text(encoding="utf-8"))
    tasks = data["tasks"]
    ids = [t["id"] for t in tasks]
    doppi = {i for i in ids if ids.count(i) > 1}
    if doppi:
        sys.exit(f"Errore: id duplicati {sorted(doppi)}")
    per_id = {t["id"]: t for t in tasks}
    for t in tasks:
        t.setdefault("dipende_da", [])
        t.setdefault("stato", "da_fare")
        t.setdefault("assegnato", None)
        t.setdefault("esterno", False)
        if t["stato"] not in STATI:
            sys.exit(f"Errore: stato '{t['stato']}' non valido in {t['id']}")
        for d in t["dipende_da"]:
            if d not in per_id:
                sys.exit(f"Errore: {t['id']} dipende da {d}, che non esiste")
        t["inizio"] = to_date(t.get("inizio"))
        t["fine"] = to_date(t.get("fine"))
        t["non_prima_di"] = to_date(t.get("non_prima_di"))
        if not 0 <= impegno(t) <= t["giorni"]:
            sys.exit(f"Errore: in {t['id']} l'impegno deve stare tra 0 e i giorni del task")
    # controllo cicli
    visit: dict[str, int] = {}

    def dfs(i: str, stack: list[str]):
        if visit.get(i) == 1:
            sys.exit("Errore: dipendenze circolari " + " -> ".join(stack + [i]))
        if visit.get(i) == 2:
            return
        visit[i] = 1
        for d in per_id[i]["dipende_da"]:
            dfs(d, stack + [i])
        visit[i] = 2

    for i in ids:
        dfs(i, [])
    data["_per_id"] = per_id
    data["_oggi"] = oggi or dt.date.today()
    return data


# --------------------------------------------------------------------------
# Calendario lavorativo
# --------------------------------------------------------------------------

class Calendario:
    def __init__(self, festivi):
        self.festivi = {to_date(f) for f in (festivi or [])}

    def lavorativo(self, d: dt.date) -> bool:
        return d.weekday() < 5 and d not in self.festivi

    def primo_lavorativo(self, d: dt.date) -> dt.date:
        while not self.lavorativo(d):
            d += dt.timedelta(days=1)
        return d

    def successivo(self, d: dt.date) -> dt.date:
        return self.primo_lavorativo(d + dt.timedelta(days=1))

    def fine_dopo(self, inizio: dt.date, giorni: float) -> dt.date:
        """Ultimo giorno lavorativo di un task che inizia `inizio` e dura `giorni`
        (una mezza giornata occupa comunque un giorno di calendario)."""
        d = self.primo_lavorativo(inizio)
        for _ in range(max(math.ceil(giorni), 1) - 1):
            d = self.successivo(d)
        return d

    def carichi(self, inizio: dt.date, impegno: float) -> list[tuple[dt.date, float]]:
        """Giorni lavorativi occupati da `impegno` giorni di lavoro, con il carico di ciascuno
        (1 = una persona per tutto il giorno, 0.5 = mezza giornata)."""
        out, d, resto = [], self.primo_lavorativo(inizio), float(impegno)
        while resto > 1e-9:
            out.append((d, min(1.0, resto)))
            resto -= 1.0
            d = self.successivo(d)
        return out


def impegno(t: dict) -> float:
    """Lavoro effettivo del team: il resto della durata è attesa di terzi."""
    return float(t.get("impegno", t["giorni"]))


def fmt_giorni(g: float) -> str:
    return f"{g:g}"


# --------------------------------------------------------------------------
# Pianificazione
# --------------------------------------------------------------------------

def pianifica(data: dict, oggi: dt.date) -> dict[str, tuple[dt.date, dt.date]]:
    """Restituisce {id: (inizio, fine)} previsti, con al massimo N task in parallelo."""
    cal = Calendario(data["progetto"].get("festivi"))
    per_id = data["_per_id"]
    tasks = data["tasks"]
    capacita = int(data["progetto"].get("persone_in_parallelo", 2))
    avvio = to_date(data["progetto"]["inizio_previsto"])
    base = cal.primo_lavorativo(max(avvio, oggi))

    # priorità: lunghezza del percorso più lungo fino alla fine del progetto
    successori: dict[str, list[str]] = {t["id"]: [] for t in tasks}
    for t in tasks:
        for d in t["dipende_da"]:
            successori[d].append(t["id"])
    memo: dict[str, int] = {}

    def coda(i: str) -> int:
        if i not in memo:
            memo[i] = per_id[i]["giorni"] + max((coda(s) for s in successori[i]), default=0)
        return memo[i]

    piano: dict[str, tuple[dt.date, dt.date]] = {}
    occupazione: dict[dt.date, float] = {}

    def occupa(t: dict, ini: dt.date, da: dt.date | None = None):
        for d, carico in cal.carichi(ini, impegno(t)):
            if da is None or d >= da:
                occupazione[d] = occupazione.get(d, 0) + carico

    def libero(t: dict, ini: dt.date) -> bool:
        return all(occupazione.get(d, 0) + carico <= capacita + 1e-9
                   for d, carico in cal.carichi(ini, impegno(t)))

    # task già conclusi o in corso: date reali
    for t in tasks:
        if t["stato"] == "fatto":
            ini = t["inizio"] or t["fine"] or base
            fin = t["fine"] or ini
            piano[t["id"]] = (ini, fin)
        elif t["stato"] == "in_corso":
            ini = t["inizio"] or oggi
            fin = cal.fine_dopo(ini, t["giorni"])
            if fin < oggi:  # in ritardo: si assume che finisca oggi
                fin = cal.primo_lavorativo(oggi)
            piano[t["id"]] = (ini, fin)
            occupa(t, ini, da=base)

    # task da fare / bloccati: schedulazione a liste con capacità limitata
    restanti = [t for t in tasks if t["id"] not in piano]
    while restanti:
        pronti = [t for t in restanti if all(d in piano for d in t["dipende_da"])]
        # prima le fasi nell'ordine delle demo, poi i task con più lavoro a valle;
        # "anticipa: true" porta avanti i task con tempi esterni lunghi
        pronti.sort(key=lambda t: (0 if t.get("anticipa") else min(t["fase"], 2),
                                   -coda(t["id"]), tasks.index(t)))
        t = pronti[0]
        primo = max(base, t["non_prima_di"] or base)
        for d in t["dipende_da"]:
            primo = max(primo, cal.successivo(piano[d][1]))
        ini = cal.primo_lavorativo(primo)
        while not libero(t, ini):
            ini = cal.successivo(ini)
        fin = cal.fine_dopo(ini, t["giorni"])
        piano[t["id"]] = (ini, fin)
        occupa(t, ini)
        restanti.remove(t)
    return piano


def milestone_date(data, piano):
    out = []
    for m in data.get("milestone", []):
        fine = max(piano[i][1] for i in m["dopo"])
        out.append((m, fine))
    return out


# --------------------------------------------------------------------------
# Domande sullo stato
# --------------------------------------------------------------------------

def avviabili(data: dict) -> list[dict]:
    per_id = data["_per_id"]
    oggi = data["_oggi"]
    return [
        t for t in data["tasks"]
        if t["stato"] == "da_fare"
        and all(per_id[d]["stato"] == "fatto" for d in t["dipende_da"])
        and not (t["non_prima_di"] and t["non_prima_di"] > oggi)
    ]


def suggerimenti(data: dict, piano, escludi: str | None = None) -> list[dict]:
    lista = [t for t in avviabili(data) if t["id"] != escludi]
    # prima quelli che il piano prevede prima, poi i più lunghi a valle
    return sorted(lista, key=lambda t: (piano[t["id"]][0], data["tasks"].index(t)))


def verifica(data: dict, piano, tid: str) -> str:
    per_id = data["_per_id"]
    if tid not in per_id:
        return f"Il task {tid} non esiste."
    t = per_id[tid]
    righe = [f"{t['id']} — {t['titolo']}"]
    if t["stato"] == "fatto":
        righe.append(f"Già completato da {t.get('assegnato') or 'qualcuno'} il {t['fine']}.")
    elif t["stato"] == "in_corso":
        righe.append(f"Già in corso: lo sta facendo {t.get('assegnato') or 'qualcuno'} dal {t['inizio']}.")
    elif t["stato"] == "bloccato":
        righe.append("È segnato come bloccato. " + (t.get("note") or ""))
    else:
        mancanti = [d for d in t["dipende_da"] if per_id[d]["stato"] != "fatto"]
        if mancanti:
            dett = ", ".join(f"{d} ({ETICHETTA[per_id[d]['stato']]})" for d in mancanti)
            righe.append(f"Non si può ancora avviare: aspetta {dett}.")
        elif t["non_prima_di"] and t["non_prima_di"] > data["_oggi"]:
            righe.append(f"Non si può avviare prima del {t['non_prima_di'].strftime('%d/%m/%Y')}. "
                         "Se la data è cambiata, aggiornare non_prima_di.")
        else:
            righe.append("È libero e si può avviare.")
            return "\n".join(righe)
    sug = suggerimenti(data, piano, escludi=tid)
    if sug:
        righe.append("Task liberi da avviare al suo posto:")
        for s in sug[:3]:
            righe.append(f"  - {s['id']} — {s['titolo']}")
    else:
        righe.append("Al momento non ci sono altri task liberi.")
    return "\n".join(righe)


# --------------------------------------------------------------------------
# Modifica del file YAML conservando commenti e formattazione
# --------------------------------------------------------------------------

def imposta_campi(tid: str, campi: dict[str, str | None]):
    righe = TASKS.read_text(encoding="utf-8").split("\n")
    inizio = next((i for i, r in enumerate(righe) if r.strip() == f"- id: {tid}"), None)
    if inizio is None:
        sys.exit(f"Task {tid} non trovato")
    fine = inizio + 1
    while fine < len(righe) and not righe[fine].lstrip().startswith("- id:") \
            and not righe[fine].lstrip().startswith("# ----"):
        fine += 1
    while fine > inizio + 1 and righe[fine - 1].strip() == "":
        fine -= 1
    indent = re.match(r"(\s*)-", righe[inizio]).group(1) + "  "
    for chiave, valore in campi.items():
        testo = f"{indent}{chiave}: {valore}" if valore not in (None, "") else None
        pos = next((i for i in range(inizio + 1, fine)
                    if re.match(rf"\s*{chiave}:", righe[i])), None)
        if pos is not None:
            if testo is None:
                del righe[pos]
                fine -= 1
            else:
                righe[pos] = testo
        elif testo is not None:
            # inserisci dopo "stato:" se c'è, altrimenti in fondo al blocco
            dopo = next((i for i in range(inizio + 1, fine)
                         if re.match(r"\s*stato:", righe[i])), fine - 1)
            righe.insert(dopo + 1, testo)
            fine += 1
    TASKS.write_text("\n".join(righe), encoding="utf-8", newline="\n")


# --------------------------------------------------------------------------
# Generazione dei documenti
# --------------------------------------------------------------------------

def pulisci(s: str, n: int = 60) -> str:
    s = re.sub(r"[:;#]", " ", s)
    s = re.sub(r"\s+", " ", s).strip()
    return s if len(s) <= n else s[: n - 1].rstrip() + "…"


def genera_gantt(data, piano, oggi) -> str:
    fasi = data["fasi"]
    out = [
        "# Diagramma di Gantt — Ordinachatbot",
        "",
        f"_Aggiornato il {oggi.isoformat()} da `scripts/piano.py`. Non modificare a mano:"
        " cambia `project/tasks.yaml` e rigenera._",
        "",
        "Legenda: grigio = fatto, blu chiaro con bordo = in corso, rosso = bloccato,"
        " rombi = demo e rilascio. La linea verticale è la data di oggi.",
        "",
        "```mermaid",
        "gantt",
        "    title Ordinachatbot — piano di progetto",
        "    dateFormat YYYY-MM-DD",
        "    axisFormat %d/%m",
    ]
    per_fase: dict[int, list] = {}
    for t in data["tasks"]:
        per_fase.setdefault(t["fase"], []).append(t)
    mil = milestone_date(data, piano)
    for f in sorted(per_fase):
        out.append(f"    section Fase {f} {pulisci(fasi.get(f, ''), 40)}")
        for t in sorted(per_fase[f], key=lambda t: piano[t["id"]][0]):
            ini, fin = piano[t["id"]]
            tag = {"fatto": "done, ", "in_corso": "active, ", "bloccato": "crit, "}.get(t["stato"], "")
            nome = pulisci(f"{t['id']} {t['titolo']}")
            alias = t["id"].replace("-", "_").lower()
            fine_excl = fin + dt.timedelta(days=1)
            out.append(f"    {nome} :{tag}{alias}, {ini.isoformat()}, {fine_excl.isoformat()}")
        for m, d in mil:
            if any(data["_per_id"][i]["fase"] == f for i in m["dopo"]):
                out.append(f"    {pulisci(m['titolo'], 50)} :milestone, {m['id'].lower()}, {d.isoformat()}, 0d")
    out += ["```", ""]
    out.append("## Date previste")
    out.append("")
    out.append("| Task | Titolo | Stato | Chi | Inizio | Fine |")
    out.append("|---|---|---|---|---|---|")
    for t in sorted(data["tasks"], key=lambda t: (piano[t["id"]][0], t["id"])):
        ini, fin = piano[t["id"]]
        out.append(
            f"| {t['id']} | {t['titolo']} | {ETICHETTA[t['stato']]} | {t.get('assegnato') or ''} "
            f"| {ini.strftime('%d/%m/%Y')} | {fin.strftime('%d/%m/%Y')} |"
        )
    out.append("")
    return "\n".join(out)


def riepilogo(data, piano, oggi) -> str:
    tasks = data["tasks"]
    v1 = [t for t in tasks if t["fase"] <= ULTIMA_FASE_V1]  # le fasi dopo il rilascio non contano
    tot = sum(t["giorni"] for t in v1)
    fatti = sum(t["giorni"] for t in v1 if t["stato"] == "fatto")
    pct = round(100 * fatti / tot) if tot else 0
    ultima_fase = max(t["fase"] for t in tasks if t["fase"] <= ULTIMA_FASE_V1) if any(t["fase"] <= ULTIMA_FASE_V1 for t in tasks) else 99
    # le fasi dopo il rilascio non contano per la fine prevista e l'obiettivo
    fine_prev = max(piano[t["id"]][1] for t in tasks if t["fase"] <= ultima_fase)
    out = [
        "# Stato del progetto Ordinachatbot",
        "",
        f"_Aggiornato il {oggi.strftime('%d/%m/%Y')} da `scripts/piano.py`._",
        "",
        f"**Avanzamento versione 1: {pct}%** ({fmt_giorni(fatti)} giorni di lavoro completati"
        f" su {fmt_giorni(tot)})."
        f" Fine prevista: **{fine_prev.strftime('%d/%m/%Y')}**.",
        "",
        *righe_obiettivo(data, fine_prev),
        "## Per fase",
        "",
        "| Fase | Fatti | In corso | Da fare | Avanzamento |",
        "|---|---|---|---|---|",
    ]
    for f, nome in data["fasi"].items():
        ft = [t for t in tasks if t["fase"] == f]
        g = sum(t["giorni"] for t in ft)
        gf = sum(t["giorni"] for t in ft if t["stato"] == "fatto")
        out.append(
            f"| {f}. {nome} | {sum(t['stato']=='fatto' for t in ft)} "
            f"| {sum(t['stato']=='in_corso' for t in ft)} "
            f"| {sum(t['stato'] in ('da_fare','bloccato') for t in ft)} "
            f"| {round(100*gf/g) if g else 0}% |"
        )
    out += ["", "## Demo e rilascio", ""]
    for m, d in milestone_date(data, piano):
        fatta = all(data["_per_id"][i]["stato"] == "fatto" for i in m["dopo"])
        out.append(f"- {m['titolo']}: {'raggiunta' if fatta else 'prevista il ' + d.strftime('%d/%m/%Y')}")
    in_corso = [t for t in tasks if t["stato"] == "in_corso"]
    out += ["", "## In corso", ""]
    if in_corso:
        for t in in_corso:
            ini, fin = piano[t["id"]]
            ritardo = " — **in ritardo**" if cal_fine_teorica(data, t, oggi) < oggi else ""
            out.append(f"- {t['id']} — {t['titolo']} ({t.get('assegnato') or '?'}, dal {t['inizio']},"
                       f" fine prevista {fin.strftime('%d/%m')}){ritardo}")
    else:
        out.append("- Nessun task in corso.")
    bloccati = [t for t in tasks if t["stato"] == "bloccato"]
    if bloccati:
        out += ["", "## Bloccati", ""]
        for t in bloccati:
            out.append(f"- {t['id']} — {t['titolo']}" + (f": {t['note']}" if t.get("note") else ""))
    out += ["", "## Prossimi task liberi (si possono avviare subito)", ""]
    sug = suggerimenti(data, piano)
    if sug:
        for t in sug:
            ext = " — richiede account o credenziali esterne" if t.get("esterno") else ""
            out.append(f"- {t['id']} — {t['titolo']} ({fmt_giorni(t['giorni'])} g){ext}")
    else:
        out.append("- Nessuno: si aspetta la chiusura dei task in corso.")
    esterni = [t for t in tasks if t.get("esterno") and t["stato"] != "fatto"]
    if esterni:
        out += ["", "## Da preparare all'esterno (account, credenziali, decisioni)", ""]
        for t in esterni:
            out.append(f"- {t['id']} — {t['titolo']}, previsto dal {piano[t['id']][0].strftime('%d/%m/%Y')}")
    out.append("")
    return "\n".join(out)


def righe_obiettivo(data, fine_prev) -> list[str]:
    obiettivo = to_date(data["progetto"].get("scadenza_obiettivo"))
    if not obiettivo:
        return []
    cal = Calendario(data["progetto"].get("festivi"))
    if fine_prev <= obiettivo:
        return [f"Obiettivo: fine sviluppo entro il {obiettivo.strftime('%d/%m/%Y')} — **in linea**.", ""]
    d, ritardo = obiettivo, 0
    while d < fine_prev:
        d += dt.timedelta(days=1)
        if cal.lavorativo(d):
            ritardo += 1
    return [f"Obiettivo: fine sviluppo entro il {obiettivo.strftime('%d/%m/%Y')} — "
            f"**previsti {ritardo} giorni lavorativi di ritardo**.", ""]


def cal_fine_teorica(data, t, oggi: dt.date) -> dt.date:
    cal = Calendario(data["progetto"].get("festivi"))
    return cal.fine_dopo(t["inizio"] or oggi, t["giorni"])


def rigenera(oggi: dt.date):
    data = carica(oggi)
    piano = pianifica(data, oggi)
    GANTT.parent.mkdir(parents=True, exist_ok=True)
    GANTT.write_text(genera_gantt(data, piano, oggi), encoding="utf-8", newline="\n")
    STATO.write_text(riepilogo(data, piano, oggi), encoding="utf-8", newline="\n")
    return data, piano


# --------------------------------------------------------------------------
# Riga di comando
# --------------------------------------------------------------------------

def main(argv: list[str]):
    oggi = dt.date.today()
    if "--oggi" in argv:
        i = argv.index("--oggi")
        oggi = dt.date.fromisoformat(argv[i + 1])
        del argv[i: i + 2]
    cmd = argv[0] if argv else "rigenera"

    if cmd == "rigenera":
        rigenera(oggi)
        print("Aggiornati docs/GANTT.md e docs/STATO.md")
    elif cmd == "stato":
        data = carica(oggi)
        print(riepilogo(data, pianifica(data, oggi), oggi))
    elif cmd == "prossimo":
        data = carica(oggi)
        piano = pianifica(data, oggi)
        sug = suggerimenti(data, piano)
        if not sug:
            print("Nessun task libero al momento.")
        for t in sug:
            print(f"{t['id']} — {t['titolo']} ({fmt_giorni(t['giorni'])} g)")
    elif cmd == "verifica":
        data = carica(oggi)
        print(verifica(data, pianifica(data, oggi), argv[1]))
    elif cmd == "avvia":
        if len(argv) < 3:
            sys.exit("Uso: avvia ID NOME")
        tid, nome = argv[1], " ".join(argv[2:])
        data = carica(oggi)
        piano = pianifica(data, oggi)
        t = data["_per_id"].get(tid)
        if t is None or t not in avviabili(data):
            print(verifica(data, piano, tid))
            sys.exit(1)
        imposta_campi(tid, {"stato": "in_corso", "assegnato": nome, "inizio": oggi.isoformat()})
        rigenera(oggi)
        print(f"{tid} assegnato a {nome} e messo in corso.")
    elif cmd in ("chiudi", "blocca", "libera"):
        tid = argv[1]
        data = carica(oggi)
        if tid not in data["_per_id"]:
            sys.exit(f"Il task {tid} non esiste.")
        if cmd == "chiudi":
            campi = {"stato": "fatto", "fine": oggi.isoformat()}
            if not data["_per_id"][tid]["inizio"]:
                campi["inizio"] = oggi.isoformat()
        elif cmd == "blocca":
            campi = {"stato": "bloccato"}
        else:
            campi = {"stato": "da_fare", "assegnato": None, "inizio": None, "fine": None}
        imposta_campi(tid, campi)
        data, piano = rigenera(oggi)
        print(f"{tid}: {ETICHETTA[campi['stato']]}.")
        if cmd == "chiudi":
            sug = suggerimenti(data, piano)
            if sug:
                print("Prossimi task liberi:")
                for s in sug[:3]:
                    print(f"  - {s['id']} — {s['titolo']}")
    else:
        print(__doc__)
        sys.exit(1)


if __name__ == "__main__":
    main(sys.argv[1:])
