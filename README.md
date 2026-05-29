# Keki website

Public landing + policy page for **Keki** (privacy, refunds, contact) — hosts
the business website Stripe requires.

Single self-contained `index.html`, no build step. Deployed to Azure Static Web
Apps via the workflow in `.github/workflows/` — every push to `main`
auto-deploys (the workflow skips the build and serves `index.html` as-is).

> Review `index.html` before relying on it — especially the refund/cancellation
> terms, the service-fee wording, and the operator/legal details.

Local preview: open `index.html`, or `npx serve .`
