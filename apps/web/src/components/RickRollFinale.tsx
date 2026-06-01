'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { ChevronDown } from 'lucide-react';
import SplitTitle from '@/components/SplitTitle';

interface RickRollFinaleProps {
  darkMode: boolean;
}

export default function RickRollFinale({ darkMode }: RickRollFinaleProps) {
  const [triggered, setTriggered] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const triggeredRef = useRef(false);

  const headingFont = { fontFamily: "'Outfit', sans-serif" };
  const monoFont = { fontFamily: "'JetBrains Mono', monospace" };

  const triggerRickRoll = useCallback(() => {
    if (triggeredRef.current) return;
    triggeredRef.current = true;
    setTriggered(true);

    // Disable smooth scrolling temporarily so our manual scroll animation works
    const htmlEl = document.documentElement;
    const prevScrollBehavior = htmlEl.style.scrollBehavior;
    htmlEl.style.scrollBehavior = 'auto';

    // Lock the body scroll during animation
    document.body.style.overflow = 'hidden';

    const startScroll = window.scrollY;
    const targetScroll = document.documentElement.scrollHeight - window.innerHeight;
    const distance = Math.max(0, targetScroll - startScroll);

    const duration = 2200;
    const startTime = performance.now();

    const easeInQuart = (t: number): number => t * t * t * t;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeInQuart(progress);

      window.scrollTo(0, startScroll + distance * eased);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setTimeout(() => {
          setShowVideo(true);
          document.body.style.overflow = 'hidden';
          htmlEl.style.scrollBehavior = prevScrollBehavior;
        }, 150);
      }
    };

    requestAnimationFrame(animate);
  }, []);

  // Auto-trigger only when user has fully reached and scrolled past the finale section
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (triggeredRef.current) return;
      // Only trigger on downward scroll
      if (e.deltaY <= 0) return;

      const finale = document.getElementById('finale');
      if (!finale) return;

      const rect = finale.getBoundingClientRect();
      // Only trigger when the bottom of the finale section is at/above viewport bottom
      // AND user is actively scrolling down past it
      if (rect.bottom <= window.innerHeight + 30) {
        triggerRickRoll();
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [triggerRickRoll]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.scrollBehavior = '';
    };
  }, []);

  const overlayBg = darkMode
    ? 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%)'
    : 'radial-gradient(ellipse at center, transparent 40%, rgba(255,255,255,0.45) 100%)';

  const buttonDisabledClass = triggered ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <>
      {/* Finale prompt section */}
      <section
        id="finale"
        className="min-h-screen flex flex-col items-center justify-center px-6 relative z-10"
      >
        <div className="text-center max-w-3xl">
          <p
            className={`text-sm uppercase tracking-[0.3em] mb-6 ${
              darkMode ? 'text-red-500' : 'text-red-600'
            }`}
            style={monoFont}
          >
            {'// '} one more thing...
          </p>
          <h2
            className={`text-5xl md:text-7xl font-bold mb-6 transition-colors duration-700 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}
            style={headingFont}
          >
            <SplitTitle>Keep scrolling <span className={darkMode ? 'text-red-500' : 'text-red-600'}>down</span> <span className="inline-block animate-wiggle">:)</span></SplitTitle>
          </h2>
          <p
            className={`text-lg md:text-xl mb-12 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
            style={headingFont}
          >
            There&apos;s a little surprise waiting for you at the very bottom...
          </p>

          <button
            onClick={triggerRickRoll}
            disabled={triggered}
            className={`group inline-flex flex-col items-center gap-3 px-10 py-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${
              darkMode
                ? 'border-red-900/50 hover:border-red-500 hover:bg-red-950/30 text-white'
                : 'border-gray-300 hover:border-red-500 hover:bg-red-50 text-gray-900'
            } ${buttonDisabledClass}`}
            style={headingFont}
            aria-label="Scroll to bottom"
          >
            <span className="text-base font-medium">Click here to go further</span>
            <ChevronDown
              size={36}
              className={`animate-bounce-arrow ${
                darkMode ? 'text-red-500' : 'text-red-600'
              } group-hover:scale-125 transition-transform`}
            />
          </button>

          <p
            className={`mt-8 text-xs ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}
            style={monoFont}
          >
            Or just scroll your mouse wheel down ↓
          </p>
        </div>
      </section>

      {/* Acceleration overlay — clean vignette + blur, NO rain/speed lines */}
      {triggered && !showVideo && (
        <div
          className="fixed inset-0 z-[60] pointer-events-none"
          style={{
            background: overlayBg,
            animation: 'speedBlur 2.2s ease-in forwards',
          }}
        />
      )}

      {/* Fullscreen YouTube video */}
      {showVideo && (
        <div
          className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
          style={{ animation: 'videoReveal 0.6s ease-out forwards' }}
        >
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&controls=1&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&fs=1&playsinline=1"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
          <div
            className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 text-sm px-4 py-2 rounded-full bg-black/60 backdrop-blur-sm"
            style={monoFont}
          >
            Refresh the page to escape 😉
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes wiggle {
          0%,
          100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(-10deg);
          }
          75% {
            transform: rotate(10deg);
          }
        }
        .animate-wiggle {
          animation: wiggle 1.5s ease-in-out infinite;
          display: inline-block;
        }
        @keyframes bounce-arrow {
          0%,
          100% {
            transform: translateY(0);
            opacity: 0.7;
          }
          50% {
            transform: translateY(10px);
            opacity: 1;
          }
        }
        .animate-bounce-arrow {
          animation: bounce-arrow 1.5s ease-in-out infinite;
        }
        @keyframes speedBlur {
          0% {
            backdrop-filter: blur(0px);
            -webkit-backdrop-filter: blur(0px);
            opacity: 0;
          }
          50% {
            backdrop-filter: blur(6px);
            -webkit-backdrop-filter: blur(6px);
            opacity: 1;
          }
          100% {
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            opacity: 1;
          }
        }
        @keyframes videoReveal {
          0% {
            opacity: 0;
            transform: scale(1.1);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </>
  );
}
