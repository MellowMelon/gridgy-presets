import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import babel from "rollup-plugin-babel";
import uglify from "rollup-plugin-uglify";

function makeBabelPlugin() {
  return babel({
    babelrc: false,
    presets: [
      ["env", {modules: false}],
      "flow",
    ],
    plugins: [
      "external-helpers",
    ],
  });
}

function getDemoConfig() {
  return {
    input: "demo/demo.js",
    plugins: [
      makeBabelPlugin(),
      resolve(),
      commonjs(),
    ],
    output: {
      file: "demo/compiled.js",
      format: "iife",
      name: "GridgyDemo",
    },
  };
}

function getConfig(options = {}) {
  const {keepModules = false, minify = false} = options;
  let outPath = "dist/main";
  outPath += keepModules ? ".esm" : ".umd";
  outPath += minify ? ".min" : "";
  outPath += ".js";
  return {
    input: "src/main.js",
    plugins: [
      makeBabelPlugin(),
      resolve(),
      commonjs(),
      minify && uglify(),
    ].filter(Boolean),
    output: {
      file: outPath,
      format: keepModules ? "es" : "umd",
      name: "GridgyPresets",
    },
  };
}

let config = [
  getConfig(),
  getConfig({keepModules: true}),
  getConfig({minify: true}),
];
if (process.env.DEMO) {
  config = [getDemoConfig()];
}

export default config;
