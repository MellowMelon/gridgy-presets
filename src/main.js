import {Grid, Tesselation} from "gridgy";

// Utilities and helpers

function map2D(width, height, f) {
  const ret = [];
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const el = f(x, y);
      if (el != null) {
        ret.push(el);
      }
    }
  }
  return ret;
}

function modifyFaceList(
  faceList,
  elToString = String,
  include = [],
  exclude = []
) {
  if (!include.length && !exclude.length) {
    return faceList;
  }
  const excludeSet = new Set();
  exclude.forEach(f => excludeSet.add(elToString(f)));
  include.forEach(f => excludeSet.add(elToString(f)));
  return faceList.filter(f => !excludeSet.has(elToString(f))).concat(include);
}

function makeGeometry(tesselation, tessFaceList, props) {
  const faceList = tessFaceList.map(props.fromFaceTessKey || (x => x));
  return new Grid({
    tesselation,
    faceList: modifyFaceList(
      faceList,
      props.elToString,
      props.include,
      props.exclude
    ),
    origin: props.origin,
    scale: props.scale,
    fromFaceTessKey: props.fromFaceTessKey,
    fromEdgeTessKey: props.fromEdgeTessKey,
    fromVertexTessKey: props.fromVertexTessKey,
    toFaceTessKey: props.toFaceTessKey,
    toEdgeTessKey: props.toEdgeTessKey,
    toVertexTessKey: props.toVertexTessKey,
    elToString: props.elToString,
  });
}

// Tesselations

const HRT2 = Math.sqrt(2) / 2;
const HRT3 = Math.sqrt(3) / 2;

export const tessSquare = new Tesselation({
  periodMatrix: [1, 0, 0, 1],
  faceVerticesTable: {
    "0": [[0, 0, "0"], [1, 0, "0"], [1, 1, "0"], [0, 1, "0"]],
  },
  vertexCoordinatesTable: {"0": [0, 0]},
});

export const tessOctagon = new Tesselation({
  periodMatrix: [HRT2 + 1, 0, 0, HRT2 + 1],
  faceVerticesTable: {
    "0": [
      [0, 0, "0"],
      [0, 0, "1"],
      [0, 0, "2"],
      [0, 0, "3"],
      [0, 0, "4"],
      [0, 0, "5"],
      [0, 0, "6"],
      [0, 0, "7"],
    ],
    "1": [[0, 0, "2"], [1, 0, "7"], [1, 0, "6"], [0, 0, "3"]],
    "2": [[0, 0, "5"], [0, 0, "4"], [0, 1, "1"], [0, 1, "0"]],
    "3": [
      [0, 0, "3"],
      [1, 0, "6"],
      [1, 0, "5"],
      [1, 1, "0"],
      [1, 1, "7"],
      [0, 1, "2"],
      [0, 1, "1"],
      [0, 0, "4"],
    ],
  },
  vertexCoordinatesTable: {
    "0": [HRT2 / 2, 0],
    "1": [HRT2 / 2 + 0.5, 0],
    "2": [HRT2 + 0.5, HRT2 / 2],
    "3": [HRT2 + 0.5, HRT2 / 2 + 0.5],
    "4": [HRT2 / 2 + 0.5, HRT2 + 0.5],
    "5": [HRT2 / 2, HRT2 + 0.5],
    "6": [0, HRT2 / 2 + 0.5],
    "7": [0, HRT2 / 2],
  },
});

export const tessSnubSquare = new Tesselation({
  periodMatrix: [2 * HRT3 + 1, 0, 0, 2 * HRT3 + 1],
  faceVerticesTable: {
    "0": [[0, 0, "0"], [0, 0, "1"], [0, 0, "3"], [0, 0, "6"]],
    "1": [[0, 0, "1"], [0, 0, "2"], [0, 0, "3"]],
    "2": [[0, 0, "6"], [0, 0, "3"], [0, 0, "5"]],
    "3": [[0, 0, "2"], [1, 0, "0"], [0, 0, "4"], [0, 0, "3"]],
    "4": [[1, 0, "0"], [1, 0, "6"], [0, 0, "4"]],
    "5": [[0, 0, "3"], [0, 0, "4"], [0, 0, "5"]],
    "6": [[0, 0, "6"], [0, 0, "5"], [0, 1, "1"], [0, 0, "7"]],
    "7": [[0, 0, "5"], [0, 1, "2"], [0, 1, "1"]],
    "8": [[0, 0, "7"], [0, 1, "1"], [0, 1, "0"]],
    "9": [[0, 0, "5"], [0, 0, "4"], [1, 0, "7"], [0, 1, "2"]],
    "10": [[0, 0, "4"], [1, 0, "6"], [1, 0, "7"]],
    "11": [[1, 0, "7"], [1, 1, "0"], [0, 1, "2"]],
  },
  vertexCoordinatesTable: {
    "0": [0, 0.5],
    "1": [HRT3, 0],
    "2": [HRT3 + 1, 0],
    "3": [HRT3 + 0.5, HRT3],
    "4": [2 * HRT3 + 0.5, HRT3 + 0.5],
    "5": [HRT3 + 0.5, HRT3 + 1],
    "6": [0.5, HRT3 + 0.5],
    "7": [0, 2 * HRT3 + 0.5],
  },
});

export const tessCairo = new Tesselation({
  periodMatrix: [2 * HRT3 + 1, 0, 0, 2 * HRT3 + 1],
  faceVerticesTable: {
    "0": [[0, 0, "0"], [0, 0, "1"], [0, 0, "3"], [0, 0, "5"], [0, 0, "2"]],
    "1": [[0, 0, "2"], [0, 0, "5"], [0, 0, "9"], [0, 0, "7"], [0, 0, "6"]],
    "2": [[0, 0, "3"], [0, 0, "4"], [0, 0, "10"], [0, 0, "9"], [0, 0, "5"]],
    "3": [[0, 0, "4"], [1, 0, "0"], [1, 0, "2"], [1, 0, "6"], [0, 0, "10"]],
    "4": [[0, 0, "6"], [0, 0, "7"], [0, 1, "1"], [0, 1, "0"], [0, 0, "8"]],
    "5": [[0, 0, "7"], [0, 0, "9"], [0, 0, "11"], [0, 1, "3"], [0, 1, "1"]],
    "6": [[0, 0, "9"], [0, 0, "10"], [1, 0, "6"], [1, 0, "8"], [0, 0, "11"]],
    "7": [[0, 0, "11"], [1, 0, "8"], [1, 1, "0"], [0, 1, "4"], [0, 1, "3"]],
  },
  vertexCoordinatesTable: {
    "0": [0, 0],
    "1": [HRT3 / 2 + 0.25, -HRT3 / 6 - 0.25],
    "2": [HRT3 / 6 + 0.25, HRT3 / 2 + 0.25],
    "3": [HRT3 + 0.5, 0],
    "4": [3 * HRT3 / 2 + 0.75, HRT3 / 6 + 0.25],
    "5": [5 * HRT3 / 6 + 0.25, HRT3 / 2 + 0.25],
    "6": [0, HRT3 + 0.5],
    "7": [HRT3 / 2 + 0.25, 7 * HRT3 / 6 + 0.75],
    "8": [-HRT3 / 6 - 0.25, 3 * HRT3 / 2 + 0.75],
    "9": [HRT3 + 0.5, HRT3 + 0.5],
    "10": [3 * HRT3 / 2 + 0.75, 5 * HRT3 / 6 + 0.25],
    "11": [7 * HRT3 / 6 + 0.75, 3 * HRT3 / 2 + 0.75],
  },
});

export const tessTriangleH = new Tesselation({
  periodMatrix: [1, 0, 0.5, HRT3],
  faceVerticesTable: {
    "0": [[0, 0, "0"], [1, 0, "0"], [0, 1, "0"]],
    "1": [[1, 0, "0"], [1, 1, "0"], [0, 1, "0"]],
  },
  vertexCoordinatesTable: {"0": [0, 0]},
});

export const tessTriangleV = new Tesselation({
  periodMatrix: [HRT3, 0.5, 0, 1],
  faceVerticesTable: {
    "0": [[0, 0, "0"], [1, 0, "0"], [0, 1, "0"]],
    "1": [[1, 0, "0"], [1, 1, "0"], [0, 1, "0"]],
  },
  vertexCoordinatesTable: {"0": [0, 0]},
});

export const tessHexagonH = new Tesselation({
  periodMatrix: [0.75, HRT3 / 2, 0, HRT3],
  faceVerticesTable: {
    "0": [
      [0, 0, "0"],
      [0, 0, "1"],
      [1, 0, "0"],
      [0, 1, "1"],
      [0, 1, "0"],
      [-1, 1, "1"],
    ],
  },
  vertexCoordinatesTable: {
    "0": [0, 0],
    "1": [0.5, 0],
  },
});

export const tessHexagonV = new Tesselation({
  periodMatrix: [HRT3, 0, HRT3 / 2, 0.75],
  faceVerticesTable: {
    "0": [
      [0, 0, "0"],
      [0, 0, "1"],
      [0, 1, "0"],
      [1, 0, "1"],
      [1, 0, "0"],
      [1, -1, "1"],
    ],
  },
  vertexCoordinatesTable: {
    "0": [0, 0],
    "1": [0, 0.5],
  },
});

// Geometries

export function square(props) {
  const {width, height} = props;
  const faceList = map2D(width, height, (x, y) => [x, y, "0"]);
  return makeGeometry(tessSquare, faceList, props);
}

export function octagon(props) {
  const {width, height} = props;
  const faceList = map2D(width, height, (x, y) => {
    return [Math.floor(x / 2), Math.floor(y / 2), String(x % 2 + 2 * (y % 2))];
  });
  return makeGeometry(tessOctagon, faceList, props);
}

export function snubSquare(props) {
  const {width, height} = props;
  const faceList = map2D(2 * width - 1, 2 * height - 1, (x, y) => {
    if (x % 2 === 1 && y % 2 === 1) {
      return null;
    }
    const qx = Math.floor(x / 4);
    const qy = Math.floor(y / 4);
    const fid =
      (x % 2 ? 1 : 0) +
      (y % 2 ? 2 : 0) +
      (x % 4 >= 2 ? 3 : 0) +
      (y % 4 >= 2 ? 6 : 0);
    return [qx, qy, String(fid)];
  });
  return makeGeometry(tessSnubSquare, faceList, props);
}

export function cairo(props) {
  const {width, height} = props;
  const faceList = map2D(width, 2 * height, (x, twiceY) => {
    const y = Math.floor(twiceY / 2);
    const hx = Math.floor(x / 2);
    const hy = Math.floor(y / 2);
    const fid = (x % 2 ? 2 : 0) + (y % 2 ? 4 : 0) + (twiceY % 2 ? 1 : 0);
    return [hx, hy, String(fid)];
  });
  return makeGeometry(tessCairo, faceList, props);
}

export function triangleH(props) {
  const {width, height} = props;
  const faceList = map2D(2 * width, height, (x, y) => {
    x -= y;
    return [Math.floor(x / 2), y, String(Math.abs(x % 2))];
  });
  return makeGeometry(tessTriangleH, faceList, props);
}

export function triangleHDown(props) {
  const {length} = props;
  const faceList = map2D(2 * length, length, (x, y) => {
    if (x + 2 * y >= 2 * length - 1) {
      return null;
    }
    return [Math.floor(x / 2), y, String(Math.abs(x % 2))];
  });
  return makeGeometry(tessTriangleH, faceList, props);
}

export function triangleHUp(props) {
  const {length} = props;
  const faceList = map2D(2 * length, length, (x, y) => {
    if (x + 2 * y < 2 * length - 1) {
      return null;
    }
    return [Math.floor(x / 2), y, String(Math.abs(x % 2))];
  });
  return makeGeometry(tessTriangleH, faceList, props);
}

export function triangleV(props) {
  const {width, height} = props;
  const faceList = map2D(width, 2 * height, (x, y) => {
    y -= x;
    return [x, Math.floor(y / 2), String(Math.abs(y % 2))];
  });
  return makeGeometry(tessTriangleV, faceList, props);
}

export function triangleVRight(props) {
  const {length} = props;
  const faceList = map2D(length, 2 * length, (x, y) => {
    if (2 * x + y >= 2 * length - 1) {
      return null;
    }
    return [x, Math.floor(y / 2), String(Math.abs(y % 2))];
  });
  return makeGeometry(tessTriangleV, faceList, props);
}

export function triangleVLeft(props) {
  const {length} = props;
  const faceList = map2D(length, 2 * length, (x, y) => {
    if (2 * x + y < 2 * length - 1) {
      return null;
    }
    return [x, Math.floor(y / 2), String(Math.abs(y % 2))];
  });
  return makeGeometry(tessTriangleV, faceList, props);
}

export function hexagonH(props) {
  const {width, height} = props;
  const faceList = map2D(width, height, (x, y) => {
    y -= Math.floor(x / 2);
    return [x, y, "0"];
  });
  return makeGeometry(tessHexagonH, faceList, props);
}

export function hexagonHCubic(props) {
  const {widthTL, widthTR, height} = props;
  const width = widthTL + widthTR - 1;
  const faceList = map2D(width, width + height, (x, y) => {
    y -= x;
    if (x + y < 0 || x + y > height + widthTR - 2) {
      return null;
    }
    if (y >= height || y <= -widthTL) {
      return null;
    }
    return [x, y, "0"];
  });
  return makeGeometry(tessHexagonH, faceList, props);
}

export function hexagonV(props) {
  const {width, height} = props;
  const faceList = map2D(width, height, (x, y) => {
    x -= Math.floor(y / 2);
    return [x, y, "0"];
  });
  return makeGeometry(tessHexagonV, faceList, props);
}

export function hexagonVCubic(props) {
  const {width, heightTL, heightBL} = props;
  const height = heightTL + heightBL - 1;
  const faceList = map2D(width + height, height, (x, y) => {
    x -= y;
    if (x + y < 0 || x + y > width + heightBL - 2) {
      return null;
    }
    if (x >= width || x <= -heightTL) {
      return null;
    }
    return [x, y, "0"];
  });
  return makeGeometry(tessHexagonV, faceList, props);
}
