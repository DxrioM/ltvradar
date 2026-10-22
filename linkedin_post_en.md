Before I published this tool, I almost broke it. I'm glad it happened before anyone else saw it. 🔍

I built LTV Radar: a free, 100% browser-based tool that calculates your real Customer Lifetime Value and finds which products sell together — you upload your sales CSV and it never leaves your machine (no backend, you can check the code).

Before shipping it, instead of only testing with toy data, I ran it against a real public dataset: 60,324 orders from Brazilian e-commerce (Olist, 2018). That exposed two things a small dataset never would have:

🐛 A real performance bug. The segment-scoring step re-sorted the entire dataset on every single call — invisible at 25 rows, but with 51,612 real customers the browser tab froze. Rewrote it to sort once and binary-search per lookup: from "hangs" to 0.03 seconds.

📊 A data-honesty problem, not a code problem. Only 11.6% of customers bought more than once in the period. Labeling segments "loyal" without flagging that would be misleading — so the tool now surfaces a warning automatically whenever the repeat-purchase rate is low, instead of dressing up the result.

With the real data, here's what came out:
→ Real CLV: $55 · AOV: $120 · Observed retention: 12%
→ 4 distinct segments (Champions, Loyal, At risk, New) with clearly different behavior
→ Real cross-sell: customers buying construction tools/lighting also buy home decor (2.56x more likely)

This is exactly the kind of diagnostic I run for businesses sitting on real sales data: find where customers are actually leaking and which cross-sell moves the needle most — before a bug or a misread number makes it into a real decision.

Try the tool free (your data never leaves your browser), and if you want this diagnostic run on your own business, let's talk 👇

#DataScience #MachineLearning #CustomerLifetimeValue #Ecommerce #Retention #Analytics #Portfolio #Python
