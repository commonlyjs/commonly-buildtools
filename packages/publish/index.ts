const { spawnSync } = require("child_process")
const npmrunpath = require("npm-run-path")



const { CI = "", TRAVIS_BRANCH = "" } = process.env

spawnSync(
    "lerna",
    [
        "publish", "from-git",

        ...
            CI
                ? [ "--yes" ]
                :
            [],

        ...
            /^master$/.test(TRAVIS_BRANCH)
                ? [ "--dist-tag", "next" ]
                :
            /^stable$/.test(TRAVIS_BRANCH)
                ? [ "--dist-tag", "latest" ]
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
