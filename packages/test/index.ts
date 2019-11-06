const { spawnSync } = require("child_process")
const npmrunpath = require("npm-run-path")



spawnSync(
    "jest",
    [
        "--config", require.resolve("@commonly-buildtools/configuration/jest/jest.config.js"),
        ...process.argv.slice(2)
    ],
    {
        cwd: process.cwd(),
        shell: true,
        stdio: "inherit",
        env: npmrunpath.env()
    }
)
