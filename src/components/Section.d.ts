import * as React from 'react';

export type SectionVariant = 'hero' | 'full' | 'large' | 'medium' | 'default' | 'compact';

export interface SectionProps {
  variant?: SectionVariant;
  className?: string;
  containerized?: boolean;
  children?: React.ReactNode;
}

declare const Section: React.FC<SectionProps>;

export default Section;

