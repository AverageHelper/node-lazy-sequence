// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  projects: [
    {
      displayName: "src:node",
      clearMocks: true,
      preset: "ts-jest",
      setupFilesAfterEnv: ["jest-extended"],
      testEnvironment: "node",
      testMatch: undefined,
      testPathIgnorePatterns: ["/node_modules/"],
      testRegex: ["src/.*\\.test\\.(t|j)sx?$"]
    }
  ],
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*[!.d][!.test].{js,ts}"],
  coverageDirectory: "coverage",
  coveragePathIgnorePatterns: ["/node_modules/"],
  verbose: true
};
