'use client';

import { useEffect, useState, useRef, type CSSProperties } from 'react';
import { Moon, Sun, Code2 } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

interface LetterSplit {
  // Per-letter offset (in px) for the "split apart" effect
  x: number;
  y: number;
}

// Compute how much each letter should move away from the mouse cursor.
// Returns an array of {x, y} offsets, one per character.
function computeLetterSplits(
  text: string,
  letterRects: DOMRect[],
  mouseX: number,
  mouseY: number,
  pushRadius: number,
  maxPush: number
): LetterSplit[] {
  return text.split('').map((_, i) => {
    const rect = letterRects[i];
    if (!rect) return { x: 0, y: 0 };

    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = cx - mouseX;
    const dy = cy - mouseY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > pushRadius || dist === 0) return { x: 0, y: 0 };

    const force = (pushRadius - dist) / pushRadius;
    const angle = Math.atan2(dy, dx);
    return {
      x: Math.cos(angle) * force * maxPush,
      y: Math.sin(angle) * force * maxPush,
    };
  });
}

export default function Header({ darkMode, toggleDarkMode }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [logoSplits, setLogoSplits] = useState<LetterSplit[]>([]);
  const [navSplits, setNavSplits] = useState<Record<string, LetterSplit[]>>({});
  const headerRef = useRef<HTMLElement>(null);
  const logoTextRef = useRef<HTMLSpanElement>(null);
  const navRefs = useRef<Record<string, HTMLSpanElement | null>>({});

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ];

  const logoText = 'Mike.Vision';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const sections = ['home', 'skills', 'projects', 'about', 'contact'];
      const current = sections.find((id) => {
        const el = document.getElementById(id);
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return rect.top <= 120 && rect.bottom >= 120;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track mouse position and compute per-letter offsets
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!headerRef.current) return;
      const headerRect = headerRef.current.getBoundingClientRect();

      // Only compute split effect when mouse is near the header band
      const isNearHeader = e.clientY < headerRect.bottom + 120;
      if (!isNearHeader) {
        // Clear all splits when mouse leaves header zone
        setLogoSplits((prev) => (prev.length === 0 ? prev : []));
        setNavSplits((prev) => (Object.keys(prev).length === 0 ? prev : {}));
        return;
      }

      // Logo letters split
      const logoEl = logoTextRef.current;
      if (logoEl) {
        const letterRects: DOMRect[] = Array.from(
          logoEl.querySelectorAll<HTMLElement>('[data-letter]')
        ).map((el) => el.getBoundingClientRect());
        if (letterRects.length === logoText.length) {
          const splits = computeLetterSplits(
            logoText,
            letterRects,
            e.clientX,
            e.clientY,
            90, // push radius (px) - how close mouse must be
            14 // max push distance (px)
          );
          setLogoSplits(splits);
        }
      }

      // Nav items letters split
      const newNavSplits: Record<string, LetterSplit[]> = {};
      navItems.forEach((item) => {
        const navEl = navRefs.current[item.id];
        if (!navEl) return;
        const letterRects: DOMRect[] = Array.from(
          navEl.querySelectorAll<HTMLElement>('[data-letter]')
        ).map((el) => el.getBoundingClientRect());
        if (letterRects.length === item.label.length) {
          const splits = computeLetterSplits(item.label, letterRects, e.clientX, e.clientY, 70, 12);
          // Only store if any letter is actually moving
          if (splits.some((s) => s.x !== 0 || s.y !== 0)) {
            newNavSplits[item.id] = splits;
          }
        }
      });
      setNavSplits(newNavSplits);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Helper to render text with per-letter spans that can split apart
  const renderSplitText = (
    text: string,
    splits: LetterSplit[] | undefined,
    extraStyle?: (i: number) => CSSProperties
  ) => {
    return text.split('').map((char, i) => {
      const offset = splits?.[i] ?? { x: 0, y: 0 };
      const style: CSSProperties = {
        display: 'inline-block',
        transform: `translate(${offset.x}px, ${offset.y}px)`,
        transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
        ...(extraStyle?.(i) ?? {}),
      };
      return (
        <span key={i} data-letter style={style}>
          {char === ' ' ? '\u00A0' : char}
        </span>
      );
    });
  };

  const headerBgClass = scrolled
    ? darkMode
      ? 'bg-black/30 border-b border-red-900/15'
      : 'bg-white/30 border-b border-gray-200/40'
    : 'bg-transparent';

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-50 ${headerBgClass}`}
      style={{
        backdropFilter: scrolled ? 'blur(20px) saturate(160%)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(160%)' : 'none',
        transition: 'background 0.5s, border-color 0.5s, backdrop-filter 0.5s',
      }}
    >
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <button onClick={() => scrollToSection('home')} className="flex items-center gap-2 group">
          <div
            className={`p-2 rounded-lg transition-all duration-500 group-hover:rotate-12 ${
              darkMode ? 'bg-red-600' : 'bg-gray-900'
            }`}
          >
            <Code2 size={18} className="text-white" />
          </div>
          <span
            ref={logoTextRef}
            className={`font-bold text-lg tracking-tight transition-colors duration-500 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            {renderSplitText(logoText, logoSplits, (i) => {
              // Letter at position 4 is "." - make it red
              if (logoText[i] === '.') {
                return { color: darkMode ? '#EF4444' : '#DC2626' };
              }
              return {};
            })}
          </span>
        </button>

        {/* Nav Items */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            const itemColorClass = isActive
              ? darkMode
                ? 'text-red-500'
                : 'text-red-600'
              : darkMode
                ? 'text-gray-400 hover:text-white'
                : 'text-gray-600 hover:text-gray-900';

            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-300 ${itemColorClass}`}
              >
                <span
                  ref={(el) => {
                    navRefs.current[item.id] = el;
                  }}
                  className="inline-block"
                >
                  {renderSplitText(item.label, navSplits[item.id])}
                </span>
                {isActive && (
                  <span
                    className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-6 rounded-full transition-all duration-300 ${
                      darkMode ? 'bg-red-500' : 'bg-red-600'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Toggle Button */}
        <button
          onClick={toggleDarkMode}
          className={`relative p-2.5 rounded-full transition-all duration-500 overflow-hidden group ${
            darkMode
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-gray-900 hover:bg-gray-800 text-white'
          }`}
          aria-label="Toggle dark mode"
        >
          <span className="relative z-10 block transition-transform duration-500 group-hover:rotate-180">
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </span>
        </button>
      </nav>
    </header>
  );
}
