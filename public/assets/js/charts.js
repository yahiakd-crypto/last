/* ============================================================
   PUNCHLINE — Chart.js helpers (design-system styled)
   Minimal gridlines, green positive series, gray baseline.
   ============================================================ */
window.CH = (function () {
  "use strict";

  const GREEN = "#2ECC71";
  const GREEN_DARK = "#27ae60";
  const GRAY = "#DFE2DF";
  const GRAY_LINE = "#C9CCC9";
  const INK = "#191A1D";
  const MUTED = "#8A8A93";

  Chart.defaults.font.family = "'Inter', system-ui, sans-serif";
  Chart.defaults.font.size = 11;
  Chart.defaults.color = MUTED;
  Chart.defaults.plugins.legend.display = false;

  function base(extra) {
    return Object.assign({
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 700, easing: "easeOutQuart" },
    }, extra || {});
  }

  const tooltip = {
    backgroundColor: "#191A1D",
    titleColor: "#fff",
    bodyColor: "#D8DAD8",
    padding: 12,
    cornerRadius: 10,
    displayColors: false,
    titleFont: { weight: 700 },
  };

  function line(canvas, labels, series, opts) {
    opts = opts || {};
    const ctx = document.getElementById(canvas);
    if (!ctx) return null;
    const cfg = {
      type: "line",
      data: {
        labels,
        datasets: series.map((s, i) => ({
          label: s.label || "Series " + i,
          data: s.data,
          borderColor: s.color || (i === 0 ? GREEN : GRAY_LINE),
          backgroundColor: s.color || (i === 0 ? GREEN : GRAY_LINE),
          borderWidth: s.width || 2.5,
          tension: 0.38,
          pointRadius: s.points === false ? 0 : 0,
          pointHoverRadius: 4,
          pointBackgroundColor: s.color || (i === 0 ? GREEN : GRAY_LINE),
          fill: s.fill !== undefined ? s.fill : false,
        })),
      },
      options: base({
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: opts.legend ? { display: true, labels: { usePointStyle: true, pointStyle: "circle", padding: 18, color: INK, font: { weight: 600 } } } : false,
          tooltip,
        },
        scales: {
          x: { grid: { display: false }, border: { display: false }, ticks: { maxTicksLimit: opts.maxTicks || 8 } },
          y: { grid: { color: "rgba(0,0,0,0.05)" }, border: { display: false }, ticks: { maxTicksLimit: 5 } },
        },
      }),
    };
    return new Chart(ctx, cfg);
  }

  function bar(canvas, labels, datasets, opts) {
    opts = opts || {};
    const ctx = document.getElementById(canvas);
    if (!ctx) return null;
    const cfg = {
      type: "bar",
      data: { labels, datasets: datasets.map((d, i) => ({
        label: d.label || "S" + i,
        data: d.data,
        backgroundColor: d.color || (i === 0 ? GRAY : GREEN),
        borderRadius: 6,
        borderSkipped: false,
        barPercentage: 0.6,
        categoryPercentage: 0.62,
      })) },
      options: base({
        plugins: { legend: opts.legend ? { display: true, labels: { usePointStyle: true, pointStyle: "circle", padding: 18, color: INK, font: { weight: 600 } } } : false, tooltip },
        scales: {
          x: { grid: { display: false }, border: { display: false } },
          y: { grid: { color: "rgba(0,0,0,0.05)" }, border: { display: false }, ticks: { maxTicksLimit: 5 } },
        },
      }),
    };
    return new Chart(ctx, cfg);
  }

  function spark(canvas, values, opts) {
    opts = opts || {};
    const ctx = document.getElementById(canvas);
    if (!ctx) return null;
    const grad = ctx.getContext && ctx.getContext("2d");
    let bg = null;
    if (grad) {
      const g = grad.createLinearGradient(0, 0, 0, 60);
      g.addColorStop(0, "rgba(46,204,113,0.25)");
      g.addColorStop(1, "rgba(46,204,113,0)");
      bg = g;
    }
    const cfg = {
      type: "line",
      data: {
        labels: values.map((_, i) => i),
        datasets: [{ data: values, borderColor: opts.color || GREEN, borderWidth: 2, tension: 0.4, pointRadius: 0, fill: true, backgroundColor: bg }],
      },
      options: base({
        plugins: { tooltip: { enabled: false } },
        scales: { x: { display: false }, y: { display: false } },
      }),
    };
    return new Chart(ctx, cfg);
  }

  function doughnut(canvas, value, opts) {
    opts = opts || {};
    const ctx = document.getElementById(canvas);
    if (!ctx) return null;
    const cfg = {
      type: "doughnut",
      data: {
        labels: [opts.label || "Score", "Rest"],
        datasets: [{
          data: [value, 100 - value],
          backgroundColor: [opts.color || GREEN, "rgba(0,0,0,0.06)"],
          borderWidth: 0,
          hoverOffset: 0,
        }],
      },
      options: base({
        cutout: opts.cutout || "76%",
        plugins: { tooltip: { enabled: false }, legend: { display: false } },
      }),
    };
    return new Chart(ctx, cfg);
  }

  return { line, bar, spark, doughnut, colors: { GREEN, GREEN_DARK, GRAY, INK, MUTED } };
})();
