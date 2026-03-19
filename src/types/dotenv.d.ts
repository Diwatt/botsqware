declare module 'dotenv' {
  export function config(opts?: { path?: string; debug?: boolean }): void;
  const _default: { config: typeof config };
  export default _default;
}
