const typescript = require("typescript"),
    config = require("./../typescript/tsconfig.json")


const process = (source, path) =>
    typescript.transpile(source, config.compilerOptions, path, [])


module.exports = {
    process
}
