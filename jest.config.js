module.exports = {
  "moduleFileExtensions": ["ts", "js"],
  "transform": {
      "\\.(ts)$": "ts-jest"
    },
  "testRegex": "/*.(test).(ts)$",
  "collectCoverageFrom": [
      "src/**/*.{ts}",
      "!**/*.d.ts"
  ],
  "coverageThreshold": {
    "global": {
      "branches": 60,
      "functions": 60,
      "lines": 60,
      "statements": 60
    }
  }
}