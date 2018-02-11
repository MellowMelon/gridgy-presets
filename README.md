# gridgy-presets

This contains some premade instances and creators for the Tesselation and Grid
classes from [gridgy](https://github.com/MellowMelon/gridgy).

[Demo](https://mellowmelon.github.io/gridgy-presets/index.html)

# Install

With [npm](http://npmjs.org) installed, run

```
npm install gridgy-presets
```

UMD builds made with rollup are available in the dist directory.

# Example

The example on the [gridgy](https://github.com/MellowMelon/gridgy) readme
shows a simple case of using gridgy-presets. A more complete example is the
[demo](https://mellowmelon.github.io/gridgy-presets/index.html) and its
[JS source](https://github.com/MellowMelon/gridgy-presets/blob/master/demo/demo.js).

Here is another example that covers the tesselation override feature:
``` js
import {Tesselation} from "gridgy";
import {tessHexagonV, hexagonVCubic} from "gridgy-presets";

// A grid of square cells where every other row is offset by the width of half
// a cell. Topologically equivalent to tessHexagonV.
const tessHexagonVSquareCells = new Tesselation({
  periodMatrix: [1, 0, 0.5, 1],
  faceVerticesTable: tessHexagonV.getProps().faceVerticesTable,
  vertexCoordinatesTable: {
    "0": [0, 0],
    "1": [0, 1],
  },
});

const grid = hexagonVCubic({
  width: 3,
  heightTL: 3,
  heightBL: 3,
  tesselation: tessHexagonVSquareCells,
  origin: [50, 10],
  scale: 20,
});

// followed by use of the grid instance
```

# API

gridgy-presets exports two categories of things: premade Tesselation instances,
and functions creating Grid instances of a certain shape given a few
dimensions. All of these exports are viewable in the
[demo](https://mellowmelon.github.io/gridgy-presets/index.html). This API
documentation mostly concerns itself with the features the demo does not cover.

The exported tesselations are
- tessSquare
- tessOctagon
- tessSnubSquare
- tessCairo
- tessTriangleH
- tessTriangleV
- tessHexagonH
- tessHexagonV

These are premade instances, not functions. As the example above demonstrates,
gridgy makes it easy to create altered tesselation instances based on these in
case that is what you need.

The exported Grid-creating functions, which map one-to-one with the items in
the main dropdown on the demo page, are
- [square](https://mellowmelon.github.io/gridgy-presets/index.html#g:square) (uses tessSquare)
- [octagon](https://mellowmelon.github.io/gridgy-presets/index.html#g:octagon) (uses tessOctagon)
- [snubSquare](https://mellowmelon.github.io/gridgy-presets/index.html#g:snubsquare) (uses tessSnubSquare)
- [cairo](https://mellowmelon.github.io/gridgy-presets/index.html#g:cairo) (uses tessCairo)
- [triangleH](https://mellowmelon.github.io/gridgy-presets/index.html#g:triangleh) (uses tessTriangleH)
- [triangleHDown](https://mellowmelon.github.io/gridgy-presets/index.html#g:trianglehdown) (uses tessTriangleH)
- [triangleHUp](https://mellowmelon.github.io/gridgy-presets/index.html#g:trianglehup) (uses tessTriangleH)
- [triangleV](https://mellowmelon.github.io/gridgy-presets/index.html#g:trianglev) (uses tessTriangleV)
- [triangleVLeft](https://mellowmelon.github.io/gridgy-presets/index.html#g:trianglevleft) (uses tessTriangleV)
- [triangleVRight](https://mellowmelon.github.io/gridgy-presets/index.html#g:trianglevright) (uses tessTriangleV)
- [hexagonH](https://mellowmelon.github.io/gridgy-presets/index.html#g:hexagonh) (uses tessHexagonH)
- [hexagonHCubic](https://mellowmelon.github.io/gridgy-presets/index.html#g:hexagonhcubic) (uses tessHexagonH)
- [hexagonV](https://mellowmelon.github.io/gridgy-presets/index.html#g:hexagonv) (uses tessHexagonV)
- [hexagonVCubic](https://mellowmelon.github.io/gridgy-presets/index.html#g:hexagonvcubic) (uses tessHexagonV)

You can see the code used to construct the appropriate Grid instance at the
bottom left of the demo page. The demo page shows the keys used to specify the
dimensions of the grid (which depends on what grid shape is being used), the
origin key, and the scale key.

In addition to the dimensions, origin, and scale, there are many other keys
supported on all of these functions, many of which come directly from the Grid
constructor provided by gridgy. The full list of keys is:
- \<dimension\>: The only required key(s). A required integer giving a size for
  one of the grid's dimensions. For example, `width` and `height` are required
  for square, and only `length` is required for triangleHDown. Please refer to
  the [demo](https://mellowmelon.github.io/gridgy-presets/index.html) to see
  what dimensions are required for each grid.
- tesselation: Used to override the default tesselation that this
  function uses. You need to make sure the Tesselation you provide mimics the
  structure of the default one, or things will go haywire.
- exclude: An array of faces not to include in the grid, even if they would be
  included by default. Specify these in your custom key format, if any.
- include: An array of extra faces to add to the grid. This takes precedence
  over `exclude`. Specify these in your custom key format, if any.
- origin: Same as the origin property on the Grid constructor.
- scale: Same as the scale property on the Grid constructor.
- fromFaceTessKey: Same as the fromFaceTessKey property on the Grid
  constructor.
- fromEdgeTessKey: Same as the fromEdgeTessKey property on the Grid
  constructor.
- fromVertexTessKey: Same as the fromVertexTessKey property on the Grid
  constructor.
- toFaceTessKey: Same as the toFaceTessKey property on the Grid constructor.
- toEdgeTessKey: Same as the toEdgeTessKey property on the Grid constructor.
- toVertexTessKey: Same as the toVertexTessKey property on the Grid constructor.
- elToString: Same as the elToString property on the Grid constructor.

# License

MIT
