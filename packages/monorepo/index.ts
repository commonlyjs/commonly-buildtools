const { spawnSync } = require("child_process")
const npmrunpath = require("npm-run-path")



spawnSync(
    "lerna",
    [
        "bootstrap",
        ...process.argv.slice(2)
    ],
    {
        cwd: process.cwd(),
        shell: true,
        stdio: "inherit",
        env: npmrunpath.env()
    }
)


spawnSync(
    "link-parent-bin",
    [
        ...process.argv.slice(2)
    ],
    {
        cwd: process.cwd(),
        shell: true,
        stdio: "inherit",
        env: npmrunpath.env()
    }
)
