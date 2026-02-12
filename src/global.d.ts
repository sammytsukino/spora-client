declare module "*.glb" {
  const src: string;
  export default src;
}

declare module "*.png" {
  const src: string;
  export default src;
}

declare module "*.jpg" {
  const src: string;
  export default src;
}

declare module "meshline" {
  export class MeshLineGeometry {
    constructor();
    setPoints(points: unknown[]): void;
  }
  export class MeshLineMaterial {
    constructor(options?: Record<string, unknown>);
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare namespace JSX {
  interface IntrinsicElements {
    meshLineGeometry: Record<string, unknown>;
    meshLineMaterial: Record<string, unknown>;
  }
}

export {};

