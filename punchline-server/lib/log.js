/* PUNCHLINE — AI request logging (Section 29).
   Every request: timestamp, provider, model, task, token usage, latency,
   cost estimate, success/failure. Cap the log in memory + disk. */
import { readStore, writeStore } from "./store.js";

const FILE = "logs.json";
const MAX = 500;

function appendLog(entry) {
  const logs = readStore(FILE).items || [];
  logs.unshift({
    time: new Date().toISOString(),
    provider: entry.provider || "—",
    model: entry.model || "—",
    task: entry.task || "—",
    tokens: entry.tokens != null ? entry.tokens : "—",
    latency: entry.latencyMs != null ? `${entry.latencyMs}ms` : "—",
    cost: entry.cost != null ? `$${entry.cost.toFixed(4)}` : "—",
    status: entry.status || "ok",
    error: entry.error || "",
  });
  writeStore(FILE, { items: logs.slice(0, MAX) });
  return logs[0];
}

function listLogs(limit = 100) {
  return (readStore(FILE).items || []).slice(0, limit);
}

export { appendLog, listLogs };
