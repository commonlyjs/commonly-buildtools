const { spawnSync } = require("child_process")
const npmrunpath = require("npm-run-path")



spawnSync(
    "tsc",
    [
        "--build",
        ...process.argv.slice(2)
    ],
    {
        cwd: process.cwd(),
        shell: true,
        stdio: "inherit",
        env: npmrunpath.env()
    }
)
