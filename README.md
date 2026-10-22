# LTV Radar 🎯

Herramienta interactiva, bilingüe y 100% client-side para calcular el Customer Lifetime Value (CLV) real de un negocio y encontrar oportunidades de cross-sell — sin subir datos a ningún servidor.

**[Usar la herramienta (ES)](./docs/index.html)** · cambia a inglés con el botón EN dentro de la página.

## Qué hace

- **Diagnóstico rápido**: calcula un CLV estimado en 30 segundos a partir de 4-5 inputs (ticket promedio, frecuencia, margen, retención, CAC opcional) y lo compara contra el ratio CLV:CAC de referencia de la industria (3:1).
- **Análisis profundo (CSV)**: sube tu propio historial de ventas (una fila por pedido) y la herramienta corre, en tu navegador:
  - CLV real calculado directamente de tus transacciones (no estimado).
  - Segmentación de clientes por RFM (Recencia, Frecuencia, Monto) + KMeans.
  - Reglas de asociación (cross-sell) entre productos, si subes la columna de producto.
- **Privacidad real, no solo un mensaje de marketing**: no hay backend. El parseo del CSV, el clustering y el minado de reglas corren enteramente en JavaScript, en el navegador de quien lo usa. Puedes verificarlo mirando el código — no hay ninguna llamada de red en la ruta de análisis.

## Nicho

Retención y cross-sell analytics para e-commerce y PyMEs de LatAm — el tipo de negocio que tiene datos de ventas reales pero no un equipo de datos propio para explotarlos.

## Validación con datos reales ("build in public")

Antes de publicar la herramienta, la corrí contra un dataset público real — pedidos de e-commerce brasileño de 2018 (Olist, ver [Fuente de datos](#fuente-de-datos) abajo) — en vez de solo contra datos sintéticos de prueba. Esto expuso y permitió corregir dos problemas reales antes de que llegaran a cualquier usuario:

1. **Bug de performance O(n² log n)**: el scoring RFM original re-ordenaba el arreglo completo de valores en cada llamada (3 veces por cliente). Con datos sintéticos de 25 filas nunca se notó. Con 51,612 clientes reales, el navegador se congelaba. Se corrigió ordenando una sola vez y usando búsqueda binaria por cliente — de O(n² log n) a O(n log n); el análisis bajó de "se cuelga" a 0.03 segundos.
2. **Honestidad de datos**: con datos reales, solo 11.6% de los clientes del período tuvo más de un pedido. Etiquetar segmentos como "Leales" sin aclarar esto sería engañoso — los segmentos reflejan sobre todo diferencias en la primera compra, no lealtad repetida. Se agregó una nota dinámica que aparece automáticamente cuando la tasa de recompra es baja (≥70% de compradores únicos).

## Resultados reales sobre el dataset Olist (2018, pedidos entregados)

| Métrica | Valor |
|---|---|
| Pedidos analizados | 60,324 |
| Clientes únicos | 51,612 |
| Ticket promedio real | R$120 |
| Tasa de recompra observada | 12% |
| CLV real calculado | R$55 |
| Vida útil esperada | 1.1 años |

**Segmentos (RFM + KMeans):**

| Segmento | Clientes | Gasto promedio | Última compra |
|---|---|---|---|
| Campeones | 6,003 | R$214 | hace 122 días |
| Leales | 12,483 | R$179 | hace 47 días |
| En riesgo de fuga | 13,307 | R$214 | hace 176 días |
| Nuevos / ocasionales | 19,819 | R$43 | hace 134 días |

**Reglas de cross-sell más fuertes (por categoría de producto):**
- `construction_tools_lights` ↔ `furniture_decor` — lift 2.56x
- `bed_bath_table` ↔ `baby` — lift 1.34x
- `garden_tools` ↔ `furniture_decor` — lift 1.15x

## Fuente de datos

Brazilian E-Commerce Public Dataset by Olist (datos reales, 2016-2018), usado solo para validar el motor de cálculo con un dataset de tamaño real. La herramienta en sí no incluye ni almacena estos datos — cualquier persona que la use sube su propio CSV, que nunca sale de su navegador. Clave de cliente correcta: `customer_unique_id` (no `customer_id`, que en Olist es un identificador por pedido, no por cliente — un detalle de calidad de datos fácil de pasar por alto y que arruinaría silenciosamente cualquier análisis de recompra).

## Metodología — supuestos explícitos

- `CLV = Ticket promedio × Compras/año × Margen × Vida útil esperada (1 / tasa de abandono)`, con un tope de 10 años para evitar valores absurdos cuando la retención observada es casi perfecta.
- El ratio de referencia CLV:CAC de 3:1 es una regla general citada en la industria de marketing/SaaS, no un promedio medido de ningún dataset.
- La retención en Modo CSV es una aproximación a partir de la tasa de recompra observada en el período disponible, no un cálculo de cohortes verdadero (que requeriría múltiples períodos completos de historial).

## Stack

JavaScript vanilla (sin frameworks, sin dependencias de build), Chart.js (auto-alojado, sin CDN). KMeans y minado de reglas de asociación (Apriori simplificado) implementados desde cero.

## Build

```
python3 build.py   # ensambla index_template.html + app.js → outputs/ y docs/ (GitHub Pages)
```
