declare module '*.svg' {
  const url: string
  export default url;
  export const ReactComponent: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
}
