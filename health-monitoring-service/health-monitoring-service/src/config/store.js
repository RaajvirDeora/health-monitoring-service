// In-memory data store. Swap for MongoDB/Postgres in a real deployment —
// the rest of the app only talks to this module, so that swap is isolated
// to this one file.

const { randomUUID } = require("crypto");

// monitors: [{ id, name, url, intervalSeconds, nextCheckAt, status, history: [] }]
const monitors = [];

function addMonitor({ name, url, intervalSeconds }) {
  const monitor = {
    id: randomUUID(),
    name,
    url,
    intervalSeconds,
    status: "PENDING", // PENDING | UP | DOWN
    lastCheckedAt: null,
    nextCheckAt: Date.now(), // check immediately on creation
    history: [], // { timestamp, status, responseTimeMs, statusCode }
  };
  monitors.push(monitor);
  return monitor;
}

function getMonitors() {
  return monitors;
}

function getMonitorById(id) {
  return monitors.find((m) => m.id === id);
}

function removeMonitor(id) {
  const index = monitors.findIndex((m) => m.id === id);
  if (index === -1) return false;
  monitors.splice(index, 1);
  return true;
}

// Cap history length so memory doesn't grow unbounded during a long demo run
const MAX_HISTORY = 100;

function recordCheckResult(id, result) {
  const monitor = getMonitorById(id);
  if (!monitor) return;

  monitor.status = result.status;
  monitor.lastCheckedAt = result.timestamp;
  monitor.nextCheckAt = Date.now() + monitor.intervalSeconds * 1000;

  monitor.history.push(result);
  if (monitor.history.length > MAX_HISTORY) {
    monitor.history.shift();
  }
}

module.exports = { addMonitor, getMonitors, getMonitorById, removeMonitor, recordCheckResult };
