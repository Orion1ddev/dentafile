// Type declarations for modules without type definitions
declare module 'lovable-tagger' {
  import type { Plugin } from 'vite';
  export function componentTagger(): Plugin;
}

// Add Vite module declarations
declare module 'vite' {
  export interface ConfigEnv {
    mode: string;
    command: string;
  }
  
  export interface UserConfig {
    // Add any missing configuration options here
    plugins?: any[];
    resolve?: {
      alias?: Record<string, string>;
    };
    base?: string;
    build?: {
      outDir?: string;
      sourcemap?: boolean;
      chunkSizeWarningLimit?: number;
      rollupOptions?: any;
    };
    server?: {
      host?: string;
      port?: number;
    };
    optimizeDeps?: {
      include?: string[];
    };
  }
  
  export interface Plugin {
    name: string;
    [key: string]: any;
  }

  export function defineConfig(config: UserConfig | ((env: ConfigEnv) => UserConfig)): UserConfig;
} 