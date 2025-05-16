/// <reference types="vite/client" />

declare module 'lovable-tagger' {
  import type { Plugin } from 'vite';
  export function componentTagger(): Plugin;
}
