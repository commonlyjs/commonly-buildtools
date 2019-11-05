import { spawnSync } from "child_process"
import npmrunpath from "npm-run-path"



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
