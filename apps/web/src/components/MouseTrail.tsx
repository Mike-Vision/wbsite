'use client';

import { useEffect, useRef, useState } from 'react';

interface TrailIcon {
  id: number;
  x: number;
  y: number;
  icon: string;
  rotation: number;
  scale: number;
  createdAt: number;
}

interface MouseTrailProps {
  darkMode: boolean;
}

const ICONS = ['💻', '⚡', '🚀', '✨', '🔥', '💡', '⭐', '🎯', '🎨', '🛠️', '⚙️', '📦'];

export default function MouseTrail({ darkMode }: MouseTrailProps) {
  const [icons, setIcons] = useState<TrailIcon[]>([]);
  const lastSpawnRef = useRef({ x: 0, y: 0, time: 0 });
  const idCounterRef = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      const last = lastSpawnRef.current;
      const dx = e.clientX - last.x;
      const dy = e.clientY - last.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Only spawn icon if mouse has moved enough distance and enough time has passed
      if (distance > 60 && now - last.time > 80) {
        const newIcon: TrailIcon = {
          id: idCounterRef.current++,
          x: e.clientX,
          y: e.clientY,
          icon: ICONS[Math.floor(Math.random() * ICONS.length)],
          rotation: Math.random() * 360,
          scale: 0.8 + Math.random() * 0.6,
          createdAt: now,
        };

        setIcons((prev) => [...prev.slice(-15), newIcon]);
        lastSpawnRef.current = { x: e.clientX, y: e.clientY, time: now };
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Cleanup old icons
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setIcons((prev) => prev.filter((icon) => now - icon.createdAt < 1500));
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      {icons.map((icon) => (
        <span
          key={icon.id}
          className="absolute text-2xl select-none"
          style={{
            left: icon.x,
            top: icon.y,
            transform: `translate(-50%, -50%) rotate(${icon.rotation}deg) scale(${icon.scale})`,
            animation: 'trailFade 1.5s ease-out forwards',
            filter: darkMode
              ? 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.6))'
              : 'drop-shadow(0 0 6px rgba(0, 0, 0, 0.3))',
          }}
        >
          {icon.icon}
        </span>
      ))}

      <style jsx global>{`
        @keyframes trailFade {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) rotate(0deg) scale(0.4);
          }
          15% {
            opacity: 1;
            transform: translate(-50%, -50%) rotate(20deg) scale(1.2);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, calc(-50% - 60px)) rotate(180deg) scale(0.5);
          }
        }
      `}</style>
    </div>
  );
}
