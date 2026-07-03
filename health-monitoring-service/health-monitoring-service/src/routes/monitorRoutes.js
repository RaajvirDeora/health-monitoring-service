const express = require("express");
const {
  createMonitor,
  listMonitors,
  getMonitor,
  getMonitorHistory,
  deleteMonitor,
} = require("../controllers/monitorController");

const router = express.Router();

router.post("/", createMonitor);
router.get("/", listMonitors);
router.get("/:id", getMonitor);
router.get("/:id/history", getMonitorHistory);
router.delete("/:id", deleteMonitor);

module.exports = router;
