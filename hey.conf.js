module.exports = {
  root: "build",
  webpack: {
    umd: {
      entry: "./src/index.js",
      library: "Utils",
      filename: 'utils.js'
    }
  }
};
