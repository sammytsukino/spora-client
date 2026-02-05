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
    setPoints(points: any[]): void;
  }
  export class MeshLineMaterial {
    constructor(options?: any);
  }
}

declare namespace JSX {
  interface IntrinsicElements {
    meshLineGeometry: any;
    meshLineMaterial: any;
  }
}

export {};

