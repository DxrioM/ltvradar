Antes de publicar esta herramienta, casi la rompo. Y me alegra que haya pasado antes de que la viera cualquier otra persona. 🔍

Construí LTV Radar: una herramienta gratuita y 100% en-navegador que calcula tu Customer Lifetime Value real y encuentra qué productos se venden juntos — subes tu CSV de ventas y nunca sale de tu computadora (no hay backend, lo puedes verificar en el código).

Antes de publicarla, en vez de probarla solo con datos de juguete, la corrí contra un dataset público real: 60,324 pedidos de e-commerce brasileño (Olist, 2018). Eso expuso dos cosas que un dataset pequeño jamás hubiera mostrado:

🐛 Un bug de performance real. El cálculo de segmentos re-ordenaba todo el dataset en cada paso — invisible con 25 filas, pero con 51,612 clientes reales el navegador se congelaba. Lo reescribí para ordenar una sola vez y buscar por índice: de "se cuelga" a 0.03 segundos.

📊 Un problema de honestidad en los datos, no de código. Solo 11.6% de los clientes compró más de una vez en el período. Etiquetar segmentos como "leales" sin aclararlo sería engañoso — así que la herramienta ahora avisa automáticamente cuando la tasa de recompra es baja, en vez de maquillar el resultado.

Con los datos reales, esto es lo que salió:
→ CLV real: R$55 · Ticket promedio: R$120 · Retención observada: 12%
→ 4 segmentos (Campeones, Leales, En riesgo de fuga, Nuevos) con comportamiento claramente distinto
→ Cross-sell real: quien compra herramientas/iluminación de construcción también compra decoración de hogar (2.56x más probable)

Esto es exactamente el tipo de diagnóstico que hago para negocios con datos de ventas reales: encontrar dónde se está fugando el cliente y qué cross-sell mueve más la aguja — antes de que un bug o un dato mal interpretado llegue a una decisión real.

Prueba la herramienta gratis (tus datos no salen de tu navegador) y si quieres este diagnóstico aplicado a tu negocio, hablemos 👇

#DataScience #MachineLearning #CustomerLifetimeValue #Ecommerce #Retention #Analytics #Portfolio #Python
