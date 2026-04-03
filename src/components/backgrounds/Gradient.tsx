/** @paper-design/shaders-react@0.0.71 */
import {
  MeshGradient as MeshGradientComponent,
  type MeshGradientProps,
} from '@paper-design/shaders-react';

import { cn } from '@/lib/utils';

/**
 * from Paper
 * https://app.paper.design/file/01KGPT4ZY9MCZ73NJPPTJHRRW7?node=01KGPT661B4X650ST1N5YCWEFW
 * on Feb 5, 2026
 */
export const HERO_MESH_GRADIENT_COLORS = [
  '#CAFF50',
  '#FF64FF',
  '#F4EF40',
  '#52FF5A',
  '#00DCFF',
  '#DD4AFF',
  '#EDEDED',
] as const;

/** Same shader params as the home hero — use for section backgrounds site-wide. */
export const heroMeshGradientDefaults = {
  speed: 1,
  scale: 1,
  distortion: 0.8,
  swirl: 0.1,
  colors: [...HERO_MESH_GRADIENT_COLORS],
} satisfies Pick<MeshGradientProps, 'speed' | 'scale' | 'distortion' | 'swirl' | 'colors'>;

/**
 * Full-bleed hero-style mesh (same look as {@link MeshGradient} in HeroSection).
 * Overrides: pass any {@link MeshGradientProps} to tweak one-off.
 */
export function HeroMeshGradientBackground({
  className,
  style,
  ...rest
}: MeshGradientProps) {
  return (
    <MeshGradientComponent
      {...heroMeshGradientDefaults}
      {...rest}
      className={cn('size-full min-h-full', className)}
      style={{ width: '100%', height: '100%', ...style }}
    />
  );
}

export default function MeshGradient(props: MeshGradientProps) {
  return <MeshGradientComponent {...props} />;
}
