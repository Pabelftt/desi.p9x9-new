'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface VideoPlayerProps {
  src: string;
  poster: string;
  title: string;
  description: string;
  videoId: string;
  redirectUrl?: string;
}

function opaqueId(input: string): string {
  let hash = 5381;
  for (let i = 0; i < input.length; i++) {
    hash = ((hash << 5) + hash + input.charCodeAt(i)) >>> 0;
  }
  return hash.toString(36);
}

const COOKIE_MAX_AGE = 300;

function readConsentCookie(name: string): string | null {
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`));
  if (!match) return null;
  return decodeURIComponent(match.slice(name.length + 1));
}

function writeConsentCookie(name: string, pagePath: string) {
  document.cookie =
    `${name}=${encodeURIComponent(pagePath)}; ` +
    `path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
}

export default function VideoPlayer({
  src,
  poster,
  title,
  description,
  videoId,
  redirectUrl,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const iconRef = useRef<HTMLElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const continueRef = useRef<HTMLButtonElement>(null);
  const allowedRef = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const cookieName = `dv_ok_${opaqueId(videoId)}`;

  useEffect(() => {
    allowedRef.current = readConsentCookie(cookieName) !== null;
  }, [cookieName]);

  const togglePlayback = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().catch(() => {});
      setPlaying(true);
    } else {
      videoRef.current.pause();
      setPlaying(false);
    }
  };

  const requestPlayback = useCallback(() => {
    if (allowedRef.current) {
      togglePlayback();
      return;
    }
    setShowModal(true);
  }, []);

  const handleContinue = () => {
    writeConsentCookie(cookieName, window.location.pathname);
    allowedRef.current = true;
    setShowModal(false);
    if (redirectUrl && redirectUrl.trim()) {
      try {
        window.location.assign(redirectUrl);
        return;
      } catch {
        // fall through: play video normally if redirect fails
      }
    }
    videoRef.current?.play().catch(() => {});
    setPlaying(true);
    buttonRef.current?.focus();
  };

  const closeModal = () => {
    setShowModal(false);
    buttonRef.current?.focus();
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => {
      if (!allowedRef.current) {
        video.pause();
        video.currentTime = 0;
        setShowModal(true);
        return;
      }
      setPlaying(true);
    };
    const handlePause = () => setPlaying(false);
    const handleEnded = () => setPlaying(false);

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  useEffect(() => {
    if (iconRef.current) {
      iconRef.current.className = playing ? 'fa-solid fa-pause' : 'fa-solid fa-play';
    }
  }, [playing]);

  useEffect(() => {
    if (!showModal) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    continueRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeModal();
        return;
      }
      if (e.key !== 'Tab' || !dialogRef.current) return;

      const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
        'button, [href], [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables.length) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [showModal]);

  return (
    <div
      className="video-player-container"
      style={{
        position: 'relative',
        width: '100%',
        borderRadius: 18,
        overflow: 'hidden',
        background: '#000',
        boxShadow: '0 18px 45px var(--shadow), 0 0 30px rgba(77, 163, 255, 0.18)',
        border: '2px solid var(--border)',
        transition: 'box-shadow 0.4s, border-color 0.4s',
      }}
      onMouseEnter={(e) => {
        const target = e.currentTarget as HTMLElement;
        target.style.boxShadow = '0 22px 55px var(--shadow), 0 0 40px rgba(77, 163, 255, 0.35)';
        target.style.borderColor = 'var(--accent)';
      }}
      onMouseLeave={(e) => {
        const target = e.currentTarget as HTMLElement;
        target.style.boxShadow = '0 18px 45px var(--shadow), 0 0 30px rgba(77, 163, 255, 0.18)';
        target.style.borderColor = 'var(--border)';
      }}
    >
      <video
        ref={videoRef}
        id="mainVideo"
        controls
        preload="auto"
        playsInline
        poster={poster}
        aria-label={title}
        data-playing={playing}
        style={{
          width: '100%',
          height: 'auto',
          display: 'block',
          cursor: 'pointer',
          background: '#000',
        }}
        onClick={requestPlayback}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div
        className="description"
        style={{
          textAlign: 'center',
          background: 'linear-gradient(90deg, #ff8f00, #ffc107)',
        }}
      >
        <p style={{
          background: 'transparent',
          color: '#1a1a1a',
          fontWeight: 600,
          padding: '10px',
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
        }}>
          <i className="fa-solid fa-circle-info" aria-hidden="true" style={{ marginRight: 8 }} />
          {description}
        </p>
      </div>

      <button
        ref={buttonRef}
        type="button"
        className="center-play-button"
        id="centerPlayButton"
        aria-label={playing ? 'Pause video' : 'Play video'}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 80,
          height: 80,
          padding: 0,
          background: 'rgba(0, 0, 0, 0.65)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          opacity: playing ? 0 : 1,
          transition: 'all 0.3s ease',
          zIndex: 10,
          border: '3px solid rgba(255, 255, 255, 0.85)',
          boxShadow: '0 0 30px rgba(0, 0, 0, 0.8)',
        }}
        onClick={(e) => {
          e.stopPropagation();
          requestPlayback();
        }}
        onMouseEnter={(e) => {
          const target = e.currentTarget as HTMLElement;
          target.style.background = 'rgba(0, 0, 0, 0.9)';
          target.style.borderColor = 'var(--accent)';
          target.style.transform = 'translate(-50%, -50%) scale(1.1)';
        }}
        onMouseLeave={(e) => {
          const target = e.currentTarget as HTMLElement;
          target.style.background = 'rgba(0, 0, 0, 0.65)';
          target.style.borderColor = 'rgba(255, 255, 255, 0.85)';
          target.style.transform = 'translate(-50%, -50%)';
        }}
      >
        <i
          ref={iconRef}
          id="centerPlayIcon"
          aria-hidden="true"
          className={playing ? 'fa-solid fa-pause' : 'fa-solid fa-play'}
          style={{
            fontSize: 34,
            color: '#fff',
            marginLeft: 5,
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.7)',
          }}
        />
      </button>

      {showModal && (
        <div
          role="presentation"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 20,
            background: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 12,
          }}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="video-consent-title"
            aria-describedby="video-consent-desc"
            style={{
              width: 'min(340px, 100%)',
              background: 'var(--surface, #12141c)',
              color: 'var(--text, #fff)',
              border: '1px solid var(--border, rgba(255, 255, 255, 0.12))',
              borderRadius: 14,
              padding: '22px 18px',
              textAlign: 'center',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
            }}
          >
            <h3
              id="video-consent-title"
              style={{ margin: '0 0 10px', fontSize: 17, fontWeight: 700, lineHeight: 1.4 }}
            >
              ভিডিও চালানোর আগে Continue চাপুন।
            </h3>
            <p
              id="video-consent-desc"
              style={{ margin: '0 0 18px', fontSize: 14, lineHeight: 1.5, opacity: 0.85 }}
            >
              নিচের Continue বাটনে ক্লিক করলে ভিডিও চলবে।
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button
                ref={continueRef}
                type="button"
                onClick={handleContinue}
                style={{
                  padding: '11px 28px',
                  borderRadius: 10,
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: 15,
                  color: '#fff',
                  background: 'linear-gradient(135deg, #1a6bff, #123a8f)',
                }}
              >
                Continue
              </button>
              <button
                type="button"
                onClick={closeModal}
                aria-label="Close dialog"
                style={{
                  padding: '11px 20px',
                  borderRadius: 10,
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: 15,
                  color: 'var(--text, #fff)',
                  background: 'transparent',
                  border: '1px solid var(--border, rgba(255, 255, 255, 0.25))',
                }}
              >
                বন্ধ
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .video-player-container:hover .center-play-button,
        video:not([data-playing="true"]) + .center-play-button {
          opacity: 1;
        }
        video[data-playing="true"] + .center-play-button {
          opacity: 0;
        }
        .video-player-container:hover video[data-playing="true"] + .center-play-button {
          opacity: 1;
        }
        .center-play-button i {
          font-size: 34px;
          color: #fff;
          margin-left: 5px;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.7);
        }
      `}</style>
    </div>
  );
}
