/* PUNCHLINE — JSON file store (products, settings, logs, entities). */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "..", "data");
const UPLOAD_DIR = path.join(DATA_DIR, "uploads");

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function readStore(name) {
  ensureDir(DATA_DIR);
  const p = path.join(DATA_DIR, name);
  if (!fs.existsSync(p)) return {};
  try {
    return JSON.parse(fs.readFileSync(p, "utf8"));
  } catch {
    return {};
  }
}

function writeStore(name, data) {
  ensureDir(DATA_DIR);
  const p = path.join(DATA_DIR, name);
  fs.writeFileSync(p, JSON.stringify(data, null, 2));
  return data;
}

/* Entity helpers (Section 21: Users, Products, Brands, Personas, Competitors,
   Creative Concepts, Ads, Campaigns, Experiments, AI Providers, AI Models,
   Analysis Reports — with Save/Duplicate/Edit/Export/Delete/Compare). */
function collection(entity) {
  const file = `${entity}.json`;
  const all = () => (readStore(file).items || []);
  const save = (item) => {
    const items = all();
    const idx = items.findIndex((x) => x.id === item.id);
    if (idx >= 0) items[idx] = item;
    else items.unshift(item);
    writeStore(file, { items });
    return item;
  };
  const remove = (id) => {
    writeStore(file, { items: all().filter((x) => x.id !== id) });
  };
  const duplicate = (id) => {
    const src = all().find((x) => x.id === id);
    if (!src) throw new Error("Not found: " + id);
    return save({ ...src, id: `${id}-copy-${Date.now()}` });
  };
  return { all, save, remove, duplicate };
}

export { readStore, writeStore, collection, DATA_DIR, UPLOAD_DIR };
