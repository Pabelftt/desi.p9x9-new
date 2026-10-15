'use client';

import Link from 'next/link';
import Image from 'next/image';

interface MovieCardProps {
  movie: {
    id: string;
    hadding: string;
    img: string;
  };
  priority?: boolean;
}

export default function MovieCard({ movie, priority = false }: MovieCardProps) {
  const rating = (Math.random() * 2 + 8).toFixed(1);

  return (
    <Link
      href={`/movie/${movie.id}`}
      className="card"
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 18,
        background: 'var(--card-grad)',
        textDecoration: 'none',
        color: 'var(--text)',
        transition: 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.5s',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
      onMouseEnter={(e) => {
        const target = e.currentTarget as HTMLElement;
        target.style.transform = 'translateY(-12px) scale(1.03)';
        target.style.boxShadow = '0 24px 45px var(--shadow), 0 0 30px rgba(77, 163, 255, 0.25)';
        target.style.borderColor = 'rgba(77, 163, 255, 0.5)';
        const before = target.querySelector('.card-before') as HTMLElement;
        if (before) before.style.opacity = '1';
        const h3 = target.querySelector('h3') as HTMLElement;
        if (h3) {
          h3.style.color = 'var(--accent)';
          h3.style.transform = 'translateY(-5px)';
        }
        const after = target.querySelector('.card-after') as HTMLElement;
        if (after) after.style.transform = 'scaleX(1)';
      }}
      onMouseLeave={(e) => {
        const target = e.currentTarget as HTMLElement;
        target.style.transform = '';
        target.style.boxShadow = 'var(--shadow)';
        target.style.borderColor = 'var(--border)';
        const before = target.querySelector('.card-before') as HTMLElement;
        if (before) before.style.opacity = '0';
        const h3 = target.querySelector('h3') as HTMLElement;
        if (h3) {
          h3.style.color = 'var(--text)';
          h3.style.transform = '';
        }
        const after = target.querySelector('.card-after') as HTMLElement;
        if (after) after.style.transform = 'scaleX(0)';
      }}
    >
      <div className="card-before" style={{
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, rgba(77, 163, 255, 0.12) 0%, rgba(255, 77, 164, 0.12) 100%)',
        opacity: 0,
        transition: 'opacity 0.4s',
        zIndex: 1,
        pointerEvents: 'none',
      }} />
      <div className="rating" style={{
        position: 'absolute',
        top: 13,
        right: 13,
        background: 'linear-gradient(135deg, #c2185b, #8e1045)',
        color: '#fff',
        fontWeight: 800,
        fontSize: 13,
        padding: '6px 11px',
        borderRadius: 10,
        zIndex: 3,
        boxShadow: '0 5px 14px rgba(0, 0, 0, 0.45)',
        display: 'flex',
        alignItems: 'center',
        gap: 5,
      }}>
        <i className="fa-solid fa-star" aria-hidden="true" style={{ color: 'gold', fontSize: 11 }} />
        {rating}
      </div>
      <div className="card-thumb">
        <Image
          src={movie.img}
          alt={movie.hadding}
          width={300}
          height={169}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : undefined}
          decoding="async"
          style={{
            width: '100%',
            height: '100%',
            display: 'block',
            objectFit: 'contain',
            objectPosition: 'center',
          }}
        />
      </div>
      <h3 style={{
        position: 'relative',
        zIndex: 2,
        padding: '18px 15px',
        fontSize: 17,
        fontWeight: 700,
        color: 'var(--text)',
        flexGrow: 1,
        display: 'flex',
        alignItems: 'center',
        lineHeight: 1.4,
        transition: 'color 0.3s, transform 0.3s',
      }}>
        <i className="fa-solid fa-film" aria-hidden="true" style={{ marginRight: 8, color: 'var(--accent)', fontSize: 14 }} />
        {movie.hadding}
      </h3>
      <div className="card-after" style={{
        content: '""',
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: 5,
        background: 'var(--gradient)',
        transform: 'scaleX(0)',
        transition: 'transform 0.5s',
        zIndex: 3,
      }} />
    </Link>
  );
}