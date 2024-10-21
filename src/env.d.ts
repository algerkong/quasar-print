/* eslint-disable */

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
    VUE_ROUTER_MODE: 'hash' | 'history' | 'abstract' | undefined;
    VUE_ROUTER_BASE: string | undefined;
  }
}

export {};

declare global {
  interface Window {
    electronAPI: {
      sendMessage: (channel: string, data?: any) => void;
      receiveMessage: (channel: string, func: (...args: any[]) => void) => void;
      invokeMessage: (channel: string, ...args: any[]) => Promise<any>;
    };
  }
}
