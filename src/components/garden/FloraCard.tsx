import FloraCardBase from '@/components/common/FloraCardBase';

interface FloraCardProps {
  id: string;
  generation: string;
  image: string;
  title: string;
  excerpt: string;
  author: string;
  seed: string;
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
      onClick={onClick}
      variant="garden"
    />
  );
}
