import type { Config } from "@jest/types"
import path from "path"

const config: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  testMatch: ["<rootDir>/src/tests/**/*.test.ts"],
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.json",
    },
  },
  moduleNameMapper: {
    "^@src/(.*)$": path.join(__dirname, "src", "$1").replace(/\\/g, "/"),
  },
  moduleDirectories: ["node_modules", "src"],
}

export default config
