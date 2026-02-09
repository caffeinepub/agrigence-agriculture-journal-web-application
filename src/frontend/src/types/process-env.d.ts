// Global TypeScript declaration for process.env used in browser context
// This prevents TypeScript build errors when code references process.env

declare namespace NodeJS {
  interface ProcessEnv {
    II_URL?: string;
    NODE_ENV?: string;
  }
}

// Ensure process exists in browser global scope
declare const process: {
  env: NodeJS.ProcessEnv;
};
