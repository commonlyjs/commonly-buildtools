const { spawnSync } = require("child_process")
const npmrunpath = require("npm-run-path")



const { CI = "", GITHUB_REF = "" } = process.env

spawnSync(
    "lerna",
    [
        "version",
        "--no-push",
        "--conventional-commits",

        ...
            CI
                ? [ "--yes" ]
                :
                [],

        ...
            /^master$/.test(GITHUB_REF)
                ? [
                    "--conventional-prerelease",
                    "--preid", "next",
                    "--no-changelog"
                ]
                :
            /^stable$/.test(GITHUB_REF)
                ? [ "--conventional-graduate" ]
                :
            [],


        ...process.argv.slice(2)
    ],
    {
        cwd: process.cwd(),
        shell: true,
        stdio: "inherit",
        env: npmrunpath.env()
    }
)
