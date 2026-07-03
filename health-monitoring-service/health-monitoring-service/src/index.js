require("dotenv").config();
const express = require("express");
const monitorRoutes = require("./routes/monitorRoutes");
const { startHealthCheckJob } = require("./jobs/healthCheckJob");

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ service: "health-monitoring-service", status: "UP" });
});

app.use("/monitors", monitorRoutes);

app.listen(PORT, () => {
  console.log(`[health-monitoring-service] Listening on http://localhost:${PORT}`);
  startHealthCheckJob();
});
