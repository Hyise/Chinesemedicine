export {};

declare global {
  interface Window {
    __POWERED_BY_QIANKUN__?: boolean;
  }
}

declare module '*.svg' {
  const content: string;
  export default content;
}
