/// <reference types="vite/client" />

// Google Maps types
declare global {
  interface Window {
    google: typeof google;
  }
}

declare module '@googlemaps/js-api-loader' {
  export class Loader {
    constructor(options: {
      apiKey: string;
      version: string;
      libraries?: string[];
    });
    load(): Promise<typeof google>;
  }
}
