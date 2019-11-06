import { spawnSync } from "child_process"
import npmrunpath from "npm-run-path"



const { CI = "", TRAVIS_BRANCH = "" } = process.env

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
            /^master$/.test(TRAVIS_BRANCH)
                ? [
                    "--conventional-prerelease",
                    "--preid", "next",
                    "--no-changelog"
                ]
                :
            /^stable$/.test(TRAVIS_BRANCH)
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
