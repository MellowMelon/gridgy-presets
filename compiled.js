(function () {
'use strict';

var _typeof$1 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};























































var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

var _typeof = typeof Symbol === "function" && _typeof$1(Symbol.iterator) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof$1(obj);
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof$1(obj);
};

/* global $ReadOnlyArray */

function forEachObj(obj, f) {
  for (var k in obj) {
    if (obj.hasOwnProperty(k)) {
      f(obj[k], k);
    }
  }
}

function isObject(obj) {
  return !!obj && (typeof obj === "undefined" ? "undefined" : _typeof(obj)) === "object";
}

function mapValues(obj, f) {
  var newObj = {};
  forEachObj(obj, function (v, k) {
    return newObj[k] = f(v, k);
  });
  return newObj;
}

function orderArrays(a1, a2) {
  for (var i = 0; i < a1.length; i += 1) {
    // We're okay with string+number inequality comparisons here
    if (a2.length <= i || a1[i] > a2[i]) {
      return [a2, a1];
    } else if (a1[i] < a2[i]) {
      return [a1, a2];
    }
  }
  return [a1, a2];
}

function union(nestedArray, without) {
  var stringify = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : String;

  var seenTable = {};
  without && without.forEach(function (el) {
    seenTable[stringify(el)] = true;
  });
  var ret = [];
  nestedArray.forEach(function (elArray) {
    elArray.forEach(function (el) {
      var seenKey = stringify(el);
      if (!seenTable[seenKey]) {
        seenTable[seenKey] = true;
        ret.push(el);
      }
    });
  });
  return ret;
}

var _slicedToArray$1 = function () {
    function sliceIterator(arr, i) {
        var _arr = [];var _n = true;var _d = false;var _e = undefined;try {
            for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                _arr.push(_s.value);if (i && _arr.length === i) break;
            }
        } catch (err) {
            _d = true;_e = err;
        } finally {
            try {
                if (!_n && _i["return"]) _i["return"]();
            } finally {
                if (_d) throw _e;
            }
        }return _arr;
    }return function (arr, i) {
        if (Array.isArray(arr)) {
            return arr;
        } else if (Symbol.iterator in Object(arr)) {
            return sliceIterator(arr, i);
        } else {
            throw new TypeError("Invalid attempt to destructure non-iterable instance");
        }
    };
}();

function invertMatrix2(_ref) {
    var _ref2 = _slicedToArray$1(_ref, 4),
        a = _ref2[0],
        b = _ref2[1],
        c = _ref2[2],
        d = _ref2[3];

    var det = a * d - b * c;
    if (det === 0) {
        throw new Error("Can't invert singular matrix [" + a + ", " + b + ", " + c + ", " + d + "]");
    }
    return [d / det, -b / det, -c / det, a / det];
}

function multMV2(_ref3, _ref4) {
    var _ref6 = _slicedToArray$1(_ref3, 4),
        a = _ref6[0],
        b = _ref6[1],
        c = _ref6[2],
        d = _ref6[3];

    var _ref5 = _slicedToArray$1(_ref4, 2),
        x = _ref5[0],
        y = _ref5[1];

    return [x * a + y * c, x * b + y * d];
}

function diffVV2(_ref7, _ref8) {
    var _ref10 = _slicedToArray$1(_ref7, 2),
        x1 = _ref10[0],
        y1 = _ref10[1];

    var _ref9 = _slicedToArray$1(_ref8, 2),
        x2 = _ref9[0],
        y2 = _ref9[1];

    return [x1 - x2, y1 - y2];
}

// These two functions solve the problem of taking a 2 by 2 period matrix
// as used by tesselations and writing an arbitrary point as a sum of one
// inside a base rectangle R plus an integer linear combination of the vectors
// in the period matrix.

// This is equivalent to finding a point with integer coordinates inside R
// after transforming it by the inverse of the period matrix and translating by
// the transform of the input point. Let that transform of R be Q, meaning that
// Q is a parallelogram.

// This first function chooses the size of R. This choice has the property that
// the center of Q is also the center of a 1 by 1 square inside of Q, which
// will make it very easy to find the desired integer point in the other
// function.

function getBaseRectSize(_ref11) {
    var _ref12 = _slicedToArray$1(_ref11, 4),
        a = _ref12[0],
        b = _ref12[1],
        c = _ref12[2],
        d = _ref12[3];

    return [Math.abs(a) + Math.abs(c), Math.abs(b) + Math.abs(d)];
}

// The second function decomposes a point into one inside R and an integer
// linear combination of the period matrix. It returns two 2-vectors. The first
// is the integer components of the period. The second is the point contained
// inside R. So if
// -- the passed point is [x, y]
// -- the passed period matrix is [a, b, c, d], and
// -- the return is [[r, s], [t, u]],
// then we have:
// -- r and s are integers,
// -- 0 <= t <= w, 0 <= u <= h for [w, h] the return of the above function,
// -- x = t + r * a + s * c,
// -- y = u + r * b + s * d.

function reducePoint(p, periodM) {
    var _getBaseRectSize = getBaseRectSize(periodM),
        _getBaseRectSize2 = _slicedToArray$1(_getBaseRectSize, 2),
        w = _getBaseRectSize2[0],
        h = _getBaseRectSize2[1];

    var invPeriodM = invertMatrix2(periodM);
    var transformedP = multMV2(invPeriodM, p);
    var centerOfQUnshifted = multMV2(invPeriodM, [w / 2, h / 2]);

    var _diffVV = diffVV2(transformedP, centerOfQUnshifted),
        _diffVV2 = _slicedToArray$1(_diffVV, 2),
        cx = _diffVV2[0],
        cy = _diffVV2[1];
    // The 1 by 1 square property guarantees this is inside Q.


    var _ref13 = [Math.round(cx), Math.round(cy)],
        r = _ref13[0],
        s = _ref13[1];

    return [[r, s], [p[0] - r * periodM[0] - s * periodM[2], p[1] - r * periodM[1] - s * periodM[3]]];
}

var _slicedToArray$3 = function () {
  function sliceIterator(arr, i) {
    var _arr = [];var _n = true;var _d = false;var _e = undefined;try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;_e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }return _arr;
  }return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();

// The matrix format [a, b, c, d] corresponds to
// [ a c ]
// [ b d ]

function isPointInRect(p, r2) {
  return p[0] <= r2[0] + r2[2] && r2[0] <= p[0] && p[1] <= r2[1] + r2[3] && r2[1] <= p[1];
}

function doRectsIntersect(r1, r2) {
  return r1[0] <= r2[0] + r2[2] && r2[0] <= r1[0] + r1[2] && r1[1] <= r2[1] + r2[3] && r2[1] <= r1[1] + r1[3];
}

function getBoundingBox(poly) {
  var minX = Infinity;
  var maxX = -Infinity;
  var minY = Infinity;
  var maxY = -Infinity;
  for (var i = 0; i < poly.length; i += 1) {
    minX = Math.min(poly[i][0], minX);
    maxX = Math.max(poly[i][0], maxX);
    minY = Math.min(poly[i][1], minY);
    maxY = Math.max(poly[i][1], maxY);
  }
  return [minX, minY, maxX - minX, maxY - minY];
}

function unionRects(rectList) {
  var points = [];
  for (var i = 0; i < rectList.length; i += 1) {
    var r = rectList[i];
    points.push([r[0], r[1]]);
    points.push([r[0] + r[2], r[1] + r[3]]);
  }
  return getBoundingBox(points);
}

// Based on https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html
function isPointInPolygon(_ref, poly) {
  var _ref2 = _slicedToArray$3(_ref, 2),
      x = _ref2[0],
      y = _ref2[1];

  var inside = false;
  for (var i = 0; i < poly.length; i += 1) {
    var _poly$i = _slicedToArray$3(poly[i], 2),
        x1 = _poly$i[0],
        y1 = _poly$i[1];

    var _poly = _slicedToArray$3(poly[(i + 1) % poly.length], 2),
        x2 = _poly[0],
        y2 = _poly[1];

    if (y1 > y !== y2 > y && x < (y - y1) * (x2 - x1) / (y2 - y1) + x1) {
      inside = !inside;
    }
  }
  return inside;
}

var _slicedToArray$2 = function () {
  function sliceIterator(arr, i) {
    var _arr = [];var _n = true;var _d = false;var _e = undefined;try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;_e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }return _arr;
  }return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();

// Given a base rectangle, the period of a tesselation, and some properties of
// the tesselation faces (a list of FIDs, the polygons, the touching faces),
// return an array of all faces whose rectangular bounding boxes intersect the
// base rectangle. The base rectangle must contain faces from the 0,0 period
// for this to work.

// All we do is compute the bounding rectangle of all faces in the base period,
// try the bounding rectangle for neighboring periods, then test each face for
// each working period. For finding neighboring periods to check, we go in 8
// directions from a working one, and we also use the periods of any touching
// faces.

// For an incomplete tesselation with a period matrix whose vectors are not
// chosen minimally, it is possible this will miss some faces, but this is a
// fairly extreme case.

function findFaceCover(baseRect, periodMatrix, faceIDs, getFacePolygon, getTouchingFaces) {
  // Compute the rectangle of each face, as well as the one containing all of
  // them. This is for the base period only.
  var faceRectTable = {};
  var faceRectList = [];
  faceIDs.forEach(function (fid) {
    var r = getBoundingBox(getFacePolygon(fid));
    faceRectTable[fid] = r;
    faceRectList.push(r);
  });
  var baseAllFacesRect = unionRects(faceRectList);

  // Compute all periods where the bounding rectangle of faces intersects the
  // given one. Stored in periodsThatIntersect.
  var periodsThatIntersect = [];
  var neighborPeriods = computeNeighborPeriods(faceIDs, getTouchingFaces);
  var alreadyCheckedPeriods = {};
  function checkPeriod(px, py) {
    if (!alreadyCheckedPeriods[px + "," + py]) {
      alreadyCheckedPeriods[px + "," + py] = true;
      var allFacesRect = moveRect(baseAllFacesRect, periodMatrix, px, py);
      if (doRectsIntersect(baseRect, allFacesRect)) {
        periodsThatIntersect.push([px, py]);
        neighborPeriods.forEach(function (_ref) {
          var _ref2 = _slicedToArray$2(_ref, 2),
              qx = _ref2[0],
              qy = _ref2[1];

          return checkPeriod(px + qx, py + qy);
        });
      }
    }
  }
  checkPeriod(0, 0);

  // Within these periods, compute the faces whose rectangles intersect the
  // given one. This is our final result.
  var ret = [];
  periodsThatIntersect.forEach(function (_ref3) {
    var _ref4 = _slicedToArray$2(_ref3, 2),
        px = _ref4[0],
        py = _ref4[1];

    forEachObj(faceRectTable, function (faceRect, fid) {
      faceRect = moveRect(faceRect, periodMatrix, px, py);
      if (doRectsIntersect(baseRect, faceRect)) {
        ret.push([px, py, fid]);
      }
    });
  });
  return ret;
}

function moveRect(r, _ref5, periodX, periodY) {
  var _ref6 = _slicedToArray$2(_ref5, 4),
      a = _ref6[0],
      b = _ref6[1],
      c = _ref6[2],
      d = _ref6[3];

  return [r[0] + a * periodX + c * periodY, r[1] + b * periodX + d * periodY, r[2], r[3]];
}

function computeNeighborPeriods(faceIDs, getTouchingFaces) {
  var retArray = [];
  // This is only used to avoid duplicates. We preinsert 0,0 which we don't
  // want in the return.
  var retTable = { "0,0": true };
  // Helper to only add to the return array if not added before.
  function add(x, y) {
    if (!retTable[x + "," + y]) {
      retTable[x + "," + y] = true;
      retArray.push([x, y]);
    }
  }
  add(-1, -1);
  add(-1, 0);
  add(-1, 1);
  add(0, -1);
  add(0, 1);
  add(1, -1);
  add(1, 0);
  add(1, 1);
  faceIDs.forEach(function (fid) {
    getTouchingFaces(fid).forEach(function (fKey) {
      add(fKey[0], fKey[1]);
    });
  });
  return retArray;
}

var _slicedToArray$4 = function () {
  function sliceIterator(arr, i) {
    var _arr = [];var _n = true;var _d = false;var _e = undefined;try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;_e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }return _arr;
  }return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();

// An extremely crude quad tree, in which all rectangles are known up-front
// and all queries are points.

// Since large rectangles will be moved into all child quad trees, we need a
// way to avoid infinitely subdividing. Our dumb solution to this is to
// increase the splitting limit each time the quad tree splits.
var QT_INITIAL_LIMIT = 5;
var QT_LIMIT_INCREMENT = 5;

// Instead of creating an object, we just return the query function.
function makeQuadTree(bb, rectData) {
  var splitLimit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : QT_INITIAL_LIMIT;

  var applicRects = rectData.filter(function (n) {
    return doRectsIntersect(bb, n[0]);
  });

  if (applicRects.length > splitLimit) {
    var _bb = _slicedToArray$4(bb, 4),
        x = _bb[0],
        y = _bb[1],
        w = _bb[2],
        h = _bb[3];

    var subTreeBBs = [[x, y, w / 2, h / 2], [x + w / 2, y, w / 2, h / 2], [x, y + h / 2, w / 2, h / 2], [x + w / 2, y + h / 2, w / 2, h / 2]];
    var newLimit = splitLimit + QT_LIMIT_INCREMENT;
    var subTreeQueries = subTreeBBs.map(function (subBB) {
      return makeQuadTree(subBB, applicRects, newLimit);
    });
    return function (point) {
      return findRectsInQuadTree(point, subTreeBBs, subTreeQueries);
    };
  }
  return function (point) {
    return applicRects.filter(function (r) {
      return isPointInRect(point, r[0]);
    });
  };
}

function findRectsInQuadTree(point, subTreeBBs, subTreeQueries) {
  for (var i = 0; i < 4; i += 1) {
    if (isPointInRect(point, subTreeBBs[i])) {
      return subTreeQueries[i](point);
    }
  }
  return [];
}

// A generalization of a quad tree to arbitrary polygons. Implemented by making
// a quad tree of bounding boxes and testing each of the results.

// Instead of creating an object, we just return the query function.
function makePolygonAtlas(bb, polygonData) {
  var rectData = polygonData.map(function (n) {
    return [getBoundingBox(n[0]), n];
  });
  var queryQuadTree = makeQuadTree(bb, rectData);
  return function (point) {
    return queryQuadTree(point).filter(function (c) {
      return isPointInPolygon(point, c[1][0]);
    }).map(function (c) {
      return c[1];
    });
  };
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var rhillVoronoiCore = createCommonjsModule(function (module) {
/*!
Copyright (C) 2010-2013 Raymond Hill: https://github.com/gorhill/Javascript-Voronoi
MIT License: See https://github.com/gorhill/Javascript-Voronoi/LICENSE.md
*/
/*
Author: Raymond Hill (rhill@raymondhill.net)
Contributor: Jesse Morgan (morgajel@gmail.com)
File: rhill-voronoi-core.js
Version: 0.98
Date: January 21, 2013
Description: This is my personal Javascript implementation of
Steven Fortune's algorithm to compute Voronoi diagrams.

License: See https://github.com/gorhill/Javascript-Voronoi/LICENSE.md
Credits: See https://github.com/gorhill/Javascript-Voronoi/CREDITS.md
History: See https://github.com/gorhill/Javascript-Voronoi/CHANGELOG.md

## Usage:

  var sites = [{x:300,y:300}, {x:100,y:100}, {x:200,y:500}, {x:250,y:450}, {x:600,y:150}];
  // xl, xr means x left, x right
  // yt, yb means y top, y bottom
  var bbox = {xl:0, xr:800, yt:0, yb:600};
  var voronoi = new Voronoi();
  // pass an object which exhibits xl, xr, yt, yb properties. The bounding
  // box will be used to connect unbound edges, and to close open cells
  result = voronoi.compute(sites, bbox);
  // render, further analyze, etc.

Return value:
  An object with the following properties:

  result.vertices = an array of unordered, unique Voronoi.Vertex objects making
    up the Voronoi diagram.
  result.edges = an array of unordered, unique Voronoi.Edge objects making up
    the Voronoi diagram.
  result.cells = an array of Voronoi.Cell object making up the Voronoi diagram.
    A Cell object might have an empty array of halfedges, meaning no Voronoi
    cell could be computed for a particular cell.
  result.execTime = the time it took to compute the Voronoi diagram, in
    milliseconds.

Voronoi.Vertex object:
  x: The x position of the vertex.
  y: The y position of the vertex.

Voronoi.Edge object:
  lSite: the Voronoi site object at the left of this Voronoi.Edge object.
  rSite: the Voronoi site object at the right of this Voronoi.Edge object (can
    be null).
  va: an object with an 'x' and a 'y' property defining the start point
    (relative to the Voronoi site on the left) of this Voronoi.Edge object.
  vb: an object with an 'x' and a 'y' property defining the end point
    (relative to Voronoi site on the left) of this Voronoi.Edge object.

  For edges which are used to close open cells (using the supplied bounding
  box), the rSite property will be null.

Voronoi.Cell object:
  site: the Voronoi site object associated with the Voronoi cell.
  halfedges: an array of Voronoi.Halfedge objects, ordered counterclockwise,
    defining the polygon for this Voronoi cell.

Voronoi.Halfedge object:
  site: the Voronoi site object owning this Voronoi.Halfedge object.
  edge: a reference to the unique Voronoi.Edge object underlying this
    Voronoi.Halfedge object.
  getStartpoint(): a method returning an object with an 'x' and a 'y' property
    for the start point of this halfedge. Keep in mind halfedges are always
    countercockwise.
  getEndpoint(): a method returning an object with an 'x' and a 'y' property
    for the end point of this halfedge. Keep in mind halfedges are always
    countercockwise.

TODO: Identify opportunities for performance improvement.

TODO: Let the user close the Voronoi cells, do not do it automatically. Not only let
      him close the cells, but also allow him to close more than once using a different
      bounding box for the same Voronoi diagram.
*/

/*global Math */

// ---------------------------------------------------------------------------

function Voronoi() {
    this.vertices = null;
    this.edges = null;
    this.cells = null;
    this.toRecycle = null;
    this.beachsectionJunkyard = [];
    this.circleEventJunkyard = [];
    this.vertexJunkyard = [];
    this.edgeJunkyard = [];
    this.cellJunkyard = [];
}

// ---------------------------------------------------------------------------

Voronoi.prototype.reset = function () {
    if (!this.beachline) {
        this.beachline = new this.RBTree();
    }
    // Move leftover beachsections to the beachsection junkyard.
    if (this.beachline.root) {
        var beachsection = this.beachline.getFirst(this.beachline.root);
        while (beachsection) {
            this.beachsectionJunkyard.push(beachsection); // mark for reuse
            beachsection = beachsection.rbNext;
        }
    }
    this.beachline.root = null;
    if (!this.circleEvents) {
        this.circleEvents = new this.RBTree();
    }
    this.circleEvents.root = this.firstCircleEvent = null;
    this.vertices = [];
    this.edges = [];
    this.cells = [];
};

Voronoi.prototype.sqrt = Math.sqrt;
Voronoi.prototype.abs = Math.abs;
Voronoi.prototype.ε = Voronoi.ε = 1e-9;
Voronoi.prototype.invε = Voronoi.invε = 1.0 / Voronoi.ε;
Voronoi.prototype.equalWithEpsilon = function (a, b) {
    return this.abs(a - b) < 1e-9;
};
Voronoi.prototype.greaterThanWithEpsilon = function (a, b) {
    return a - b > 1e-9;
};
Voronoi.prototype.greaterThanOrEqualWithEpsilon = function (a, b) {
    return b - a < 1e-9;
};
Voronoi.prototype.lessThanWithEpsilon = function (a, b) {
    return b - a > 1e-9;
};
Voronoi.prototype.lessThanOrEqualWithEpsilon = function (a, b) {
    return a - b < 1e-9;
};

// ---------------------------------------------------------------------------
// Red-Black tree code (based on C version of "rbtree" by Franck Bui-Huu
// https://github.com/fbuihuu/libtree/blob/master/rb.c

Voronoi.prototype.RBTree = function () {
    this.root = null;
};

Voronoi.prototype.RBTree.prototype.rbInsertSuccessor = function (node, successor) {
    var parent;
    if (node) {
        // >>> rhill 2011-05-27: Performance: cache previous/next nodes
        successor.rbPrevious = node;
        successor.rbNext = node.rbNext;
        if (node.rbNext) {
            node.rbNext.rbPrevious = successor;
        }
        node.rbNext = successor;
        // <<<
        if (node.rbRight) {
            // in-place expansion of node.rbRight.getFirst();
            node = node.rbRight;
            while (node.rbLeft) {
                node = node.rbLeft;
            }
            node.rbLeft = successor;
        } else {
            node.rbRight = successor;
        }
        parent = node;
    }
    // rhill 2011-06-07: if node is null, successor must be inserted
    // to the left-most part of the tree
    else if (this.root) {
            node = this.getFirst(this.root);
            // >>> Performance: cache previous/next nodes
            successor.rbPrevious = null;
            successor.rbNext = node;
            node.rbPrevious = successor;
            // <<<
            node.rbLeft = successor;
            parent = node;
        } else {
            // >>> Performance: cache previous/next nodes
            successor.rbPrevious = successor.rbNext = null;
            // <<<
            this.root = successor;
            parent = null;
        }
    successor.rbLeft = successor.rbRight = null;
    successor.rbParent = parent;
    successor.rbRed = true;
    // Fixup the modified tree by recoloring nodes and performing
    // rotations (2 at most) hence the red-black tree properties are
    // preserved.
    var grandpa, uncle;
    node = successor;
    while (parent && parent.rbRed) {
        grandpa = parent.rbParent;
        if (parent === grandpa.rbLeft) {
            uncle = grandpa.rbRight;
            if (uncle && uncle.rbRed) {
                parent.rbRed = uncle.rbRed = false;
                grandpa.rbRed = true;
                node = grandpa;
            } else {
                if (node === parent.rbRight) {
                    this.rbRotateLeft(parent);
                    node = parent;
                    parent = node.rbParent;
                }
                parent.rbRed = false;
                grandpa.rbRed = true;
                this.rbRotateRight(grandpa);
            }
        } else {
            uncle = grandpa.rbLeft;
            if (uncle && uncle.rbRed) {
                parent.rbRed = uncle.rbRed = false;
                grandpa.rbRed = true;
                node = grandpa;
            } else {
                if (node === parent.rbLeft) {
                    this.rbRotateRight(parent);
                    node = parent;
                    parent = node.rbParent;
                }
                parent.rbRed = false;
                grandpa.rbRed = true;
                this.rbRotateLeft(grandpa);
            }
        }
        parent = node.rbParent;
    }
    this.root.rbRed = false;
};

Voronoi.prototype.RBTree.prototype.rbRemoveNode = function (node) {
    // >>> rhill 2011-05-27: Performance: cache previous/next nodes
    if (node.rbNext) {
        node.rbNext.rbPrevious = node.rbPrevious;
    }
    if (node.rbPrevious) {
        node.rbPrevious.rbNext = node.rbNext;
    }
    node.rbNext = node.rbPrevious = null;
    // <<<
    var parent = node.rbParent,
        left = node.rbLeft,
        right = node.rbRight,
        next;
    if (!left) {
        next = right;
    } else if (!right) {
        next = left;
    } else {
        next = this.getFirst(right);
    }
    if (parent) {
        if (parent.rbLeft === node) {
            parent.rbLeft = next;
        } else {
            parent.rbRight = next;
        }
    } else {
        this.root = next;
    }
    // enforce red-black rules
    var isRed;
    if (left && right) {
        isRed = next.rbRed;
        next.rbRed = node.rbRed;
        next.rbLeft = left;
        left.rbParent = next;
        if (next !== right) {
            parent = next.rbParent;
            next.rbParent = node.rbParent;
            node = next.rbRight;
            parent.rbLeft = node;
            next.rbRight = right;
            right.rbParent = next;
        } else {
            next.rbParent = parent;
            parent = next;
            node = next.rbRight;
        }
    } else {
        isRed = node.rbRed;
        node = next;
    }
    // 'node' is now the sole successor's child and 'parent' its
    // new parent (since the successor can have been moved)
    if (node) {
        node.rbParent = parent;
    }
    // the 'easy' cases
    if (isRed) {
        return;
    }
    if (node && node.rbRed) {
        node.rbRed = false;
        return;
    }
    // the other cases
    var sibling;
    do {
        if (node === this.root) {
            break;
        }
        if (node === parent.rbLeft) {
            sibling = parent.rbRight;
            if (sibling.rbRed) {
                sibling.rbRed = false;
                parent.rbRed = true;
                this.rbRotateLeft(parent);
                sibling = parent.rbRight;
            }
            if (sibling.rbLeft && sibling.rbLeft.rbRed || sibling.rbRight && sibling.rbRight.rbRed) {
                if (!sibling.rbRight || !sibling.rbRight.rbRed) {
                    sibling.rbLeft.rbRed = false;
                    sibling.rbRed = true;
                    this.rbRotateRight(sibling);
                    sibling = parent.rbRight;
                }
                sibling.rbRed = parent.rbRed;
                parent.rbRed = sibling.rbRight.rbRed = false;
                this.rbRotateLeft(parent);
                node = this.root;
                break;
            }
        } else {
            sibling = parent.rbLeft;
            if (sibling.rbRed) {
                sibling.rbRed = false;
                parent.rbRed = true;
                this.rbRotateRight(parent);
                sibling = parent.rbLeft;
            }
            if (sibling.rbLeft && sibling.rbLeft.rbRed || sibling.rbRight && sibling.rbRight.rbRed) {
                if (!sibling.rbLeft || !sibling.rbLeft.rbRed) {
                    sibling.rbRight.rbRed = false;
                    sibling.rbRed = true;
                    this.rbRotateLeft(sibling);
                    sibling = parent.rbLeft;
                }
                sibling.rbRed = parent.rbRed;
                parent.rbRed = sibling.rbLeft.rbRed = false;
                this.rbRotateRight(parent);
                node = this.root;
                break;
            }
        }
        sibling.rbRed = true;
        node = parent;
        parent = parent.rbParent;
    } while (!node.rbRed);
    if (node) {
        node.rbRed = false;
    }
};

Voronoi.prototype.RBTree.prototype.rbRotateLeft = function (node) {
    var p = node,
        q = node.rbRight,
        // can't be null
    parent = p.rbParent;
    if (parent) {
        if (parent.rbLeft === p) {
            parent.rbLeft = q;
        } else {
            parent.rbRight = q;
        }
    } else {
        this.root = q;
    }
    q.rbParent = parent;
    p.rbParent = q;
    p.rbRight = q.rbLeft;
    if (p.rbRight) {
        p.rbRight.rbParent = p;
    }
    q.rbLeft = p;
};

Voronoi.prototype.RBTree.prototype.rbRotateRight = function (node) {
    var p = node,
        q = node.rbLeft,
        // can't be null
    parent = p.rbParent;
    if (parent) {
        if (parent.rbLeft === p) {
            parent.rbLeft = q;
        } else {
            parent.rbRight = q;
        }
    } else {
        this.root = q;
    }
    q.rbParent = parent;
    p.rbParent = q;
    p.rbLeft = q.rbRight;
    if (p.rbLeft) {
        p.rbLeft.rbParent = p;
    }
    q.rbRight = p;
};

Voronoi.prototype.RBTree.prototype.getFirst = function (node) {
    while (node.rbLeft) {
        node = node.rbLeft;
    }
    return node;
};

Voronoi.prototype.RBTree.prototype.getLast = function (node) {
    while (node.rbRight) {
        node = node.rbRight;
    }
    return node;
};

// ---------------------------------------------------------------------------
// Diagram methods

Voronoi.prototype.Diagram = function (site) {
    this.site = site;
};

// ---------------------------------------------------------------------------
// Cell methods

Voronoi.prototype.Cell = function (site) {
    this.site = site;
    this.halfedges = [];
    this.closeMe = false;
};

Voronoi.prototype.Cell.prototype.init = function (site) {
    this.site = site;
    this.halfedges = [];
    this.closeMe = false;
    return this;
};

Voronoi.prototype.createCell = function (site) {
    var cell = this.cellJunkyard.pop();
    if (cell) {
        return cell.init(site);
    }
    return new this.Cell(site);
};

Voronoi.prototype.Cell.prototype.prepareHalfedges = function () {
    var halfedges = this.halfedges,
        iHalfedge = halfedges.length,
        edge;
    // get rid of unused halfedges
    // rhill 2011-05-27: Keep it simple, no point here in trying
    // to be fancy: dangling edges are a typically a minority.
    while (iHalfedge--) {
        edge = halfedges[iHalfedge].edge;
        if (!edge.vb || !edge.va) {
            halfedges.splice(iHalfedge, 1);
        }
    }

    // rhill 2011-05-26: I tried to use a binary search at insertion
    // time to keep the array sorted on-the-fly (in Cell.addHalfedge()).
    // There was no real benefits in doing so, performance on
    // Firefox 3.6 was improved marginally, while performance on
    // Opera 11 was penalized marginally.
    halfedges.sort(function (a, b) {
        return b.angle - a.angle;
    });
    return halfedges.length;
};

// Return a list of the neighbor Ids
Voronoi.prototype.Cell.prototype.getNeighborIds = function () {
    var neighbors = [],
        iHalfedge = this.halfedges.length,
        edge;
    while (iHalfedge--) {
        edge = this.halfedges[iHalfedge].edge;
        if (edge.lSite !== null && edge.lSite.voronoiId != this.site.voronoiId) {
            neighbors.push(edge.lSite.voronoiId);
        } else if (edge.rSite !== null && edge.rSite.voronoiId != this.site.voronoiId) {
            neighbors.push(edge.rSite.voronoiId);
        }
    }
    return neighbors;
};

// Compute bounding box
//
Voronoi.prototype.Cell.prototype.getBbox = function () {
    var halfedges = this.halfedges,
        iHalfedge = halfedges.length,
        xmin = Infinity,
        ymin = Infinity,
        xmax = -Infinity,
        ymax = -Infinity,
        v,
        vx,
        vy;
    while (iHalfedge--) {
        v = halfedges[iHalfedge].getStartpoint();
        vx = v.x;
        vy = v.y;
        if (vx < xmin) {
            xmin = vx;
        }
        if (vy < ymin) {
            ymin = vy;
        }
        if (vx > xmax) {
            xmax = vx;
        }
        if (vy > ymax) {
            ymax = vy;
        }
        // we dont need to take into account end point,
        // since each end point matches a start point
    }
    return {
        x: xmin,
        y: ymin,
        width: xmax - xmin,
        height: ymax - ymin
    };
};

// Return whether a point is inside, on, or outside the cell:
//   -1: point is outside the perimeter of the cell
//    0: point is on the perimeter of the cell
//    1: point is inside the perimeter of the cell
//
Voronoi.prototype.Cell.prototype.pointIntersection = function (x, y) {
    // Check if point in polygon. Since all polygons of a Voronoi
    // diagram are convex, then:
    // http://paulbourke.net/geometry/polygonmesh/
    // Solution 3 (2D):
    //   "If the polygon is convex then one can consider the polygon
    //   "as a 'path' from the first vertex. A point is on the interior
    //   "of this polygons if it is always on the same side of all the
    //   "line segments making up the path. ...
    //   "(y - y0) (x1 - x0) - (x - x0) (y1 - y0)
    //   "if it is less than 0 then P is to the right of the line segment,
    //   "if greater than 0 it is to the left, if equal to 0 then it lies
    //   "on the line segment"
    var halfedges = this.halfedges,
        iHalfedge = halfedges.length,
        halfedge,
        p0,
        p1,
        r;
    while (iHalfedge--) {
        halfedge = halfedges[iHalfedge];
        p0 = halfedge.getStartpoint();
        p1 = halfedge.getEndpoint();
        r = (y - p0.y) * (p1.x - p0.x) - (x - p0.x) * (p1.y - p0.y);
        if (!r) {
            return 0;
        }
        if (r > 0) {
            return -1;
        }
    }
    return 1;
};

// ---------------------------------------------------------------------------
// Edge methods
//

Voronoi.prototype.Vertex = function (x, y) {
    this.x = x;
    this.y = y;
};

Voronoi.prototype.Edge = function (lSite, rSite) {
    this.lSite = lSite;
    this.rSite = rSite;
    this.va = this.vb = null;
};

Voronoi.prototype.Halfedge = function (edge, lSite, rSite) {
    this.site = lSite;
    this.edge = edge;
    // 'angle' is a value to be used for properly sorting the
    // halfsegments counterclockwise. By convention, we will
    // use the angle of the line defined by the 'site to the left'
    // to the 'site to the right'.
    // However, border edges have no 'site to the right': thus we
    // use the angle of line perpendicular to the halfsegment (the
    // edge should have both end points defined in such case.)
    if (rSite) {
        this.angle = Math.atan2(rSite.y - lSite.y, rSite.x - lSite.x);
    } else {
        var va = edge.va,
            vb = edge.vb;
        // rhill 2011-05-31: used to call getStartpoint()/getEndpoint(),
        // but for performance purpose, these are expanded in place here.
        this.angle = edge.lSite === lSite ? Math.atan2(vb.x - va.x, va.y - vb.y) : Math.atan2(va.x - vb.x, vb.y - va.y);
    }
};

Voronoi.prototype.createHalfedge = function (edge, lSite, rSite) {
    return new this.Halfedge(edge, lSite, rSite);
};

Voronoi.prototype.Halfedge.prototype.getStartpoint = function () {
    return this.edge.lSite === this.site ? this.edge.va : this.edge.vb;
};

Voronoi.prototype.Halfedge.prototype.getEndpoint = function () {
    return this.edge.lSite === this.site ? this.edge.vb : this.edge.va;
};

// this create and add a vertex to the internal collection

Voronoi.prototype.createVertex = function (x, y) {
    var v = this.vertexJunkyard.pop();
    if (!v) {
        v = new this.Vertex(x, y);
    } else {
        v.x = x;
        v.y = y;
    }
    this.vertices.push(v);
    return v;
};

// this create and add an edge to internal collection, and also create
// two halfedges which are added to each site's counterclockwise array
// of halfedges.

Voronoi.prototype.createEdge = function (lSite, rSite, va, vb) {
    var edge = this.edgeJunkyard.pop();
    if (!edge) {
        edge = new this.Edge(lSite, rSite);
    } else {
        edge.lSite = lSite;
        edge.rSite = rSite;
        edge.va = edge.vb = null;
    }

    this.edges.push(edge);
    if (va) {
        this.setEdgeStartpoint(edge, lSite, rSite, va);
    }
    if (vb) {
        this.setEdgeEndpoint(edge, lSite, rSite, vb);
    }
    this.cells[lSite.voronoiId].halfedges.push(this.createHalfedge(edge, lSite, rSite));
    this.cells[rSite.voronoiId].halfedges.push(this.createHalfedge(edge, rSite, lSite));
    return edge;
};

Voronoi.prototype.createBorderEdge = function (lSite, va, vb) {
    var edge = this.edgeJunkyard.pop();
    if (!edge) {
        edge = new this.Edge(lSite, null);
    } else {
        edge.lSite = lSite;
        edge.rSite = null;
    }
    edge.va = va;
    edge.vb = vb;
    this.edges.push(edge);
    return edge;
};

Voronoi.prototype.setEdgeStartpoint = function (edge, lSite, rSite, vertex) {
    if (!edge.va && !edge.vb) {
        edge.va = vertex;
        edge.lSite = lSite;
        edge.rSite = rSite;
    } else if (edge.lSite === rSite) {
        edge.vb = vertex;
    } else {
        edge.va = vertex;
    }
};

Voronoi.prototype.setEdgeEndpoint = function (edge, lSite, rSite, vertex) {
    this.setEdgeStartpoint(edge, rSite, lSite, vertex);
};

// ---------------------------------------------------------------------------
// Beachline methods

// rhill 2011-06-07: For some reasons, performance suffers significantly
// when instanciating a literal object instead of an empty ctor
Voronoi.prototype.Beachsection = function () {};

// rhill 2011-06-02: A lot of Beachsection instanciations
// occur during the computation of the Voronoi diagram,
// somewhere between the number of sites and twice the
// number of sites, while the number of Beachsections on the
// beachline at any given time is comparatively low. For this
// reason, we reuse already created Beachsections, in order
// to avoid new memory allocation. This resulted in a measurable
// performance gain.

Voronoi.prototype.createBeachsection = function (site) {
    var beachsection = this.beachsectionJunkyard.pop();
    if (!beachsection) {
        beachsection = new this.Beachsection();
    }
    beachsection.site = site;
    return beachsection;
};

// calculate the left break point of a particular beach section,
// given a particular sweep line
Voronoi.prototype.leftBreakPoint = function (arc, directrix) {
    // http://en.wikipedia.org/wiki/Parabola
    // http://en.wikipedia.org/wiki/Quadratic_equation
    // h1 = x1,
    // k1 = (y1+directrix)/2,
    // h2 = x2,
    // k2 = (y2+directrix)/2,
    // p1 = k1-directrix,
    // a1 = 1/(4*p1),
    // b1 = -h1/(2*p1),
    // c1 = h1*h1/(4*p1)+k1,
    // p2 = k2-directrix,
    // a2 = 1/(4*p2),
    // b2 = -h2/(2*p2),
    // c2 = h2*h2/(4*p2)+k2,
    // x = (-(b2-b1) + Math.sqrt((b2-b1)*(b2-b1) - 4*(a2-a1)*(c2-c1))) / (2*(a2-a1))
    // When x1 become the x-origin:
    // h1 = 0,
    // k1 = (y1+directrix)/2,
    // h2 = x2-x1,
    // k2 = (y2+directrix)/2,
    // p1 = k1-directrix,
    // a1 = 1/(4*p1),
    // b1 = 0,
    // c1 = k1,
    // p2 = k2-directrix,
    // a2 = 1/(4*p2),
    // b2 = -h2/(2*p2),
    // c2 = h2*h2/(4*p2)+k2,
    // x = (-b2 + Math.sqrt(b2*b2 - 4*(a2-a1)*(c2-k1))) / (2*(a2-a1)) + x1

    // change code below at your own risk: care has been taken to
    // reduce errors due to computers' finite arithmetic precision.
    // Maybe can still be improved, will see if any more of this
    // kind of errors pop up again.
    var site = arc.site,
        rfocx = site.x,
        rfocy = site.y,
        pby2 = rfocy - directrix;
    // parabola in degenerate case where focus is on directrix
    if (!pby2) {
        return rfocx;
    }
    var lArc = arc.rbPrevious;
    if (!lArc) {
        return -Infinity;
    }
    site = lArc.site;
    var lfocx = site.x,
        lfocy = site.y,
        plby2 = lfocy - directrix;
    // parabola in degenerate case where focus is on directrix
    if (!plby2) {
        return lfocx;
    }
    var hl = lfocx - rfocx,
        aby2 = 1 / pby2 - 1 / plby2,
        b = hl / plby2;
    if (aby2) {
        return (-b + this.sqrt(b * b - 2 * aby2 * (hl * hl / (-2 * plby2) - lfocy + plby2 / 2 + rfocy - pby2 / 2))) / aby2 + rfocx;
    }
    // both parabolas have same distance to directrix, thus break point is midway
    return (rfocx + lfocx) / 2;
};

// calculate the right break point of a particular beach section,
// given a particular directrix
Voronoi.prototype.rightBreakPoint = function (arc, directrix) {
    var rArc = arc.rbNext;
    if (rArc) {
        return this.leftBreakPoint(rArc, directrix);
    }
    var site = arc.site;
    return site.y === directrix ? site.x : Infinity;
};

Voronoi.prototype.detachBeachsection = function (beachsection) {
    this.detachCircleEvent(beachsection); // detach potentially attached circle event
    this.beachline.rbRemoveNode(beachsection); // remove from RB-tree
    this.beachsectionJunkyard.push(beachsection); // mark for reuse
};

Voronoi.prototype.removeBeachsection = function (beachsection) {
    var circle = beachsection.circleEvent,
        x = circle.x,
        y = circle.ycenter,
        vertex = this.createVertex(x, y),
        previous = beachsection.rbPrevious,
        next = beachsection.rbNext,
        disappearingTransitions = [beachsection],
        abs_fn = Math.abs;

    // remove collapsed beachsection from beachline
    this.detachBeachsection(beachsection);

    // there could be more than one empty arc at the deletion point, this
    // happens when more than two edges are linked by the same vertex,
    // so we will collect all those edges by looking up both sides of
    // the deletion point.
    // by the way, there is *always* a predecessor/successor to any collapsed
    // beach section, it's just impossible to have a collapsing first/last
    // beach sections on the beachline, since they obviously are unconstrained
    // on their left/right side.

    // look left
    var lArc = previous;
    while (lArc.circleEvent && abs_fn(x - lArc.circleEvent.x) < 1e-9 && abs_fn(y - lArc.circleEvent.ycenter) < 1e-9) {
        previous = lArc.rbPrevious;
        disappearingTransitions.unshift(lArc);
        this.detachBeachsection(lArc); // mark for reuse
        lArc = previous;
    }
    // even though it is not disappearing, I will also add the beach section
    // immediately to the left of the left-most collapsed beach section, for
    // convenience, since we need to refer to it later as this beach section
    // is the 'left' site of an edge for which a start point is set.
    disappearingTransitions.unshift(lArc);
    this.detachCircleEvent(lArc);

    // look right
    var rArc = next;
    while (rArc.circleEvent && abs_fn(x - rArc.circleEvent.x) < 1e-9 && abs_fn(y - rArc.circleEvent.ycenter) < 1e-9) {
        next = rArc.rbNext;
        disappearingTransitions.push(rArc);
        this.detachBeachsection(rArc); // mark for reuse
        rArc = next;
    }
    // we also have to add the beach section immediately to the right of the
    // right-most collapsed beach section, since there is also a disappearing
    // transition representing an edge's start point on its left.
    disappearingTransitions.push(rArc);
    this.detachCircleEvent(rArc);

    // walk through all the disappearing transitions between beach sections and
    // set the start point of their (implied) edge.
    var nArcs = disappearingTransitions.length,
        iArc;
    for (iArc = 1; iArc < nArcs; iArc++) {
        rArc = disappearingTransitions[iArc];
        lArc = disappearingTransitions[iArc - 1];
        this.setEdgeStartpoint(rArc.edge, lArc.site, rArc.site, vertex);
    }

    // create a new edge as we have now a new transition between
    // two beach sections which were previously not adjacent.
    // since this edge appears as a new vertex is defined, the vertex
    // actually define an end point of the edge (relative to the site
    // on the left)
    lArc = disappearingTransitions[0];
    rArc = disappearingTransitions[nArcs - 1];
    rArc.edge = this.createEdge(lArc.site, rArc.site, undefined, vertex);

    // create circle events if any for beach sections left in the beachline
    // adjacent to collapsed sections
    this.attachCircleEvent(lArc);
    this.attachCircleEvent(rArc);
};

Voronoi.prototype.addBeachsection = function (site) {
    var x = site.x,
        directrix = site.y;

    // find the left and right beach sections which will surround the newly
    // created beach section.
    // rhill 2011-06-01: This loop is one of the most often executed,
    // hence we expand in-place the comparison-against-epsilon calls.
    var lArc,
        rArc,
        dxl,
        dxr,
        node = this.beachline.root;

    while (node) {
        dxl = this.leftBreakPoint(node, directrix) - x;
        // x lessThanWithEpsilon xl => falls somewhere before the left edge of the beachsection
        if (dxl > 1e-9) {
            // this case should never happen
            // if (!node.rbLeft) {
            //    rArc = node.rbLeft;
            //    break;
            //    }
            node = node.rbLeft;
        } else {
            dxr = x - this.rightBreakPoint(node, directrix);
            // x greaterThanWithEpsilon xr => falls somewhere after the right edge of the beachsection
            if (dxr > 1e-9) {
                if (!node.rbRight) {
                    lArc = node;
                    break;
                }
                node = node.rbRight;
            } else {
                // x equalWithEpsilon xl => falls exactly on the left edge of the beachsection
                if (dxl > -1e-9) {
                    lArc = node.rbPrevious;
                    rArc = node;
                }
                // x equalWithEpsilon xr => falls exactly on the right edge of the beachsection
                else if (dxr > -1e-9) {
                        lArc = node;
                        rArc = node.rbNext;
                    }
                    // falls exactly somewhere in the middle of the beachsection
                    else {
                            lArc = rArc = node;
                        }
                break;
            }
        }
    }
    // at this point, keep in mind that lArc and/or rArc could be
    // undefined or null.

    // create a new beach section object for the site and add it to RB-tree
    var newArc = this.createBeachsection(site);
    this.beachline.rbInsertSuccessor(lArc, newArc);

    // cases:
    //

    // [null,null]
    // least likely case: new beach section is the first beach section on the
    // beachline.
    // This case means:
    //   no new transition appears
    //   no collapsing beach section
    //   new beachsection become root of the RB-tree
    if (!lArc && !rArc) {
        return;
    }

    // [lArc,rArc] where lArc == rArc
    // most likely case: new beach section split an existing beach
    // section.
    // This case means:
    //   one new transition appears
    //   the left and right beach section might be collapsing as a result
    //   two new nodes added to the RB-tree
    if (lArc === rArc) {
        // invalidate circle event of split beach section
        this.detachCircleEvent(lArc);

        // split the beach section into two separate beach sections
        rArc = this.createBeachsection(lArc.site);
        this.beachline.rbInsertSuccessor(newArc, rArc);

        // since we have a new transition between two beach sections,
        // a new edge is born
        newArc.edge = rArc.edge = this.createEdge(lArc.site, newArc.site);

        // check whether the left and right beach sections are collapsing
        // and if so create circle events, to be notified when the point of
        // collapse is reached.
        this.attachCircleEvent(lArc);
        this.attachCircleEvent(rArc);
        return;
    }

    // [lArc,null]
    // even less likely case: new beach section is the *last* beach section
    // on the beachline -- this can happen *only* if *all* the previous beach
    // sections currently on the beachline share the same y value as
    // the new beach section.
    // This case means:
    //   one new transition appears
    //   no collapsing beach section as a result
    //   new beach section become right-most node of the RB-tree
    if (lArc && !rArc) {
        newArc.edge = this.createEdge(lArc.site, newArc.site);
        return;
    }

    // [null,rArc]
    // impossible case: because sites are strictly processed from top to bottom,
    // and left to right, which guarantees that there will always be a beach section
    // on the left -- except of course when there are no beach section at all on
    // the beach line, which case was handled above.
    // rhill 2011-06-02: No point testing in non-debug version
    //if (!lArc && rArc) {
    //    throw "Voronoi.addBeachsection(): What is this I don't even";
    //    }

    // [lArc,rArc] where lArc != rArc
    // somewhat less likely case: new beach section falls *exactly* in between two
    // existing beach sections
    // This case means:
    //   one transition disappears
    //   two new transitions appear
    //   the left and right beach section might be collapsing as a result
    //   only one new node added to the RB-tree
    if (lArc !== rArc) {
        // invalidate circle events of left and right sites
        this.detachCircleEvent(lArc);
        this.detachCircleEvent(rArc);

        // an existing transition disappears, meaning a vertex is defined at
        // the disappearance point.
        // since the disappearance is caused by the new beachsection, the
        // vertex is at the center of the circumscribed circle of the left,
        // new and right beachsections.
        // http://mathforum.org/library/drmath/view/55002.html
        // Except that I bring the origin at A to simplify
        // calculation
        var lSite = lArc.site,
            ax = lSite.x,
            ay = lSite.y,
            bx = site.x - ax,
            by = site.y - ay,
            rSite = rArc.site,
            cx = rSite.x - ax,
            cy = rSite.y - ay,
            d = 2 * (bx * cy - by * cx),
            hb = bx * bx + by * by,
            hc = cx * cx + cy * cy,
            vertex = this.createVertex((cy * hb - by * hc) / d + ax, (bx * hc - cx * hb) / d + ay);

        // one transition disappear
        this.setEdgeStartpoint(rArc.edge, lSite, rSite, vertex);

        // two new transitions appear at the new vertex location
        newArc.edge = this.createEdge(lSite, site, undefined, vertex);
        rArc.edge = this.createEdge(site, rSite, undefined, vertex);

        // check whether the left and right beach sections are collapsing
        // and if so create circle events, to handle the point of collapse.
        this.attachCircleEvent(lArc);
        this.attachCircleEvent(rArc);
        return;
    }
};

// ---------------------------------------------------------------------------
// Circle event methods

// rhill 2011-06-07: For some reasons, performance suffers significantly
// when instanciating a literal object instead of an empty ctor
Voronoi.prototype.CircleEvent = function () {
    // rhill 2013-10-12: it helps to state exactly what we are at ctor time.
    this.arc = null;
    this.rbLeft = null;
    this.rbNext = null;
    this.rbParent = null;
    this.rbPrevious = null;
    this.rbRed = false;
    this.rbRight = null;
    this.site = null;
    this.x = this.y = this.ycenter = 0;
};

Voronoi.prototype.attachCircleEvent = function (arc) {
    var lArc = arc.rbPrevious,
        rArc = arc.rbNext;
    if (!lArc || !rArc) {
        return;
    } // does that ever happen?
    var lSite = lArc.site,
        cSite = arc.site,
        rSite = rArc.site;

    // If site of left beachsection is same as site of
    // right beachsection, there can't be convergence
    if (lSite === rSite) {
        return;
    }

    // Find the circumscribed circle for the three sites associated
    // with the beachsection triplet.
    // rhill 2011-05-26: It is more efficient to calculate in-place
    // rather than getting the resulting circumscribed circle from an
    // object returned by calling Voronoi.circumcircle()
    // http://mathforum.org/library/drmath/view/55002.html
    // Except that I bring the origin at cSite to simplify calculations.
    // The bottom-most part of the circumcircle is our Fortune 'circle
    // event', and its center is a vertex potentially part of the final
    // Voronoi diagram.
    var bx = cSite.x,
        by = cSite.y,
        ax = lSite.x - bx,
        ay = lSite.y - by,
        cx = rSite.x - bx,
        cy = rSite.y - by;

    // If points l->c->r are clockwise, then center beach section does not
    // collapse, hence it can't end up as a vertex (we reuse 'd' here, which
    // sign is reverse of the orientation, hence we reverse the test.
    // http://en.wikipedia.org/wiki/Curve_orientation#Orientation_of_a_simple_polygon
    // rhill 2011-05-21: Nasty finite precision error which caused circumcircle() to
    // return infinites: 1e-12 seems to fix the problem.
    var d = 2 * (ax * cy - ay * cx);
    if (d >= -2e-12) {
        return;
    }

    var ha = ax * ax + ay * ay,
        hc = cx * cx + cy * cy,
        x = (cy * ha - ay * hc) / d,
        y = (ax * hc - cx * ha) / d,
        ycenter = y + by;

    // Important: ybottom should always be under or at sweep, so no need
    // to waste CPU cycles by checking

    // recycle circle event object if possible
    var circleEvent = this.circleEventJunkyard.pop();
    if (!circleEvent) {
        circleEvent = new this.CircleEvent();
    }
    circleEvent.arc = arc;
    circleEvent.site = cSite;
    circleEvent.x = x + bx;
    circleEvent.y = ycenter + this.sqrt(x * x + y * y); // y bottom
    circleEvent.ycenter = ycenter;
    arc.circleEvent = circleEvent;

    // find insertion point in RB-tree: circle events are ordered from
    // smallest to largest
    var predecessor = null,
        node = this.circleEvents.root;
    while (node) {
        if (circleEvent.y < node.y || circleEvent.y === node.y && circleEvent.x <= node.x) {
            if (node.rbLeft) {
                node = node.rbLeft;
            } else {
                predecessor = node.rbPrevious;
                break;
            }
        } else {
            if (node.rbRight) {
                node = node.rbRight;
            } else {
                predecessor = node;
                break;
            }
        }
    }
    this.circleEvents.rbInsertSuccessor(predecessor, circleEvent);
    if (!predecessor) {
        this.firstCircleEvent = circleEvent;
    }
};

Voronoi.prototype.detachCircleEvent = function (arc) {
    var circleEvent = arc.circleEvent;
    if (circleEvent) {
        if (!circleEvent.rbPrevious) {
            this.firstCircleEvent = circleEvent.rbNext;
        }
        this.circleEvents.rbRemoveNode(circleEvent); // remove from RB-tree
        this.circleEventJunkyard.push(circleEvent);
        arc.circleEvent = null;
    }
};

// ---------------------------------------------------------------------------
// Diagram completion methods

// connect dangling edges (not if a cursory test tells us
// it is not going to be visible.
// return value:
//   false: the dangling endpoint couldn't be connected
//   true: the dangling endpoint could be connected
Voronoi.prototype.connectEdge = function (edge, bbox) {
    // skip if end point already connected
    var vb = edge.vb;
    if (!!vb) {
        return true;
    }

    // make local copy for performance purpose
    var va = edge.va,
        xl = bbox.xl,
        xr = bbox.xr,
        yt = bbox.yt,
        yb = bbox.yb,
        lSite = edge.lSite,
        rSite = edge.rSite,
        lx = lSite.x,
        ly = lSite.y,
        rx = rSite.x,
        ry = rSite.y,
        fx = (lx + rx) / 2,
        fy = (ly + ry) / 2,
        fm,
        fb;

    // if we reach here, this means cells which use this edge will need
    // to be closed, whether because the edge was removed, or because it
    // was connected to the bounding box.
    this.cells[lSite.voronoiId].closeMe = true;
    this.cells[rSite.voronoiId].closeMe = true;

    // get the line equation of the bisector if line is not vertical
    if (ry !== ly) {
        fm = (lx - rx) / (ry - ly);
        fb = fy - fm * fx;
    }

    // remember, direction of line (relative to left site):
    // upward: left.x < right.x
    // downward: left.x > right.x
    // horizontal: left.x == right.x
    // upward: left.x < right.x
    // rightward: left.y < right.y
    // leftward: left.y > right.y
    // vertical: left.y == right.y

    // depending on the direction, find the best side of the
    // bounding box to use to determine a reasonable start point

    // rhill 2013-12-02:
    // While at it, since we have the values which define the line,
    // clip the end of va if it is outside the bbox.
    // https://github.com/gorhill/Javascript-Voronoi/issues/15
    // TODO: Do all the clipping here rather than rely on Liang-Barsky
    // which does not do well sometimes due to loss of arithmetic
    // precision. The code here doesn't degrade if one of the vertex is
    // at a huge distance.

    // special case: vertical line
    if (fm === undefined) {
        // doesn't intersect with viewport
        if (fx < xl || fx >= xr) {
            return false;
        }
        // downward
        if (lx > rx) {
            if (!va || va.y < yt) {
                va = this.createVertex(fx, yt);
            } else if (va.y >= yb) {
                return false;
            }
            vb = this.createVertex(fx, yb);
        }
        // upward
        else {
                if (!va || va.y > yb) {
                    va = this.createVertex(fx, yb);
                } else if (va.y < yt) {
                    return false;
                }
                vb = this.createVertex(fx, yt);
            }
    }
    // closer to vertical than horizontal, connect start point to the
    // top or bottom side of the bounding box
    else if (fm < -1 || fm > 1) {
            // downward
            if (lx > rx) {
                if (!va || va.y < yt) {
                    va = this.createVertex((yt - fb) / fm, yt);
                } else if (va.y >= yb) {
                    return false;
                }
                vb = this.createVertex((yb - fb) / fm, yb);
            }
            // upward
            else {
                    if (!va || va.y > yb) {
                        va = this.createVertex((yb - fb) / fm, yb);
                    } else if (va.y < yt) {
                        return false;
                    }
                    vb = this.createVertex((yt - fb) / fm, yt);
                }
        }
        // closer to horizontal than vertical, connect start point to the
        // left or right side of the bounding box
        else {
                // rightward
                if (ly < ry) {
                    if (!va || va.x < xl) {
                        va = this.createVertex(xl, fm * xl + fb);
                    } else if (va.x >= xr) {
                        return false;
                    }
                    vb = this.createVertex(xr, fm * xr + fb);
                }
                // leftward
                else {
                        if (!va || va.x > xr) {
                            va = this.createVertex(xr, fm * xr + fb);
                        } else if (va.x < xl) {
                            return false;
                        }
                        vb = this.createVertex(xl, fm * xl + fb);
                    }
            }
    edge.va = va;
    edge.vb = vb;

    return true;
};

// line-clipping code taken from:
//   Liang-Barsky function by Daniel White
//   http://www.skytopia.com/project/articles/compsci/clipping.html
// Thanks!
// A bit modified to minimize code paths
Voronoi.prototype.clipEdge = function (edge, bbox) {
    var ax = edge.va.x,
        ay = edge.va.y,
        bx = edge.vb.x,
        by = edge.vb.y,
        t0 = 0,
        t1 = 1,
        dx = bx - ax,
        dy = by - ay;
    // left
    var q = ax - bbox.xl;
    if (dx === 0 && q < 0) {
        return false;
    }
    var r = -q / dx;
    if (dx < 0) {
        if (r < t0) {
            return false;
        }
        if (r < t1) {
            t1 = r;
        }
    } else if (dx > 0) {
        if (r > t1) {
            return false;
        }
        if (r > t0) {
            t0 = r;
        }
    }
    // right
    q = bbox.xr - ax;
    if (dx === 0 && q < 0) {
        return false;
    }
    r = q / dx;
    if (dx < 0) {
        if (r > t1) {
            return false;
        }
        if (r > t0) {
            t0 = r;
        }
    } else if (dx > 0) {
        if (r < t0) {
            return false;
        }
        if (r < t1) {
            t1 = r;
        }
    }
    // top
    q = ay - bbox.yt;
    if (dy === 0 && q < 0) {
        return false;
    }
    r = -q / dy;
    if (dy < 0) {
        if (r < t0) {
            return false;
        }
        if (r < t1) {
            t1 = r;
        }
    } else if (dy > 0) {
        if (r > t1) {
            return false;
        }
        if (r > t0) {
            t0 = r;
        }
    }
    // bottom        
    q = bbox.yb - ay;
    if (dy === 0 && q < 0) {
        return false;
    }
    r = q / dy;
    if (dy < 0) {
        if (r > t1) {
            return false;
        }
        if (r > t0) {
            t0 = r;
        }
    } else if (dy > 0) {
        if (r < t0) {
            return false;
        }
        if (r < t1) {
            t1 = r;
        }
    }

    // if we reach this point, Voronoi edge is within bbox

    // if t0 > 0, va needs to change
    // rhill 2011-06-03: we need to create a new vertex rather
    // than modifying the existing one, since the existing
    // one is likely shared with at least another edge
    if (t0 > 0) {
        edge.va = this.createVertex(ax + t0 * dx, ay + t0 * dy);
    }

    // if t1 < 1, vb needs to change
    // rhill 2011-06-03: we need to create a new vertex rather
    // than modifying the existing one, since the existing
    // one is likely shared with at least another edge
    if (t1 < 1) {
        edge.vb = this.createVertex(ax + t1 * dx, ay + t1 * dy);
    }

    // va and/or vb were clipped, thus we will need to close
    // cells which use this edge.
    if (t0 > 0 || t1 < 1) {
        this.cells[edge.lSite.voronoiId].closeMe = true;
        this.cells[edge.rSite.voronoiId].closeMe = true;
    }

    return true;
};

// Connect/cut edges at bounding box
Voronoi.prototype.clipEdges = function (bbox) {
    // connect all dangling edges to bounding box
    // or get rid of them if it can't be done
    var edges = this.edges,
        iEdge = edges.length,
        edge,
        abs_fn = Math.abs;

    // iterate backward so we can splice safely
    while (iEdge--) {
        edge = edges[iEdge];
        // edge is removed if:
        //   it is wholly outside the bounding box
        //   it is looking more like a point than a line
        if (!this.connectEdge(edge, bbox) || !this.clipEdge(edge, bbox) || abs_fn(edge.va.x - edge.vb.x) < 1e-9 && abs_fn(edge.va.y - edge.vb.y) < 1e-9) {
            edge.va = edge.vb = null;
            edges.splice(iEdge, 1);
        }
    }
};

// Close the cells.
// The cells are bound by the supplied bounding box.
// Each cell refers to its associated site, and a list
// of halfedges ordered counterclockwise.
Voronoi.prototype.closeCells = function (bbox) {
    var xl = bbox.xl,
        xr = bbox.xr,
        yt = bbox.yt,
        yb = bbox.yb,
        cells = this.cells,
        iCell = cells.length,
        cell,
        iLeft,
        halfedges,
        nHalfedges,
        edge,
        va,
        vb,
        vz,
        lastBorderSegment,
        abs_fn = Math.abs;

    while (iCell--) {
        cell = cells[iCell];
        // prune, order halfedges counterclockwise, then add missing ones
        // required to close cells
        if (!cell.prepareHalfedges()) {
            continue;
        }
        if (!cell.closeMe) {
            continue;
        }
        // find first 'unclosed' point.
        // an 'unclosed' point will be the end point of a halfedge which
        // does not match the start point of the following halfedge
        halfedges = cell.halfedges;
        nHalfedges = halfedges.length;
        // special case: only one site, in which case, the viewport is the cell
        // ...

        // all other cases
        iLeft = 0;
        while (iLeft < nHalfedges) {
            va = halfedges[iLeft].getEndpoint();
            vz = halfedges[(iLeft + 1) % nHalfedges].getStartpoint();
            // if end point is not equal to start point, we need to add the missing
            // halfedge(s) up to vz
            if (abs_fn(va.x - vz.x) >= 1e-9 || abs_fn(va.y - vz.y) >= 1e-9) {

                // rhill 2013-12-02:
                // "Holes" in the halfedges are not necessarily always adjacent.
                // https://github.com/gorhill/Javascript-Voronoi/issues/16

                // find entry point:
                switch (true) {

                    // walk downward along left side
                    case this.equalWithEpsilon(va.x, xl) && this.lessThanWithEpsilon(va.y, yb):
                        lastBorderSegment = this.equalWithEpsilon(vz.x, xl);
                        vb = this.createVertex(xl, lastBorderSegment ? vz.y : yb);
                        edge = this.createBorderEdge(cell.site, va, vb);
                        iLeft++;
                        halfedges.splice(iLeft, 0, this.createHalfedge(edge, cell.site, null));
                        nHalfedges++;
                        if (lastBorderSegment) {
                            break;
                        }
                        va = vb;
                    // fall through

                    // walk rightward along bottom side
                    case this.equalWithEpsilon(va.y, yb) && this.lessThanWithEpsilon(va.x, xr):
                        lastBorderSegment = this.equalWithEpsilon(vz.y, yb);
                        vb = this.createVertex(lastBorderSegment ? vz.x : xr, yb);
                        edge = this.createBorderEdge(cell.site, va, vb);
                        iLeft++;
                        halfedges.splice(iLeft, 0, this.createHalfedge(edge, cell.site, null));
                        nHalfedges++;
                        if (lastBorderSegment) {
                            break;
                        }
                        va = vb;
                    // fall through

                    // walk upward along right side
                    case this.equalWithEpsilon(va.x, xr) && this.greaterThanWithEpsilon(va.y, yt):
                        lastBorderSegment = this.equalWithEpsilon(vz.x, xr);
                        vb = this.createVertex(xr, lastBorderSegment ? vz.y : yt);
                        edge = this.createBorderEdge(cell.site, va, vb);
                        iLeft++;
                        halfedges.splice(iLeft, 0, this.createHalfedge(edge, cell.site, null));
                        nHalfedges++;
                        if (lastBorderSegment) {
                            break;
                        }
                        va = vb;
                    // fall through

                    // walk leftward along top side
                    case this.equalWithEpsilon(va.y, yt) && this.greaterThanWithEpsilon(va.x, xl):
                        lastBorderSegment = this.equalWithEpsilon(vz.y, yt);
                        vb = this.createVertex(lastBorderSegment ? vz.x : xl, yt);
                        edge = this.createBorderEdge(cell.site, va, vb);
                        iLeft++;
                        halfedges.splice(iLeft, 0, this.createHalfedge(edge, cell.site, null));
                        nHalfedges++;
                        if (lastBorderSegment) {
                            break;
                        }
                        va = vb;
                        // fall through

                        // walk downward along left side
                        lastBorderSegment = this.equalWithEpsilon(vz.x, xl);
                        vb = this.createVertex(xl, lastBorderSegment ? vz.y : yb);
                        edge = this.createBorderEdge(cell.site, va, vb);
                        iLeft++;
                        halfedges.splice(iLeft, 0, this.createHalfedge(edge, cell.site, null));
                        nHalfedges++;
                        if (lastBorderSegment) {
                            break;
                        }
                        va = vb;
                        // fall through

                        // walk rightward along bottom side
                        lastBorderSegment = this.equalWithEpsilon(vz.y, yb);
                        vb = this.createVertex(lastBorderSegment ? vz.x : xr, yb);
                        edge = this.createBorderEdge(cell.site, va, vb);
                        iLeft++;
                        halfedges.splice(iLeft, 0, this.createHalfedge(edge, cell.site, null));
                        nHalfedges++;
                        if (lastBorderSegment) {
                            break;
                        }
                        va = vb;
                        // fall through

                        // walk upward along right side
                        lastBorderSegment = this.equalWithEpsilon(vz.x, xr);
                        vb = this.createVertex(xr, lastBorderSegment ? vz.y : yt);
                        edge = this.createBorderEdge(cell.site, va, vb);
                        iLeft++;
                        halfedges.splice(iLeft, 0, this.createHalfedge(edge, cell.site, null));
                        nHalfedges++;
                        if (lastBorderSegment) {
                            break;
                        }
                    // fall through

                    default:
                        throw "Voronoi.closeCells() > this makes no sense!";
                }
            }
            iLeft++;
        }
        cell.closeMe = false;
    }
};

// ---------------------------------------------------------------------------
// Debugging helper
/*
Voronoi.prototype.dumpBeachline = function(y) {
    console.log('Voronoi.dumpBeachline(%f) > Beachsections, from left to right:', y);
    if ( !this.beachline ) {
        console.log('  None');
        }
    else {
        var bs = this.beachline.getFirst(this.beachline.root);
        while ( bs ) {
            console.log('  site %d: xl: %f, xr: %f', bs.site.voronoiId, this.leftBreakPoint(bs, y), this.rightBreakPoint(bs, y));
            bs = bs.rbNext;
            }
        }
    };
*/

// ---------------------------------------------------------------------------
// Helper: Quantize sites

// rhill 2013-10-12:
// This is to solve https://github.com/gorhill/Javascript-Voronoi/issues/15
// Since not all users will end up using the kind of coord values which would
// cause the issue to arise, I chose to let the user decide whether or not
// he should sanitize his coord values through this helper. This way, for
// those users who uses coord values which are known to be fine, no overhead is
// added.

Voronoi.prototype.quantizeSites = function (sites) {
    var ε = this.ε,
        n = sites.length,
        site;
    while (n--) {
        site = sites[n];
        site.x = Math.floor(site.x / ε) * ε;
        site.y = Math.floor(site.y / ε) * ε;
    }
};

// ---------------------------------------------------------------------------
// Helper: Recycle diagram: all vertex, edge and cell objects are
// "surrendered" to the Voronoi object for reuse.
// TODO: rhill-voronoi-core v2: more performance to be gained
// when I change the semantic of what is returned.

Voronoi.prototype.recycle = function (diagram) {
    if (diagram) {
        if (diagram instanceof this.Diagram) {
            this.toRecycle = diagram;
        } else {
            throw 'Voronoi.recycleDiagram() > Need a Diagram object.';
        }
    }
};

// ---------------------------------------------------------------------------
// Top-level Fortune loop

// rhill 2011-05-19:
//   Voronoi sites are kept client-side now, to allow
//   user to freely modify content. At compute time,
//   *references* to sites are copied locally.

Voronoi.prototype.compute = function (sites, bbox) {
    // to measure execution time
    var startTime = new Date();

    // init internal state
    this.reset();

    // any diagram data available for recycling?
    // I do that here so that this is included in execution time
    if (this.toRecycle) {
        this.vertexJunkyard = this.vertexJunkyard.concat(this.toRecycle.vertices);
        this.edgeJunkyard = this.edgeJunkyard.concat(this.toRecycle.edges);
        this.cellJunkyard = this.cellJunkyard.concat(this.toRecycle.cells);
        this.toRecycle = null;
    }

    // Initialize site event queue
    var siteEvents = sites.slice(0);
    siteEvents.sort(function (a, b) {
        var r = b.y - a.y;
        if (r) {
            return r;
        }
        return b.x - a.x;
    });

    // process queue
    var site = siteEvents.pop(),
        siteid = 0,
        xsitex,
        // to avoid duplicate sites
    xsitey,
        cells = this.cells,
        circle;

    // main loop
    for (;;) {
        // we need to figure whether we handle a site or circle event
        // for this we find out if there is a site event and it is
        // 'earlier' than the circle event
        circle = this.firstCircleEvent;

        // add beach section
        if (site && (!circle || site.y < circle.y || site.y === circle.y && site.x < circle.x)) {
            // only if site is not a duplicate
            if (site.x !== xsitex || site.y !== xsitey) {
                // first create cell for new site
                cells[siteid] = this.createCell(site);
                site.voronoiId = siteid++;
                // then create a beachsection for that site
                this.addBeachsection(site);
                // remember last site coords to detect duplicate
                xsitey = site.y;
                xsitex = site.x;
            }
            site = siteEvents.pop();
        }

        // remove beach section
        else if (circle) {
                this.removeBeachsection(circle.arc);
            }

            // all done, quit
            else {
                    break;
                }
    }

    // wrapping-up:
    //   connect dangling edges to bounding box
    //   cut edges as per bounding box
    //   discard edges completely outside bounding box
    //   discard edges which are point-like
    this.clipEdges(bbox);

    //   add missing edges in order to close opened cells
    this.closeCells(bbox);

    // to measure execution time
    var stopTime = new Date();

    // prepare return values
    var diagram = new this.Diagram();
    diagram.cells = this.cells;
    diagram.edges = this.edges;
    diagram.vertices = this.vertices;
    diagram.execTime = stopTime.getTime() - startTime.getTime();

    // clean up
    this.reset();

    return diagram;
};

module.exports = Voronoi;
});

var _slicedToArray$5 = function () {
  function sliceIterator(arr, i) {
    var _arr = [];var _n = true;var _d = false;var _e = undefined;try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;_e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }return _arr;
  }return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();

// The collection polygons computed by the voronoi diagram may have epsilon
// sized gaps due to floating point rounding. We dilate all polygons about the
// voronoi site by this factor to avoid this issue.
var ENLARGE_AMOUNT = 1.000000001;

function makeVoronoiAtlas(pointData) {
  var pointList = pointData.map(function (p) {
    return p[0];
  });
  var pointIndexTable = new Map();
  pointList.forEach(function (p, i) {
    return pointIndexTable.set(p.join(","), i);
  });
  var bbRect = getBoundingBox(pointList);
  var vInst = new rhillVoronoiCore();
  var diagram = vInst.compute(pointList.map(function (p) {
    return { x: p[0], y: p[1] };
  }), {
    xl: bbRect[0],
    xr: bbRect[0] + bbRect[2],
    yt: bbRect[1],
    yb: bbRect[1] + bbRect[3]
  });
  var vSitePermutation = diagram.cells.map(function (c) {
    return pointIndexTable.get(c.site.x + "," + c.site.y);
  });
  var convertPointToArray = function convertPointToArray(p) {
    return [p.x, p.y];
  };
  var polygons = diagram.cells.map(function (c) {
    return c.halfedges.map(function (e) {
      return convertPointToArray(e.getStartpoint());
    });
  });
  var polygonData = polygons.map(function (p, i) {
    var pointDataIndex = vSitePermutation[i];
    p = enlargePolygon(p, pointData[pointDataIndex][0], ENLARGE_AMOUNT);
    return [p, pointData[pointDataIndex][1]];
  });
  return makePolygonAtlas(bbRect, polygonData);
}

function enlargePolygon(polygon, about, scale) {
  var _about = _slicedToArray$5(about, 2),
      x = _about[0],
      y = _about[1];

  return polygon.map(function (_ref) {
    var _ref2 = _slicedToArray$5(_ref, 2),
        px = _ref2[0],
        py = _ref2[1];

    return [px * scale + x * (1 - scale), py * scale + y * (1 - scale)];
  });
}

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

var _slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];var _n = true;var _d = false;var _e = undefined;try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;_e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }return _arr;
  }return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _toConsumableArray(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }return arr2;
  } else {
    return Array.from(arr);
  }
}

function shiftEl(el, toEl) {
  var newEl = el.slice(0);
  newEl[0] += toEl[0];
  newEl[1] += toEl[1];
  return newEl;
}

function shiftEls(elArray, toEl) {
  return elArray.map(function (el) {
    return shiftEl(el, toEl);
  });
}

// Edges on two faces can be identified in two ways. This makes a table that
// disambiguates them and chooses one to use.
function makeEdgeTable(vOnETable) {
  var vertexPairTable = {};
  var edgeTable = {};

  var pairToKeyAndEdge = function pairToKeyAndEdge(_ref, i, fid) {
    var _ref2 = _slicedToArray(_ref, 2),
        v1 = _ref2[0],
        v2 = _ref2[1];

    var _orderArrays = orderArrays(v1, v2),
        _orderArrays2 = _slicedToArray(_orderArrays, 2),
        vl = _orderArrays2[0],
        vh = _orderArrays2[1];

    return {
      vpKey: [vl[2], vh[0] - vl[0], vh[1] - vl[1], vh[2]].join(","),
      edge: [-vl[0], -vl[1], i, fid]
    };
  };
  forEachObj(vOnETable, function (vOnERow, fid) {
    edgeTable[fid] = edgeTable[fid] || [];
    vOnERow.forEach(function (vs, i) {
      var _pairToKeyAndEdge = pairToKeyAndEdge(vs, i, fid),
          vpKey = _pairToKeyAndEdge.vpKey,
          edge = _pairToKeyAndEdge.edge;

      vertexPairTable[vpKey] = vertexPairTable[vpKey] || [];
      vertexPairTable[vpKey].push(edge);
    });
  });

  forEachObj(vertexPairTable, function (edges, vpKey) {
    if (edges.length === 1) {
      var _edges$ = _slicedToArray(edges[0], 4),
          i1 = _edges$[2],
          fid1 = _edges$[3];

      edgeTable[fid1][i1] = [0, 0, i1, fid1];
    } else {
      var _orderArrays3 = orderArrays(edges[0], edges[1]),
          _orderArrays4 = _slicedToArray(_orderArrays3, 2),
          el = _orderArrays4[0],
          eh = _orderArrays4[1];

      var _el = _slicedToArray(el, 4),
          x1 = _el[0],
          y1 = _el[1],
          _i = _el[2],
          _fid = _el[3];

      var _eh = _slicedToArray(eh, 4),
          x2 = _eh[0],
          y2 = _eh[1],
          i2 = _eh[2],
          fid2 = _eh[3];

      edgeTable[_fid][_i] = [x2 - x1, y2 - y1, i2, fid2];
      edgeTable[fid2][i2] = [0, 0, i2, fid2];
    }
  });
  return edgeTable;
}

function getMappedEdge(edge, edgeTable) {
  var mappedEdge = edgeTable[edge[3]][edge[2]];
  return [edge[0] + mappedEdge[0], edge[1] + mappedEdge[1], mappedEdge[2], mappedEdge[3]];
}

// Given an array of edges without collapsing duplicates and the return of
// makeEdgeTable, return array with remapping and duplicates collapsed.
function remapEdges(edgeArray, edgeTable) {
  var seenEdges = {};
  var newArray = [];
  edgeArray.forEach(function (edge) {
    var newEdge = getMappedEdge(edge, edgeTable);
    var newEdgeKey = newEdge.join(",");
    if (!seenEdges[newEdgeKey]) {
      seenEdges[newEdgeKey] = true;
      newArray.push(newEdge);
    }
  });
  return newArray;
}

function isFaceEqual(f1, f2) {
  return f1[0] === f2[0] && f1[1] === f2[1] && f1[2] === f2[2];
}
function isEdgeEqual(e1, e2) {
  return e1[0] === e2[0] && e1[1] === e2[1] && e1[2] === e2[2] && e1[3] === e2[3];
}
function isVertexEqual(v1, v2) {
  return v1[0] === v2[0] && v1[1] === v2[1] && v1[2] === v2[2];
}

// Go around a vertex to compute all faces and edges on it. The returns will be
// in consecutive order if the tesselation is complete, otherwise a bit
// arbitrary.
function computeElementsAroundVertex(vertex, preFaces, eOnF, vOnF, fOnE) {
  var ret = { faces: [], edges: [] };
  var usedFaces = {};
  var usedEdges = {};

  var getOtherFace = function getOtherFace(face, edge) {
    var _shiftEls = shiftEls(fOnE[edge[3]][edge[2]], edge),
        _shiftEls2 = _slicedToArray(_shiftEls, 2),
        f1 = _shiftEls2[0],
        f2 = _shiftEls2[1];

    if (!f2) {
      return null;
    }
    return isFaceEqual(f1, face) ? f2 : f1;
  };
  // Optionally pass null for edge to get an edge on the face+vertex.
  var getOtherEdge = function getOtherEdge(face, edge) {
    var vertices = shiftEls(vOnF[face[2]], face);
    var index = vertices.findIndex(function (v) {
      return isVertexEqual(v, [0, 0, vertex]);
    });
    if (index === -1) {
      return null;
    }
    var edges = shiftEls(eOnF[face[2]], face);
    var e1 = edges[index];
    if (!edge || !isEdgeEqual(e1, edge)) {
      return e1;
    }
    return index === 0 ? edges[edges.length - 1] : edges[index - 1];
  };
  var tryToAddFace = function tryToAddFace(face, prevEdge) {
    var usedFKey = face.join(",");
    if (!usedFaces[usedFKey]) {
      usedFaces[usedFKey] = true;
      ret.faces.push(face);
      var nextEdge = getOtherEdge(face, prevEdge);
      nextEdge && tryToAddEdge(face, nextEdge);
    }
  };
  var tryToAddEdge = function tryToAddEdge(prevFace, edge) {
    var usedEKey = edge.join(",");
    if (!usedEdges[usedEKey]) {
      usedEdges[usedEKey] = true;
      ret.edges.push(edge);
      var nextFace = getOtherFace(prevFace, edge);
      nextFace && tryToAddFace(nextFace, edge);
    }
  };

  preFaces.forEach(function (face) {
    var firstEdge = getOtherEdge(face, null);
    if (!firstEdge) {
      return;
    }
    tryToAddFace(face, firstEdge);
    tryToAddEdge(face, firstEdge);
  });

  return ret;
}

function getIncidenceCache(tess) {
  if (tess._incidenceCache) {
    return tess._incidenceCache;
  }
  var cache = {
    eOnF: {},
    vOnF: {},
    fOnE: {},
    vOnE: {},
    fOnV: {},
    eOnV: {}
  };
  // This would be the real fOnV except for ordering.
  var prelimFOnV = {};

  // First, do simple iteration over faces and their vertices.
  tess.faceIDs.forEach(function (fid) {
    var vs = tess.faceVerticesTable[fid];

    // vOnF is finished with this.
    cache.vOnF[fid] = vs;
    // eOnF is finished up to using canonical edge names.
    cache.eOnF[fid] = vs.map(function (vk, i) {
      return [0, 0, i, fid];
    });

    cache.fOnE[fid] = [];
    cache.vOnE[fid] = [];
    vs.forEach(function (v, i) {
      prelimFOnV[v[2]] = prelimFOnV[v[2]] || [];
      prelimFOnV[v[2]].push([-v[0], -v[1], fid]);
      var nextI = (i + 1) % vs.length;
      // fOnE is not yet using canonical edges; these will be collapsed later.
      cache.fOnE[fid][i] = [[0, 0, fid]];
      // vOnE is finished with this.
      cache.vOnE[fid][i] = [v, vs[nextI]];
    });
  });

  // Use vOnE to determine what the canonical edges are.
  var edgeTable = makeEdgeTable(cache.vOnE);
  // eOnF is finished with this.
  cache.eOnF = mapValues(cache.eOnF, function (edges) {
    return remapEdges(edges, edgeTable);
  });

  // Finish fOnE next. This requires identifying which edges are the same and
  // combining their two edge arrays with the appropriate shifting.
  tess.faceIDs.forEach(function (fid) {
    edgeTable[fid].forEach(function (edge, i) {
      var _edge = _slicedToArray(edge, 4),
          ex = _edge[0],
          ey = _edge[1],
          ei = _edge[2],
          efid = _edge[3];

      if (efid !== fid || ei !== i) {
        var invEdge = [-ex, -ey, ei, efid];
        var oldFOnE1 = cache.fOnE[fid][i];
        var oldFOnE2 = cache.fOnE[efid][ei];
        cache.fOnE[fid][i] = [].concat(_toConsumableArray(oldFOnE1), _toConsumableArray(shiftEls(oldFOnE2, edge)));
        cache.fOnE[efid][ei] = [].concat(_toConsumableArray(shiftEls(oldFOnE1, invEdge)), _toConsumableArray(oldFOnE2));
      }
    });
  });

  // fOnV and eOnV would be easy but for ordering. Use a helper to finish
  // those two.
  forEachObj(prelimFOnV, function (preFaces, vid) {
    var _computeElementsAroun = computeElementsAroundVertex(vid, preFaces, cache.eOnF, cache.vOnF, cache.fOnE),
        faces = _computeElementsAroun.faces,
        edges = _computeElementsAroun.edges;

    cache.fOnV[vid] = faces;
    cache.eOnV[vid] = edges;
  });

  tess._edgeTable = edgeTable;
  tess._incidenceCache = cache;
  return cache;
}

function reducePointWithShift(_ref3, _ref4, periodMatrix) {
  var _ref6 = _slicedToArray(_ref3, 2),
      px = _ref6[0],
      py = _ref6[1];

  var _ref5 = _slicedToArray(_ref4, 2),
      dx = _ref5[0],
      dy = _ref5[1];

  var _reducePoint = reducePoint([px - dx, py - dy], periodMatrix),
      _reducePoint2 = _slicedToArray(_reducePoint, 2),
      periodCoords = _reducePoint2[0],
      _reducePoint2$ = _slicedToArray(_reducePoint2[1], 2),
      rx = _reducePoint2$[0],
      ry = _reducePoint2$[1];

  var tx = -px + rx + dx;
  var ty = -py + ry + dy;
  return [periodCoords, [px + tx, py + ty]];
}

// Below are the methods that figure out which element is closest to a given
// point in the plane. The general strategy here is to choose a base
// rectangle and move the provided point inside it using the period matrix.
// This makes the problem finite, and we can precompute all elements that
// intersect the base rectangle, figure out where the point is using them,
// and then shift back to the real point/element using the period.

// This helper function does the aforementioned precomputing for faces. It
// returns a base rectangle and a list of faces that intersect it. This can
// be used to build a map of which parts of the base rectangle correspond to
// which element for each of faces, edges, and vertices.
function computeFaceCover(tess) {
  if (tess._baseRect) {
    return [tess._baseRect, tess._faceCover];
  }

  var periodMatrix = tess.periodMatrix;
  var baseRectSize = getBaseRectSize(periodMatrix);
  // findFaceCover requires that a face in the 0,0 period intersects the base
  // rectangle, so we position the base rectangle to be centered at the first
  // vertex of the first face in 0,0.
  var firstFID = tess.faceIDs[0];
  var firstFace = [0, 0, firstFID];
  var firstVertex = tess.getVerticesOnFace(firstFace)[0];
  var firstVCoords = tess.getVertexCoordinates(firstVertex);
  var baseRect = [firstVCoords[0] - baseRectSize[0] / 2, firstVCoords[1] - baseRectSize[1] / 2, baseRectSize[0], baseRectSize[1]];

  var faceCover = findFaceCover(baseRect, periodMatrix, tess.faceIDs, function (fid) {
    return tess.getFaceCoordinates([0, 0, fid]);
  }, function (fid) {
    return tess.getTouchingFaces([0, 0, fid]);
  });

  tess._baseRect = baseRect;
  tess._faceCover = faceCover;
  return [baseRect, faceCover];
}

// Returns a QueryPolygonAtlas that can determine which face contains a point for
// any point in the base rectangle of computeFaceCover.
function computeFaceAtlas(tess) {
  if (tess._faceAtlas) {
    return tess._faceAtlas;
  }

  var _computeFaceCover = computeFaceCover(tess),
      _computeFaceCover2 = _slicedToArray(_computeFaceCover, 2),
      baseRect = _computeFaceCover2[0],
      faceCover = _computeFaceCover2[1];

  var faceDataForAtlas = faceCover.map(function (f) {
    return [tess.getFaceCoordinates(f), f];
  });
  var faceAtlas = makePolygonAtlas(baseRect, faceDataForAtlas);
  tess._faceAtlas = faceAtlas;
  return faceAtlas;
}

// Returns a QueryPolygonAtlas that can determine the closest edge to a point for
// any point in the base rectangle of computeFaceCover. The edge's midpoint
// is used for computing distance.
function computeEdgeAtlas(tess) {
  if (tess._edgeAtlas) {
    return tess._edgeAtlas;
  }

  var _computeFaceCover3 = computeFaceCover(tess),
      _computeFaceCover4 = _slicedToArray(_computeFaceCover3, 2),
      faceCover = _computeFaceCover4[1];

  var edges = union(faceCover.map(function (k) {
    return tess.getEdgesOnFace(k);
  }));
  var edgesWithMidpoints = edges.map(function (k) {
    var _tess$getEdgeCoordina = tess.getEdgeCoordinates(k),
        _tess$getEdgeCoordina2 = _slicedToArray(_tess$getEdgeCoordina, 2),
        _tess$getEdgeCoordina3 = _slicedToArray(_tess$getEdgeCoordina2[0], 2),
        x1 = _tess$getEdgeCoordina3[0],
        y1 = _tess$getEdgeCoordina3[1],
        _tess$getEdgeCoordina4 = _slicedToArray(_tess$getEdgeCoordina2[1], 2),
        x2 = _tess$getEdgeCoordina4[0],
        y2 = _tess$getEdgeCoordina4[1];

    return [[(x1 + x2) / 2, (y1 + y2) / 2], k];
  });
  var edgeAtlas = makeVoronoiAtlas(edgesWithMidpoints);
  tess._edgeAtlas = edgeAtlas;
  return edgeAtlas;
}

// Returns a QueryPolygonAtlas that can determine the closest vertex to a point
// for any point in the base rectangle of computeFaceCover.
function computeVertexAtlas(tess) {
  if (tess._vertexAtlas) {
    return tess._vertexAtlas;
  }

  var _computeFaceCover5 = computeFaceCover(tess),
      _computeFaceCover6 = _slicedToArray(_computeFaceCover5, 2),
      faceCover = _computeFaceCover6[1];

  var vertices = union(faceCover.map(function (k) {
    return tess.getVerticesOnFace(k);
  }));
  var verticesWithPoints = vertices.map(function (k) {
    return [tess.getVertexCoordinates(k), k];
  });
  var vertexAtlas = makeVoronoiAtlas(verticesWithPoints);
  tess._vertexAtlas = vertexAtlas;
  return vertexAtlas;
}

// Tiny helper to handle changing an arbitrary point into one inside the base
// rectangle, then using that to query an atlas using that rectangle.
function getCandidatesFromAtlas(tess, point, atlas) {
  var firstFID = tess.faceIDs[0];
  var baseRect = computeFaceCover(tess)[0];

  var _reducePointWithShift = reducePointWithShift(point, [baseRect[0], baseRect[1]], tess.periodMatrix),
      _reducePointWithShift2 = _slicedToArray(_reducePointWithShift, 2),
      _reducePointWithShift3 = _slicedToArray(_reducePointWithShift2[0], 2),
      px = _reducePointWithShift3[0],
      py = _reducePointWithShift3[1],
      reducedPoint = _reducePointWithShift2[1];

  var candEls = atlas(reducedPoint).map(function (r) {
    return r[1];
  });
  candEls = shiftEls(candEls, [px, py, firstFID]);
  return candEls;
}

var Tesselation = function () {
  function Tesselation(props) {
    _classCallCheck(this, Tesselation);

    if (!props) {
      throw new Error("new Tesselation: first parameter must be an object");
    } else if (!Array.isArray(props.periodMatrix)) {
      throw new Error("new Tesselation: must pass array for periodMatrix");
    } else if (!isObject(props.faceVerticesTable)) {
      throw new Error("new Tesselation: must pass an object for faceVerticesTable");
    } else if (!isObject(props.vertexCoordinatesTable)) {
      throw new Error("new Tesselation: must pass an object for vertexCoordinatesTable");
    }

    this.faceIDs = Object.keys(props.faceVerticesTable);
    this.faceVerticesTable = props.faceVerticesTable;
    this.vertexCoordinatesTable = props.vertexCoordinatesTable;
    this.periodMatrix = props.periodMatrix;
  }

  _createClass(Tesselation, [{
    key: "getProps",
    value: function getProps() {
      return {
        faceVerticesTable: this.faceVerticesTable,
        vertexCoordinatesTable: this.vertexCoordinatesTable,
        periodMatrix: this.periodMatrix
      };
    }
  }, {
    key: "getCanonicalEdge",
    value: function getCanonicalEdge(edge) {
      // this._edgeTable needs to be populated first.
      getIncidenceCache(this);
      return getMappedEdge(edge, this._edgeTable);
    }
  }, {
    key: "isSameEdge",
    value: function isSameEdge(e1, e2) {
      return isEdgeEqual(this.getCanonicalEdge(e1), this.getCanonicalEdge(e2));
    }
  }, {
    key: "getEdgesOnFace",
    value: function getEdgesOnFace(face) {
      var base = getIncidenceCache(this).eOnF[face[2]];
      if (!base) {
        throw new Error("Invalid face " + String(face));
      }
      return shiftEls(base, face);
    }
  }, {
    key: "getVerticesOnFace",
    value: function getVerticesOnFace(face) {
      var base = getIncidenceCache(this).vOnF[face[2]];
      if (!base) {
        throw new Error("Invalid face " + String(face));
      }
      return shiftEls(base, face);
    }
  }, {
    key: "getFacesOnEdge",
    value: function getFacesOnEdge(edge) {
      var base = getIncidenceCache(this).fOnE[edge[3]];
      base = base && base[edge[2]];
      if (!base) {
        throw new Error("Invalid edge " + String(edge));
      }
      return shiftEls(base, edge);
    }
  }, {
    key: "getVerticesOnEdge",
    value: function getVerticesOnEdge(edge) {
      var base = getIncidenceCache(this).vOnE[edge[3]];
      base = base && base[edge[2]];
      if (!base) {
        throw new Error("Invalid edge " + String(edge));
      }
      return [shiftEl(base[0], edge), shiftEl(base[1], edge)];
    }
  }, {
    key: "getFacesOnVertex",
    value: function getFacesOnVertex(vertex) {
      var base = getIncidenceCache(this).fOnV[vertex[2]];
      if (!base) {
        throw new Error("Invalid vertex " + String(vertex));
      }
      return shiftEls(base, vertex);
    }
  }, {
    key: "getEdgesOnVertex",
    value: function getEdgesOnVertex(vertex) {
      var base = getIncidenceCache(this).eOnV[vertex[2]];
      if (!base) {
        throw new Error("Invalid vertex " + String(vertex));
      }
      return shiftEls(base, vertex);
    }
  }, {
    key: "getOtherFace",
    value: function getOtherFace(face, edge) {
      var _getFacesOnEdge = this.getFacesOnEdge(edge),
          _getFacesOnEdge2 = _slicedToArray(_getFacesOnEdge, 2),
          f1 = _getFacesOnEdge2[0],
          f2 = _getFacesOnEdge2[1];

      var is1Equal = f1 && isFaceEqual(f1, face);
      var is2Equal = f2 && isFaceEqual(f2, face);
      if (!is1Equal && !is2Equal) {
        return null;
      }
      return (is1Equal ? f2 : f1) || null;
    }
  }, {
    key: "getOtherVertex",
    value: function getOtherVertex(vertex, edge) {
      var _getVerticesOnEdge = this.getVerticesOnEdge(edge),
          _getVerticesOnEdge2 = _slicedToArray(_getVerticesOnEdge, 2),
          v1 = _getVerticesOnEdge2[0],
          v2 = _getVerticesOnEdge2[1];

      var is1Equal = v1 && isVertexEqual(v1, vertex);
      var is2Equal = v2 && isVertexEqual(v2, vertex);
      if (!is1Equal && !is2Equal) {
        return null;
      }
      return (is1Equal ? v2 : v1) || null;
    }
  }, {
    key: "getAdjacentFaces",
    value: function getAdjacentFaces(face) {
      var _this = this;

      return this.getEdgesOnFace(face).map(function (edge) {
        return _this.getOtherFace(face, edge);
      }).filter(Boolean);
    }
  }, {
    key: "getAdjacentVertices",
    value: function getAdjacentVertices(vertex) {
      var _this2 = this;

      return this.getEdgesOnVertex(vertex).map(function (edge) {
        return _this2.getOtherVertex(vertex, edge);
      }).filter(Boolean);
    }
  }, {
    key: "getTouchingFaces",
    value: function getTouchingFaces(face) {
      var _this3 = this;

      return union(this.getVerticesOnFace(face).map(function (v) {
        return _this3.getFacesOnVertex(v);
      }), [face]);
    }
  }, {
    key: "getTouchingEdges",
    value: function getTouchingEdges(edge) {
      var _this4 = this;

      return union(this.getVerticesOnEdge(edge).map(function (v) {
        return _this4.getEdgesOnVertex(v);
      }), [this.getCanonicalEdge(edge)]);
    }
  }, {
    key: "getSurroundingEdges",
    value: function getSurroundingEdges(edge) {
      var _this5 = this;

      return union(this.getFacesOnEdge(edge).map(function (f) {
        return _this5.getEdgesOnFace(f);
      }), [this.getCanonicalEdge(edge)]);
    }
  }, {
    key: "getSurroundingVertices",
    value: function getSurroundingVertices(vertex) {
      var _this6 = this;

      return union(this.getFacesOnVertex(vertex).map(function (f) {
        return _this6.getVerticesOnFace(f);
      }), [vertex]);
    }
  }, {
    key: "getFaceCoordinates",
    value: function getFaceCoordinates(face) {
      var _this7 = this;

      return this.getVerticesOnFace(face).map(function (v) {
        return _this7.getVertexCoordinates(v);
      });
    }
  }, {
    key: "getEdgeCoordinates",
    value: function getEdgeCoordinates(edge) {
      var _getVerticesOnEdge3 = this.getVerticesOnEdge(edge),
          _getVerticesOnEdge4 = _slicedToArray(_getVerticesOnEdge3, 2),
          v1 = _getVerticesOnEdge4[0],
          v2 = _getVerticesOnEdge4[1];

      return [this.getVertexCoordinates(v1), this.getVertexCoordinates(v2)];
    }
  }, {
    key: "getVertexCoordinates",
    value: function getVertexCoordinates(vertex) {
      var _vertex = _slicedToArray(vertex, 3),
          vx = _vertex[0],
          vy = _vertex[1],
          vid = _vertex[2];

      var _vertexCoordinatesTab = _slicedToArray(this.vertexCoordinatesTable[vid], 2),
          vidX = _vertexCoordinatesTab[0],
          vidY = _vertexCoordinatesTab[1];

      var _periodMatrix = _slicedToArray(this.periodMatrix, 4),
          a = _periodMatrix[0],
          b = _periodMatrix[1],
          c = _periodMatrix[2],
          d = _periodMatrix[3];

      return [vx * a + vy * c + vidX, vx * b + vy * d + vidY];
    }
  }, {
    key: "findFaceAt",
    value: function findFaceAt(point) {
      var faceAtlas = computeFaceAtlas(this);
      var cands = getCandidatesFromAtlas(this, point, faceAtlas);
      return cands[0] || null;
    }
  }, {
    key: "findEdgeAt",
    value: function findEdgeAt(point) {
      var edgeAtlas = computeEdgeAtlas(this);
      var cands = getCandidatesFromAtlas(this, point, edgeAtlas);
      return cands[0] || null;
    }
  }, {
    key: "findVertexAt",
    value: function findVertexAt(point) {
      var vertexAtlas = computeVertexAtlas(this);
      var cands = getCandidatesFromAtlas(this, point, vertexAtlas);
      return cands[0] || null;
    }
  }]);

  return Tesselation;
}();

var _createClass$1 = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

var _slicedToArray$6 = function () {
  function sliceIterator(arr, i) {
    var _arr = [];var _n = true;var _d = false;var _e = undefined;try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;_e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }return _arr;
  }return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();

function _classCallCheck$1(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function withDefault(value, defaultValue) {
  return value == null ? defaultValue : value;
}

// Sets _faceSet variable if not set already.
function computeFaceSet(g) {
  if (g._faceSet) {
    return;
  }
  g._faceSet = new Set();
  g.faceList.forEach(function (f) {
    return g._faceSet.add(g.elToString(f, "f"));
  });
}

// Sets _edgeList and _edgeSet variables if not set already.
function computeEdgeListAndSet(g) {
  if (g._edgeList && g._edgeSet) {
    return;
  }
  var edgeList = [];
  var edgeSet = new Set();
  g.faceList.forEach(function (f) {
    var tessF = g.toFaceTessKey(f);
    g.tesselation.getEdgesOnFace(tessF).forEach(function (tessE) {
      var e = g.fromEdgeTessKey(tessE);
      var eStr = g.elToString(e, "e");
      if (!edgeSet.has(eStr)) {
        edgeList.push(e);
        edgeSet.add(eStr);
      }
    });
  });
  g._edgeList = edgeList;
  g._edgeSet = edgeSet;
}

// Sets _vertexList and _vertexSet variables if not set already.
function computeVertexListAndSet(g) {
  if (g._vertexList && g._vertexSet) {
    return;
  }
  var vertexList = [];
  var vertexSet = new Set();
  g.faceList.forEach(function (f) {
    var tessF = g.toFaceTessKey(f);
    g.tesselation.getVerticesOnFace(tessF).forEach(function (tessV) {
      var v = g.fromVertexTessKey(tessV);
      var vStr = g.elToString(v, "v");
      if (!vertexSet.has(vStr)) {
        vertexList.push(v);
        vertexSet.add(vStr);
      }
    });
  });
  g._vertexList = vertexList;
  g._vertexSet = vertexSet;
}

function fromTessCoordinates(g, _ref) {
  var _ref2 = _slicedToArray$6(_ref, 2),
      x = _ref2[0],
      y = _ref2[1];

  var _g$origin = _slicedToArray$6(g.origin, 2),
      ox = _g$origin[0],
      oy = _g$origin[1];

  return [g.scale * x + ox, g.scale * y + oy];
}

function toTessCoordinates(g, _ref3) {
  var _ref4 = _slicedToArray$6(_ref3, 2),
      x = _ref4[0],
      y = _ref4[1];

  var _g$origin2 = _slicedToArray$6(g.origin, 2),
      ox = _g$origin2[0],
      oy = _g$origin2[1];

  return [(x - ox) / g.scale, (y - oy) / g.scale];
}

var Grid = function () {
  function Grid(props) {
    _classCallCheck$1(this, Grid);

    if (!props) {
      throw new Error("new Grid: first parameter must be an object");
    } else if (!props.tesselation) {
      throw new Error("new Grid: must pass tesselation");
    } else if (!props.faceList) {
      throw new Error("new Grid: must pass faceList");
    }
    this.tesselation = props.tesselation;
    this.faceList = props.faceList;
    this.origin = withDefault(props.origin, [0, 0]);
    this.scale = withDefault(props.scale, 1);

    var id = function id(x) {
      return x;
    };
    this.fromFaceTessKey = withDefault(props.fromFaceTessKey, id);
    this.fromEdgeTessKey = withDefault(props.fromEdgeTessKey, id);
    this.fromVertexTessKey = withDefault(props.fromVertexTessKey, id);
    this.toFaceTessKey = withDefault(props.toFaceTessKey, id);
    this.toEdgeTessKey = withDefault(props.toEdgeTessKey, id);
    this.toVertexTessKey = withDefault(props.toVertexTessKey, id);

    this.elToString = withDefault(props.elToString, String);
  }

  _createClass$1(Grid, [{
    key: "getProps",
    value: function getProps() {
      return {
        tesselation: this.tesselation,
        faceList: this.faceList,
        origin: this.origin,
        scale: this.scale,
        fromFaceTessKey: this.fromFaceTessKey,
        fromEdgeTessKey: this.fromEdgeTessKey,
        fromVertexTessKey: this.fromVertexTessKey,
        toFaceTessKey: this.toFaceTessKey,
        toEdgeTessKey: this.toEdgeTessKey,
        toVertexTessKey: this.toVertexTessKey,
        elToString: this.elToString
      };
    }
  }, {
    key: "getFaceList",
    value: function getFaceList() {
      return this.faceList;
    }
  }, {
    key: "getEdgeList",
    value: function getEdgeList() {
      computeEdgeListAndSet(this);
      return this._edgeList;
    }
  }, {
    key: "getVertexList",
    value: function getVertexList() {
      computeVertexListAndSet(this);
      return this._vertexList;
    }
  }, {
    key: "hasFace",
    value: function hasFace(face) {
      computeFaceSet(this);
      return this._faceSet.has(this.elToString(face, "f"));
    }
  }, {
    key: "getCanonicalEdge",
    value: function getCanonicalEdge(edge) {
      var canonicalEdge = this.toEdgeTessKey(edge);
      canonicalEdge = this.tesselation.getCanonicalEdge(canonicalEdge);
      return this.fromEdgeTessKey(canonicalEdge);
    }
  }, {
    key: "hasEdge",
    value: function hasEdge(edge) {
      computeEdgeListAndSet(this);
      var has = this._edgeSet.has(this.elToString(edge, "e"));
      if (!has) {
        // This might throw if the edge is in a completely wrong format, and
        // the hasX methods need to be forgiving about that.
        try {
          var canonicalEdge = this.getCanonicalEdge(edge);
          has = this._edgeSet.has(this.elToString(canonicalEdge, "e"));
        } catch (ex) {
          has = false;
        }
      }
      return has;
    }
  }, {
    key: "hasVertex",
    value: function hasVertex(vertex) {
      computeVertexListAndSet(this);
      return this._vertexSet.has(this.elToString(vertex, "v"));
    }
  }, {
    key: "getEdgesOnFace",
    value: function getEdgesOnFace(face) {
      var _this = this;

      return this.tesselation.getEdgesOnFace(this.toFaceTessKey(face)).map(function (e) {
        return _this.fromEdgeTessKey(e);
      });
    }
  }, {
    key: "getVerticesOnFace",
    value: function getVerticesOnFace(face) {
      var _this2 = this;

      return this.tesselation.getVerticesOnFace(this.toFaceTessKey(face)).map(function (v) {
        return _this2.fromVertexTessKey(v);
      });
    }
  }, {
    key: "getFacesOnEdge",
    value: function getFacesOnEdge(edge) {
      var _this3 = this;

      return this.tesselation.getFacesOnEdge(this.toEdgeTessKey(edge)).map(function (f) {
        return _this3.fromFaceTessKey(f);
      });
    }
  }, {
    key: "getVerticesOnEdge",
    value: function getVerticesOnEdge(edge) {
      var _this4 = this;

      return this.tesselation.getVerticesOnEdge(this.toEdgeTessKey(edge)).map(function (v) {
        return _this4.fromVertexTessKey(v);
      });
    }
  }, {
    key: "getFacesOnVertex",
    value: function getFacesOnVertex(vertex) {
      var _this5 = this;

      return this.tesselation.getFacesOnVertex(this.toVertexTessKey(vertex)).map(function (f) {
        return _this5.fromFaceTessKey(f);
      });
    }
  }, {
    key: "getEdgesOnVertex",
    value: function getEdgesOnVertex(vertex) {
      var _this6 = this;

      return this.tesselation.getEdgesOnVertex(this.toVertexTessKey(vertex)).map(function (e) {
        return _this6.fromEdgeTessKey(e);
      });
    }
  }, {
    key: "getAdjacentFaces",
    value: function getAdjacentFaces(face) {
      var _this7 = this;

      return this.tesselation.getAdjacentFaces(this.toFaceTessKey(face)).map(function (f) {
        return _this7.fromFaceTessKey(f);
      });
    }
  }, {
    key: "getTouchingFaces",
    value: function getTouchingFaces(face) {
      var _this8 = this;

      return this.tesselation.getTouchingFaces(this.toFaceTessKey(face)).map(function (f) {
        return _this8.fromFaceTessKey(f);
      });
    }
  }, {
    key: "getSurroundingEdges",
    value: function getSurroundingEdges(edge) {
      var _this9 = this;

      return this.tesselation.getSurroundingEdges(this.toEdgeTessKey(edge)).map(function (e) {
        return _this9.fromEdgeTessKey(e);
      });
    }
  }, {
    key: "getTouchingEdges",
    value: function getTouchingEdges(edge) {
      var _this10 = this;

      return this.tesselation.getTouchingEdges(this.toEdgeTessKey(edge)).map(function (e) {
        return _this10.fromEdgeTessKey(e);
      });
    }
  }, {
    key: "getSurroundingVertices",
    value: function getSurroundingVertices(vertex) {
      var _this11 = this;

      return this.tesselation.getSurroundingVertices(this.toVertexTessKey(vertex)).map(function (v) {
        return _this11.fromVertexTessKey(v);
      });
    }
  }, {
    key: "getAdjacentVertices",
    value: function getAdjacentVertices(vertex) {
      var _this12 = this;

      return this.tesselation.getAdjacentVertices(this.toVertexTessKey(vertex)).map(function (v) {
        return _this12.fromVertexTessKey(v);
      });
    }
  }, {
    key: "getOtherFace",
    value: function getOtherFace(face, edge) {
      var ret = this.tesselation.getOtherFace(this.toFaceTessKey(face), this.toEdgeTessKey(edge));
      return ret && this.fromFaceTessKey(ret);
    }
  }, {
    key: "getOtherVertex",
    value: function getOtherVertex(vertex, edge) {
      var ret = this.tesselation.getOtherVertex(this.toVertexTessKey(vertex), this.toEdgeTessKey(edge));
      return ret && this.fromVertexTessKey(ret);
    }
  }, {
    key: "isEdgeInside",
    value: function isEdgeInside(edge) {
      var _this13 = this;

      var tessFaces = this.tesselation.getFacesOnEdge(this.toEdgeTessKey(edge));

      var _tessFaces$map = tessFaces.map(function (f) {
        return _this13.fromFaceTessKey(f);
      }),
          _tessFaces$map2 = _slicedToArray$6(_tessFaces$map, 2),
          f1 = _tessFaces$map2[0],
          f2 = _tessFaces$map2[1];

      return this.hasFace(f1) && this.hasFace(f2);
    }
  }, {
    key: "isEdgeOnBorder",
    value: function isEdgeOnBorder(edge) {
      return this.hasEdge(edge) && !this.isEdgeInside(edge);
    }
  }, {
    key: "isEdgeOutside",
    value: function isEdgeOutside(edge) {
      return !this.hasEdge(edge);
    }
  }, {
    key: "getFaceCoordinates",
    value: function getFaceCoordinates(face) {
      var _this14 = this;

      return this.tesselation.getFaceCoordinates(this.toFaceTessKey(face)).map(function (p) {
        return fromTessCoordinates(_this14, p);
      });
    }
  }, {
    key: "getEdgeCoordinates",
    value: function getEdgeCoordinates(edge) {
      var _tesselation$getEdgeC = this.tesselation.getEdgeCoordinates(this.toEdgeTessKey(edge)),
          _tesselation$getEdgeC2 = _slicedToArray$6(_tesselation$getEdgeC, 2),
          p1 = _tesselation$getEdgeC2[0],
          p2 = _tesselation$getEdgeC2[1];

      return [fromTessCoordinates(this, p1), fromTessCoordinates(this, p2)];
    }
  }, {
    key: "getVertexCoordinates",
    value: function getVertexCoordinates(vertex) {
      return fromTessCoordinates(this, this.tesselation.getVertexCoordinates(this.toVertexTessKey(vertex)));
    }
  }, {
    key: "getBoundingBox",
    value: function getBoundingBox$$1() {
      var _this15 = this;

      if (!this._boundingBox) {
        var vPoints = this.getVertexList().map(function (v) {
          return _this15.getVertexCoordinates(v);
        });
        this._boundingBox = getBoundingBox(vPoints);
      }
      return this._boundingBox;
    }
  }, {
    key: "findFaceAt",
    value: function findFaceAt(point) {
      var face = this.tesselation.findFaceAt(toTessCoordinates(this, point));
      return face && this.fromFaceTessKey(face);
    }
  }, {
    key: "findEdgeAt",
    value: function findEdgeAt(point) {
      var edge = this.tesselation.findEdgeAt(toTessCoordinates(this, point));
      return edge && this.fromEdgeTessKey(edge);
    }
  }, {
    key: "findVertexAt",
    value: function findVertexAt(point) {
      var vertex = this.tesselation.findVertexAt(toTessCoordinates(this, point));
      return vertex && this.fromVertexTessKey(vertex);
    }
  }]);

  return Grid;
}();

// Utilities and helpers

function map2D(width, height, f) {
  var ret = [];
  for (var y = 0; y < height; y += 1) {
    for (var x = 0; x < width; x += 1) {
      var el = f(x, y);
      if (el != null) {
        ret.push(el);
      }
    }
  }
  return ret;
}

function modifyFaceList(faceList) {
  var elToString = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : String;
  var include = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  var exclude = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];

  if (!include.length && !exclude.length) {
    return faceList;
  }
  var excludeSet = new Set();
  exclude.forEach(function (f) {
    return excludeSet.add(elToString(f));
  });
  include.forEach(function (f) {
    return excludeSet.add(elToString(f));
  });
  return faceList.filter(function (f) {
    return !excludeSet.has(elToString(f));
  }).concat(include);
}

function makeGeometry(tesselation, tessFaceList, props) {
  var faceList = tessFaceList.map(props.fromFaceTessKey || function (x) {
    return x;
  });
  return new Grid({
    tesselation: props.tesselation || tesselation,
    faceList: modifyFaceList(faceList, props.elToString, props.include, props.exclude),
    origin: props.origin,
    scale: props.scale,
    fromFaceTessKey: props.fromFaceTessKey,
    fromEdgeTessKey: props.fromEdgeTessKey,
    fromVertexTessKey: props.fromVertexTessKey,
    toFaceTessKey: props.toFaceTessKey,
    toEdgeTessKey: props.toEdgeTessKey,
    toVertexTessKey: props.toVertexTessKey,
    elToString: props.elToString
  });
}

// Tesselations

var HRT2 = Math.sqrt(2) / 2;
var HRT3 = Math.sqrt(3) / 2;

var tessSquare = new Tesselation({
  periodMatrix: [1, 0, 0, 1],
  faceVerticesTable: {
    "0": [[0, 0, "0"], [1, 0, "0"], [1, 1, "0"], [0, 1, "0"]]
  },
  vertexCoordinatesTable: { "0": [0, 0] }
});

var tessOctagon = new Tesselation({
  periodMatrix: [HRT2 + 1, 0, 0, HRT2 + 1],
  faceVerticesTable: {
    "0": [[0, 0, "0"], [0, 0, "1"], [0, 0, "2"], [0, 0, "3"], [0, 0, "4"], [0, 0, "5"], [0, 0, "6"], [0, 0, "7"]],
    "1": [[0, 0, "2"], [1, 0, "7"], [1, 0, "6"], [0, 0, "3"]],
    "2": [[0, 0, "5"], [0, 0, "4"], [0, 1, "1"], [0, 1, "0"]],
    "3": [[0, 0, "3"], [1, 0, "6"], [1, 0, "5"], [1, 1, "0"], [1, 1, "7"], [0, 1, "2"], [0, 1, "1"], [0, 0, "4"]]
  },
  vertexCoordinatesTable: {
    "0": [HRT2 / 2, 0],
    "1": [HRT2 / 2 + 0.5, 0],
    "2": [HRT2 + 0.5, HRT2 / 2],
    "3": [HRT2 + 0.5, HRT2 / 2 + 0.5],
    "4": [HRT2 / 2 + 0.5, HRT2 + 0.5],
    "5": [HRT2 / 2, HRT2 + 0.5],
    "6": [0, HRT2 / 2 + 0.5],
    "7": [0, HRT2 / 2]
  }
});

var tessSnubSquare = new Tesselation({
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
    "11": [[1, 0, "7"], [1, 1, "0"], [0, 1, "2"]]
  },
  vertexCoordinatesTable: {
    "0": [0, 0.5],
    "1": [HRT3, 0],
    "2": [HRT3 + 1, 0],
    "3": [HRT3 + 0.5, HRT3],
    "4": [2 * HRT3 + 0.5, HRT3 + 0.5],
    "5": [HRT3 + 0.5, HRT3 + 1],
    "6": [0.5, HRT3 + 0.5],
    "7": [0, 2 * HRT3 + 0.5]
  }
});

var tessCairo = new Tesselation({
  periodMatrix: [2 * HRT3 + 1, 0, 0, 2 * HRT3 + 1],
  faceVerticesTable: {
    "0": [[0, 0, "0"], [0, 0, "1"], [0, 0, "3"], [0, 0, "5"], [0, 0, "2"]],
    "1": [[0, 0, "2"], [0, 0, "5"], [0, 0, "9"], [0, 0, "7"], [0, 0, "6"]],
    "2": [[0, 0, "3"], [0, 0, "4"], [0, 0, "10"], [0, 0, "9"], [0, 0, "5"]],
    "3": [[0, 0, "4"], [1, 0, "0"], [1, 0, "2"], [1, 0, "6"], [0, 0, "10"]],
    "4": [[0, 0, "6"], [0, 0, "7"], [0, 1, "1"], [0, 1, "0"], [0, 0, "8"]],
    "5": [[0, 0, "7"], [0, 0, "9"], [0, 0, "11"], [0, 1, "3"], [0, 1, "1"]],
    "6": [[0, 0, "9"], [0, 0, "10"], [1, 0, "6"], [1, 0, "8"], [0, 0, "11"]],
    "7": [[0, 0, "11"], [1, 0, "8"], [1, 1, "0"], [0, 1, "4"], [0, 1, "3"]]
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
    "11": [7 * HRT3 / 6 + 0.75, 3 * HRT3 / 2 + 0.75]
  }
});

var tessTriangleH = new Tesselation({
  periodMatrix: [1, 0, 0.5, HRT3],
  faceVerticesTable: {
    "0": [[0, 0, "0"], [1, 0, "0"], [0, 1, "0"]],
    "1": [[1, 0, "0"], [1, 1, "0"], [0, 1, "0"]]
  },
  vertexCoordinatesTable: { "0": [0, 0] }
});

var tessTriangleV = new Tesselation({
  periodMatrix: [HRT3, 0.5, 0, 1],
  faceVerticesTable: {
    "0": [[0, 0, "0"], [1, 0, "0"], [0, 1, "0"]],
    "1": [[1, 0, "0"], [1, 1, "0"], [0, 1, "0"]]
  },
  vertexCoordinatesTable: { "0": [0, 0] }
});

var tessHexagonH = new Tesselation({
  periodMatrix: [0.75, HRT3 / 2, 0, HRT3],
  faceVerticesTable: {
    "0": [[0, 0, "0"], [0, 0, "1"], [1, 0, "0"], [0, 1, "1"], [0, 1, "0"], [-1, 1, "1"]]
  },
  vertexCoordinatesTable: {
    "0": [0, 0],
    "1": [0.5, 0]
  }
});

var tessHexagonV = new Tesselation({
  periodMatrix: [HRT3, 0, HRT3 / 2, 0.75],
  faceVerticesTable: {
    "0": [[0, 0, "0"], [0, 0, "1"], [0, 1, "0"], [1, 0, "1"], [1, 0, "0"], [1, -1, "1"]]
  },
  vertexCoordinatesTable: {
    "0": [0, 0],
    "1": [0, 0.5]
  }
});

// Geometries

function square(props) {
  var width = props.width,
      height = props.height;

  var faceList = map2D(width, height, function (x, y) {
    return [x, y, "0"];
  });
  return makeGeometry(tessSquare, faceList, props);
}

function octagon(props) {
  var width = props.width,
      height = props.height;

  var faceList = map2D(width, height, function (x, y) {
    return [Math.floor(x / 2), Math.floor(y / 2), String(x % 2 + 2 * (y % 2))];
  });
  return makeGeometry(tessOctagon, faceList, props);
}

function snubSquare(props) {
  var width = props.width,
      height = props.height;

  var faceList = map2D(2 * width - 1, 2 * height - 1, function (x, y) {
    if (x % 2 === 1 && y % 2 === 1) {
      return null;
    }
    var qx = Math.floor(x / 4);
    var qy = Math.floor(y / 4);
    var fid = (x % 2 ? 1 : 0) + (y % 2 ? 2 : 0) + (x % 4 >= 2 ? 3 : 0) + (y % 4 >= 2 ? 6 : 0);
    return [qx, qy, String(fid)];
  });
  return makeGeometry(tessSnubSquare, faceList, props);
}

function cairo(props) {
  var width = props.width,
      height = props.height;

  var faceList = map2D(width, 2 * height, function (x, twiceY) {
    var y = Math.floor(twiceY / 2);
    var hx = Math.floor(x / 2);
    var hy = Math.floor(y / 2);
    var fid = (x % 2 ? 2 : 0) + (y % 2 ? 4 : 0) + (twiceY % 2 ? 1 : 0);
    return [hx, hy, String(fid)];
  });
  return makeGeometry(tessCairo, faceList, props);
}

function triangleH(props) {
  var width = props.width,
      height = props.height;

  var faceList = map2D(2 * width, height, function (x, y) {
    x -= y;
    return [Math.floor(x / 2), y, String(Math.abs(x % 2))];
  });
  return makeGeometry(tessTriangleH, faceList, props);
}

function triangleHDown(props) {
  var length = props.length;

  var faceList = map2D(2 * length, length, function (x, y) {
    if (x + 2 * y >= 2 * length - 1) {
      return null;
    }
    return [Math.floor(x / 2), y, String(Math.abs(x % 2))];
  });
  return makeGeometry(tessTriangleH, faceList, props);
}

function triangleHUp(props) {
  var length = props.length;

  var faceList = map2D(2 * length, length, function (x, y) {
    if (x + 2 * y < 2 * length - 1) {
      return null;
    }
    return [Math.floor(x / 2), y, String(Math.abs(x % 2))];
  });
  return makeGeometry(tessTriangleH, faceList, props);
}

function triangleV(props) {
  var width = props.width,
      height = props.height;

  var faceList = map2D(width, 2 * height, function (x, y) {
    y -= x;
    return [x, Math.floor(y / 2), String(Math.abs(y % 2))];
  });
  return makeGeometry(tessTriangleV, faceList, props);
}

function triangleVRight(props) {
  var length = props.length;

  var faceList = map2D(length, 2 * length, function (x, y) {
    if (2 * x + y >= 2 * length - 1) {
      return null;
    }
    return [x, Math.floor(y / 2), String(Math.abs(y % 2))];
  });
  return makeGeometry(tessTriangleV, faceList, props);
}

function triangleVLeft(props) {
  var length = props.length;

  var faceList = map2D(length, 2 * length, function (x, y) {
    if (2 * x + y < 2 * length - 1) {
      return null;
    }
    return [x, Math.floor(y / 2), String(Math.abs(y % 2))];
  });
  return makeGeometry(tessTriangleV, faceList, props);
}

function hexagonH(props) {
  var width = props.width,
      height = props.height;

  var faceList = map2D(width, height, function (x, y) {
    y -= Math.floor(x / 2);
    return [x, y, "0"];
  });
  return makeGeometry(tessHexagonH, faceList, props);
}

function hexagonHCubic(props) {
  var widthTL = props.widthTL,
      widthTR = props.widthTR,
      height = props.height;

  var width = widthTL + widthTR - 1;
  var faceList = map2D(width, width + height, function (x, y) {
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

function hexagonV(props) {
  var width = props.width,
      height = props.height;

  var faceList = map2D(width, height, function (x, y) {
    x -= Math.floor(y / 2);
    return [x, y, "0"];
  });
  return makeGeometry(tessHexagonV, faceList, props);
}

function hexagonVCubic(props) {
  var width = props.width,
      heightTL = props.heightTL,
      heightBL = props.heightBL;

  var height = heightTL + heightBL - 1;
  var faceList = map2D(width + height, height, function (x, y) {
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

var GridgyPresets = Object.freeze({
	tessSquare: tessSquare,
	tessOctagon: tessOctagon,
	tessSnubSquare: tessSnubSquare,
	tessCairo: tessCairo,
	tessTriangleH: tessTriangleH,
	tessTriangleV: tessTriangleV,
	tessHexagonH: tessHexagonH,
	tessHexagonV: tessHexagonV,
	square: square,
	octagon: octagon,
	snubSquare: snubSquare,
	cairo: cairo,
	triangleH: triangleH,
	triangleHDown: triangleHDown,
	triangleHUp: triangleHUp,
	triangleV: triangleV,
	triangleVRight: triangleVRight,
	triangleVLeft: triangleVLeft,
	hexagonH: hexagonH,
	hexagonHCubic: hexagonHCubic,
	hexagonV: hexagonV,
	hexagonVCubic: hexagonVCubic
});

// In your code, this line would be
// import * as GridgyPresets from "gridgy-presets";

var CANVAS_WIDTH = 800;
var CANVAS_HEIGHT = 600;

var gridDataList = [{
  exportName: "square",
  tessExportName: "tessSquare",
  label: "Square",
  params: [["width", "Width", 5], ["height", "Height", 5]]
}, {
  exportName: "octagon",
  tessExportName: "tessOctagon",
  label: "Octagon",
  params: [["width", "Width", 5], ["height", "Height", 5]]
}, {
  exportName: "snubSquare",
  tessExportName: "tessSnubSquare",
  label: "Snub Square",
  params: [["width", "Width", 3], ["height", "Height", 3]]
}, {
  exportName: "cairo",
  tessExportName: "tessCairo",
  label: "Cairo",
  params: [["width", "Width", 3], ["height", "Height", 3]]
}, {
  exportName: "triangleH",
  tessExportName: "tessTriangleH",
  label: "Triangle (horizontal side)",
  params: [["width", "Width", 5], ["height", "Height", 5]]
}, {
  exportName: "triangleHDown",
  tessExportName: "tessTriangleH",
  label: "Triangle (pointing down)",
  params: [["length", "Side length", 5]]
}, {
  exportName: "triangleHUp",
  tessExportName: "tessTriangleH",
  label: "Triangle (pointing up)",
  params: [["length", "Side length", 5]]
}, {
  exportName: "triangleV",
  tessExportName: "tessTriangleV",
  label: "Triangle (vertical side)",
  params: [["width", "Width", 5], ["height", "Height", 5]]
}, {
  exportName: "triangleVRight",
  tessExportName: "tessTriangleV",
  label: "Triangle (pointing right)",
  params: [["length", "Side length", 5]]
}, {
  exportName: "triangleVLeft",
  tessExportName: "tessTriangleV",
  label: "Triangle (pointing left)",
  params: [["length", "Side length", 5]]
}, {
  exportName: "hexagonH",
  tessExportName: "tessHexagonH",
  label: "Hexagon (horizontal side)",
  params: [["width", "Width", 5], ["height", "Height", 5]]
}, {
  exportName: "hexagonHCubic",
  tessExportName: "tessHexagonH",
  label: "Hexagon (horizontal, cubic)",
  params: [["widthTL", "Width (top left)", 4], ["widthTR", "Width (top right)", 4], ["height", "Height", 4]]
}, {
  exportName: "hexagonV",
  tessExportName: "tessHexagonV",
  label: "Hexagon (vertical side)",
  params: [["width", "Width", 5], ["height", "Height", 5]]
}, {
  exportName: "hexagonVCubic",
  tessExportName: "tessHexagonV",
  label: "Hexagon (vertical, cubic)",
  params: [["width", "Width", 4], ["heightTL", "Height (top left)", 4], ["heightBL", "Height (bottom left)", 4]]
}];

var currentViewState = {
  currGridIndex: 0,
  gridParameters: {},
  originX: 80,
  originY: 80,
  scale: 100,
  currElType: "f",
  drawLabels: true,
  drawOutside: true,
  nearbyHighlightType: null,
  mousedPoint: null
};

function cloneObj(x) {
  var clonedX = {};
  for (var k in x) {
    clonedX[k] = x[k];
  }
  return clonedX;
}

function getValues(x) {
  var values = [];
  for (var k in x) {
    values.push(x[k]);
  }
  return values;
}

function polygonIntersectsRect(polygon, rect) {
  var minX = Infinity;
  var minY = Infinity;
  var maxX = -Infinity;
  var maxY = -Infinity;
  polygon.forEach(function (p) {
    minX = Math.min(p[0], minX);
    minY = Math.min(p[1], minY);
    maxX = Math.max(p[0], maxX);
    maxY = Math.max(p[1], maxY);
  });
  return maxX >= rect[0] && minX <= rect[0] + rect[2] && maxY >= rect[1] && minY <= rect[1] + rect[3];
}

function findAllElsToDraw(grid) {
  var vertexSet = {};
  var edgeSet = {};
  var faceSet = {};
  function addFace(f) {
    if (faceSet[f]) {
      return;
    }
    if (!polygonIntersectsRect(grid.getFaceCoordinates(f), [0, 0, CANVAS_WIDTH, CANVAS_HEIGHT])) {
      return;
    }
    faceSet[f] = f;
    grid.getEdgesOnFace(f).forEach(function (e) {
      return edgeSet[e] = e;
    });
    grid.getVerticesOnFace(f).forEach(function (v) {
      return vertexSet[v] = v;
    });
    grid.getAdjacentFaces(f).forEach(addFace);
  }
  grid.getFaceList().forEach(addFace);
  return {
    faces: getValues(faceSet),
    edges: getValues(edgeSet),
    vertices: getValues(vertexSet)
  };
}

function drawLabel(ctx, text, x, y) {
  var options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
  var _options$align = options.align,
      align = _options$align === undefined ? "center" : _options$align;


  ctx.font = "9px sans-serif";
  ctx.textAlign = align;
  ctx.textBaseline = "alphabetic";

  var _ctx$measureText = ctx.measureText(text),
      width = _ctx$measureText.width;

  var rectX = x - 2;
  if (align === "center") {
    rectX -= width / 2;
  }
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
  if (!drawOutside && !grid.hasFace(face)) {
    return;
  }
  var ctx = ctxLayers.face;
  ctx.fillStyle = highlightType === "mouse" ? "#FF7" : "#CFF";
  ctx.beginPath();
  grid.getFaceCoordinates(face).forEach(function (p) {
    return ctx.lineTo(p[0], p[1]);
  });
  ctx.closePath();
  ctx.fill();
}

function highlightEdge(ctxLayers, grid, edge, drawOutside, highlightType) {
  if (!drawOutside && !grid.hasEdge(edge)) {
    return;
  }
  var ctx = ctxLayers.main;
  ctx.strokeStyle = highlightType === "mouse" ? "#F44" : "#88F";
  ctx.lineWidth = highlightType === "mouse" ? 5 : 4;
  ctx.beginPath();
  grid.getEdgeCoordinates(edge).forEach(function (p) {
    return ctx.lineTo(p[0], p[1]);
  });
  ctx.stroke();
}

function highlightVertex(ctxLayers, grid, vertex, drawOutside, highlightType) {
  if (!drawOutside && !grid.hasVertex(vertex)) {
    return;
  }
  var ctx = ctxLayers.main;
  ctx.fillStyle = highlightType === "mouse" ? "#F44" : "#88F";
  var center = grid.getVertexCoordinates(vertex);
  var radius = highlightType === "mouse" ? 9 : 7;
  ctx.beginPath();
  ctx.arc(center[0], center[1], radius, 0, 2 * Math.PI);
  ctx.fill();
}

function highlightNearby(ctxLayers, grid, el, highlightInfo, drawOutside) {
  if (highlightInfo) {
    var highlightFunc = {
      f: highlightFace,
      e: highlightEdge,
      v: highlightVertex
    }[highlightInfo[0]];
    var nearEls = grid[highlightInfo[1]](el);
    nearEls.forEach(function (nearEl) {
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
  var gridData = gridDataList[viewState.currGridIndex];
  var params = cloneObj(viewState.gridParameters);
  params.origin = [viewState.originX, viewState.originY];
  params.scale = viewState.scale;
  return GridgyPresets[gridData.exportName](params);
}

function getMousedEl(viewState) {
  var grid = getGrid(viewState);
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
  var mainCtx = document.getElementById("canvas").getContext("2d");
  var _mainCtx$canvas = mainCtx.canvas,
      width = _mainCtx$canvas.width,
      height = _mainCtx$canvas.height;


  var mainLayer = document.createElement("canvas");
  mainLayer.width = width;
  mainLayer.height = height;
  var faceLayer = document.createElement("canvas");
  faceLayer.width = width;
  faceLayer.height = height;
  var ctxLayers = {
    main: mainLayer.getContext("2d"),
    face: faceLayer.getContext("2d")
  };

  var grid = getGrid(viewState);
  var els = findAllElsToDraw(grid, width, height);

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
    els.edges.forEach(function (e) {
      var _ctxLayers$main, _ctxLayers$main2;

      var coords = grid.getEdgeCoordinates(e);
      (_ctxLayers$main = ctxLayers.main).moveTo.apply(_ctxLayers$main, toConsumableArray(coords[0]));
      (_ctxLayers$main2 = ctxLayers.main).lineTo.apply(_ctxLayers$main2, toConsumableArray(coords[1]));
    });
    ctxLayers.main.stroke();
  }

  ctxLayers.main.lineWidth = 2.2;
  ctxLayers.main.strokeStyle = "#000";
  ctxLayers.main.beginPath();
  grid.getEdgeList().forEach(function (e) {
    var _ctxLayers$main3, _ctxLayers$main4;

    var coords = grid.getEdgeCoordinates(e);
    (_ctxLayers$main3 = ctxLayers.main).moveTo.apply(_ctxLayers$main3, toConsumableArray(coords[0]));
    (_ctxLayers$main4 = ctxLayers.main).lineTo.apply(_ctxLayers$main4, toConsumableArray(coords[1]));
  });
  ctxLayers.main.stroke();

  ctxLayers.main.lineWidth = 3.6;
  ctxLayers.main.strokeStyle = "#000";
  ctxLayers.main.beginPath();
  grid.getEdgeList().forEach(function (e) {
    var _ctxLayers$main5, _ctxLayers$main6;

    if (!grid.isEdgeOnBorder(e)) {
      return;
    }
    var coords = grid.getEdgeCoordinates(e);
    (_ctxLayers$main5 = ctxLayers.main).moveTo.apply(_ctxLayers$main5, toConsumableArray(coords[0]));
    (_ctxLayers$main6 = ctxLayers.main).lineTo.apply(_ctxLayers$main6, toConsumableArray(coords[1]));
  });
  ctxLayers.main.stroke();

  if (viewState.currElType === "f") {
    if (viewState.mousedPoint) {
      var mousedFace = grid.findFaceAt(viewState.mousedPoint);
      if (mousedFace && (viewState.drawOutside || grid.hasFace(mousedFace))) {
        var highlightInfo = getHighlightInfo("f", viewState.nearbyHighlightType);
        highlightNearby(ctxLayers, grid, mousedFace, highlightInfo, viewState.drawOutside);
        highlightFace(ctxLayers, grid, mousedFace, viewState.drawOutside, "mouse");
      }
    }
    if (viewState.drawLabels) {
      els.faces.forEach(function (f) {
        if (!viewState.drawOutside && !grid.hasFace(f)) {
          return;
        }
        var coords = grid.getFaceCoordinates(f);
        var centerX = coords.reduce(function (s, p) {
          return s + p[0];
        }, 0) / coords.length;
        var centerY = coords.reduce(function (s, p) {
          return s + p[1];
        }, 0) / coords.length;
        ctxLayers.main.fillStyle = grid.hasFace(f) ? "#000" : "#888";
        var text = JSON.stringify(f);
        drawLabel(ctxLayers.main, text, centerX, centerY);
      });
    }
  } else if (viewState.currElType === "e") {
    if (viewState.mousedPoint) {
      var mousedEdge = grid.findEdgeAt(viewState.mousedPoint);
      if (mousedEdge && (viewState.drawOutside || grid.hasEdge(mousedEdge))) {
        var _highlightInfo = getHighlightInfo("e", viewState.nearbyHighlightType);
        highlightNearby(ctxLayers, grid, mousedEdge, _highlightInfo, viewState.drawOutside);
        highlightEdge(ctxLayers, grid, mousedEdge, viewState.drawOutside, "mouse");
      }
    }
    if (viewState.drawLabels) {
      els.edges.forEach(function (e) {
        if (!viewState.drawOutside && !grid.hasEdge(e)) {
          return;
        }
        var coords = grid.getEdgeCoordinates(e);
        ctxLayers.main.fillStyle = grid.hasEdge(e) ? "#000" : "#888";
        var text = JSON.stringify(e);
        drawLabel(ctxLayers.main, text, (coords[0][0] + coords[1][0]) / 2, (coords[0][1] + coords[1][1]) / 2);
      });
    }
  } else if (viewState.currElType === "v") {
    if (viewState.mousedPoint) {
      var mousedVertex = grid.findVertexAt(viewState.mousedPoint);
      if (mousedVertex && (viewState.drawOutside || grid.hasVertex(mousedVertex))) {
        var _highlightInfo2 = getHighlightInfo("v", viewState.nearbyHighlightType);
        highlightNearby(ctxLayers, grid, mousedVertex, _highlightInfo2, viewState.drawOutside);
        highlightVertex(ctxLayers, grid, mousedVertex, viewState.drawOutside, "mouse");
      }
    }
    if (viewState.drawLabels) {
      els.vertices.forEach(function (v) {
        if (!viewState.drawOutside && !grid.hasVertex(v)) {
          return;
        }
        var coords = grid.getVertexCoordinates(v);
        ctxLayers.main.fillStyle = grid.hasVertex(v) ? "#000" : "#888";
        var text = JSON.stringify(v);
        drawLabel(ctxLayers.main, text, coords[0] + 8, coords[1] + 13, {
          align: "left"
        });
      });
    }
  }

  mainCtx.fillStyle = "#FFF";
  mainCtx.fillRect(0, 0, width, height);
  mainCtx.drawImage(faceLayer, 0, 0);
  mainCtx.drawImage(mainLayer, 0, 0);
}

function update(viewState) {
  var gridData = gridDataList[viewState.currGridIndex];

  if (viewState.nearbyHighlightType) {
    var highlightInfo = getHighlightInfo(viewState.currElType, viewState.nearbyHighlightType);
    document.getElementById("highlight-method-name").innerHTML = highlightInfo ? "grid." + highlightInfo[1] : "(no grid method)";
  } else {
    document.getElementById("highlight-method-name").innerHTML = " ";
  }

  var propsLines = gridData.params.map(function (p) {
    return p[0] + ": " + viewState.gridParameters[p[0]] + ",";
  });
  propsLines.push("origin: [" + viewState.originX + ", " + viewState.originY + "],");
  propsLines.push("scale: " + viewState.scale + ",");
  var code = ("\nimport {" + gridData.exportName + "} from \"gridgy-presets\";\nconst grid = " + gridData.exportName + "({\n" + propsLines.map(function (s) {
    return "  " + s;
  }).join("\n") + "\n});\n  ").replace(/^\s*|\s*$/g, "");
  document.getElementById("code").innerHTML = code;

  draw(viewState);
}

function attachChangeWithPoll(inputEl, getValue, onChange) {
  var currValue = getValue(inputEl);
  inputEl.addEventListener("change", function (evt) {
    currValue = getValue(inputEl);
    onChange(currValue, inputEl);
  });
  setInterval(function () {
    var newValue = getValue(inputEl);
    if (currValue !== newValue) {
      currValue = newValue;
      onChange(newValue, inputEl);
    }
  }, 100);
}

function setupGridParamUI(gridData) {
  var paramsContainer = document.getElementById("grid-params");
  paramsContainer.innerHTML = "";

  function makeNumberInput(id, label, initialValue, min, max, onChange) {
    var div = document.createElement("div");
    var inputEl = document.createElement("input");
    var labelEl = document.createElement("label");
    inputEl.setAttribute("id", id);
    labelEl.setAttribute("for", id);
    inputEl.setAttribute("type", "number");
    inputEl.value = initialValue;
    inputEl.setAttribute("min", min);
    inputEl.setAttribute("max", max);
    labelEl.innerHTML = label + " ";
    attachChangeWithPoll(inputEl, function (el) {
      return parseFloat(el.value);
    }, onChange);
    div.appendChild(labelEl);
    div.appendChild(inputEl);
    return div;
  }

  gridData.params.forEach(function (p, i) {
    var id = "input-grid-param-" + i;
    var div = void 0;
    if (typeof p[2] === "number") {
      div = makeNumberInput(id, p[1], p[2], 1, 50, function (value) {
        currentViewState.gridParameters[p[0]] = value;
        update(currentViewState);
      });
    }
    div && paramsContainer.appendChild(div);
  });
  var originXDiv = makeNumberInput("input-origin-x", "Origin X", currentViewState.originX, -10000, 10000, function (value) {
    currentViewState.originX = value;
    update(currentViewState);
  });
  var originYDiv = makeNumberInput("input-origin-y", "Origin Y", currentViewState.originY, -10000, 10000, function (value) {
    currentViewState.originY = value;
    update(currentViewState);
  });
  var scaleDiv = makeNumberInput("input-scale", "Scale", currentViewState.scale, 1, 10000, function (value) {
    currentViewState.scale = value;
    update(currentViewState);
  });
  paramsContainer.appendChild(originXDiv);
  paramsContainer.appendChild(originYDiv);
  paramsContainer.appendChild(scaleDiv);
}

function setGridIndex(index) {
  var gridData = gridDataList[index];
  var params = {};
  gridData.params.forEach(function (p) {
    return params[p[0]] = p[2];
  });

  currentViewState.currGridIndex = index;
  currentViewState.gridParameters = params;
  currentViewState.originX = 0;
  currentViewState.originY = 0;
  currentViewState.scale = 1;
  var grid = getGrid(currentViewState);
  var bbox = grid.getBoundingBox();
  var canvasPadding = 50;
  var scale = Math.ceil(Math.min((CANVAS_WIDTH - 2 * canvasPadding) / bbox[2], (CANVAS_HEIGHT - 2 * canvasPadding) / bbox[3]));
  currentViewState.scale = scale;
  currentViewState.originX = Math.round(-bbox[0] * scale + canvasPadding);
  currentViewState.originY = Math.round(-bbox[1] * scale + canvasPadding);
  setupGridParamUI(gridData);
}

function initUI() {
  // Grid select
  var gridSelectEl = document.getElementById("input-grid-select");
  gridDataList.forEach(function (d, i) {
    var optionEl = document.createElement("option");
    optionEl.setAttribute("value", String(i));
    optionEl.innerHTML = d.label;
    gridSelectEl.appendChild(optionEl);
  });
  gridSelectEl.value = currentViewState.currGridIndex;
  gridSelectEl.addEventListener("change", function (evt) {
    setGridIndex(parseInt(evt.currentTarget.value));
    update(currentViewState);
  });
  // Initialize grid parameters
  setGridIndex(currentViewState.currGridIndex);

  // Canvas mouse
  var canvasEl = document.getElementById("canvas");
  canvasEl.width = CANVAS_WIDTH;
  canvasEl.height = CANVAS_HEIGHT;
  canvasEl.addEventListener("mousemove", function (evt) {
    var clientRect = canvasEl.getBoundingClientRect();
    var newMousedPoint = [event.clientX - clientRect.left, event.clientY - clientRect.top];
    var prevMousedEl = getMousedEl(currentViewState);
    currentViewState.mousedPoint = newMousedPoint;
    var nextMousedEl = getMousedEl(currentViewState);
    if (prevMousedEl !== nextMousedEl) {
      update(currentViewState);
    }
  });
  canvasEl.addEventListener("mouseleave", function (evt) {
    currentViewState.mousedPoint = null;
    update(currentViewState);
  });

  // Element type
  var elTypeEls = document.querySelectorAll("input[type=radio][name=eltype]");
  for (var i = 0; i < elTypeEls.length; i += 1) {
    elTypeEls.item(i).addEventListener("change", function (evt) {
      currentViewState.currElType = evt.currentTarget.value;
      update(currentViewState);
    });
    if (currentViewState.currElType === elTypeEls.item(i).value) {
      elTypeEls.item(i).checked = true;
    }
  }

  // Other misc things

  var drawLabelsEl = document.getElementById("input-draw-labels");
  drawLabelsEl.addEventListener("change", function (evt) {
    currentViewState.drawLabels = evt.currentTarget.checked;
    update(currentViewState);
  });
  currentViewState.drawLabels = drawLabelsEl.checked;

  var drawOutsideEl = document.getElementById("input-draw-outside");
  drawOutsideEl.addEventListener("change", function (evt) {
    currentViewState.drawOutside = evt.currentTarget.checked;
    update(currentViewState);
  });
  currentViewState.drawOutside = drawOutsideEl.checked;

  var highlightEl = document.getElementById("input-highlight");
  highlightEl.value = currentViewState.nearbyHighlightType || "";
  highlightEl.addEventListener("change", function (evt) {
    currentViewState.nearbyHighlightType = evt.currentTarget.value || null;
    update(currentViewState);
  });
}

function processHashURL(hash) {
  if (hash.slice(0, 3) === "#g:") {
    var gridName = hash.slice(3).toLowerCase();
    for (var i = 0; i < gridDataList.length; i += 1) {
      if (gridName === gridDataList[i].exportName.toLowerCase()) {
        currentViewState.currGridIndex = i;
        return;
      }
    }
  } else if (hash.slice(0, 3) === "#h:") {
    var elType = hash.slice(3, 4).toLowerCase();
    var nearbyHighlightType = hash.slice(4).toLowerCase();
    var highlightInfo = getHighlightInfo(elType, nearbyHighlightType);
    if (highlightInfo) {
      currentViewState.currElType = elType;
      currentViewState.nearbyHighlightType = nearbyHighlightType;
    }
  }
}

document.addEventListener("DOMContentLoaded", function () {
  processHashURL(window.location.hash);
  initUI();
  update(currentViewState);
});

}());
