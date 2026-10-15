'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface LoadMoreProps {
  excludeId?: string;
  initialSkip?: number;
}

export default function LoadMore({ excludeId = '', initialSkip = 8 }: LoadMoreProps) {
  const [skip, setSkip] = useState(initialSkip);
  const [loading, setLoading] = useState(false);
  const [noMore, setNoMore] = useState(false);
  const [error, setError] = useState(false);
  const [addedItems, setAddedItems] = useState<any[]>([]);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (loading || noMore) return;
    setLoading(true);
    setError(false);

    try {
      const url = excludeId
        ? `/api/suggested?excludeId=${excludeId}&skip=${skip}`
        : `/api/webs-p9x9-data?skip=${skip}`;
      const res = await fetch(url);
      const data = await res.json();

      if (!data.length) {
        setNoMore(true);
        setLoading(false);
        return;
      }

      setAddedItems((prev) => [...prev, ...data]);
      setSkip((prev) => prev + 8);
      setLoading(false);
    } catch (err) {
      console.error('Error loading suggestions:', err);
      setError(true);
      setLoading(false);
    }
  }, [skip, loading, noMore, excludeId]);

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && !noMore) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    observerRef.current.observe(sentinel);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadMore, loading, noMore]);

  return (
    <div style={{ width: '100%', margin: '30px 0 50px', textAlign: 'center' }}>
      {addedItems.length > 0 && (
        <div className="grid" style={{ marginBottom: 30 }}>
          {addedItems.map((item, idx) => (
            <a
              key={item.id + idx}
              href={`/movie/${item.id}`}
              className="card"
              style={{
                textDecoration: 'none',
                color: 'var(--text)',
                background: 'var(--card-grad)',
                borderRadius: 18,
                overflow: 'hidden',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow)',
                display: 'block',
              }}
            >
              <div className="card-thumb">
                <img
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
                <div style={{
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
                }}>
                  <i className="fa-solid fa-star" aria-hidden="true" style={{ color: 'gold', fontSize: 11 }} />
                  {(Math.random() * 2 + 8).toFixed(1)}
                </div>
              </div>
              <p style={{
                fontSize: 14,
                padding: '12px',
                margin: 0,
                fontWeight: 600,
                lineHeight: 1.4,
                maxHeight: 72,
                overflow: 'hidden',
              }}>
                <i className="fa-solid fa-play-circle" aria-hidden="true" style={{ marginRight: 6, color: 'var(--accent)', fontSize: 12 }} />
                {item.hadding}
              </p>
            </a>
          ))}
        </div>
      )}

      <div ref={sentinelRef} style={{ height: '20px' }} />

      {loading && (
        <div style={{
          padding: '18px',
          background: 'linear-gradient(135deg, #1a6bff 0%, #123a8f 100%)',
          color: '#fff',
          fontSize: 16,
          fontWeight: 700,
          borderRadius: 14,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
        }}>
          <i className="fa-solid fa-spinner fa-spin" aria-hidden="true" />
          Loading more videos...
        </div>
      )}

      {noMore && (
        <div style={{
          padding: '18px',
          background: 'var(--card-grad)',
          color: 'var(--text-2)',
          fontSize: 16,
          fontWeight: 700,
          borderRadius: 14,
          border: '1px solid var(--border)',
        }}>
          <i className="fa-solid fa-check-circle" aria-hidden="true" style={{ marginRight: 8 }} />
          No more videos
        </div>
      )}

      {error && (
        <button
          onClick={loadMore}
          style={{
            padding: '18px 32px',
            background: 'linear-gradient(135deg, #1a6bff 0%, #123a8f 100%)',
            color: '#fff',
            fontSize: 16,
            fontWeight: 700,
            borderRadius: 14,
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <i className="fa-solid fa-redo" aria-hidden="true" style={{ marginRight: 8 }} />
          Try Again
        </button>
      )}
    </div>
  );
}