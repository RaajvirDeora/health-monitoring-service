const {
  addMonitor,
  getMonitors,
  getMonitorById,
  removeMonitor,
} = require("../config/store");

function createMonitor(req, res) {
  const { name, url, intervalSeconds } = req.body;

  if (!name || !url) {
    return res.status(400).json({ error: "name and url are required" });
  }

  try {
    new URL(url); // throws if not a valid URL
  } catch {
    return res.status(400).json({ error: "url must be a valid URL, e.g. https://example.com" });
  }

  const monitor = addMonitor({
    name,
    url,
    intervalSeconds: intervalSeconds || 30, // default: check every 30s
  });

  return res.status(201).json({ message: "Monitor created", monitor });
}

function listMonitors(req, res) {
  // Return a summary view (no full history) for the list endpoint
  const monitors = getMonitors().map(({ history, ...summary }) => ({
    ...summary,
    checksRecorded: history.length,
  }));
  return res.status(200).json({ count: monitors.length, monitors });
}

function getMonitor(req, res) {
  const monitor = getMonitorById(req.params.id);
  if (!monitor) return res.status(404).json({ error: "Monitor not found" });
  return res.status(200).json({ monitor });
}

function getMonitorHistory(req, res) {
  const monitor = getMonitorById(req.params.id);
  if (!monitor) return res.status(404).json({ error: "Monitor not found" });
  return res.status(200).json({ id: monitor.id, name: monitor.name, history: monitor.history });
}

function deleteMonitor(req, res) {
  const deleted = removeMonitor(req.params.id);
  if (!deleted) return res.status(404).json({ error: "Monitor not found" });
  return res.status(200).json({ message: "Monitor deleted" });
}

module.exports = { createMonitor, listMonitors, getMonitor, getMonitorHistory, deleteMonitor };
