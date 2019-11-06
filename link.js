const fs = require("fs")
const path = require("path")
const child_process = require("child_process")



child_process.spawnSync(
    "npm",
    [
        "run", "build"
    ],
    {
        cwd: process.cwd(),
        shell: true,
        stdio: "inherit"
    }
)


const packages = fs.readdirSync("./packages")
for (const pkg of packages) {
    child_process.spawnSync(
        "npm",
        [
            "link", path.join("./packages", pkg),
            ...process.argv.slice(2)
        ],
        {
            cwd: process.cwd(),
            shell: true,
            stdio: "inherit"
        }
    )
}
