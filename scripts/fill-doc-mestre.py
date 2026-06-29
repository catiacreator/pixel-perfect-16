#!/usr/bin/env python3
"""
Preenche o Documento Mestre (Leveza no Digital) a partir do TEMPLATE .docx.

Substitui os placeholders {{CAMPO}} pelos valores de um ficheiro JSON, mantendo
o design intacto. Os placeholders do template estão inteiros num único run, por
isso basta substituição de texto (com escape de XML).

Uso:
  python3 scripts/fill-doc-mestre.py TEMPLATE.docx valores.json saida.docx
"""
import sys, json, zipfile, shutil, re, html, os, tempfile


def esc(v: str) -> str:
    # escape XML + apóstrofo curvo, e quebras de linha como <w:br/>
    v = html.escape(str(v), quote=False).replace("'", "&#x2019;") if False else html.escape(str(v), quote=False)
    return v.replace("\n", "</w:t><w:br/><w:t xml:space=\"preserve\">")


def fill(template: str, values: dict, out: str):
    # placeholders em falta ficam vazios (não deixar {{...}} no resultado)
    src = zipfile.ZipFile(template, "r")
    names = src.namelist()
    tmp = tempfile.mkdtemp()
    out_zip = zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED)
    used = set()
    for n in names:
        data = src.read(n)
        if n.endswith(".xml"):
            text = data.decode("utf-8", "ignore")
            def repl(m):
                key = m.group(1)
                used.add(key)
                return esc(values.get(key, ""))
            # 1) blocos com instrução: [ {{KEY}} — instrução ] -> valor
            text = re.sub(r"\[\s*\{\{([A-Z0-9_]+)\}\}[^\]]*\]", repl, text)
            # 2) placeholders simples: {{KEY}} -> valor
            text = re.sub(r"\{\{([A-Z0-9_]+)\}\}", repl, text)
            data = text.encode("utf-8")
        out_zip.writestr(n, data)
    out_zip.close()
    src.close()
    shutil.rmtree(tmp, ignore_errors=True)
    missing = [k for k in values if k not in used]
    return used, missing


if __name__ == "__main__":
    if len(sys.argv) != 4:
        print(__doc__)
        sys.exit(1)
    template, values_path, out = sys.argv[1], sys.argv[2], sys.argv[3]
    values = json.load(open(values_path, encoding="utf-8"))
    used, missing = fill(template, values, out)
    print(f"OK -> {out}")
    print(f"placeholders preenchidos: {len(used)}")
    if missing:
        print(f"AVISO: chaves no JSON não usadas no template: {missing}")
