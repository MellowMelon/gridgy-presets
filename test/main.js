import {describe, it} from "mocha";
import {expect} from "chai";

import * as Presets from "../src/main.js";

describe("tesselations", () => {
  // If tests are to prevent regressions, and any change is breaking, we may as
  // well repeat the code.

  const HRT2 = Math.sqrt(2) / 2;
  const HRT3 = Math.sqrt(3) / 2;

  it("tessSquare", () => {
    expect(Presets.tessSquare.getProps()).to.deep.equal({
      periodMatrix: [1, 0, 0, 1],
      faceVerticesTable: {
        "0": [[0, 0, "0"], [1, 0, "0"], [1, 1, "0"], [0, 1, "0"]],
      },
      vertexCoordinatesTable: {"0": [0, 0]},
    });
  });

  it("tessOctagon", () => {
    expect(Presets.tessOctagon.getProps()).to.deep.equal({
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
  });

  it("tessSnubSquare", () => {
    expect(Presets.tessSnubSquare.getProps()).to.deep.equal({
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
  });

  it("tessCairo", () => {
    expect(Presets.tessCairo.getProps()).to.deep.equal({
      periodMatrix: [2 * HRT3 + 1, 0, 0, 2 * HRT3 + 1],
      faceVerticesTable: {
        "0": [[0, 0, "0"], [0, 0, "1"], [0, 0, "3"], [0, 0, "5"], [0, 0, "2"]],
        "1": [[0, 0, "2"], [0, 0, "5"], [0, 0, "9"], [0, 0, "7"], [0, 0, "6"]],
        "2": [[0, 0, "3"], [0, 0, "4"], [0, 0, "10"], [0, 0, "9"], [0, 0, "5"]],
        "3": [[0, 0, "4"], [1, 0, "0"], [1, 0, "2"], [1, 0, "6"], [0, 0, "10"]],
        "4": [[0, 0, "6"], [0, 0, "7"], [0, 1, "1"], [0, 1, "0"], [0, 0, "8"]],
        "5": [[0, 0, "7"], [0, 0, "9"], [0, 0, "11"], [0, 1, "3"], [0, 1, "1"]],
        "6": [
          [0, 0, "9"],
          [0, 0, "10"],
          [1, 0, "6"],
          [1, 0, "8"],
          [0, 0, "11"],
        ],
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
  });

  it("tessTriangleH", () => {
    expect(Presets.tessTriangleH.getProps()).to.deep.equal({
      periodMatrix: [1, 0, 0.5, HRT3],
      faceVerticesTable: {
        "0": [[0, 0, "0"], [1, 0, "0"], [0, 1, "0"]],
        "1": [[1, 0, "0"], [1, 1, "0"], [0, 1, "0"]],
      },
      vertexCoordinatesTable: {"0": [0, 0]},
    });
  });

  it("tessTriangleV", () => {
    expect(Presets.tessTriangleV.getProps()).to.deep.equal({
      periodMatrix: [HRT3, 0.5, 0, 1],
      faceVerticesTable: {
        "0": [[0, 0, "0"], [1, 0, "0"], [0, 1, "0"]],
        "1": [[1, 0, "0"], [1, 1, "0"], [0, 1, "0"]],
      },
      vertexCoordinatesTable: {"0": [0, 0]},
    });
  });

  it("tessHexagonH", () => {
    expect(Presets.tessHexagonH.getProps()).to.deep.equal({
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
  });

  it("tessHexagonV", () => {
    expect(Presets.tessHexagonV.getProps()).to.deep.equal({
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
  });
});

describe("grids", () => {
  it("should transfer options like origin and scale straight to the grid", () => {
    const props = {
      width: 4,
      height: 7,
      origin: [10, 20],
      scale: 30,
      fromFaceTessKey: k => "F," + k[0] + "," + k[1],
      fromEdgeTessKey: k => "E," + k[0] + "," + k[1] + "," + (k[2] ? "v" : "h"),
      fromVertexTessKey: k => "V," + k[0] + "," + k[1],
      toFaceTessKey: k => {
        const parts = k.split(",");
        return [parseInt(parts[1]), parseInt(parts[2]), "0"];
      },
      toEdgeTessKey: k => {
        const parts = k.split(",");
        return [
          parseInt(parts[1]),
          parseInt(parts[2]),
          parts[3] === "v" ? 3 : 0,
          "0",
        ];
      },
      toVertexTessKey: k => {
        const parts = k.split(",");
        return [parseInt(parts[1]), parseInt(parts[2]), "0"];
      },
      elToString: (key, elType) => elType + String(key),
    };

    const grid = Presets.square(props);
    const keysToCheck = [
      "origin",
      "scale",
      "fromFaceTessKey",
      "fromEdgeTessKey",
      "fromVertexTessKey",
      "toFaceTessKey",
      "toEdgeTessKey",
      "toVertexTessKey",
      "elToString",
    ];
    const gridProps = grid.getProps();
    keysToCheck.forEach(k => {
      expect(gridProps[k], k).to.equal(props[k]);
    });
  });

  it("should augment the face list using the include array", () => {
    const grid = Presets.square({
      width: 2,
      height: 3,
      include: [[-1, 0, "0"]],
    });
    expect(grid.hasFace([-1, 0, "0"])).to.equal(true);
  });

  it("should remove from the face list using the exclude array", () => {
    const grid = Presets.square({
      width: 2,
      height: 3,
      exclude: [[0, 0, "0"]],
    });
    expect(grid.hasFace([0, 0, "0"])).to.equal(false);
  });

  it("should prioritize include over exclude", () => {
    const grid = Presets.square({
      width: 2,
      height: 3,
      exclude: [[0, 0, "0"]],
      include: [[0, 0, "0"]],
    });
    expect(grid.hasFace([0, 0, "0"])).to.equal(true);
  });

  it("square", () => {
    const grid = Presets.square({width: 4, height: 7});
    expect(grid.tesselation, "tesselation").to.equal(Presets.tessSquare);
    expect(grid.getFaceList(), "face count").to.have.length(28);
  });

  it("octagon", () => {
    const grid = Presets.octagon({width: 4, height: 7});
    expect(grid.tesselation, "tesselation").to.equal(Presets.tessOctagon);
    expect(grid.getFaceList(), "face count").to.have.length(28);
  });

  it("snubSquare", () => {
    const grid = Presets.snubSquare({width: 4, height: 7});
    expect(grid.tesselation, "tesselation").to.equal(Presets.tessSnubSquare);
    expect(grid.getFaceList(), "face count").to.have.length(73);
  });

  it("cairo", () => {
    const grid = Presets.cairo({width: 4, height: 7});
    expect(grid.tesselation, "tesselation").to.equal(Presets.tessCairo);
    expect(grid.getFaceList(), "face count").to.have.length(56);
  });

  it("triangleH", () => {
    const grid = Presets.triangleH({width: 4, height: 7});
    expect(grid.tesselation, "tesselation").to.equal(Presets.tessTriangleH);
    expect(grid.getFaceList(), "face count").to.have.length(56);
  });

  it("triangleHDown", () => {
    const grid = Presets.triangleHDown({length: 5});
    expect(grid.tesselation, "tesselation").to.equal(Presets.tessTriangleH);
    expect(grid.getFaceList(), "face count").to.have.length(25);
  });

  it("triangleHUp", () => {
    const grid = Presets.triangleHUp({length: 5});
    expect(grid.tesselation, "tesselation").to.equal(Presets.tessTriangleH);
    expect(grid.getFaceList(), "face count").to.have.length(25);
  });

  it("triangleV", () => {
    const grid = Presets.triangleV({width: 4, height: 7});
    expect(grid.tesselation, "tesselation").to.equal(Presets.tessTriangleV);
    expect(grid.getFaceList(), "face count").to.have.length(56);
  });

  it("triangleVRight", () => {
    const grid = Presets.triangleVRight({length: 5});
    expect(grid.tesselation, "tesselation").to.equal(Presets.tessTriangleV);
    expect(grid.getFaceList(), "face count").to.have.length(25);
  });

  it("triangleVLeft", () => {
    const grid = Presets.triangleVLeft({length: 5});
    expect(grid.tesselation, "tesselation").to.equal(Presets.tessTriangleV);
    expect(grid.getFaceList(), "face count").to.have.length(25);
  });

  it("hexagonH", () => {
    const grid = Presets.hexagonH({width: 4, height: 7});
    expect(grid.tesselation, "tesselation").to.equal(Presets.tessHexagonH);
    expect(grid.getFaceList(), "face count").to.have.length(28);
  });

  it("hexagonHCubic", () => {
    const grid = Presets.hexagonHCubic({widthTL: 3, widthTR: 4, height: 5});
    expect(grid.tesselation, "tesselation").to.equal(Presets.tessHexagonH);
    expect(grid.getFaceList(), "face count").to.have.length(36);
  });

  it("hexagonV", () => {
    const grid = Presets.hexagonV({width: 4, height: 7});
    expect(grid.tesselation, "tesselation").to.equal(Presets.tessHexagonV);
    expect(grid.getFaceList(), "face count").to.have.length(28);
  });

  it("hexagonVCubic", () => {
    const grid = Presets.hexagonVCubic({width: 3, heightTL: 4, heightBL: 5});
    expect(grid.tesselation, "tesselation").to.equal(Presets.tessHexagonV);
    expect(grid.getFaceList(), "face count").to.have.length(36);
  });
});
