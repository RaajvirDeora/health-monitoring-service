const axios = require("axios");

/**
 * Pings a single URL and returns a normalized result object.
 * Never throws — a failed request is a valid "DOWN" result, not an error.
 */
async function pingTarget(url) {
  const startedAt = Date.now();

  try {
    const response = await axios.get(url, { timeout: 5000 });
    const responseTimeMs = Date.now() - startedAt;

    // Anything in the 2xx-3xx range counts as healthy
    const isUp = response.status >= 200 && response.status < 400;

    return {
      timestamp: new Date().toISOString(),
      status: isUp ? "UP" : "DOWN",
      statusCode: response.status,
      responseTimeMs,
    };
  } catch (err) {
    const responseTimeMs = Date.now() - startedAt;
    return {
      timestamp: new Date().toISOString(),
      status: "DOWN",
      statusCode: err.response?.status ?? null,
      responseTimeMs,
      error: err.code || err.message,
    };
  }
}

module.exports = { pingTarget };
