import {
  MeshGradient as MeshGradientComponent,
  type MeshGradientProps,
} from '@paper-design/shaders-react';

import { cn } from '@/lib/utils';
import { heroMeshGradientDefaults } from '@/components/backgrounds/heroMeshGradient';

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
