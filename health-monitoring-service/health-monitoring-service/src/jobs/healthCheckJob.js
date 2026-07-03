const cron = require("node-cron");
const { getMonitors, recordCheckResult } = require("../config/store");
const { pingTarget } = require("../services/pingService");

/**
 * Starts a cron job that runs every few seconds, finds any monitor whose
 * `nextCheckAt` has passed, pings it, and records the result. This is the
 * "engine" of the health monitoring system — everything else is just
 * CRUD around this loop.
 */
function startHealthCheckJob() {
  const intervalSeconds = Number(process.env.CHECK_INTERVAL_SECONDS) || 10;

  // node-cron needs a cron expression; run every N seconds via "*/N * * * * *"
  const cronExpression = `*/${intervalSeconds} * * * * *`;

  cron.schedule(cronExpression, async () => {
    const dueMonitors = getMonitors().filter((m) => Date.now() >= m.nextCheckAt);

    for (const monitor of dueMonitors) {
      const result = await pingTarget(monitor.url);
      recordCheckResult(monitor.id, result);

      const icon = result.status === "UP" ? "✅" : "❌";
      console.log(
        `[health-monitor] ${icon} ${monitor.name} (${monitor.url}) — ${result.status} in ${result.responseTimeMs}ms`
      );
    }
  });

  console.log(`[health-monitor] Background check job running every ${intervalSeconds}s`);
}

module.exports = { startHealthCheckJob };
