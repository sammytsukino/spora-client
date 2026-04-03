import type { MeshGradientProps } from '@paper-design/shaders-react';

const HERO_MESH_GRADIENT_COLORS = [
  '#CAFF50',
  '#FF64FF',
  '#F4EF40',
  '#52FF5A',
  '#00DCFF',
  '#DD4AFF',
  '#EDEDED',
] as const;

/** Same shader params as the home hero — shared by {@link Gradient.tsx} wrappers. */
export const heroMeshGradientDefaults = {
  speed: 1,
  scale: 1,
  distortion: 0.8,
  swirl: 0.1,
  colors: [...HERO_MESH_GRADIENT_COLORS],
} satisfies Pick<MeshGradientProps, 'speed' | 'scale' | 'distortion' | 'swirl' | 'colors'>;
