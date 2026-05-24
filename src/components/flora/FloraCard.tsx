import FloraCardBase from '@/components/shared/FloraCardBase';

interface FloraCardProps {
  id: string;
  generation: string;
  image: string;
  title: string;
  excerpt: string;
  author: string;
  seed: string;
  authorUsername?: string;
  to?: string;
  linkState?: unknown;
  onClick?: () => void;
}

export default function FloraCard({
  id,
  generation,
  image,
  title,
  excerpt,
  author,
  seed,
  authorUsername,
  to,
  linkState,
  onClick,
}: FloraCardProps) {
  return (
    <FloraCardBase
      id={id}
      generation={generation}
      image={image}
      title={title}
      excerpt={excerpt}
      author={author}
      seed={seed}
      authorUsername={authorUsername}
      to={to}
      linkState={linkState}
      onClick={onClick}
      variant="garden"
    />
  );
}
