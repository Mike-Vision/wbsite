'use client';

import { useEffect, useState } from 'react';

interface CodeBackgroundProps {
  darkMode: boolean;
}

interface FloatingCode {
  id: number;
  text: string;
  right: number; // positioned from the right side (opposite of math)
  duration: number;
  delay: number;
  size: number;
  drift: number;
  removing?: boolean;
}

// Library functions & code snippets from various programming languages
const CODE_SNIPPETS = [
  'console.log("Hello")',
  'import numpy as np',
  'def main():',
  '#include <iostream>',
  'public static void main()',
  'std::cout << "x"',
  'print("Hello, World!")',
  'List<T>.Add(item)',
  'async function fetch()',
  'array.map(x => x * 2)',
  'pd.DataFrame()',
  'try { ... } catch(e)',
  'git commit -m "fix"',
  'while (true) { }',
  'for i in range(10):',
  'if __name__ == "__main__":',
  'return new Promise()',
  'export default Component',
  'useState<T>(null)',
  'useEffect(() => {}, [])',
  'np.linspace(0, 1, 100)',
  'plt.show()',
  'SELECT * FROM users',
  'Array.from({length: n})',
  'Math.floor(Math.PI)',
  'JSON.stringify(obj)',
  'Object.keys(data)',
  'class Player { }',
  'function recursive(n)',
  'local function step()',
  'game.Players.LocalPlayer',
  'workspace:WaitForChild()',
  'Instance.new("Part")',
  'string.format("%d", n)',
  'table.insert(t, value)',
  'List<int> nums = new()',
  'System.out.println(x)',
  'ArrayList<T> list',
  'public class App { }',
  'throw new Error("oops")',
  '#define PI 3.14159',
  'malloc(sizeof(int))',
  'free(ptr)',
  'std::vector<int> v',
  '@Override',
  'lambda x: x ** 2',
  'filter(lambda n: n>0)',
  'requests.get(url)',
  'response.json()',
  'fetch("/api/data")',
  'await response.text()',
];

// Deterministic seeded RNG (different seed from MathBackground to avoid overlap)
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

function generateBatch(seed: number, startId: number, count: number): FloatingCode[] {
  const rng = createRng(seed);
  return Array.from({ length: count }, (_, i) => ({
    id: startId + i,
    text: CODE_SNIPPETS[Math.floor(rng() * CODE_SNIPPETS.length)],
    right: rng() * 95,
    duration: 26 + rng() * 22, // slower than math, slightly different range
    delay: rng() * 10,
    size: 0.75 + rng() * 0.5,
    drift: (rng() - 0.5) * 80,
  }));
}

export default function CodeBackground({ darkMode }: CodeBackgroundProps) {
  const [snippets, setSnippets] = useState<FloatingCode[]>([]);

  useEffect(() => {
    setSnippets(generateBatch(101, 0, 10));

    let nextId = 10;
    let seed = 211;
    const interval = setInterval(() => {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      const newBatch = generateBatch(seed, nextId, 4);
      nextId += 4;

      setSnippets((prev) => {
        if (prev.length >= 18) {
          const toRemoveCount = prev.length + newBatch.length - 18;
          const updated = prev.map((s, idx) =>
            idx < toRemoveCount ? { ...s, removing: true } : s
          );
          return [...updated, ...newBatch];
        }
        return [...prev, ...newBatch];
      });

      setTimeout(() => {
        setSnippets((prev) => prev.filter((s) => !s.removing));
      }, 1200);
    }, 11000);

    return () => clearInterval(interval);
  }, []);

  // Slightly different tint so it's visually distinguishable from math (cooler red / slate)
  const textColor = darkMode ? 'rgba(248, 113, 113, 0.16)' : 'rgba(15, 23, 42, 0.14)';
  const glowColor = darkMode ? 'rgba(248, 113, 113, 0.22)' : 'rgba(15, 23, 42, 0.18)';

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 2 }}
      aria-hidden="true"
    >
      {snippets.map((s) => {
        const animationName = s.removing ? 'codeFadeOut' : 'codeFloat';
        const animationDuration = s.removing ? '1.2s' : `${s.duration}s`;
        const animationDelay = s.removing ? '0s' : `${s.delay}s`;
        const animationTiming = s.removing ? 'ease-out' : 'linear';
        const animationFillMode = s.removing ? 'forwards' : 'none';

        return (
          <span
            key={s.id}
            className="absolute whitespace-nowrap"
            style={{
              right: `${s.right}%`,
              top: '-10%',
              fontSize: `${s.size}rem`,
              fontFamily: "'JetBrains Mono', monospace",
              color: textColor,
              textShadow: `0 0 8px ${glowColor}`,
              animation: `${animationName} ${animationDuration} ${animationTiming} ${animationDelay} ${animationFillMode} ${s.removing ? '' : 'infinite'}`,
              ['--code-drift' as never]: `${s.drift}px`,
              fontWeight: 500,
              letterSpacing: '0.02em',
              fontStyle: 'italic',
              willChange: 'transform, opacity',
            }}
          >
            {s.text}
          </span>
        );
      })}

      <style jsx global>{`
        @keyframes codeFloat {
          0% {
            transform: translate(0, 0) rotate(2deg);
            opacity: 0;
          }
          8% {
            opacity: 1;
          }
          50% {
            transform: translate(calc(var(--code-drift) * 0.5), 55vh) rotate(-1deg);
          }
          92% {
            opacity: 1;
          }
          100% {
            transform: translate(var(--code-drift), 120vh) rotate(-3deg);
            opacity: 0;
          }
        }
        @keyframes codeFadeOut {
          0% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translateY(20px);
          }
        }
      `}</style>
    </div>
  );
}
