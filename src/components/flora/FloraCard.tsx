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
      onClick={onClick}
      variant="garden"
    />
  );
}
