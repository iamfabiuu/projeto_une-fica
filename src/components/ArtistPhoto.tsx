import { useEffect, useState } from "react";
import { avatarFallback } from "../lib/avatar";

type Props = { src?: string; name: string; className?: string };

export function ArtistPhoto({ src, name, className = "" }: Props) {
  const fallback = avatarFallback(name);
  const [current, setCurrent] = useState(src?.trim() || fallback);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setCurrent(src?.trim() || fallback);
    setLoaded(false);
  }, [src, fallback]);

  return (
    <img
      src={current}
      alt={`Foto de ${name}`}
      loading="lazy"
      decoding="async"
      onLoad={() => setLoaded(true)}
      onError={() => {
        if (current !== fallback) setCurrent(fallback);
        setLoaded(true);
      }}
      className={`h-full w-full object-cover transition-opacity duration-300 ${
        loaded ? "opacity-100" : "opacity-0"
      } ${className}`}
    />
  );
}
