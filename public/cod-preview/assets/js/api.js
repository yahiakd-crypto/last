/* COD order submission — thin fetch() wrapper around the backend.
   Keeps business logic server-side; never stores seller secrets in the browser.
   If the backend is unreachable the order is kept locally (demo mode) so the
   preview still works end-to-end — main.js surfaces this honestly to the user. */

const COD_API = {
  endpoint: "/api/orders",

  async submitOrder(order) {
    try {
      const res = await fetch(this.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });
      let json;
      try { json = await res.json(); } catch (e) { json = null; }
      if (!res.ok || !json || !json.ok) {
        throw new Error((json && json.error) || `Server error ${res.status}`);
      }
      return { ok: true, id: json.id, orderNumber: json.orderNumber, demo: false };
    } catch (err) {
      const local = {
        ...order,
        id: (crypto.randomUUID && crypto.randomUUID()) || String(Date.now()),
        orderNumber: `LOCAL-${Date.now().toString().slice(-6)}`,
        savedLocally: true,
        error: String(err.message || err).slice(0, 160),
        createdAt: new Date().toISOString(),
      };
      try {
        const arr = JSON.parse(localStorage.getItem("cod.orders") || "[]");
        arr.unshift(local);
        localStorage.setItem("cod.orders", JSON.stringify(arr));
      } catch (e) { /* storage full or blocked — ignore */ }
      return { ok: true, id: local.id, orderNumber: local.orderNumber, demo: true };
    }
  },
};
