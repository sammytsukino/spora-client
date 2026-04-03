/** @paper-design/shaders-react@0.0.71 */
import {
  MeshGradient as MeshGradientComponent,
  type MeshGradientProps,
} from '@paper-design/shaders-react';

import { cn } from '@/lib/utils';
import { heroMeshGradientDefaults } from '@/components/backgrounds/heroMeshGradient';

/**
 * from Paper
 * https://app.paper.design/file/01KGPT4ZY9MCZ73NJPPTJHRRW7?node=01KGPT661B4X650ST1N5YCWEFW
 * on Feb 5, 2026
 */

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
