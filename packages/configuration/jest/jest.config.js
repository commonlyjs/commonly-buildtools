module.exports = {
    rootDir: process.cwd(),

    transform: {
        "^.+\\.(ts|tsx)$": "@commonly-buildtools/configuration/jest/jest-transformer"
    },

    moduleFileExtensions: [
        "ts",
        "tsx",
        "js"
    ],
    testMatch: [
        "**/?(*.)spec.ts"
    ],

    moduleDirectories: [
        "packages", "node_modules"
    ],

    collectCoverageFrom: [
        "packages/**/*.ts", "!packages/type/**/*.ts", "!packages/**/index.ts"
    ],

    setupFiles: [
        "jest-plugin-context/setup"
    ]
}
