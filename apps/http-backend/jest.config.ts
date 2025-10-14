import type { Config } from "jest";

const config: Config =  {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  testMatch: ["**/__tests__/**/*.ts", "**/?(*.)+(spec|test).ts"],
 
  globals:{
    'ts-jest':{
      useESM:true,
      tsconfig:'tsconfig.json'
    }
  },

  extensionsToTreatAsEsm:[
    ".ts",
    ".tsx"
  ],

  moduleNameMapper: {
        // Alias for internal src imports:
        '^@/(.*)$': '<rootDir>/src/$1', 
        
        // Essential for ESM relative imports (e.g., './file.js' -> './file.ts')
        '^(\\.{1,2}/.*)\\.js$': '$1', 
    },
    
    // Keep these settings
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
    transformIgnorePatterns: ['node_modules/(?!(@excalidraw|@prisma)/)'],
};


export default config;