'use client';

interface Props {
  src: string;
  alt: string;
}

export default function GameImage({ src, alt }: Props) {
  return (
    <img
      src={src}
      alt={alt}
      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      onError={e => {
        (e.target as HTMLImageElement).src =
          `https://placehold.co/200x140/1a1a2e/7c3aed?text=${encodeURIComponent(alt)}`;
      }}
    />
  );
}
