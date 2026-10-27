"use strict";

const fileInput = document.querySelector("#fileInput");
const dropZone = document.querySelector("#dropZone");
const fileSummary = document.querySelector("#fileSummary");
const fileThumb = document.querySelector("#fileThumb");
const fileName = document.querySelector("#fileName");
const fileMeta = document.querySelector("#fileMeta");
const replaceButton = document.querySelector("#replaceButton");
const algorithm = document.querySelector("#algorithm");
const algorithmNote = document.querySelector("#algorithmNote");
const severity = document.querySelector("#severity");
const severityValue = document.querySelector("#severityValue");
const severityNote = document.querySelector("#severityNote");
const strengthPresets = [...document.querySelectorAll("[data-strength]")];
const typeInputs = [...document.querySelectorAll('.type-fieldset input[type="checkbox"]')];
const downloadComparison = document.querySelector("#downloadComparison");
const resultsPanel = document.querySelector(".results-panel");
const resultGrid = document.querySelector("#resultGrid");
const emptyState = document.querySelector("#emptyState");
const statusPill = document.querySelector("#statusPill");
const resultCardTemplate = document.querySelector("#resultCardTemplate");
const sampleOriginal = document.querySelector("#sampleOriginal");
const sampleSimulated = document.querySelector("#sampleSimulated");
const sampleDifference = document.querySelector("#sampleDifference");
const loadSampleButton = document.querySelector("#loadSampleButton");

const TYPE_LABELS = {
  protan: "Protan",
  deutan: "Deutan",
  tritan: "Tritan",
  achromatopsia: "Achromatopsia",
};

const ALGORITHM_LABELS = {
  brettel: "Brettel 1997",
  vienot: "Viénot 1999",
  machado: "Machado 2009",
  deficiencyview: "DeficiencyView · Machado 2009",
};

const ALGORITHM_NOTES = {
  brettel: "Two projection planes in linear RGB. Recommended here for tritan comparisons.",
  vienot: "One projection plane in linear RGB. Intended for protan and deutan comparisons; tritan is included with a warning.",
  machado: "Severity-specific matrices in linear RGB. Tritan output is an approximation.",
  deficiencyview: "DeficiencyView documents Machado 2009 matrices. This preset uses the same transform.",
};

const BRETTEL = {
  protan: {
    first: [0.14980, 1.19548, -0.34528, 0.10764, 0.84864, 0.04372, 0.00384, -0.00540, 1.00156],
    second: [0.14570, 1.16172, -0.30742, 0.10816, 0.85291, 0.03892, 0.00386, -0.00524, 1.00139],
    normal: [0.00048, 0.00393, -0.00441],
  },
  deutan: {
    first: [0.36477, 0.86381, -0.22858, 0.26294, 0.64245, 0.09462, -0.02006, 0.02728, 0.99278],
    second: [0.37298, 0.88166, -0.25464, 0.25954, 0.63506, 0.10540, -0.01980, 0.02784, 0.99196],
    normal: [-0.00281, -0.00611, 0.00892],
  },
  tritan: {
    first: [1.01277, 0.13548, -0.14826, -0.01243, 0.86812, 0.14431, 0.07589, 0.80500, 0.11911],
    second: [0.93678, 0.18979, -0.12657, 0.06154, 0.81526, 0.12320, -0.37562, 1.12767, 0.24796],
    normal: [0.03901, -0.02788, -0.01113],
  },
};

const VIENOT = {
  protan: [0.11238, 0.88762, 0, 0.11238, 0.88762, 0, 0.00401, -0.00401, 1],
  deutan: [0.29275, 0.70725, 0, 0.29275, 0.70725, 0, -0.02234, 0.02234, 1],
  tritan: [1, 0.14461, -0.14461, 0, 0.85924, 0.14076, 0, 0.85924, 0.14076],
};

const MACHADO = {
  protan: [
    [1, 0, 0, 0, 1, 0, 0, 0, 1],
    [0.856167, 0.182038, -0.038205, 0.029342, 0.955115, 0.015544, -0.002880, -0.001563, 1.004443],
    [0.734766, 0.334872, -0.069637, 0.051840, 0.919198, 0.028963, -0.004928, -0.004209, 1.009137],
    [0.630323, 0.465641, -0.095964, 0.069181, 0.890046, 0.040773, -0.006308, -0.007724, 1.014032],
    [0.539009, 0.579343, -0.118352, 0.082546, 0.866121, 0.051332, -0.007136, -0.011959, 1.019095],
    [0.458064, 0.679578, -0.137642, 0.092785, 0.846313, 0.060902, -0.007494, -0.016807, 1.024301],
    [0.385450, 0.769005, -0.154455, 0.100526, 0.829802, 0.069673, -0.007442, -0.022190, 1.029632],
    [0.319627, 0.849633, -0.169261, 0.106241, 0.815969, 0.077790, -0.007025, -0.028051, 1.035076],
    [0.259411, 0.923008, -0.182420, 0.110296, 0.804340, 0.085364, -0.006276, -0.034346, 1.040622],
    [0.203876, 0.990338, -0.194214, 0.112975, 0.794542, 0.092483, -0.005222, -0.041043, 1.046265],
    [0.152286, 1.052583, -0.204868, 0.114503, 0.786281, 0.099216, -0.003882, -0.048116, 1.051998],
  ],
  deutan: [
    [1, 0, 0, 0, 1, 0, 0, 0, 1],
    [0.866435, 0.177704, -0.044139, 0.049567, 0.939063, 0.011370, -0.003453, 0.007233, 0.996220],
    [0.760729, 0.319078, -0.079807, 0.090568, 0.889315, 0.020117, -0.006027, 0.013325, 0.992702],
    [0.675425, 0.433850, -0.109275, 0.125303, 0.847755, 0.026942, -0.007950, 0.018572, 0.989378],
    [0.605511, 0.528560, -0.134071, 0.155318, 0.812366, 0.032316, -0.009376, 0.023176, 0.986200],
    [0.547494, 0.607765, -0.155259, 0.181692, 0.781742, 0.036566, -0.010410, 0.027275, 0.983136],
    [0.498864, 0.674741, -0.173604, 0.205199, 0.754872, 0.039929, -0.011131, 0.030969, 0.980162],
    [0.457771, 0.731899, -0.189670, 0.226409, 0.731012, 0.042579, -0.011595, 0.034333, 0.977261],
    [0.422823, 0.781057, -0.203881, 0.245752, 0.709602, 0.044646, -0.011843, 0.037423, 0.974421],
    [0.392952, 0.823610, -0.216562, 0.263559, 0.690210, 0.046232, -0.011910, 0.040281, 0.971630],
    [0.367322, 0.860646, -0.227968, 0.280085, 0.672501, 0.047413, -0.011820, 0.042940, 0.968881],
  ],
  tritan: [
    [1, 0, 0, 0, 1, 0, 0, 0, 1],
    [0.926670, 0.092514, -0.019184, 0.021191, 0.964503, 0.014306, 0.008437, 0.054813, 0.936750],
    [0.895720, 0.133330, -0.029050, 0.029997, 0.945400, 0.024603, 0.013027, 0.104707, 0.882266],
    [0.905871, 0.127791, -0.033662, 0.026856, 0.941251, 0.031893, 0.013410, 0.148296, 0.838294],
    [0.948035, 0.089490, -0.037526, 0.014364, 0.946792, 0.038844, 0.010853, 0.193991, 0.795156],
    [1.017277, 0.027029, -0.044306, -0.006113, 0.958479, 0.047634, 0.006379, 0.248708, 0.744913],
    [1.104996, -0.046633, -0.058363, -0.032137, 0.971635, 0.060503, 0.001336, 0.317922, 0.680742],
    [1.193214, -0.109812, -0.083402, -0.058496, 0.979410, 0.079086, -0.002346, 0.403492, 0.598854],
    [1.257728, -0.139648, -0.118081, -0.078003, 0.975409, 0.102594, -0.003316, 0.501214, 0.502102],
    [1.278864, -0.125333, -0.153531, -0.084748, 0.957674, 0.127074, -0.000989, 0.601151, 0.399838],
    [1.255528, -0.076749, -0.178779, -0.078411, 0.930809, 0.147602, 0.004733, 0.691367, 0.303900],
  ],
};

const state = { sourceCanvas: null, sourceData: null, sourceName: "image", cards: new Map(), renderFrame: 0 };
let builtinSample = null;

function clamp(value) { return Math.min(1, Math.max(0, value)); }
const SRGB_TO_LINEAR = Float32Array.from({ length: 256 }, (_, value) => {
  const channel = value / 255;
  return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
});
const LINEAR_TO_SRGB = Uint8ClampedArray.from({ length: 8193 }, (_, index) => {
  const channel = index / 8192;
  const encoded = channel <= 0.0031308 ? 12.92 * channel : 1.055 * channel ** (1 / 2.4) - 0.055;
  return Math.round(clamp(encoded) * 255);
});
function toLinear(value) { return SRGB_TO_LINEAR[value]; }
function toSrgb(value) { return LINEAR_TO_SRGB[Math.round(clamp(value) * 8192)]; }
function matrixPixel(r, g, b, matrix) { return [matrix[0] * r + matrix[1] * g + matrix[2] * b, matrix[3] * r + matrix[4] * g + matrix[5] * b, matrix[6] * r + matrix[7] * g + matrix[8] * b]; }

function machadoMatrix(type, amount) {
  const scaled = amount * 10;
  const lower = Math.floor(scaled);
  const upper = Math.min(10, lower + 1);
  const mix = scaled - lower;
  return MACHADO[type][lower].map((value, index) => value + (MACHADO[type][upper][index] - value) * mix);
}

function simulateLinear(type, r, g, b, amount, method = algorithm.value) {
  if (type === "achromatopsia") {
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return [r + (luminance - r) * amount, g + (luminance - g) * amount, b + (luminance - b) * amount];
  }
  if (method === "brettel") {
    const params = BRETTEL[type];
    const dot = r * params.normal[0] + g * params.normal[1] + b * params.normal[2];
    const transformed = matrixPixel(r, g, b, dot >= 0 ? params.first : params.second);
    return transformed.map((value, index) => value * amount + [r, g, b][index] * (1 - amount));
  }
  if (method === "vienot") {
    const transformed = matrixPixel(r, g, b, VIENOT[type]);
    return transformed.map((value, index) => value * amount + [r, g, b][index] * (1 - amount));
  }
  return matrixPixel(r, g, b, machadoMatrix(type, amount));
}

function processImageData(type, sourceData = state.sourceData, method = algorithm.value, amount = Number(severity.value)) {
  const output = new ImageData(new Uint8ClampedArray(sourceData.data), sourceData.width, sourceData.height);
  const input = sourceData.data;
  const pixels = output.data;
  for (let index = 0; index < input.length; index += 4) {
    const linear = [toLinear(input[index]), toLinear(input[index + 1]), toLinear(input[index + 2])];
    const simulated = simulateLinear(type, linear[0], linear[1], linear[2], amount, method).map(toSrgb);
    pixels[index] = simulated[0]; pixels[index + 1] = simulated[1]; pixels[index + 2] = simulated[2];
  }
  return output;
}

function differenceImageData(simulated, sourceData = state.sourceData) {
  const source = sourceData.data;
  const target = simulated.data;
  const magnitudes = new Float32Array(source.length / 4);
  let maximum = 0;
  for (let index = 0, pixel = 0; index < source.length; index += 4, pixel += 1) {
    const magnitude = Math.hypot(target[index] - source[index], target[index + 1] - source[index + 1], target[index + 2] - source[index + 2]) / Math.sqrt(3);
    magnitudes[pixel] = magnitude;
    maximum = Math.max(maximum, magnitude);
  }
  const output = new ImageData(sourceData.width, sourceData.height);
  for (let index = 0, pixel = 0; index < output.data.length; index += 4, pixel += 1) {
    const normalized = maximum > 0 ? magnitudes[pixel] / maximum : 0;
    const value = Math.round(255 * Math.sqrt(normalized));
    output.data[index] = value; output.data[index + 1] = value; output.data[index + 2] = value; output.data[index + 3] = 255;
  }
  return output;
}

function renderBuiltinDemo() {
  if (!sampleOriginal || builtinSample || !sampleOriginal.complete || !sampleOriginal.naturalWidth) return;
  const scale = Math.min(1, 900 / sampleOriginal.naturalWidth);
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(sampleOriginal.naturalWidth * scale));
  canvas.height = Math.max(1, Math.round(sampleOriginal.naturalHeight * scale));
  const context = canvas.getContext("2d", { willReadFrequently: true });
  context.drawImage(sampleOriginal, 0, 0, canvas.width, canvas.height);
  const sourceData = context.getImageData(0, 0, canvas.width, canvas.height);
  const simulated = processImageData("deutan", sourceData, "brettel", 1);
  const difference = differenceImageData(simulated, sourceData);
  sampleSimulated.width = canvas.width;
  sampleSimulated.height = canvas.height;
  sampleSimulated.getContext("2d").putImageData(simulated, 0, 0);
  sampleDifference.width = canvas.width;
  sampleDifference.height = canvas.height;
  sampleDifference.getContext("2d").putImageData(difference, 0, 0);
  builtinSample = { canvas, data: sourceData };
}

function loadBuiltinSample() {
  if (!builtinSample) {
    sampleOriginal.decode().then(() => { renderBuiltinDemo(); loadBuiltinSample(); });
    return;
  }
  state.sourceCanvas = builtinSample.canvas;
  state.sourceData = builtinSample.data;
  state.sourceName = "status-table-demo";
  typeInputs.forEach((input) => { input.checked = input.value === "deutan"; });
  fileThumb.src = sampleOriginal.src;
  fileName.textContent = "Built-in status table";
  fileMeta.textContent = `${state.sourceData.width} × ${state.sourceData.height} · built-in example`;
  dropZone.hidden = true;
  fileSummary.hidden = false;
  emptyState.hidden = true;
  resultGrid.hidden = false;
  downloadComparison.setAttribute("aria-disabled", "false");
  renderResults();
  resultsPanel.scrollIntoView({ behavior: "smooth", block: "start" });
}

function selectedTypes() { return typeInputs.filter((input) => input.checked).map((input) => input.value); }

function createCard(type, index) {
  const fragment = resultCardTemplate.content.cloneNode(true);
  const card = fragment.querySelector(".result-card");
  card.dataset.type = type;
  fragment.querySelector(".card-index").textContent = String(index + 1).padStart(2, "0");
  fragment.querySelector(".card-title").textContent = TYPE_LABELS[type];
  resultGrid.append(fragment);
  const appendedCard = resultGrid.lastElementChild;
  state.cards.set(type, {
    card: appendedCard,
    sourceCanvas: appendedCard.querySelector(".source-canvas"),
    simulatedCanvas: appendedCard.querySelector(".simulated-canvas"),
    differenceCanvas: appendedCard.querySelector(".difference-canvas"),
    algorithmLabel: appendedCard.querySelector(".algorithm-label"),
    severityLabel: appendedCard.querySelector(".severity-label"),
    downloadButton: appendedCard.querySelector(".download-button"),
  });
}

function putImageData(canvas, imageData) { canvas.width = imageData.width; canvas.height = imageData.height; canvas.getContext("2d").putImageData(imageData, 0, 0); }
function drawSourceTo(canvas) { canvas.width = state.sourceCanvas.width; canvas.height = state.sourceCanvas.height; canvas.getContext("2d").drawImage(state.sourceCanvas, 0, 0); }

function renderResults() {
  if (!state.sourceCanvas || !state.sourceData) return;
  resultsPanel.setAttribute("aria-busy", "true");
  const types = selectedTypes();
  const existing = [...state.cards.keys()];
  const sameCards = existing.length === types.length && existing.every((type, index) => type === types[index]);
  if (!sameCards) { resultGrid.replaceChildren(); state.cards.clear(); types.forEach(createCard); }
  types.forEach((type) => {
    const view = state.cards.get(type);
    const simulated = processImageData(type);
    drawSourceTo(view.sourceCanvas);
    putImageData(view.simulatedCanvas, simulated);
    putImageData(view.differenceCanvas, differenceImageData(simulated));
    view.algorithmLabel.textContent = type === "achromatopsia" ? "Luminance grayscale" : ALGORITHM_LABELS[algorithm.value];
    view.severityLabel.textContent = `Strength ${Number(severity.value).toFixed(2)}`;
    view.downloadButton.href = view.simulatedCanvas.toDataURL("image/png");
    view.downloadButton.download = `${state.sourceName}-${type}-${algorithm.value}.png`;
  });
  resultsPanel.setAttribute("aria-busy", "false");
  statusPill.classList.toggle("is-ready", types.length > 0);
  statusPill.querySelector("b").textContent = types.length > 0 ? `${types.length} ${types.length === 1 ? "view" : "views"} ready` : "Select a deficiency view";
}

function scheduleRender() { cancelAnimationFrame(state.renderFrame); state.renderFrame = requestAnimationFrame(renderResults); }

function setSeverityUI() {
  const number = Number(severity.value);
  severityValue.textContent = number.toFixed(2);
  severity.style.setProperty("--range-progress", `${number * 100}%`);
  strengthPresets.forEach((button) => button.classList.toggle("is-active", Math.abs(Number(button.dataset.strength) - number) < 0.001));
}

function setAlgorithmUI() {
  algorithmNote.textContent = ALGORITHM_NOTES[algorithm.value];
  severityNote.textContent = ["machado", "deficiencyview"].includes(algorithm.value)
    ? "This method uses severity-specific matrices between 0 and 1."
    : "This method blends between the original and the full dichromacy model.";
}

function formatBytes(bytes) { if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`; return `${(bytes / (1024 * 1024)).toFixed(1)} MB`; }
function baseName(name) { return name.replace(/\.[^.]+$/, "").replace(/[^a-z0-9-_]+/gi, "-").replace(/^-|-$/g, "") || "image"; }

async function decodeFile(file) {
  if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) throw new Error("Choose a JPEG, PNG, or WebP image.");
  if ("createImageBitmap" in window) return createImageBitmap(file);
  const url = URL.createObjectURL(file);
  try { const image = new Image(); image.src = url; await image.decode(); return image; } finally { URL.revokeObjectURL(url); }
}

async function loadFile(file) {
  if (!file) return;
  statusPill.classList.remove("is-ready");
  statusPill.querySelector("b").textContent = "Reading local image";
  resultsPanel.setAttribute("aria-busy", "true");
  try {
    const bitmap = await decodeFile(file);
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width || bitmap.naturalWidth;
    canvas.height = bitmap.height || bitmap.naturalHeight;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    context.drawImage(bitmap, 0, 0);
    state.sourceCanvas = canvas; state.sourceData = context.getImageData(0, 0, canvas.width, canvas.height); state.sourceName = baseName(file.name);
    if (typeof bitmap.close === "function") bitmap.close();
    const thumbUrl = URL.createObjectURL(file);
    fileThumb.onload = () => URL.revokeObjectURL(thumbUrl);
    fileThumb.src = thumbUrl;
    fileName.textContent = file.name;
    fileMeta.textContent = `${canvas.width} × ${canvas.height} · ${formatBytes(file.size)}`;
    dropZone.hidden = true; fileSummary.hidden = false; emptyState.hidden = true; resultGrid.hidden = false;
    downloadComparison.setAttribute("aria-disabled", "false");
    renderResults();
    return true;
  } catch (error) {
    statusPill.querySelector("b").textContent = error.message || "Could not read image";
    resultsPanel.setAttribute("aria-busy", "false");
    return false;
  }
}

function buildCompositeCanvas() {
  if (!state.cards.size) return null;
  const cards = [...state.cards.entries()];
  const sourceWidth = state.sourceCanvas.width;
  const sourceHeight = state.sourceCanvas.height;
  const labelHeight = Math.max(60, Math.round(sourceWidth * 0.065));
  const gap = Math.max(12, Math.round(sourceWidth * 0.014));
  const output = document.createElement("canvas");
  output.width = sourceWidth * 3 + gap * 4;
  output.height = cards.length * (sourceHeight + labelHeight + gap) + gap;
  const context = output.getContext("2d");
  context.fillStyle = "#080a0f"; context.fillRect(0, 0, output.width, output.height);
  context.textBaseline = "middle"; context.font = `700 ${Math.max(18, Math.round(labelHeight * 0.28))}px Arial, sans-serif`;
  cards.forEach(([type, view], row) => {
    const y = gap + row * (sourceHeight + labelHeight + gap);
    const panes = [["Original", view.sourceCanvas], [`${TYPE_LABELS[type]} · Simulated`, view.simulatedCanvas], ["Difference · brighter means more change", view.differenceCanvas]];
    panes.forEach(([label, canvas], column) => {
      const x = gap + column * (sourceWidth + gap);
      context.fillStyle = column === 2 ? "#c7f464" : "#f5f7fb";
      context.fillText(label, x, y + labelHeight / 2);
      context.drawImage(canvas, x, y + labelHeight, sourceWidth, sourceHeight);
    });
  });
  return output;
}

function prepareCompositeDownload(event) {
  if (!state.cards.size || downloadComparison.getAttribute("aria-disabled") === "true") { event.preventDefault(); return; }
  const output = buildCompositeCanvas();
  downloadComparison.href = output.toDataURL("image/png");
  downloadComparison.download = `${state.sourceName}-color-blindness-comparison.png`;
}

function openPicker() { fileInput.click(); }
const FILTER_PRESETS = {
  all: { method: "brettel", strength: 1, types: ["protan", "deutan", "tritan", "achromatopsia"] },
  "red-green": { method: "machado", strength: 1, types: ["protan", "deutan"] },
  deutan: { method: "machado", strength: 1, types: ["deutan"] },
  protan: { method: "machado", strength: 1, types: ["protan"] },
  protanomaly: { method: "machado", strength: 0.5, types: ["protan"] },
  tritan: { method: "brettel", strength: 1, types: ["tritan"] },
};

async function applyFilterPreset(name) {
  const preset = FILTER_PRESETS[name];
  if (!preset) return;
  const feedback = document.querySelector("#filterFeedback");
  try {
    if (!state.sourceCanvas) {
      await sampleOriginal.decode();
      renderBuiltinDemo();
      loadBuiltinSample();
    }
    algorithm.value = preset.method;
    severity.value = String(preset.strength);
    typeInputs.forEach((input) => { input.checked = preset.types.includes(input.value); });
    setAlgorithmUI();
    setSeverityUI();
    renderResults();
    feedback.textContent = `${preset.types.map((type) => TYPE_LABELS[type]).join(" + ")} · ${ALGORITHM_LABELS[preset.method]} · Strength ${preset.strength.toFixed(2)}. Settings applied to the image in the existing simulator.`;
  } catch (error) {
    feedback.textContent = "The example could not be opened. Choose a local image in the simulator, then select the filter shortcut again.";
  }
}

document.querySelectorAll("[data-filter-preset]").forEach((link) => {
  link.addEventListener("click", () => { applyFilterPreset(link.dataset.filterPreset); });
});

// Landscape uses its standalone image asset; other scene sources stay unchanged.
const SCENE_LANDSCAPE_URL = "./assets/scene-landscape.jpg";
const sceneButtons = [...document.querySelectorAll("[data-scene]")];
const sceneSources = new Map();
const sceneFeedback = document.querySelector("#sceneFeedback");
let sceneLoading = false;

function drawScene(id) {
  const canvas = document.createElement("canvas");
  canvas.width = 720;
  canvas.height = 480;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#f4f6fa";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#182333";
  ctx.font = "bold 26px Arial, sans-serif";
  const colors = ["#e94b44", "#31a05a", "#287bc1", "#edb42c", "#ad62ba", "#ed823d", "#32b3b1", "#d64e86"];
  if (id === "pencils") {
    ctx.fillText("A row of pencils", 34, 48);
    colors.forEach((color, i) => {
      const x = 54 + i * 80;
      ctx.fillStyle = color;
      ctx.fillRect(x, 130, 48, 260);
      ctx.fillStyle = "rgba(255,255,255,0.25)";
      ctx.fillRect(x + 7, 130, 10, 260);
      ctx.fillStyle = "#dfbd8b";
      ctx.beginPath(); ctx.moveTo(x, 130); ctx.lineTo(x + 24, 72); ctx.lineTo(x + 48, 130); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#253042";
      ctx.beginPath(); ctx.moveTo(x + 16, 92); ctx.lineTo(x + 24, 72); ctx.lineTo(x + 32, 92); ctx.closePath(); ctx.fill();
      ctx.font = "bold 20px Arial, sans-serif";
      ctx.fillText(String(i + 1), x + 17, 429);
    });
  } else if (id === "line-chart") {
    ctx.fillText("Weekly totals · example data", 34, 48);
    ctx.strokeStyle = "#bfc7d1"; ctx.lineWidth = 1;
    for (let y = 110; y <= 350; y += 60) { ctx.beginPath(); ctx.moveTo(70, y); ctx.lineTo(635, y); ctx.stroke(); }
    ctx.strokeStyle = "#263446"; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(70, 90); ctx.lineTo(70, 370); ctx.lineTo(640, 370); ctx.stroke();
    [[290, 245, 260, 160, 125, 100], [320, 260, 205, 225, 165, 135], [180, 195, 150, 185, 230, 205]].forEach((ys, row) => {
      ctx.strokeStyle = colors[row]; ctx.fillStyle = colors[row]; ctx.lineWidth = 6; ctx.setLineDash(row === 1 ? [16, 10] : row === 2 ? [4, 10] : []);
      ctx.beginPath(); ys.forEach((y, i) => { if (i === 0) ctx.moveTo(90, y); else ctx.lineTo(90 + i * 94, y); }); ctx.stroke(); ctx.setLineDash([]);
      ys.forEach((y, i) => { const x = 90 + i * 94; ctx.beginPath(); if (row === 0) ctx.arc(x, y, 7, 0, Math.PI * 2); else if (row === 1) ctx.rect(x - 7, y - 7, 14, 14); else { ctx.moveTo(x, y - 9); ctx.lineTo(x + 9, y + 7); ctx.lineTo(x - 9, y + 7); ctx.closePath(); } ctx.fill(); });
      ctx.font = "bold 22px Arial, sans-serif"; ctx.fillText(String.fromCharCode(65 + row), 585, ys[5] + 8);
    });
    ctx.fillStyle = "#263446"; ctx.font = "20px Arial, sans-serif";
    ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].forEach((day, i) => ctx.fillText(day, 70 + i * 94, 405));
    ctx.fillText("A: circles   B: squares   C: triangles", 100, 451);
  } else if (id === "pie-chart") {
    ctx.fillText("Example segments", 34, 48);
    let angle = -Math.PI / 2;
    [4, 3, 2, 1].forEach((weight, i) => {
      const end = angle + Math.PI * 2 * weight / 10;
      ctx.beginPath(); ctx.moveTo(260, 255); ctx.arc(260, 255, 163, angle, end); ctx.closePath(); ctx.fillStyle = colors[i]; ctx.fill(); ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 5; ctx.stroke();
      const mid = (angle + end) / 2;
      ctx.fillStyle = "#ffffff"; ctx.beginPath(); ctx.arc(260 + Math.cos(mid) * 110, 255 + Math.sin(mid) * 110, 20, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#172435"; ctx.font = "bold 23px Arial, sans-serif"; ctx.textAlign = "center"; ctx.fillText(String.fromCharCode(65 + i), 260 + Math.cos(mid) * 110, 263 + Math.sin(mid) * 110); ctx.textAlign = "left";
      ctx.fillStyle = colors[i]; ctx.fillRect(475, 130 + i * 70, 28, 28); ctx.fillStyle = "#263446"; ctx.fillText(`Group ${String.fromCharCode(65 + i)}`, 517, 153 + i * 70);
      angle = end;
    });
  } else if (id === "color-wheel") {
    ctx.fillText("Twelve hues", 34, 48);
    for (let i = 0; i < 12; i += 1) {
      const start = i * Math.PI / 6 - Math.PI / 2;
      ctx.beginPath(); ctx.moveTo(360, 253); ctx.arc(360, 253, 180, start, start + Math.PI / 6); ctx.closePath(); ctx.fillStyle = `hsl(${i * 30} 78% 50%)`; ctx.fill(); ctx.strokeStyle = "#f4f6fa"; ctx.lineWidth = 3; ctx.stroke();
      const mid = start + Math.PI / 12;
      const x = 360 + Math.cos(mid) * 141; const y = 253 + Math.sin(mid) * 141;
      ctx.fillStyle = "#ffffff"; ctx.beginPath(); ctx.arc(x, y, 18, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = "#172435"; ctx.font = "bold 18px Arial, sans-serif"; ctx.textAlign = "center"; ctx.fillText(String(i + 1), x, y + 6);
    }
    ctx.textAlign = "left";
  } else if (id === "clothing") {
    ctx.fillText("Pick a top by its label", 34, 48);
    colors.slice(0, 6).forEach((color, i) => {
      const x = 67 + (i % 3) * 220; const y = 92 + Math.floor(i / 3) * 188;
      ctx.fillStyle = color; ctx.strokeStyle = "#263446"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(x + 35, y); ctx.lineTo(x, y + 24); ctx.lineTo(x + 20, y + 65); ctx.lineTo(x + 39, y + 52); ctx.lineTo(x + 39, y + 132); ctx.lineTo(x + 139, y + 132); ctx.lineTo(x + 139, y + 52); ctx.lineTo(x + 158, y + 65); ctx.lineTo(x + 178, y + 24); ctx.lineTo(x + 143, y); ctx.lineTo(x + 113, y); ctx.quadraticCurveTo(x + 89, y + 30, x + 65, y); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#ffffff"; ctx.beginPath(); ctx.arc(x + 89, y + 67, 22, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = "#172435"; ctx.font = "bold 25px Arial, sans-serif"; ctx.textAlign = "center"; ctx.fillText(String.fromCharCode(65 + i), x + 89, y + 76); ctx.textAlign = "left";
    });
  } else if (id === "traffic-lights") {
    ctx.fillText("Keep the position and the label", 34, 48);
    ["STOP", "WAIT", "GO"].forEach((label, signal) => {
      const x = 84 + signal * 215;
      ctx.fillStyle = "#263446"; ctx.fillRect(x + 44, 360, 24, 58); ctx.fillStyle = "#131b28"; ctx.beginPath(); ctx.roundRect(x, 78, 112, 292, 24); ctx.fill();
      ["#ef4242", "#f3bd29", "#2cb85e"].forEach((color, lamp) => { ctx.fillStyle = lamp === signal ? color : "#344052"; ctx.beginPath(); ctx.arc(x + 56, 128 + lamp * 91, 34, 0, Math.PI * 2); ctx.fill(); });
      ctx.fillStyle = "#263446"; ctx.font = "bold 24px Arial, sans-serif"; ctx.textAlign = "center"; ctx.fillText(label, x + 56, 453); ctx.textAlign = "left";
    });
  }
  return canvas;
}

function paintSceneThumbnail(button, canvas) {
  const thumbnail = button.querySelector("canvas");
  thumbnail.getContext("2d").drawImage(canvas, 0, 0, thumbnail.width, thumbnail.height);
}

async function initializeSceneGallery() {
  sceneButtons.forEach((button) => {
    if (button.dataset.scene === "landscape") { button.disabled = true; return; }
    const canvas = drawScene(button.dataset.scene);
    sceneSources.set(button.dataset.scene, canvas);
    paintSceneThumbnail(button, canvas);
  });
  const landscapeButton = sceneButtons.find((button) => button.dataset.scene === "landscape");
  if (!landscapeButton) return;
  try {
    const image = new Image();
    image.src = SCENE_LANDSCAPE_URL;
    await image.decode();
    const canvas = document.createElement("canvas");
    canvas.width = 720; canvas.height = 480;
    canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
    sceneSources.set("landscape", canvas);
    paintSceneThumbnail(landscapeButton, canvas);
    landscapeButton.disabled = false;
  } catch (error) {
    sceneFeedback.textContent = "The landscape example could not be loaded. The other scenes are available.";
  }
}

async function loadScene(button) {
  if (sceneLoading || !sceneSources.has(button.dataset.scene)) return;
  sceneLoading = true;
  sceneButtons.forEach((choice) => { choice.disabled = true; });
  const label = button.querySelector("span").textContent;
  sceneFeedback.textContent = `Opening ${label.toLowerCase()} in the simulator…`;
  try {
    const canvas = sceneSources.get(button.dataset.scene);
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
    if (!blob) throw new Error("The scene image could not be created.");
    if (!selectedTypes().length) typeInputs.find((input) => input.value === "deutan").checked = true;
    const loaded = await loadFile(new File([blob], `${label}.png`, { type: "image/png" }));
    if (!loaded) throw new Error("The scene could not be opened.");
    fileInput.value = "";
    sceneButtons.forEach((choice) => { choice.setAttribute("aria-pressed", String(choice === button)); });
    sceneFeedback.textContent = `${label} is open in the existing simulator. Your selected method and strength are unchanged.`;
    resultsPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (error) {
    sceneFeedback.textContent = error.message || "The scene could not be opened. Please try another scene.";
  } finally {
    sceneLoading = false;
    sceneButtons.forEach((choice) => { choice.disabled = !sceneSources.has(choice.dataset.scene); });
  }
}

sceneButtons.forEach((button) => { button.addEventListener("click", () => { loadScene(button); }); });
fileInput.addEventListener("change", () => loadFile(fileInput.files[0]));
replaceButton.addEventListener("click", openPicker);
dropZone.addEventListener("keydown", (event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); openPicker(); } });
["dragenter", "dragover"].forEach((name) => dropZone.addEventListener(name, (event) => { event.preventDefault(); dropZone.classList.add("is-dragging"); }));
["dragleave", "drop"].forEach((name) => dropZone.addEventListener(name, (event) => { event.preventDefault(); dropZone.classList.remove("is-dragging"); }));
dropZone.addEventListener("drop", (event) => loadFile(event.dataTransfer.files[0]));
severity.addEventListener("input", () => { setSeverityUI(); scheduleRender(); });
strengthPresets.forEach((button) => button.addEventListener("click", () => { severity.value = button.dataset.strength; setSeverityUI(); scheduleRender(); }));
algorithm.addEventListener("change", () => { setAlgorithmUI(); scheduleRender(); });
typeInputs.forEach((input) => input.addEventListener("change", scheduleRender));
downloadComparison.addEventListener("click", prepareCompositeDownload);
loadSampleButton?.addEventListener("click", loadBuiltinSample);
sampleOriginal?.addEventListener("load", renderBuiltinDemo);

function registerWebMCP() {
  const context = navigator.modelContext ?? document.modelContext;
  if (!context?.registerTool) return;
  const allowedTypes = Object.keys(TYPE_LABELS);
  context.registerTool({
    name: "set_simulation_controls", title: "Set simulation controls", description: "Set the visible simulation method, strength, and deficiency views.",
    inputSchema: { type: "object", properties: { algorithm: { type: "string", enum: Object.keys(ALGORITHM_LABELS) }, severity: { type: "number", minimum: 0, maximum: 1 }, types: { type: "array", items: { type: "string", enum: allowedTypes }, uniqueItems: true } }, additionalProperties: false },
    annotations: { readOnlyHint: false, untrustedContentHint: false },
    execute(input) {
      if (!input || typeof input !== "object") throw new Error("Input must be an object.");
      if (input.algorithm !== undefined) { if (!Object.keys(ALGORITHM_LABELS).includes(input.algorithm)) throw new Error("Unsupported simulation method."); algorithm.value = input.algorithm; setAlgorithmUI(); }
      if (input.severity !== undefined) { if (!Number.isFinite(input.severity) || input.severity < 0 || input.severity > 1) throw new Error("Strength must be between 0 and 1."); severity.value = String(input.severity); setSeverityUI(); }
      if (input.types !== undefined) { if (!Array.isArray(input.types) || input.types.some((type) => !allowedTypes.includes(type))) throw new Error("Views contain an unsupported value."); typeInputs.forEach((control) => { control.checked = input.types.includes(control.value); }); }
      scheduleRender();
      return { algorithm: algorithm.value, severity: Number(severity.value), types: selectedTypes(), imageLoaded: Boolean(state.sourceCanvas) };
    },
  });
  context.registerTool({
    name: "get_simulation_status", title: "Get simulation status", description: "Read the visible simulation settings and whether a local image is loaded.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false }, annotations: { readOnlyHint: true, untrustedContentHint: false },
    execute() { return { algorithm: algorithm.value, severity: Number(severity.value), types: selectedTypes(), imageLoaded: Boolean(state.sourceCanvas), outputFormat: "PNG" }; },
  });
}

setSeverityUI();
setAlgorithmUI();
renderBuiltinDemo();
initializeSceneGallery();
registerWebMCP();
