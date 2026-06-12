module.exports = [
"[turbopack-node]/transforms/postcss.ts { CONFIG => \"[project]/railsy/railsy-backend/railsy/postcss.config.js_.loader.mjs [postcss] (ecmascript)\" } [postcss] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "build/chunks/d591c_b65a6fab._.js",
  "build/chunks/[root-of-the-server]__486419be._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[turbopack-node]/transforms/postcss.ts { CONFIG => \"[project]/railsy/railsy-backend/railsy/postcss.config.js_.loader.mjs [postcss] (ecmascript)\" } [postcss] (ecmascript)");
    });
});
}),
];