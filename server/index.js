import express from 'express';
import priceApprox from './priceApprox.js';

const app = express();

// 🔊 lightweight request logger (no deps)
app.use((req, res, next) => {
  const start = process.hrtime.bigint();
  res.on('finish', () => {
    const ms = Number(process.hrtime.bigint() - start) / 1e6;
    console.log(
      `[REQ] ${req.ip} ${req.method} ${req.originalUrl} -> ${res.statusCode} ${ms.toFixed(1)}ms`
    );
  });
  next();
});

app.use(express.json());

// You currently define the route path inside the router as "/api/price-approx",
// so mount the router with no prefix:
app.use('/api', priceApprox);

// healthcheck
app.get('/api/health', (req, res) => res.json({ ok: true }));

// final error logger (shows stacks for 500s)
app.use((err, req, res, next) => {
  console.error('[UNHANDLED ERROR]', err?.stack || err);
  res.status(500).json({ error: String(err?.message || err) });
});

// also catch truly unhandled cases
process.on('unhandledRejection', (e) => console.error('[unhandledRejection]', e));
process.on('uncaughtException', (e) => console.error('[uncaughtException]', e));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Price API listening on port ${PORT}`));
