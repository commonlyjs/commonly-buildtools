import { spawnSync } from "child_process"
import npmrunpath from "npm-run-path"



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
