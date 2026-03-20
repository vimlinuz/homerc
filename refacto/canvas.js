// Canvas Feature extracted from script.js
let canvasElem, canvasCtx;
let currentTemplate = 'blank';

// Import templates
let CanvasTemplates;
(function loadTemplates() {
  const script = document.createElement('script');
  script.src = 'canvasTemplates.js';
  script.onload = () => { CanvasTemplates = CanvasTemplates || window.CanvasTemplates; };
  document.head.appendChild(script);
})();
let isDrawing = false;
let currentColor = '#ffffff';
let currentSize = 5;
let strokePoints = [];

const openCanvasBtn = document.getElementById('openCanvasBtn');
const canvasOverlay = document.getElementById('canvasOverlay');
const canvasColor = document.getElementById('canvasColor');
const canvasBrush = document.getElementById('canvasBrush');
const canvasClear = document.getElementById('canvasClear');
const canvasSave = document.getElementById('canvasSave');
const canvasClose = document.getElementById('canvasClose');
const canvasUndo = document.getElementById('canvasUndo');
const canvasRedo = document.getElementById('canvasRedo');

// Canvas history stacks
let undoStack = [];
let redoStack = [];
const MAX_HISTORY = 50;

function showCanvasOverlay() {
  canvasOverlay.style.display = 'flex';
  resizeCanvas();
  window.addEventListener('keydown', canvasKeyHandler);
}
function hideCanvasOverlay() {
  canvasOverlay.style.display = 'none';
  window.removeEventListener('keydown', canvasKeyHandler);
}

function resizeCanvas() {
  if (CanvasTemplates && currentTemplate && CanvasTemplates[currentTemplate]) {
    CanvasTemplates[currentTemplate](canvasCtx, window.innerWidth, window.innerHeight);
  }
  if (!canvasElem) return;
  // Save canvas contents
  const imageData = canvasElem.toDataURL();
  const oldWidth = canvasElem.width;
  const oldHeight = canvasElem.height;

  // Resize canvas to viewport
  canvasElem.width = window.innerWidth;
  canvasElem.height = window.innerHeight;
  canvasCtx.lineCap = 'round';
  canvasCtx.lineJoin = 'round';

  // Restore canvas contents
  const img = new window.Image();
  img.src = imageData;
  img.onload = function () {
    // Fit image to new canvas size proportionally
    canvasCtx.drawImage(img, 0, 0, canvasElem.width, canvasElem.height);
  };
}

function startDrawing(e) {
  isDrawing = true;
  strokePoints = [];
  const rect = canvasElem.getBoundingClientRect();
  let x, y;
  if (e.touches) {
    const touch = e.touches[0];
    x = touch.clientX - rect.left;
    y = touch.clientY - rect.top;
  } else {
    x = e.clientX - rect.left;
    y = e.clientY - rect.top;
  }
  strokePoints.push({ x, y });
  canvasCtx.beginPath();
  canvasCtx.moveTo(x, y);
  // Save current state for undo
  saveStateForUndo();
}

function draw(e) {
  if (!isDrawing) return;
  const rect = canvasElem.getBoundingClientRect();
  canvasCtx.lineWidth = currentSize;
  canvasCtx.strokeStyle = currentColor;

  let x, y;
  if (e.touches) {
    const touch = e.touches[0];
    x = touch.clientX - rect.left;
    y = touch.clientY - rect.top;
  } else {
    x = e.clientX - rect.left;
    y = e.clientY - rect.top;
  }
  strokePoints.push({ x, y });

  // Improved brush smoothing: Catmull-Rom-like cubic Bezier
  if (strokePoints.length > 3) {
    const n = strokePoints.length;
    const p0 = strokePoints[n - 4];
    const p1 = strokePoints[n - 3];
    const p2 = strokePoints[n - 2];
    const p3 = strokePoints[n - 1];

    // Calculate control points
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    canvasCtx.beginPath();
    canvasCtx.moveTo(p1.x, p1.y);
    canvasCtx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
    canvasCtx.stroke();
  } else if (strokePoints.length > 1) {
    const prev = strokePoints[strokePoints.length - 2];
    canvasCtx.beginPath();
    canvasCtx.moveTo(prev.x, prev.y);
    canvasCtx.lineTo(x, y);
    canvasCtx.stroke();
  }
}

function stopDrawing() {
  isDrawing = false;
  // Clear redo stack
  redoStack = [];
}

function clearCanvas() {
  saveStateForUndo();
  canvasCtx.clearRect(0, 0, canvasElem.width, canvasElem.height);
}

function saveCanvas() {
  const link = document.createElement('a');
  link.download = 'canvas-drawing.png';
  link.href = canvasElem.toDataURL();
  link.click();
}

function saveStateForUndo() {
  // Trim history
  if (undoStack.length >= MAX_HISTORY) undoStack.shift();
  undoStack.push(canvasElem.toDataURL());
  if (undoStack.length > 1 && redoStack.length) redoStack = [];
}

function undoCanvas() {
  if (undoStack.length < 2) return;
  // Save current for redo
  if (redoStack.length >= MAX_HISTORY) redoStack.shift();
  redoStack.push(undoStack.pop());
  const lastState = undoStack[undoStack.length - 1];
  restoreCanvasState(lastState);
}

function redoCanvas() {
  if (!redoStack.length) return;
  const state = redoStack.pop();
  undoStack.push(state);
  restoreCanvasState(state);
}

function restoreCanvasState(dataURL) {
  const img = new window.Image();
  img.src = dataURL;
  img.onload = function () {
    canvasCtx.clearRect(0, 0, canvasElem.width, canvasElem.height);
    canvasCtx.drawImage(img, 0, 0, canvasElem.width, canvasElem.height);
  };
}

function initCanvasEvents() {
  canvasElem.addEventListener('mousedown', startDrawing);
  canvasElem.addEventListener('mousemove', draw);
  canvasElem.addEventListener('mouseup', stopDrawing);
  canvasElem.addEventListener('mouseout', stopDrawing);

  // Touch events for mobile
  canvasElem.addEventListener('touchstart', startDrawing);
  canvasElem.addEventListener('touchmove', draw);
  canvasElem.addEventListener('touchend', stopDrawing);

  canvasColor.addEventListener('change', e => { currentColor = e.target.value; });
  canvasBrush.addEventListener('input', e => {
  currentSize = e.target.value;
  document.getElementById('canvasBrushValue').textContent = currentSize;
});
  canvasUndo.addEventListener('click', undoCanvas);
  canvasRedo.addEventListener('click', redoCanvas);
}

function canvasKeyHandler(e) {
  // Undo: Ctrl+Z or Cmd+Z
  const isUndo = (e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === 'z';
  // Redo: Ctrl+Shift+Z, Ctrl+Y, Cmd+Shift+Z
  const isRedo = ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'z') || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y');

  if (isUndo) {
    e.preventDefault();
    undoCanvas();
  }
  if (isRedo) {
    e.preventDefault();
    redoCanvas();
  }
}

openCanvasBtn.addEventListener('click', () => {
  showCanvasOverlay();
  // Save initial canvas state
  undoStack = [];
  redoStack = [];
  saveStateForUndo();
});
canvasClose.addEventListener('click', () => {
  hideCanvasOverlay();
});
canvasClear.addEventListener('click', clearCanvas);
canvasSave.addEventListener('click', saveCanvas);

// Init on first overlay open
canvasOverlay.addEventListener('transitionend', () => {
  // no-op (could be refined)
});

document.addEventListener('DOMContentLoaded', () => {
  // Canvas setup
  canvasElem = document.getElementById('canvasElem');
  if (canvasElem) {
    canvasCtx = canvasElem.getContext('2d');
    resizeCanvas();
    initCanvasEvents();
    // Template change event
    const templateSelector = document.getElementById('canvasTemplate');
    if (templateSelector) {
      templateSelector.addEventListener('change', (e) => {
        currentTemplate = e.target.value;
        resizeCanvas();
      });
    }
  }
});

window.addEventListener('resize', resizeCanvas);
