module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  testMatch: ["**/__tests__/**/*.ts", "**/?(*.)+(spec|test).ts"],
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        usESM: true,
      },
    ],
  },

  transformIgnorePatterns: ["node_modules/(?!(@excalidraw|@prisma)/)"],

  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],

  // Module name mapper
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^(\\.{1,2}/.*)\\.js$": "$1", // Handle .js imports from .ts files
  },

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};
