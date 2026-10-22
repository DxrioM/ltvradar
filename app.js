/* ============================================================
   LTV Radar - app.js
   Motor de calculo (CLV rapido + analisis profundo CSV) + i18n.
   Todo corre en el navegador del visitante. Nada se sube a un
   servidor.
   ============================================================ */

const I18N = {
  es: {
    page_title: "LTV Radar — Calculadora de Valor de Cliente y Cross-Sell",
    kicker: "RETENCIÓN · CROSS-SELL · E-COMMERCE",
    hero_sub: "Calcula tu Customer Lifetime Value en 30 segundos, o sube tus datos de ventas para un diagnóstico completo de retención y oportunidades de cross-sell.",
    privacy_badge: "Tus datos nunca salen de tu navegador — todo el cálculo ocurre localmente",
    tab_quick: "⚡ Diagnóstico rápido", tab_deep: "📊 Análisis profundo (CSV)",
    quick_form_title: "Tus números",
    f_aov: "Ticket promedio (valor de pedido)", f_aov_help: "En tu moneda local, antes de descuentos",
    f_freq: "Compras promedio por cliente, al año",
    f_margin: "Margen bruto (%)", f_margin_help: "Si no lo sabes con precisión, usa 30-40% como estimado típico de retail",
    f_retention: "¿De cada 100 clientes este año, cuántos siguen comprándote el año siguiente? (%)",
    f_cac: "Costo de adquisición por cliente (opcional)", f_cac_help: "Lo que gastas en marketing/ads dividido entre clientes nuevos",
    f_submit: "Calcular mi CLV",
    deep_upload_title: "Sube tu historial de ventas",
    deep_upload_help: "CSV con una fila por pedido: ID de cliente, fecha, monto — y opcionalmente producto, para encontrar oportunidades de cross-sell.",
    dz_title: "Arrastra tu CSV aquí, o haz clic para elegir",
    dz_sub: "Ningún archivo subido todavía",
    cta_title: "¿Quieres este diagnóstico aplicado a tu negocio?",
    cta_sub: "Te ayudo a encontrar exactamente dónde está la fuga de clientes y qué cross-sell mueve más la aguja — con tus datos reales.",
    cta_btn: "Hablemos en LinkedIn →",
    footer_p1: "LTV Radar es una herramienta gratuita y de código abierto construida por Dario Molano. CLV = Ticket promedio × Compras/año × Margen × Vida útil esperada (1 / tasa de abandono).",
    footer_p2: "El ratio CLV:CAC de referencia (3:1 saludable) es una regla general citada en la industria del marketing/SaaS, no un promedio medido de ningún dataset.",
    err_fill_all: "Completa al menos ticket promedio, compras al año, margen y retención.",
    err_duplicate_map: "Elegiste la misma columna para más de un campo. Revisa el mapeo — cada campo requerido debe apuntar a una columna distinta.",
    result_label: "CLV estimado por cliente",
    result_sub_tpl: "Vida útil esperada: {lifespan} años (con {retention}% de retención anual)",
    ratio_clv: "CLV", ratio_cac: "CAC", ratio_ratio: "Ratio CLV:CAC",
    verdict_good: "Saludable: por cada peso que inviertes en adquirir un cliente, recuperas {ratio}x en valor de por vida. La regla general de la industria considera saludable un ratio de 3:1 o más.",
    verdict_warn: "Ajustado: tu ratio CLV:CAC está por debajo del 3:1 que suele citarse como saludable. Vale la pena revisar retención o costo de adquisición.",
    verdict_bad: "Alerta: estás gastando en adquirir clientes casi tanto (o más) de lo que valen a largo plazo. Esto no es sostenible sin mejorar retención o bajar CAC.",
    verdict_no_cac: "Agrega tu costo de adquisición (CAC) para ver si tu inversión en marketing es sostenible.",
    dz_parsing: "Leyendo archivo...",
    dz_error_parse: "No pude leer ese CSV. Revisa que sea un archivo .csv válido con encabezados.",
    dz_error_empty: "El archivo no tiene filas de datos.",
    err_too_few_rows: "Encontré muy pocos pedidos válidos (menos de 5) después de revisar las columnas mapeadas. Verifica que elegiste las columnas correctas, o sube un historial con más pedidos.",
    map_title: "Confirma qué columna es cuál",
    map_customer: "ID de cliente", map_date: "Fecha del pedido", map_amount: "Monto del pedido",
    map_product: "Producto (opcional, para cross-sell)",
    map_none: "— no tengo esta columna —",
    map_submit: "Analizar",
    kpi_orders: "Pedidos analizados", kpi_customers: "Clientes únicos", kpi_aov: "Ticket promedio real",
    kpi_retention: "Tasa de recompra observada (proxy de retención anual)",
    deep_clv_title: "CLV real calculado de tus datos",
    seg_title: "Segmentos de clientes (RFM + KMeans)",
    seg_champions: "Campeones", seg_loyal: "Leales", seg_atrisk: "En riesgo de fuga", seg_new: "Nuevos / ocasionales",
    seg_customers: "clientes", seg_avg_spend: "gasto promedio", seg_avg_orders: "pedidos promedio", seg_recency: "última compra hace",
    seg_days: "días",
    low_repeat_note: "Nota: la mayoría de tus clientes compró una sola vez en este período. Los segmentos de abajo reflejan sobre todo diferencias en cuándo y cuánto fue esa primera compra, no lealtad repetida — útil igual para ver dónde está la mayor fuga de clientes.",
    rules_title: "Qué se compra junto (reglas de asociación)",
    rules_none: "No se detectaron suficientes compras repetidas de 2+ productos para generar reglas confiables. Esto es normal con pocos datos — a más historial, mejores reglas.",
    th_if: "Si compra…", th_then: "…también suele comprar", th_lift: "Lift",
    no_product_col: "No mapeaste una columna de producto, así que esta sección de cross-sell no está disponible. Puedes volver a subir el CSV incluyendo esa columna.",
  },
  en: {
    page_title: "LTV Radar — Customer Lifetime Value & Cross-Sell Calculator",
    kicker: "RETENTION · CROSS-SELL · E-COMMERCE",
    hero_sub: "Calculate your Customer Lifetime Value in 30 seconds, or upload your sales data for a full retention and cross-sell diagnostic.",
    privacy_badge: "Your data never leaves your browser — all the math runs locally",
    tab_quick: "⚡ Quick diagnostic", tab_deep: "📊 Deep analysis (CSV)",
    quick_form_title: "Your numbers",
    f_aov: "Average order value", f_aov_help: "In your local currency, before discounts",
    f_freq: "Average purchases per customer, per year",
    f_margin: "Gross margin (%)", f_margin_help: "If you don't know it precisely, 30-40% is a typical retail estimate",
    f_retention: "Of 100 customers this year, how many still buy from you next year? (%)",
    f_cac: "Customer acquisition cost (optional)", f_cac_help: "Marketing/ads spend divided by new customers",
    f_submit: "Calculate my CLV",
    deep_upload_title: "Upload your sales history",
    deep_upload_help: "CSV with one row per order: customer ID, date, amount — and optionally product, to find cross-sell opportunities.",
    dz_title: "Drag your CSV here, or click to choose",
    dz_sub: "No file uploaded yet",
    cta_title: "Want this diagnostic applied to your business?",
    cta_sub: "I'll help you find exactly where customers are leaking and which cross-sell moves the needle most — with your real data.",
    cta_btn: "Let's talk on LinkedIn →",
    footer_p1: "LTV Radar is a free, open-source tool built by Dario Molano. CLV = Average order value × Purchases/year × Margin × Expected lifespan (1 / churn rate).",
    footer_p2: "The reference CLV:CAC ratio (3:1 healthy) is a commonly cited marketing/SaaS industry rule of thumb, not a measured average from any dataset.",
    err_fill_all: "Fill in at least average order value, purchases per year, margin and retention.",
    err_duplicate_map: "You picked the same column for more than one field. Check the mapping — each required field needs its own distinct column.",
    result_label: "Estimated CLV per customer",
    result_sub_tpl: "Expected lifespan: {lifespan} years (at {retention}% annual retention)",
    ratio_clv: "CLV", ratio_cac: "CAC", ratio_ratio: "CLV:CAC ratio",
    verdict_good: "Healthy: for every unit you spend acquiring a customer, you recover {ratio}x in lifetime value. The commonly cited industry rule considers 3:1 or higher healthy.",
    verdict_warn: "Tight: your CLV:CAC ratio is below the 3:1 often cited as healthy. Worth reviewing retention or acquisition cost.",
    verdict_bad: "Warning: you're spending almost as much (or more) acquiring customers as they're worth long-term. Not sustainable without improving retention or lowering CAC.",
    verdict_no_cac: "Add your acquisition cost (CAC) to see whether your marketing spend is sustainable.",
    dz_parsing: "Reading file...",
    dz_error_parse: "Couldn't read that CSV. Check that it's a valid .csv file with headers.",
    dz_error_empty: "The file has no data rows.",
    err_too_few_rows: "Found very few valid orders (fewer than 5) after checking the mapped columns. Double-check you picked the right columns, or upload a history with more orders.",
    map_title: "Confirm which column is which",
    map_customer: "Customer ID", map_date: "Order date", map_amount: "Order amount",
    map_product: "Product (optional, for cross-sell)",
    map_none: "— I don't have this column —",
    map_submit: "Analyze",
    kpi_orders: "Orders analyzed", kpi_customers: "Unique customers", kpi_aov: "Real average order value",
    kpi_retention: "Observed repeat-purchase rate (annual retention proxy)",
    deep_clv_title: "Real CLV computed from your data",
    seg_title: "Customer segments (RFM + KMeans)",
    seg_champions: "Champions", seg_loyal: "Loyal", seg_atrisk: "At risk of churn", seg_new: "New / occasional",
    seg_customers: "customers", seg_avg_spend: "avg. spend", seg_avg_orders: "avg. orders", seg_recency: "last purchase",
    seg_days: "days ago",
    low_repeat_note: "Note: most of your customers bought only once in this period. The segments below mainly reflect differences in the timing and size of that first purchase, not repeat loyalty — still useful for spotting where customer leakage is biggest.",
    rules_title: "What sells together (association rules)",
    rules_none: "Not enough repeated 2+ product purchases to generate reliable rules. This is normal with limited data — more history means better rules.",
    th_if: "If they buy…", th_then: "…they also tend to buy", th_lift: "Lift",
    no_product_col: "You didn't map a product column, so this cross-sell section isn't available. You can re-upload the CSV including that column.",
  }
};

let LANG = 'es';

function t(key){ return I18N[LANG][key] || key; }

function applyI18n(){
  document.title = t('page_title');
  document.documentElement.lang = LANG;
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const key = el.getAttribute('data-i18n');
    if(I18N[LANG][key] !== undefined) el.textContent = I18N[LANG][key];
  });
  const heroTitle = document.querySelector('[data-i18n-html]');
  if(heroTitle){
    heroTitle.innerHTML = LANG === 'es'
      ? '¿Cuánto <span class="accent">vale realmente</span> un cliente tuyo?'
      : 'How much is a customer of yours <span class="accent">really worth</span>?';
  }
  document.getElementById('btn-es').classList.toggle('active', LANG==='es');
  document.getElementById('btn-en').classList.toggle('active', LANG==='en');
}

function setLang(l){
  LANG = l;
  applyI18n();
  // Re-render anything already generated dynamically (not tagged [data-i18n]),
  // so a language switch after running an analysis actually translates the
  // results instead of leaving them frozen in whichever language was active
  // at render time.
  if(PARSED_CSV && document.getElementById('map-customer')){
    renderMapping(PARSED_CSV.headers, currentMapping());
  }
  if(HAS_QUICK_RESULT) calcQuick();
  if(HAS_DEEP_RESULT) runDeepAnalysis();
}

function currentMapping(){
  const c = document.getElementById('map-customer');
  if(!c) return null;
  return {
    customer: document.getElementById('map-customer').value,
    date: document.getElementById('map-date').value,
    amount: document.getElementById('map-amount').value,
    product: document.getElementById('map-product').value,
  };
}

function showTab(tab){
  document.getElementById('tabbtn-quick').classList.toggle('active', tab==='quick');
  document.getElementById('tabbtn-deep').classList.toggle('active', tab==='deep');
  document.getElementById('panel-quick').classList.toggle('active', tab==='quick');
  document.getElementById('panel-deep').classList.toggle('active', tab==='deep');
}

/* ============================================================
   QUICK MODE
   ============================================================ */

function computeCLV(aov, purchasesPerYear, marginPct, retentionPct, maxLifespanCap){
  const churn = Math.max(1 - retentionPct, 0.01);
  const lifespan = Math.min(1 / churn, maxLifespanCap || 10);
  const clv = aov * purchasesPerYear * marginPct * lifespan;
  return { churn, lifespan, clv };
}

function fmtMoney(v){
  return Math.round(v).toLocaleString(LANG === 'es' ? 'es-CO' : 'en-US');
}

let HAS_QUICK_RESULT = false;
let HAS_DEEP_RESULT = false;

function calcQuick(){
  HAS_QUICK_RESULT = true;
  const aov = parseFloat(document.getElementById('q-aov').value);
  const freq = parseFloat(document.getElementById('q-freq').value);
  const marginInput = parseFloat(document.getElementById('q-margin').value);
  const retentionInput = parseFloat(document.getElementById('q-retention').value);
  const cacInput = document.getElementById('q-cac').value;
  const cac = cacInput ? parseFloat(cacInput) : null;

  const wrap = document.getElementById('quick-result-wrap');

  if(!aov || !freq || isNaN(marginInput) || isNaN(retentionInput)){
    wrap.innerHTML = `<div class="error-box">${t('err_fill_all')}</div>`;
    return;
  }

  const margin = marginInput / 100;
  const retention = Math.min(Math.max(retentionInput / 100, 0), 0.99);

  const { churn, lifespan, clv } = computeCLV(aov, freq, margin, retention, 10);

  let ratioHtml = '';
  let verdictHtml = '';
  if(cac && cac > 0){
    const ratio = clv / cac;
    let verdictClass = 'warn', verdictText = t('verdict_warn');
    if(ratio >= 3){ verdictClass = 'good'; verdictText = t('verdict_good').replace('{ratio}', ratio.toFixed(1)); }
    else if(ratio < 1){ verdictClass = 'bad'; verdictText = t('verdict_bad'); }
    ratioHtml = `
      <div class="ratio-row">
        <div class="ratio-chip"><div class="n">${fmtMoney(clv)}</div><div class="l">${t('ratio_clv')}</div></div>
        <div class="ratio-chip"><div class="n">${fmtMoney(cac)}</div><div class="l">${t('ratio_cac')}</div></div>
        <div class="ratio-chip"><div class="n">${ratio.toFixed(1)}x</div><div class="l">${t('ratio_ratio')}</div></div>
      </div>`;
    verdictHtml = `<div class="verdict ${verdictClass}">${verdictText}</div>`;
  } else {
    verdictHtml = `<div class="verdict warn">${t('verdict_no_cac')}</div>`;
  }

  const subText = t('result_sub_tpl')
    .replace('{lifespan}', lifespan.toFixed(1))
    .replace('{retention}', Math.round(retention*100));

  wrap.innerHTML = `
    <div class="result-card">
      <div class="label">${t('result_label')}</div>
      <div class="value">${fmtMoney(clv)}</div>
      <div class="sub">${subText}</div>
      ${ratioHtml}
      ${verdictHtml}
    </div>`;
}

/* ============================================================
   CSV PARSING (hand-rolled, handles quoted fields)
   ============================================================ */

function parseCSV(text){
  const rows = [];
  let row = [], field = '', inQuotes = false;
  for(let i = 0; i < text.length; i++){
    const c = text[i];
    if(inQuotes){
      if(c === '"'){
        if(text[i+1] === '"'){ field += '"'; i++; }
        else { inQuotes = false; }
      } else {
        field += c;
      }
    } else {
      if(c === '"'){ inQuotes = true; }
      else if(c === ','){ row.push(field); field = ''; }
      else if(c === '\n'){ row.push(field); rows.push(row); row = []; field = ''; }
      else if(c === '\r'){ /* skip */ }
      else { field += c; }
    }
  }
  if(field.length > 0 || row.length > 0){ row.push(field); rows.push(row); }
  const filtered = rows.filter(r => r.length > 1 || (r.length===1 && r[0].trim() !== ''));
  if(filtered.length < 2) return null;
  const headers = filtered[0].map(h => h.trim());
  const data = filtered.slice(1).map(r => {
    const obj = {};
    headers.forEach((h, i) => { obj[h] = (r[i] !== undefined ? r[i].trim() : ''); });
    return obj;
  });
  return { headers, data };
}

let PARSED_CSV = null;

function setupDropzone(){
  const dz = document.getElementById('dropzone');
  const input = document.getElementById('csv-input');
  dz.addEventListener('click', ()=> input.click());
  dz.addEventListener('dragover', (e)=>{ e.preventDefault(); dz.classList.add('drag'); });
  dz.addEventListener('dragleave', ()=> dz.classList.remove('drag'));
  dz.addEventListener('drop', (e)=>{
    e.preventDefault(); dz.classList.remove('drag');
    if(e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
  });
  input.addEventListener('change', (e)=>{
    if(e.target.files.length) handleFile(e.target.files[0]);
  });
}

function handleFile(file){
  const errBox = document.getElementById('deep-error');
  errBox.innerHTML = '';
  const dzFilename = document.getElementById('dz-filename');
  dzFilename.textContent = file.name;
  dzFilename.removeAttribute('data-i18n'); // stop applyI18n() from overwriting the real filename with the placeholder text on a language switch
  const reader = new FileReader();
  reader.onload = (e)=>{
    const parsed = parseCSV(e.target.result);
    if(!parsed){
      errBox.innerHTML = `<div class="error-box">${t('dz_error_parse')}</div>`;
      return;
    }
    PARSED_CSV = parsed;
    renderMapping(parsed.headers);
  };
  reader.onerror = ()=>{
    errBox.innerHTML = `<div class="error-box">${t('dz_error_parse')}</div>`;
  };
  reader.readAsText(file);
}

function guessColumn(headers, candidates){
  const lower = headers.map(h => h.toLowerCase());
  for(const cand of candidates){
    const idx = lower.findIndex(h => h.includes(cand));
    if(idx >= 0) return headers[idx];
  }
  return '';
}

function renderMapping(headers, preserve){
  const wrap = document.getElementById('mapping-wrap');
  wrap.style.display = 'block';

  const guessCustomer = (preserve && preserve.customer) || guessColumn(headers, ['customer', 'cliente', 'user', 'usuario', 'id_cliente']);
  const guessDate = (preserve && preserve.date) || guessColumn(headers, ['date', 'fecha', 'time']);
  const guessAmount = (preserve && preserve.amount) || guessColumn(headers, ['amount', 'monto', 'total', 'price', 'precio', 'revenue', 'venta']);
  const guessProduct = (preserve && preserve.product) || guessColumn(headers, ['product', 'producto', 'item', 'sku']);

  function optionsHtml(selected, includeNone){
    let opts = '';
    if(includeNone) opts += `<option value="">${t('map_none')}</option>`;
    headers.forEach(h=>{
      opts += `<option value="${h}" ${h===selected?'selected':''}>${h}</option>`;
    });
    return opts;
  }

  wrap.innerHTML = `
    <h3>${t('map_title')}</h3>
    <div class="mapping-row">
      <div class="req-label">${t('map_customer')}</div>
      <select id="map-customer">${optionsHtml(guessCustomer, false)}</select>
    </div>
    <div class="mapping-row">
      <div class="req-label">${t('map_date')}</div>
      <select id="map-date">${optionsHtml(guessDate, false)}</select>
    </div>
    <div class="mapping-row">
      <div class="req-label">${t('map_amount')}</div>
      <select id="map-amount">${optionsHtml(guessAmount, false)}</select>
    </div>
    <div class="mapping-row">
      <div class="req-label">${t('map_product')}</div>
      <select id="map-product">${optionsHtml(guessProduct, true)}</select>
    </div>
    <button class="btn-primary" onclick="runDeepAnalysis()">${t('map_submit')}</button>
  `;
}

/* ============================================================
   DEEP ANALYSIS: cohort retention, RFM, KMeans, Apriori-lite
   ============================================================ */

function runDeepAnalysis(){
  HAS_DEEP_RESULT = true;
  const errBox = document.getElementById('deep-error');
  errBox.innerHTML = '';
  const custCol = document.getElementById('map-customer').value;
  const dateCol = document.getElementById('map-date').value;
  const amountCol = document.getElementById('map-amount').value;
  const productCol = document.getElementById('map-product').value;

  if(!custCol || !dateCol || !amountCol){
    errBox.innerHTML = `<div class="error-box">${t('err_fill_all')}</div>`;
    return;
  }
  const requiredCols = [custCol, dateCol, amountCol];
  if(new Set(requiredCols).size !== requiredCols.length){
    errBox.innerHTML = `<div class="error-box">${t('err_duplicate_map')}</div>`;
    return;
  }

  const rawRows = PARSED_CSV.data.map(r=>{
    const amount = parseFloat(String(r[amountCol]).replace(/[^0-9.\-]/g, ''));
    const date = new Date(r[dateCol]);
    return {
      customer: r[custCol],
      date: date,
      amount: isNaN(amount) ? null : amount,
      product: productCol ? r[productCol] : null,
    };
  }).filter(r => r.customer && r.date instanceof Date && !isNaN(r.date) && r.amount !== null);

  if(rawRows.length < 5){
    errBox.innerHTML = `<div class="error-box">${t('err_too_few_rows')}</div>`;
    return;
  }

  const result = analyzeTransactions(rawRows);
  renderDeepResults(result, !!productCol);
}

function analyzeTransactions(rows){
  const byCustomer = {};
  rows.forEach(r=>{
    if(!byCustomer[r.customer]) byCustomer[r.customer] = [];
    byCustomer[r.customer].push(r);
  });

  const customers = Object.keys(byCustomer);
  const maxDate = new Date(Math.max(...rows.map(r=>r.date.getTime())));

  // Per-customer RFM
  const rfm = customers.map(c=>{
    const orders = byCustomer[c].slice().sort((a,b)=>a.date-b.date);
    const totalSpend = orders.reduce((s,o)=>s+o.amount,0);
    const lastDate = orders[orders.length-1].date;
    const recencyDays = Math.round((maxDate - lastDate) / 86400000);
    return {
      customer: c,
      recencyDays,
      frequency: orders.length,
      monetary: totalSpend,
      avgOrder: totalSpend / orders.length,
      firstDate: orders[0].date,
      lastDate,
    };
  });

  // Observed monthly retention (cohort-lite): for each customer with >=2 orders,
  // gap in days between consecutive orders -> convert to "active again within 60 days of
  // their own average gap" isn't robust with small samples, so instead: overall % of
  // customers with more than 1 order (simple, defensible repeat-purchase rate) and
  // an approximate monthly retention derived from it via the same geometric model,
  // inverted: observed average inter-purchase gap -> monthly cadence -> churn proxy.
  const repeatCustomers = rfm.filter(c=>c.frequency > 1).length;
  const repeatRate = repeatCustomers / customers.length;

  // Average orders per year per customer (based on each customer's own observed span)
  const spans = rfm.map(c=>{
    const spanDays = Math.max((c.lastDate - c.firstDate) / 86400000, 1);
    return { c, spanDays };
  });
  const totalSpanYears = spans.reduce((s,x)=>s + x.spanDays/365, 0) || (customers.length * (1/365));
  const totalOrders = rows.length;
  // purchases per customer per year: weight by customers with span>0; fallback to simple avg freq
  const avgFreqRaw = rfm.reduce((s,c)=>s+c.frequency,0) / customers.length;
  const observedSpanDaysAvg = spans.reduce((s,x)=>s+x.spanDays,0) / spans.length;
  const purchasesPerYear = observedSpanDaysAvg > 30
    ? avgFreqRaw / (observedSpanDaysAvg/365)
    : avgFreqRaw; // not enough span to annualize meaningfully

  const aov = rows.reduce((s,r)=>s+r.amount,0) / rows.length;

  // Approximate ANNUAL retention from repeat rate: treat repeatRate as a proxy for
  // "didn't churn after first purchase within the observed window" -- explicitly
  // labeled as an approximation in the UI, not a true cohort-over-time calculation
  // (which would need >=2 full periods of history to do properly).
  const approxRetention = Math.min(Math.max(repeatRate, 0.02), 0.98);

  const marginAssumed = 0.35; // stated assumption, shown in UI
  const { churn, lifespan, clv } = computeCLV(aov, purchasesPerYear, marginAssumed, approxRetention, 10);

  // RFM scoring (quintile-ish, robust to small n via rank-based buckets).
  // Each dimension is sorted ONCE, then every customer's rank is found with a
  // binary search -- O(n log n) total instead of re-sorting per customer
  // (an O(n^2 log n) bug that froze the tab on real-sized datasets, e.g.
  // 50k+ customers).
  function buildQuantileScorer(values, invert){
    const sorted = values.slice().sort((a,b)=>a-b);
    const n = sorted.length;
    return function(value){
      // binary search for first index >= value
      let lo = 0, hi = n;
      while(lo < hi){
        const mid = (lo + hi) >> 1;
        if(sorted[mid] < value) lo = mid + 1; else hi = mid;
      }
      const pct = lo < 0 ? 1 : lo / n;
      let score = Math.ceil(pct * 5) || 1;
      if(invert) score = 6 - score;
      return Math.min(Math.max(score, 1), 5);
    };
  }
  const scoreRecency = buildQuantileScorer(rfm.map(c=>c.recencyDays), true); // lower days = better = higher score
  const scoreFrequency = buildQuantileScorer(rfm.map(c=>c.frequency), false);
  const scoreMonetary = buildQuantileScorer(rfm.map(c=>c.monetary), false);
  rfm.forEach(c=>{
    c.rScore = scoreRecency(c.recencyDays);
    c.fScore = scoreFrequency(c.frequency);
    c.mScore = scoreMonetary(c.monetary);
  });

  // Simple KMeans (k=4) on standardized [rScore,fScore,mScore]
  const points = rfm.map(c=>[c.rScore, c.fScore, c.mScore]);
  const k = Math.min(4, Math.max(2, Math.floor(customers.length/3) || 2));
  const labels = kmeans(points, k, 42);
  rfm.forEach((c,i)=> c.cluster = labels[i]);

  // Label clusters by centroid characteristics
  const clusterStats = [];
  for(let ci=0; ci<k; ci++){
    const members = rfm.filter(c=>c.cluster===ci);
    if(members.length===0) continue;
    const avgR = members.reduce((s,c)=>s+c.rScore,0)/members.length;
    const avgF = members.reduce((s,c)=>s+c.fScore,0)/members.length;
    const avgM = members.reduce((s,c)=>s+c.mScore,0)/members.length;
    clusterStats.push({
      cluster: ci, n: members.length, avgR, avgF, avgM,
      avgSpend: members.reduce((s,c)=>s+c.monetary,0)/members.length,
      avgOrders: members.reduce((s,c)=>s+c.frequency,0)/members.length,
      avgRecencyDays: members.reduce((s,c)=>s+c.recencyDays,0)/members.length,
    });
  }
  labelClusters(clusterStats);
  const oneTimeShare = rfm.filter(c=>c.frequency===1).length / rfm.length;

  // Apriori-lite (pairs only) if product data present
  let rules = [];
  const hasProduct = rows.some(r=>r.product);
  if(hasProduct){
    const basketsByOrder = {}; // group by customer+date as order proxy if no order id
    rows.forEach(r=>{
      if(!r.product) return;
      const key = r.customer + '|' + r.date.toISOString().slice(0,10);
      if(!basketsByOrder[key]) basketsByOrder[key] = new Set();
      basketsByOrder[key].add(r.product);
    });
    const baskets = Object.values(basketsByOrder).map(s=>Array.from(s)).filter(b=>b.length>=2);
    rules = aprioriPairs(baskets, 0.02);
  }

  return {
    customers: customers.length, orders: rows.length, aov, purchasesPerYear,
    approxRetention, churn, lifespan, clv, repeatRate, marginAssumed,
    clusterStats, rules, hasProduct, oneTimeShare,
  };
}

function kmeans(points, k, seed){
  // deterministic-ish simple kmeans (fixed iterations), seeded by picking
  // evenly spaced initial points after a stable sort
  const n = points.length;
  const sorted = points.map((p,i)=>({p,i})).sort((a,b)=> (a.p[0]+a.p[1]+a.p[2]) - (b.p[0]+b.p[1]+b.p[2]));
  let centroids = [];
  for(let c=0;c<k;c++){
    const idx = Math.floor((c+0.5) * n / k);
    centroids.push(sorted[Math.min(idx, n-1)].p.slice());
  }
  let labels = new Array(n).fill(0);
  for(let iter=0; iter<25; iter++){
    for(let i=0;i<n;i++){
      let best=0, bestDist=Infinity;
      for(let c=0;c<k;c++){
        const d = dist2(points[i], centroids[c]);
        if(d<bestDist){ bestDist=d; best=c; }
      }
      labels[i]=best;
    }
    const sums = Array.from({length:k}, ()=>[0,0,0,0]);
    for(let i=0;i<n;i++){
      const c = labels[i];
      sums[c][0]+=points[i][0]; sums[c][1]+=points[i][1]; sums[c][2]+=points[i][2]; sums[c][3]+=1;
    }
    centroids = sums.map((s,ci)=> s[3]>0 ? [s[0]/s[3], s[1]/s[3], s[2]/s[3]] : centroids[ci]);
  }
  return labels;
}
function dist2(a,b){ return (a[0]-b[0])**2 + (a[1]-b[1])**2 + (a[2]-b[2])**2; }

function labelClusters(clusterStats){
  // Rank-based labeling (relative to the clusters actually found, instead of
  // fixed absolute thresholds) so small samples don't collapse into
  // duplicate "Loyal" buckets. Priority: flag "at risk" first (used to be
  // valuable, hasn't bought in a while), then rank the rest by F+M.
  const avgRall = clusterStats.reduce((s,c)=>s+c.avgR,0) / clusterStats.length;
  const remaining = [];
  clusterStats.forEach(s=>{
    const valuable = (s.avgF + s.avgM) / 2;
    if(s.avgR < avgRall - 0.4 && valuable >= 2.5){
      s.label = 'seg_atrisk';
    } else {
      remaining.push(s);
    }
  });
  remaining.sort((a,b)=> (b.avgF+b.avgM) - (a.avgF+a.avgM));
  remaining.forEach((s, idx)=>{
    if(idx === 0 && (s.avgF+s.avgM) >= 7) s.label = 'seg_champions';
    else if(idx === remaining.length-1 && (s.avgF+s.avgM) <= 4) s.label = 'seg_new';
    else s.label = 'seg_loyal';
  });
}

function aprioriPairs(baskets, minSupport){
  const n = baskets.length;
  if(n===0) return [];
  const itemCount = {};
  const pairCount = {};
  baskets.forEach(b=>{
    const uniq = Array.from(new Set(b));
    uniq.forEach(x=> itemCount[x] = (itemCount[x]||0)+1);
    for(let i=0;i<uniq.length;i++){
      for(let j=0;j<uniq.length;j++){
        if(i===j) continue;
        const key = uniq[i] + '\u0001' + uniq[j];
        pairCount[key] = (pairCount[key]||0)+1;
      }
    }
  });
  const rules = [];
  Object.keys(pairCount).forEach(key=>{
    const [a,b] = key.split('\u0001');
    const support = pairCount[key] / n;
    if(support < minSupport) return;
    const confidence = pairCount[key] / itemCount[a];
    const lift = confidence / (itemCount[b] / n);
    if(lift > 1) rules.push({ antecedent: a, consequent: b, support, confidence, lift });
  });
  rules.sort((a,b)=> b.lift - a.lift);
  return rules.slice(0, 10);
}

/* ============================================================
   RENDER DEEP RESULTS
   ============================================================ */

function renderDeepResults(res, hasProductMapped){
  const wrap = document.getElementById('deep-result-wrap');
  const t_ = t;

  let html = `
    <div class="kpi-grid">
      <div class="kpi"><div class="v">${res.orders.toLocaleString()}</div><div class="l">${t_('kpi_orders')}</div></div>
      <div class="kpi"><div class="v">${res.customers.toLocaleString()}</div><div class="l">${t_('kpi_customers')}</div></div>
      <div class="kpi"><div class="v">${fmtMoney(res.aov)}</div><div class="l">${t_('kpi_aov')}</div></div>
      <div class="kpi"><div class="v">${Math.round(res.approxRetention*100)}%</div><div class="l">${t_('kpi_retention')}</div></div>
    </div>

    <div class="result-card" style="margin-top:10px;">
      <div class="label">${t_('deep_clv_title')}</div>
      <div class="value">${fmtMoney(res.clv)}</div>
      <div class="sub">${t_('result_sub_tpl').replace('{lifespan}', res.lifespan.toFixed(1)).replace('{retention}', Math.round(res.approxRetention*100))}</div>
    </div>

    <div class="card" style="margin-top:24px;">
      <h3>${t_('seg_title')}</h3>
      ${res.oneTimeShare >= 0.7 ? `<div class="verdict warn" style="margin-bottom:4px;">${t_('low_repeat_note')}</div>` : ''}
      <div class="chart-box" style="height:260px;"><canvas id="segChart"></canvas></div>
      <div class="seg-grid">
  `;

  const segColors = { seg_champions:'#4F46E5', seg_loyal:'#1FAF75', seg_atrisk:'#E6503F', seg_new:'#E8A93A' };
  res.clusterStats.forEach(s=>{
    const col = segColors[s.label] || '#999';
    html += `
      <div class="seg-card">
        <div><span class="seg-dot" style="background:${col}"></span><span class="seg-name">${t_(s.label)}</span></div>
        <div class="seg-n">${s.n} ${t_('seg_customers')}</div>
        <div class="seg-stat">${t_('seg_avg_spend')}: <b>${fmtMoney(s.avgSpend)}</b></div>
        <div class="seg-stat">${t_('seg_avg_orders')}: <b>${s.avgOrders.toFixed(1)}</b></div>
        <div class="seg-stat">${t_('seg_recency')}: <b>${Math.round(s.avgRecencyDays)} ${t_('seg_days')}</b></div>
      </div>`;
  });

  html += `</div></div>`;

  html += `<div class="card" style="margin-top:24px;"><h3>${t_('rules_title')}</h3>`;
  if(!hasProductMapped){
    html += `<p class="help">${t_('no_product_col')}</p>`;
  } else if(res.rules.length === 0){
    html += `<p class="help">${t_('rules_none')}</p>`;
  } else {
    html += `<div class="table-scroll"><table class="rules"><thead><tr>
      <th>${t_('th_if')}</th><th></th><th>${t_('th_then')}</th><th>${t_('th_lift')}</th>
    </tr></thead><tbody>`;
    res.rules.forEach(r=>{
      html += `<tr><td>${escapeHtml(r.antecedent)}</td><td>→</td><td>${escapeHtml(r.consequent)}</td><td><span class="lift-pill">${r.lift.toFixed(2)}x</span></td></tr>`;
    });
    html += `</tbody></table></div>`;
  }
  html += `</div>`;

  wrap.innerHTML = html;

  try{
    const ctx = document.getElementById('segChart');
    const labels = res.clusterStats.map(s=>t_(s.label));
    const data = res.clusterStats.map(s=>s.n);
    const colors = res.clusterStats.map(s=>segColors[s.label]||'#999');
    new Chart(ctx, {
      type:'doughnut',
      data:{ labels, datasets:[{ data, backgroundColor: colors, borderColor:'#fff', borderWidth:3 }] },
      options:{ plugins:{ legend:{ position:'bottom' } } }
    });
  }catch(e){
    console.error('chart error', e);
  }
}

function escapeHtml(s){
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', ()=>{
  applyI18n();
  setupDropzone();
});
