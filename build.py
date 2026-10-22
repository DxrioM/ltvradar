import os

BASE = os.path.dirname(os.path.abspath(__file__))
OUTDIRS = [os.path.join(BASE, "outputs"), os.path.join(BASE, "docs")]

with open(os.path.join(BASE, "index_template.html")) as f:
    html = f.read()
with open(os.path.join(BASE, "app.js")) as f:
    js = f.read()

html = html.replace("__JS_BODY__", js)
html = html.replace("__HTML_LANG__", "es")
html = html.replace('__I18N_PLACEHOLDER__', '{}')  # unused now (i18n lives inside app.js), kept harmless

for outdir in OUTDIRS:
    os.makedirs(outdir, exist_ok=True)
    out_path = os.path.join(outdir, "index.html")
    with open(out_path, "w") as f:
        f.write(html)
    chart_dst = os.path.join(outdir, "chart.umd.min.js")
    with open(os.path.join(BASE, "chart.umd.min.js"), "rb") as fsrc, open(chart_dst, "wb") as fdst:
        fdst.write(fsrc.read())
    print("Generado:", out_path)
