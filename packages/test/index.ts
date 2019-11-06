import { spawnSync } from "child_process"
import npmrunpath from "npm-run-path"



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
