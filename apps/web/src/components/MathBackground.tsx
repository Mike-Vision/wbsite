'use client';

import { useEffect, useState } from 'react';

interface MathBackgroundProps {
  darkMode: boolean;
}

interface FloatingFormula {
  id: number;
  text: string;
  left: number;
  duration: number;
  delay: number;
  size: number;
  drift: number;
  removing?: boolean;
}

// Pool of math formulas, equations, and complex problems (validated characters only)
const FORMULAS = [
  'e^(iπ) + 1 = 0',
  '∫ e^(-x²) dx = √π/2',
  'f(x) = ax² + bx + c',
  '∇·E = ρ/ε₀',
  'lim x→0 sin(x)/x = 1',
  'Σ 1/n² = π²/6',
  'F = ma',
  'E = mc²',
  '∂²u/∂t² = c²∇²u',
  'a² + b² = c²',
  'P(A|B) = P(B|A)·P(A)/P(B)',
  'd/dx(eˣ) = eˣ',
  '∮ E·dA = Q/ε₀',
  'ψ(x,t) = A·e^(i(kx-ωt))',
  'iℏ·∂ψ/∂t = Ĥψ',
  '(a+b)ⁿ = Σ C(n,k)·aⁿ⁻ᵏ·bᵏ',
  'log(xy) = log(x) + log(y)',
  '∫ f(x) dx = F(x) + C',
  'sin²θ + cos²θ = 1',
  '∂f/∂x · ∂x/∂t',
  'lim (1 + 1/n)ⁿ = e',
  '∇×B = μ₀·J + μ₀ε₀·∂E/∂t',
  'φ = (1 + √5) / 2',
  'ζ(s) = Σ 1/nˢ',
  '∮ B·dl = μ₀·I',
  'Δx · Δp ≥ ℏ/2',
  'y = sin(x) + cos(x)',
  'det(A - λI) = 0',
  '∫∫ f(x,y) dA',
  'lim (f(x+h) - f(x)) / h',
  '√(-1) = i',
  'Σ i = n(n+1)/2',
  'cos(A+B) = cosA·cosB - sinA·sinB',
  'O(n log n)',
  'P ≠ NP',
  '∀x ∈ ℝ, x² ≥ 0',
  '∃! x : f(x) = 0',
  'τ = 2π',
  'γ ≈ 0.5772',
  'π ≈ 3.14159',
  'e ≈ 2.71828',
];

// Deterministic seeded RNG (Mulberry32) to avoid hydration issues
function createRng(seed: number) {
  let state = seed;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function generateBatch(seed: number, startId: number, count: number): FloatingFormula[] {
  const rng = createRng(seed);
  return Array.from({ length: count }, (_, i) => ({
    id: startId + i,
    text: FORMULAS[Math.floor(rng() * FORMULAS.length)],
    left: rng() * 95,
    duration: 22 + rng() * 18,
    delay: rng() * 8,
    size: 0.85 + rng() * 0.6,
    drift: (rng() - 0.5) * 80,
  }));
}

export default function MathBackground({ darkMode }: MathBackgroundProps) {
  const [formulas, setFormulas] = useState<FloatingFormula[]>([]);

  useEffect(() => {
    setFormulas(generateBatch(7, 0, 12));

    let nextId = 12;
    let seed = 13;
    const interval = setInterval(() => {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      const newBatch = generateBatch(seed, nextId, 4);
      nextId += 4;

      setFormulas((prev) => {
        // If we have too many, mark the oldest ones for fade-out removal
        if (prev.length >= 20) {
          const toRemoveCount = prev.length + newBatch.length - 20;
          const updated = prev.map((f, idx) =>
            idx < toRemoveCount ? { ...f, removing: true } : f
          );
          return [...updated, ...newBatch];
        }
        return [...prev, ...newBatch];
      });

      // Actually remove the faded-out items after the fade animation completes
      setTimeout(() => {
        setFormulas((prev) => prev.filter((f) => !f.removing));
      }, 1200);
    }, 9000);

    return () => clearInterval(interval);
  }, []);

  const textColor = darkMode ? 'rgba(239, 68, 68, 0.18)' : 'rgba(220, 38, 38, 0.14)';
  const glowColor = darkMode ? 'rgba(239, 68, 68, 0.25)' : 'rgba(220, 38, 38, 0.18)';

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 1 }}
      aria-hidden="true"
    >
      {formulas.map((f) => {
        const animationName = f.removing ? 'mathFadeOut' : 'mathFloat';
        const animationDuration = f.removing ? '1.2s' : `${f.duration}s`;
        const animationDelay = f.removing ? '0s' : `${f.delay}s`;
        const animationTiming = f.removing ? 'ease-out' : 'linear';
        const animationFillMode = f.removing ? 'forwards' : 'none';

        return (
          <span
            key={f.id}
            className="absolute whitespace-nowrap"
            style={{
              left: `${f.left}%`,
              bottom: '-10%',
              fontSize: `${f.size}rem`,
              fontFamily: "'JetBrains Mono', monospace",
              color: textColor,
              textShadow: `0 0 10px ${glowColor}`,
              animation: `${animationName} ${animationDuration} ${animationTiming} ${animationDelay} ${animationFillMode} ${f.removing ? '' : 'infinite'}`,
              ['--drift' as never]: `${f.drift}px`,
              fontWeight: 500,
              letterSpacing: '0.04em',
              willChange: 'transform, opacity',
            }}
          >
            {f.text}
          </span>
        );
      })}

      <style jsx global>{`
        @keyframes mathFloat {
          0% {
            transform: translate(0, 0) rotate(-2deg);
            opacity: 0;
          }
          8% {
            opacity: 1;
          }
          50% {
            transform: translate(calc(var(--drift) * 0.5), -55vh) rotate(1deg);
          }
          92% {
            opacity: 1;
          }
          100% {
            transform: translate(var(--drift), -120vh) rotate(3deg);
            opacity: 0;
          }
        }
        @keyframes mathFadeOut {
          0% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translateY(-20px);
          }
        }
      `}</style>
    </div>
  );
}
