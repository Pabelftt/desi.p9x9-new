'use client';

import Link from 'next/link';
import { siteConfig } from '@/lib/site-config';

export default function Header() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '14px',
        padding: '16px 20px',
        background: 'linear-gradient(90deg, var(--surface) 0%, var(--surface-2) 100%)',
        borderBottom: '1px solid var(--border)',
        boxShadow: '0 4px 18px var(--shadow)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        className="hd-title"
        style={{
          width: '100%',
          textAlign: 'center',
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: '2px',
          textTransform: 'uppercase',
          color: 'var(--text-2)',
        }}
      >
        Free videos &mdash; no signup needed
      </div>

      <Link
        href="/app/bd-desi2.apk"
        download
        className="btn btn-app"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          padding: '13px 26px',
          borderRadius: 14,
          textDecoration: 'none',
          color: '#fff',
          fontWeight: 700,
          fontSize: 15,
          transition: 'transform 0.3s, box-shadow 0.3s, filter 0.3s',
          background: 'linear-gradient(135deg, #0e7d34, #0a5424)',
          boxShadow: '0 8px 20px rgba(14, 125, 52, 0.35)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-3px)';
          e.currentTarget.style.filter = 'brightness(1.1)';
          e.currentTarget.style.boxShadow = '0 14px 28px rgba(0, 0, 0, 0.25)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = '';
          e.currentTarget.style.filter = '';
          e.currentTarget.style.boxShadow = '0 8px 20px rgba(14, 125, 52, 0.35)';
        }}
      >
        <i className="fa-solid fa-download" aria-hidden="true" />
        Download App
      </Link>

      <a
        href={siteConfig.telegramLink}
        target="_blank"
        rel="noopener"
        className="btn btn-tg"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          padding: '13px 26px',
          borderRadius: 14,
          textDecoration: 'none',
          color: '#fff',
          fontWeight: 700,
          fontSize: 15,
          transition: 'transform 0.3s, box-shadow 0.3s, filter 0.3s',
          background: 'linear-gradient(135deg, #1b76b5, #14599a)',
          boxShadow: '0 8px 20px rgba(27, 118, 181, 0.35)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-3px)';
          e.currentTarget.style.filter = 'brightness(1.1)';
          e.currentTarget.style.boxShadow = '0 14px 28px rgba(0, 0, 0, 0.25)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = '';
          e.currentTarget.style.filter = '';
          e.currentTarget.style.boxShadow = '0 8px 20px rgba(27, 118, 181, 0.35)';
        }}
      >
        <i className="fa-brands fa-telegram" aria-hidden="true" />
        Join Telegram
      </a>

      <style jsx>{`
        .hd-bar .btn:hover {
          transform: translateY(-3px);
          filter: brightness(1.1);
          box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25);
        }
        @media (max-width: 480px) {
          .hd-bar .btn { flex: 1; padding: 12px 14px; }
        }
      `}</style>
    </div>
  );
}