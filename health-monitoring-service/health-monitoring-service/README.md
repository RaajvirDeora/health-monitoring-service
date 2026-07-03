# Health Monitoring Service

**Intern ID:** CITS2241
**Full Name:** Raajvir Deora
**No. of Weeks:** 6
**Project Name:** Health Monitoring Service
**Project Scope:** Build a backend service that registers external endpoints,
periodically checks their availability, and exposes their status/uptime
history via a REST API.

---

## Overview

You register a URL (e.g. `https://google.com`, or one of your other
internship services' `/health` endpoint). A background job pings it on a
schedule you set per-monitor, records UP/DOWN + response time, and keeps a
rolling history you can query.

## Tech Stack

- Node.js + Express (REST API)
- `node-cron` for the scheduled background checker
- `axios` to perform the actual HTTP pings
- In-memory store (swap for MongoDB/Postgres for persistence)

## Running it

```bash
npm install
cp .env.example .env
npm start
```

Server runs on `http://localhost:5001` by default. The background checker
starts automatically and scans every `CHECK_INTERVAL_SECONDS` (default 10s)
for any monitor that's due.

## API

### Create a monitor
```bash
curl -X POST http://localhost:5001/monitors \
  -H "Content-Type: application/json" \
  -d '{"name": "Google", "url": "https://google.com", "intervalSeconds": 15}'
```

### List all monitors (summary + current status)
```bash
curl http://localhost:5001/monitors
```

### Get one monitor (full detail)
```bash
curl http://localhost:5001/monitors/<id>
```

### Get check history for a monitor
```bash
curl http://localhost:5001/monitors/<id>/history
```

### Delete a monitor
```bash
curl -X DELETE http://localhost:5001/monitors/<id>
```

## How the scheduler works

Every monitor stores `nextCheckAt`. A cron job runs every
`CHECK_INTERVAL_SECONDS` and pings any monitor whose `nextCheckAt` has
passed, then resets `nextCheckAt` to `now + monitor.intervalSeconds`. This
means each monitor can have its own independent check frequency without
needing a separate timer per monitor.

## Project Structure

```
health-monitoring-service/
└── src/
    ├── config/store.js           # in-memory data layer
    ├── services/pingService.js   # performs the actual HTTP check
    ├── jobs/healthCheckJob.js    # cron loop that drives checks
    ├── controllers/monitorController.js
    ├── routes/monitorRoutes.js
    └── index.js
```

## Key Concepts Demonstrated

- Scheduled background jobs (cron) decoupled from request/response cycle
- External service health-checking pattern (used in real uptime monitors
  like UptimeRobot, Pingdom)
- Per-resource configurable polling intervals
- Bounded history (prevents unbounded memory growth)
