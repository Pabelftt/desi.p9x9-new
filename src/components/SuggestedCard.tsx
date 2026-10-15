'use client';

import Link from 'next/link';
import Image from 'next/image';

interface SuggestedCardProps {
  item: {
    id: string;
    hadding: string;
    img: string;
  };
}

export default function SuggestedCard({ item }: SuggestedCardProps) {
  const rating = (Math.random() * 2 + 8).toFixed(1);

  return (
    <Link
      href={`/movie/${item.id}`}
      className="s-card"
      style={{
        textDecoration: 'none',
        color: 'var(--text)',
        background: 'var(--card-grad)',
        borderRadius: 14,
        overflow: 'hidden',
        transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseEnter={(e) => {
        const target = e.currentTarget as HTMLElement;
        target.style.transform = 'translateY(-10px) scale(1.03)';
        target.style.boxShadow = '0 22px 42px var(--shadow), 0 0 30px rgba(77, 163, 255, 0.25)';
        target.style.borderColor = 'var(--accent)';
        const before = target.querySelector('.s-card-before') as HTMLElement;
        if (before) before.style.opacity = '1';
        const after = target.querySelector('.s-card-after') as HTMLElement;
        if (after) after.style.transform = 'scaleX(1)';
        const p = target.querySelector('p') as HTMLElement;
        if (p) p.style.color = 'var(--accent)';
      }}
      onMouseLeave={(e) => {
        const target = e.currentTarget as HTMLElement;
        target.style.transform = '';
        target.style.boxShadow = 'var(--shadow)';
        target.style.borderColor = 'var(--border)';
        const before = target.querySelector('.s-card-before') as HTMLElement;
        if (before) before.style.opacity = '0';
        const after = target.querySelector('.s-card-after') as HTMLElement;
        if (after) after.style.transform = 'scaleX(0)';
        const p = target.querySelector('p') as HTMLElement;
        if (p) p.style.color = 'var(--text)';
      }}
    >
      <div className="s-card-before" style={{
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
        padding: '5px 10px',
        borderRadius: 9,
        zIndex: 3,
        boxShadow: '0 5px 12px rgba(0, 0, 0, 0.45)',
        display: 'flex',
        alignItems: 'center',
        gap: 4,
      }}>
        <i className="fa-solid fa-star" aria-hidden="true" style={{ color: 'gold', fontSize: 11 }} />
        {rating}
      </div>
      <div className="card-thumb">
        <Image
          src={item.img}
          alt={item.hadding}
          width={300}
          height={169}
          loading="lazy"
          decoding="async"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            objectPosition: 'center',
            display: 'block',
          }}
        />
      </div>
      <p style={{
        fontSize: 15,
        padding: '15px',
        margin: 0,
        fontWeight: 600,
        lineHeight: 1.4,
        flexGrow: 1,
        display: 'flex',
        alignItems: 'center',
        zIndex: 2,
        position: 'relative',
        transition: 'color 0.3s',
      }}>
        <i className="fa-solid fa-play-circle" aria-hidden="true" style={{ marginRight: 8, color: 'var(--accent)', fontSize: 14 }} />
        {item.hadding}
      </p>
      <div className="s-card-after" style={{
        content: '""',
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: 4,
        background: 'var(--gradient)',
        transform: 'scaleX(0)',
        transition: 'transform 0.4s',
        zIndex: 2,
      }} />
    </Link>
  );
}