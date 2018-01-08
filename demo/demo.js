import * as GridgyPresets from "../src/main.js";

const gridDataList = [{
  exportName: "square",
  tessExportName: "tessSquare",
  label: "Square",
  params: [
    ["width", "Width", 5],
    ["height", "Height", 5],
  ],
}, {
  exportName: "octagon",
  tessExportName: "tessOctagon",
  label: "Octagon",
  params: [
    ["width", "Width", 5],
    ["height", "Height", 5],
  ],
}, {
  exportName: "snubSquare",
  tessExportName: "tessSnubSquare",
  label: "Snub Square",
  params: [
    ["width", "Width", 3],
    ["height", "Height", 3],
  ],
}, {
  exportName: "cairo",
  tessExportName: "tessCairo",
  label: "Cairo",
  params: [
    ["width", "Width", 3],
    ["height", "Height", 3],
  ],
}, {
  exportName: "triangleH",
  tessExportName: "tessTriangleH",
  label: "Triangle (horizontal side)",
  params: [
    ["width", "Width", 5],
    ["height", "Height", 5],
  ],
}, {
  exportName: "triangleHDown",
  tessExportName: "tessTriangleH",
  label: "Triangle (pointing down)",
  params: [
    ["length", "Side length", 5],
  ],
}, {
  exportName: "triangleHUp",
  tessExportName: "tessTriangleH",
  label: "Triangle (pointing up)",
  params: [
    ["length", "Side length", 5],
  ],
}, {
  exportName: "triangleV",
  tessExportName: "tessTriangleV",
  label: "Triangle (vertical side)",
  params: [
    ["width", "Width", 5],
    ["height", "Height", 5],
  ],
}, {
  exportName: "triangleVRight",
  tessExportName: "tessTriangleV",
  label: "Triangle (pointing right)",
  params: [
    ["length", "Side length", 5],
  ],
}, {
  exportName: "triangleVLeft",
  tessExportName: "tessTriangleV",
  label: "Triangle (pointing left)",
  params: [
    ["length", "Side length", 5],
  ],
}, {
  exportName: "hexagonH",
  tessExportName: "tessHexagonH",
  label: "Hexagon (horizontal side)",
  params: [
    ["width", "Width", 5],
    ["height", "Height", 5],
  ],
}, {
  exportName: "hexagonHCubic",
  tessExportName: "tessHexagonH",
  label: "Hexagon (horizontal, cubic)",
  params: [
    ["widthTL", "Width (top left)", 4],
    ["widthTR", "Width (top right)", 4],
    ["height", "Height", 4],
  ],
}, {
  exportName: "hexagonV",
  tessExportName: "tessHexagonV",
  label: "Hexagon (vertical side)",
  params: [
    ["width", "Width", 5],
    ["height", "Height", 5],
  ],
}, {
  exportName: "hexagonVCubic",
  tessExportName: "tessHexagonV",
  label: "Hexagon (vertical, cubic)",
  params: [
    ["width", "Width", 4],
    ["heightTL", "Height (top left)", 4],
    ["heightBL", "Height (bottom left)", 4],
  ],
}];

const currentViewState = {
  currGridIndex: 0,
  gridParameters: {},
  originX: 80,
  originY: 80,
  scale: 100,
  currElType: "f",
  drawLabels: true,
  tessKeys: false,
  drawOutside: true,
  nearbyHighlightType: null,
  mousedPoint: null,
};

function cloneObj(x) {
  const clonedX = {};
  for (const k in x) { clonedX[k] = x[k]; }
  return clonedX;
}

function polygonIntersectsRect(polygon, rect) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  polygon.forEach(p => {
    minX = Math.min(p[0], minX);
    minY = Math.min(p[1], minY);
    maxX = Math.max(p[0], maxX);
    maxY = Math.max(p[1], maxY);
  });
  return maxX >= rect[0] && minX <= rect[0] + rect[2] &&
    maxY >= rect[1] && minY <= rect[1] + rect[3];
}

function findAllElsToDraw(grid) {
  const vertexSet = {};
  const edgeSet = {};
  const faceSet = {};
  function addFace(f) {
    if (faceSet[f]) { return; }
    if (!polygonIntersectsRect(grid.getFaceCoordinates(f), [0, 0, 800, 600])) {
      return;
    }
    faceSet[f] = true;
    grid.getEdgesOnFace(f).forEach(e => edgeSet[e] = true);
    grid.getVerticesOnFace(f).forEach(v => vertexSet[v] = true);
    grid.getAdjacentFaces(f).forEach(addFace);
  }
  grid.getFaceList().forEach(addFace);
  return {
    faces: Object.keys(faceSet),
    edges: Object.keys(edgeSet),
    vertices: Object.keys(vertexSet),
  };
}

function drawLabel(ctx, text, x, y, options = {}) {
  const {align = "center"} = options;

  ctx.font = "9px sans-serif";
  ctx.textAlign = align;
  ctx.textBaseline = "alphabetic";

  const {width} = ctx.measureText(text);
  let rectX = x - 2;
  if (align === "center") { rectX -= width / 2; }
  ctx.save();
  ctx.fillStyle = "#FFF";
  ctx.beginPath();
  ctx.rect(rectX, y - 6, width + 4, 13);
  ctx.globalAlpha = 0.8;
  ctx.fill();
  ctx.restore();

  ctx.fillText(text, x, y + 3);
}

function highlightFace(ctxLayers, grid, face, drawOutside, highlightType) {
  if (!drawOutside && !grid.hasFace(face)) { return; }
  const ctx = ctxLayers.face;
  ctx.fillStyle = highlightType === "mouse" ? "#FF7" : "#CFF";
  ctx.beginPath();
  grid.getFaceCoordinates(face).forEach(p => ctx.lineTo(p[0], p[1]));
  ctx.closePath();
  ctx.fill();
}

function highlightEdge(ctxLayers, grid, edge, drawOutside, highlightType) {
  if (!drawOutside && !grid.hasEdge(edge)) { return; }
  const ctx = ctxLayers.main;
  ctx.strokeStyle = highlightType === "mouse" ? "#F44" : "#88F";
  ctx.lineWidth = highlightType === "mouse" ? 5 : 4;
  ctx.beginPath();
  grid.getEdgeCoordinates(edge).forEach(p => ctx.lineTo(p[0], p[1]));
  ctx.stroke();
}

function highlightVertex(ctxLayers, grid, vertex, drawOutside, highlightType) {
  if (!drawOutside && !grid.hasVertex(vertex)) { return; }
  const ctx = ctxLayers.main;
  ctx.fillStyle = highlightType === "mouse" ? "#F44" : "#88F";
  const center = grid.getVertexCoordinates(vertex);
  const radius = highlightType === "mouse" ? 9 : 7;
  ctx.beginPath();
  ctx.arc(center[0], center[1], radius, 0, 2 * Math.PI);
  ctx.fill();
}

function highlightNearby(ctxLayers, grid, el, highlightInfo, drawOutside) {
  if (highlightInfo) {
    const highlightFunc = {
      f: highlightFace,
      e: highlightEdge,
      v: highlightVertex,
    }[highlightInfo[0]];
    const nearEls = grid[highlightInfo[1]](el);
    nearEls.forEach(nearEl => {
      highlightFunc(ctxLayers, grid, nearEl, drawOutside, "near");
    });
  }
}

function getHighlightInfo(elType, nearbyHighlightType) {
  if (elType === "f" && nearbyHighlightType === "e") {
    return ["e", "getEdgesOnFace"];
  } else if (elType === "f" && nearbyHighlightType === "v") {
    return ["v", "getVerticesOnFace"];
  } else if (elType === "e" && nearbyHighlightType === "f") {
    return ["f", "getFacesOnEdge"];
  } else if (elType === "e" && nearbyHighlightType === "v") {
    return ["v", "getVerticesOnEdge"];
  } else if (elType === "v" && nearbyHighlightType === "f") {
    return ["f", "getFacesOnVertex"];
  } else if (elType === "v" && nearbyHighlightType === "e") {
    return ["e", "getEdgesOnVertex"];
  } else if (elType === "f" && nearbyHighlightType === "adj") {
    return ["f", "getAdjacentFaces"];
  } else if (elType === "f" && nearbyHighlightType === "touch") {
    return ["f", "getTouchingFaces"];
  } else if (elType === "e" && nearbyHighlightType === "surr") {
    return ["e", "getSurroundingEdges"];
  } else if (elType === "e" && nearbyHighlightType === "touch") {
    return ["e", "getTouchingEdges"];
  } else if (elType === "v" && nearbyHighlightType === "surr") {
    return ["v", "getSurroundingVertices"];
  } else if (elType === "v" && nearbyHighlightType === "adj") {
    return ["v", "getAdjacentVertices"];
  }
  return null;
}

function getGrid(viewState) {
  const gridData = gridDataList[viewState.currGridIndex];
  const params = cloneObj(viewState.gridParameters);
  params.origin = [viewState.originX, viewState.originY];
  params.scale = viewState.scale;
  return GridgyPresets[gridData.exportName](params);
}

function getMousedEl(viewState) {
  const grid = getGrid(viewState);
  if (!viewState.mousedPoint) {
    return null;
  } else if (viewState.currElType === "f") {
    return grid.findFaceAt(viewState.mousedPoint);
  } else if (viewState.currElType === "e") {
    return grid.findEdgeAt(viewState.mousedPoint);
  } else if (viewState.currElType === "v") {
    return grid.findVertexAt(viewState.mousedPoint);
  }
}

function draw(viewState) {
  const mainCtx = document.getElementById("canvas").getContext("2d");
  const {width, height} = mainCtx.canvas;

  const mainLayer = document.createElement("canvas");
  mainLayer.width = width;
  mainLayer.height = height;
  const faceLayer = document.createElement("canvas");
  faceLayer.width = width;
  faceLayer.height = height;
  const ctxLayers = {
    main: mainLayer.getContext("2d"),
    face: faceLayer.getContext("2d"),
  };

  const grid = getGrid(viewState);
  const els = findAllElsToDraw(grid, width, height);

  initContext(ctxLayers.main);
  initContext(ctxLayers.face);
  function initContext(ctx) {
    ctx.clearRect(0, 0, width, height);
    ctx.setTransform(1, 0, 0, 1, 0.5, 0.5);
    ctx.lineCap = "round";
    ctx.beginPath();
  }

  if (viewState.drawOutside) {
    ctxLayers.main.lineWidth = 0.6;
    ctxLayers.main.strokeStyle = "#777";
    ctxLayers.main.beginPath();
    els.edges.forEach(e => {
      const coords = grid.getEdgeCoordinates(e);
      ctxLayers.main.moveTo(...coords[0]);
      ctxLayers.main.lineTo(...coords[1]);
    });
    ctxLayers.main.stroke();
  }

  ctxLayers.main.lineWidth = 2.5;
  ctxLayers.main.strokeStyle = "#000";
  ctxLayers.main.beginPath();
  grid.getEdgeList().forEach(e => {
    const coords = grid.getEdgeCoordinates(e);
    ctxLayers.main.moveTo(...coords[0]);
    ctxLayers.main.lineTo(...coords[1]);
  });
  ctxLayers.main.stroke();

  if (viewState.currElType === "f") {
    if (viewState.mousedPoint) {
      const mousedFace = grid.findFaceAt(viewState.mousedPoint);
      if (mousedFace && (viewState.drawOutside || grid.hasFace(mousedFace))) {
        const highlightInfo = getHighlightInfo("f", viewState.nearbyHighlightType);
        highlightNearby(ctxLayers, grid, mousedFace, highlightInfo, viewState.drawOutside);
        highlightFace(ctxLayers, grid, mousedFace, viewState.drawOutside, "mouse");
      }
    }
    if (viewState.drawLabels) {
      els.faces.forEach(f => {
        if (!viewState.drawOutside && !grid.hasFace(f)) { return; }
        const coords = grid.getFaceCoordinates(f);
        const centerX = coords.reduce((s, p) => s + p[0], 0) / coords.length;
        const centerY = coords.reduce((s, p) => s + p[1], 0) / coords.length;
        ctxLayers.main.fillStyle = grid.hasFace(f) ? "#000" : "#777";
        const text = viewState.tessKeys ? JSON.stringify(grid.toFaceTessKey(f)) : f;
        drawLabel(ctxLayers.main, text, centerX, centerY);
      });
    }
  } else if (viewState.currElType === "e") {
    if (viewState.mousedPoint) {
      const mousedEdge = grid.findEdgeAt(viewState.mousedPoint);
      if (mousedEdge && (viewState.drawOutside || grid.hasEdge(mousedEdge))) {
        const highlightInfo = getHighlightInfo("e", viewState.nearbyHighlightType);
        highlightNearby(ctxLayers, grid, mousedEdge, highlightInfo, viewState.drawOutside);
        highlightEdge(ctxLayers, grid, mousedEdge, viewState.drawOutside, "mouse");
      }
    }
    if (viewState.drawLabels) {
      els.edges.forEach(e => {
        if (!viewState.drawOutside && !grid.hasEdge(e)) { return; }
        const coords = grid.getEdgeCoordinates(e);
        ctxLayers.main.fillStyle = grid.hasEdge(e) ? "#000" : "#777";
        const text = viewState.tessKeys ? JSON.stringify(grid.toEdgeTessKey(e)) : e;
        drawLabel(ctxLayers.main, text, (coords[0][0] + coords[1][0]) / 2,
          (coords[0][1] + coords[1][1]) / 2);
      });
    }
  } else if (viewState.currElType === "v") {
    if (viewState.mousedPoint) {
      const mousedVertex = grid.findVertexAt(viewState.mousedPoint);
      if (mousedVertex && (viewState.drawOutside || grid.hasVertex(mousedVertex))) {
        const highlightInfo = getHighlightInfo("v", viewState.nearbyHighlightType);
        highlightNearby(ctxLayers, grid, mousedVertex, highlightInfo, viewState.drawOutside);
        highlightVertex(ctxLayers, grid, mousedVertex, viewState.drawOutside, "mouse");
      }
    }
    if (viewState.drawLabels) {
      els.vertices.forEach(v => {
        if (!viewState.drawOutside && !grid.hasVertex(v)) { return; }
        const coords = grid.getVertexCoordinates(v);
        ctxLayers.main.fillStyle = grid.hasVertex(v) ? "#000" : "#777";
        const text = viewState.tessKeys ? JSON.stringify(grid.toVertexTessKey(v)) : v;
        drawLabel(ctxLayers.main, text, coords[0] + 8, coords[1] + 13, {align: "left"});
      });
    }
  }

  mainCtx.fillStyle = "#FFF";
  mainCtx.fillRect(0, 0, width, height);
  mainCtx.drawImage(faceLayer, 0, 0);
  mainCtx.drawImage(mainLayer, 0, 0);
}

function update(viewState) {
  const gridData = gridDataList[viewState.currGridIndex];

  if (viewState.nearbyHighlightType) {
    const highlightInfo = getHighlightInfo(viewState.currElType,
      viewState.nearbyHighlightType);
    document.getElementById("highlight-method-name").innerHTML = highlightInfo ?
      "grid." + highlightInfo[1] :
      "(no grid method)";
  }

  const propsLines = gridData.params.map(p => {
    return p[0] + ": " + viewState.gridParameters[p[0]] + ",";
  });
  propsLines.push(`origin: [${viewState.originX}, ${viewState.originY}],`);
  propsLines.push(`scale: ${viewState.scale},`);
  const code = `
import {${gridData.exportName}} from "gridgy-presets";
const grid = ${gridData.exportName}({
${propsLines.map(s => "  " + s).join("\n")}
});
  `.replace(/^\s*|\s*$/g, "");
  document.getElementById("code").innerHTML = code;

  draw(viewState);
}

function attachChangeWithPoll(inputEl, getValue, onChange) {
  let currValue = getValue(inputEl);
  inputEl.addEventListener("change", evt => {
    currValue = getValue(inputEl);
    onChange(currValue, inputEl);
  });
  setInterval(() => {
    const newValue = getValue(inputEl);
    if (currValue !== newValue) {
      currValue = newValue;
      onChange(newValue, inputEl);
    }
  }, 100);
}

function setupGridParamUI(gridData) {
  const paramsContainer = document.getElementById("grid-params");
  paramsContainer.innerHTML = "";

  function makeNumberInput(id, label, initialValue, min, max, onChange) {
    const div = document.createElement("div");
    const inputEl = document.createElement("input");
    const labelEl = document.createElement("label");
    inputEl.setAttribute("id", id);
    labelEl.setAttribute("for", id);
    inputEl.setAttribute("type", "number");
    inputEl.value = initialValue;
    inputEl.setAttribute("min", min);
    inputEl.setAttribute("max", max);
    labelEl.innerHTML = label + " ";
    attachChangeWithPoll(inputEl, el => parseFloat(el.value), onChange);
    div.appendChild(labelEl);
    div.appendChild(inputEl);
    return div;
  }

  gridData.params.forEach((p, i) => {
    const id = "input-grid-param-" + i;
    let div;
    if (typeof p[2] === "number") {
      div = makeNumberInput(id, p[1], p[2], 1, 50, value => {
        currentViewState.gridParameters[p[0]] = value;
        update(currentViewState);
      });
    }
    div && paramsContainer.appendChild(div);
  });
  const originXDiv = makeNumberInput("input-origin-x", "Origin X",
    currentViewState.originX, -10000, 10000, value => {
      currentViewState.originX = value;
      update(currentViewState);
    }
  );
  const originYDiv = makeNumberInput("input-origin-y", "Origin Y",
    currentViewState.originY, -10000, 10000, value => {
      currentViewState.originY = value;
      update(currentViewState);
    }
  );
  const scaleDiv = makeNumberInput("input-scale", "Scale",
    currentViewState.scale, 1, 10000, value => {
      currentViewState.scale = value;
      update(currentViewState);
    }
  );
  paramsContainer.appendChild(originXDiv);
  paramsContainer.appendChild(originYDiv);
  paramsContainer.appendChild(scaleDiv);
}

function setGridIndex(index) {
  const gridData = gridDataList[index];
  setupGridParamUI(gridData);
  const params = {};
  gridData.params.forEach(p => params[p[0]] = p[2]);

  currentViewState.currGridIndex = index;
  currentViewState.gridParameters = params;
  currentViewState.originX = 80;
  currentViewState.originY = 80;
  currentViewState.scale = 100;
}

function initUI() {
  // Grid select
  const gridSelectEl = document.getElementById("input-grid-select");
  gridDataList.forEach((d, i) => {
    const optionEl = document.createElement("option");
    optionEl.setAttribute("value", String(i));
    optionEl.innerHTML = d.label;
    gridSelectEl.appendChild(optionEl);
  });
  gridSelectEl.addEventListener("change", evt => {
    setGridIndex(parseInt(evt.currentTarget.value));
    update(currentViewState);
  });
  // Initialize grid parameters
  setGridIndex(currentViewState.currGridIndex);

  // Canvas mouse
  const canvasEl = document.getElementById("canvas");
  canvasEl.addEventListener("mousemove", evt => {
    const clientRect = canvasEl.getBoundingClientRect();
    const newMousedPoint = [
      event.clientX - clientRect.left,
      event.clientY - clientRect.top,
    ];
    const prevMousedEl = getMousedEl(currentViewState);
    currentViewState.mousedPoint = newMousedPoint;
    const nextMousedEl = getMousedEl(currentViewState);
    if (prevMousedEl !== nextMousedEl) {
      update(currentViewState);
    }
  });
  canvasEl.addEventListener("mouseleave", evt => {
    currentViewState.mousedPoint = null;
    update(currentViewState);
  });

  // Element type
  const elTypeEls = document.querySelectorAll("input[type=radio][name=eltype]");
  for (let i = 0; i < elTypeEls.length; i += 1) {
    elTypeEls.item(i).addEventListener("change", evt => {
      currentViewState.currElType = evt.currentTarget.value;
      update(currentViewState);
    });
  }

  // Other misc things

  const drawLabelsEl = document.getElementById("input-draw-labels");
  drawLabelsEl.addEventListener("change", evt => {
    currentViewState.drawLabels = evt.currentTarget.checked;
    update(currentViewState);
  });
  currentViewState.drawLabels = drawLabelsEl.checked;

  const tessKeysEl = document.getElementById("input-tess-labels");
  tessKeysEl.addEventListener("change", evt => {
    currentViewState.tessKeys = evt.currentTarget.checked;
    update(currentViewState);
  });
  currentViewState.tessKeys = tessKeysEl.checked;

  const drawOutsideEl = document.getElementById("input-draw-outside");
  drawOutsideEl.addEventListener("change", evt => {
    currentViewState.drawOutside = evt.currentTarget.checked;
    update(currentViewState);
  });
  currentViewState.drawOutside = drawOutsideEl.checked;

  const highlightEl = document.getElementById("input-highlight");
  highlightEl.addEventListener("change", evt => {
    currentViewState.nearbyHighlightType = evt.currentTarget.value || null;
    update(currentViewState);
  });
  currentViewState.nearbyHighlightType = highlightEl.value || null;
}

document.addEventListener("DOMContentLoaded", function() {
  initUI();
  update(currentViewState);
});
