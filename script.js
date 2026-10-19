const scenarios = {
  flood: {
    title: "Flood risk simulation",
    description: "Process terrain, rainfall, and river-flow data to compare possible flood scenarios and help identify areas that may need further assessment.",
    tags: ["Geospatial data", "Numerical modelling", "Risk mapping"],
    standard: 300, baseGB: 480, efficiency: .80, baselineLabel: "Flood model"
  },
  forest: {
    title: "Forest change analysis",
    description: "Analyze large collections of satellite imagery to detect land-cover changes and help researchers prioritize locations for further review.",
    tags: ["Satellite imagery", "Land cover", "Change detection"],
    standard: 420, baseGB: 1200, efficiency: .76, baselineLabel: "Image analysis"
  },
  energy: {
    title: "Local energy planning",
    description: "Evaluate demand patterns and run alternative grid scenarios to support planning for reliable and efficient local energy systems.",
    tags: ["Demand data", "Grid scenarios", "Optimization"],
    standard: 180, baseGB: 120, efficiency: .84, baselineLabel: "Energy model"
  }
};

const workloadSettings = {
  small: { label: "Small", gb: 120, factor: .55 },
  medium: { label: "Medium", gb: 480, factor: 1 },
  large: { label: "Large", gb: 1200, factor: 2.5 }
};

let currentChallenge = "flood";
let currentWorkload = "medium";
let currentNodes = 16;

function formatMinutes(totalMinutes) {
  if (totalMinutes < 1) return `${Math.max(1, Math.round(totalMinutes * 60))} sec`;
  const minutes = Math.floor(totalMinutes);
  const seconds = Math.round((totalMinutes - minutes) * 60);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

// Simplified idealized model with a fixed serial fraction and parallel efficiency.
// It is illustrative only and should not be treated as a real system benchmark.
function estimateRuntime(nodes, challenge = currentChallenge, workload = currentWorkload) {
  const scenario = scenarios[challenge];
  const load = workloadSettings[workload];
  const baselineMinutes = scenario.standard * load.factor;
  const serialFraction = .08;
  const parallelFraction = 1 - serialFraction;
  const speedup = 1 / (serialFraction + parallelFraction / (nodes * scenario.efficiency));
  return { baselineMinutes, runtimeMinutes: baselineMinutes / speedup, speedup, reduction: (1 - 1 / speedup) * 100, dataGB: load.gb };
}

function updateScenario() {
  const scenario = scenarios[currentChallenge];
  document.getElementById("challengeTitle").textContent = scenario.title;
  document.getElementById("challengeDescription").textContent = scenario.description;
  document.getElementById("challengeTags").replaceChildren(...scenario.tags.map(tag => {
    const span = document.createElement("span"); span.textContent = tag; return span;
  }));
  document.getElementById("dataMetric").innerHTML = `${workloadSettings[currentWorkload].gb.toLocaleString("en-US")} <small>${workloadSettings[currentWorkload].gb >= 1000 ? "GB" : "GB"}</small>`;
  const result = estimateRuntime(currentNodes);
  document.getElementById("runtimeMetric").innerHTML = `${formatMinutes(result.runtimeMinutes)} <small>${result.runtimeMinutes < 1 ? "min*" : "min"}</small>`;
  document.getElementById("savedMetric").innerHTML = `${Math.round(result.reduction)}<small>%</small>`;
  runtimeChart.data.datasets[0].data = [result.baselineMinutes, result.runtimeMinutes];
  runtimeChart.data.labels = ["Standard workstation", "HPC cluster"];
  runtimeChart.update();
  updateSimulationResult(false);
}

const runtimeChart = new Chart(document.getElementById("runtimeChart"), {
  type: "bar",
  data: {
    labels: ["Standard workstation", "HPC cluster"],
    datasets: [{ label: "Estimated minutes", data: [300, 42], backgroundColor: ["#c5c7d5", "#7868ef"], borderRadius: 7, borderSkipped: false, maxBarThickness: 48 }]
  },
  options: {
    responsive: true, maintainAspectRatio: false, indexAxis: "y",
    plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => ` ${formatMinutes(c.raw)} minutes` } } },
    scales: {
      x: { beginAtZero: true, grid: { color: "rgba(145,146,169,.15)" }, border: { display: false }, ticks: { font: { size: 9 } } },
      y: { grid: { display: false }, border: { display: false }, ticks: { font: { size: 9 } } }
    }
  }
});

const scalingChart = new Chart(document.getElementById("scalingChart"), {
  type: "line",
  data: {
    labels: [1, 4, 8, 16, 32, 64],
    datasets: [{
      label: "Estimated runtime (minutes)", data: [],
      borderColor: "#7868ef", backgroundColor: "rgba(120,104,239,.10)", fill: true, tension: .35,
      pointRadius: 3, pointHoverRadius: 5, pointBackgroundColor: "#7868ef", borderWidth: 2
    }]
  },
  options: {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => ` ${formatMinutes(c.raw)}` } } },
    scales: {
      x: { title: { display: true, text: "Compute nodes", font: { size: 9 } }, grid: { display: false }, border: { display: false }, ticks: { font: { size: 8 } } },
      y: { title: { display: true, text: "Estimated minutes", font: { size: 9 } }, beginAtZero: true, grid: { color: "rgba(145,146,169,.15)" }, border: { display: false }, ticks: { maxTicksLimit: 4, font: { size: 8 } } }
    }
  }
});

function updateSimulationResult(showRunState = false) {
  const result = estimateRuntime(currentNodes);
  document.getElementById("nodeValue").textContent = `${currentNodes} ${currentNodes === 1 ? "node" : "nodes"}`;
  document.getElementById("workloadLabel").textContent = workloadSettings[currentWorkload].label;
  document.getElementById("efficiencyLabel").textContent = `${Math.round(scenarios[currentChallenge].efficiency * 100)}%`;
  document.getElementById("resultTime").innerHTML = `${formatMinutes(result.runtimeMinutes)} <small>${result.runtimeMinutes < 1 ? "min*" : "min"}</small>`;
  document.getElementById("resultNodes").textContent = currentNodes;
  document.getElementById("speedup").textContent = `${result.speedup.toFixed(1)}×`;
  document.getElementById("timeReduction").textContent = `${Math.round(result.reduction)}%`;
  document.getElementById("resultProgress").style.width = `${Math.min(100, Math.max(7, result.reduction))}%`;
  document.getElementById("resultStatus").textContent = showRunState ? "Simulation complete" : "Ready to run";
  scalingChart.data.datasets[0].data = [1, 4, 8, 16, 32, 64].map(n => estimateRuntime(n).runtimeMinutes);
  scalingChart.update();
}

document.querySelectorAll(".challenge-option").forEach(button => {
  button.addEventListener("click", () => {
    currentChallenge = button.dataset.challenge;
    document.querySelectorAll(".challenge-option").forEach(item => {
      const selected = item === button;
      item.classList.toggle("selected", selected);
      item.setAttribute("aria-pressed", String(selected));
    });
    updateScenario();
  });
});

document.getElementById("nodeSlider").addEventListener("input", event => {
  currentNodes = Number(event.target.value);
  updateSimulationResult(false);
});

document.getElementById("workloadSelect").addEventListener("change", event => {
  currentWorkload = event.target.value;
  updateScenario();
});

document.getElementById("runSimulation").addEventListener("click", () => {
  const button = document.getElementById("runSimulation");
  button.disabled = true;
  button.innerHTML = "<span>✓</span> Simulation complete";
  updateSimulationResult(true);
  window.setTimeout(() => {
    button.disabled = false;
    button.innerHTML = "<span>▶</span> Run simulation again";
  }, 900);
});

document.getElementById("themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const dark = document.body.classList.contains("dark");
  document.getElementById("themeToggle").setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
});

document.getElementById("menuToggle").addEventListener("click", () => {
  document.getElementById("sidebar").classList.toggle("open");
});

document.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", () => {
    document.querySelectorAll(".nav-link").forEach(item => item.classList.remove("active"));
    link.classList.add("active");
    document.getElementById("sidebar").classList.remove("open");
  });
});

updateScenario();
