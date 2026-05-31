'use client';

import { useState, useEffect } from 'react';
import { ExternalLink, ArrowDown } from 'lucide-react';
import ParticleBackground from '@/components/ParticleBackground';
import MouseTrail from '@/components/MouseTrail';
import MathBackground from '@/components/MathBackground';
import CodeBackground from '@/components/CodeBackground';
import Header from '@/components/Header';
import ProjectsSection from '@/components/ProjectsSection';
import RickRollFinale from '@/components/RickRollFinale';

const codeLines = [
  '// Initializing developer profile...',
  'const developer = {',
  '  name: "Mike Vision",',
  '  role: "Software Engineer",',
  '  passion: "Building innovative solutions",',
  '  status: "Ready to collaborate"',
  '};',
];

const skills = [
  { name: 'Python', level: 90, icon: '🐍', tagline: 'Data, automation & backend' },
  { name: 'JavaScript', level: 85, icon: '⚡', tagline: 'Modern web experiences' },
  { name: 'C++', level: 80, icon: '⚙️', tagline: 'Performance-critical systems' },
  { name: 'C#', level: 75, icon: '🎮', tagline: '.NET & game development' },
  { name: 'Java', level: 70, icon: '☕', tagline: 'Enterprise applications' },
  { name: 'Lua', level: 85, icon: '🌙', tagline: 'Lightweight scripting' },
  { name: 'Luau', level: 80, icon: '🎯', tagline: 'Roblox development' },
];

export default function Home() {
  const [darkMode, setDarkMode] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);

  // Mount and load saved theme
  useEffect(() => {
    setMounted(true);
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      setDarkMode(savedMode === 'true');
    }
  }, []);

  // Save dark mode preference to localStorage
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('darkMode', darkMode.toString());
    }
  }, [darkMode, mounted]);

  // Typing animation effect
  useEffect(() => {
    if (currentLineIndex >= codeLines.length) return;

    const currentLine = codeLines[currentLineIndex];

    if (currentCharIndex < currentLine.length) {
      const timeout = setTimeout(
        () => {
          setTypedText((prev) => prev + currentLine[currentCharIndex]);
          setCurrentCharIndex((prev) => prev + 1);
        },
        30 + Math.random() * 40
      );

      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setTypedText((prev) => prev + '\n');
        setCurrentLineIndex((prev) => prev + 1);
        setCurrentCharIndex(0);
      }, 400);

      return () => clearTimeout(timeout);
    }
  }, [currentCharIndex, currentLineIndex]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const scrollToSkills = () => {
    const el = document.getElementById('skills');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Heading font style
  const headingFont = { fontFamily: "'Outfit', sans-serif" };
  const monoFont = { fontFamily: "'JetBrains Mono', monospace" };

  return (
    <div
      className={`min-h-screen transition-colors duration-700 relative ${
        darkMode ? 'bg-black text-white' : 'bg-[#fafafa] text-gray-900'
      }`}
    >
      {/* Background Effects */}
      {mounted && <ParticleBackground darkMode={darkMode} />}
      {mounted && <MathBackground darkMode={darkMode} />}
      {mounted && <CodeBackground darkMode={darkMode} />}
      {mounted && <MouseTrail darkMode={darkMode} />}

      {/* Gradient orbs for ambiance */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className={`absolute top-1/4 -left-32 w-96 h-96 rounded-full blur-3xl transition-opacity duration-700 ${
            darkMode ? 'bg-red-900/20 opacity-100' : 'bg-red-200/40 opacity-100'
          }`}
        />
        <div
          className={`absolute bottom-1/4 -right-32 w-96 h-96 rounded-full blur-3xl transition-opacity duration-700 ${
            darkMode ? 'bg-red-800/15 opacity-100' : 'bg-orange-200/30 opacity-100'
          }`}
        />
      </div>

      {/* Header */}
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      {/* Hero Section */}
      <section
        id="home"
        className="min-h-screen flex items-center justify-center px-6 pt-24 relative z-10"
      >
        <div className="max-w-4xl w-full">
          {/* Code Block */}
          <div
            className={`rounded-2xl border transition-all duration-700 overflow-hidden shadow-2xl ${
              darkMode
                ? 'bg-zinc-950/80 border-red-900/40 shadow-red-950/30 backdrop-blur-sm'
                : 'bg-white/80 border-gray-200 shadow-gray-200/50 backdrop-blur-sm'
            }`}
          >
            {/* Window controls */}
            <div
              className={`flex items-center gap-2 px-4 py-3 border-b ${
                darkMode ? 'border-red-900/30 bg-black/40' : 'border-gray-200 bg-gray-50/50'
              }`}
            >
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span
                className={`ml-3 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}
                style={monoFont}
              >
                profile.ts
              </span>
            </div>

            <div className="p-6 md:p-8">
              <pre
                className={`text-sm md:text-base leading-relaxed whitespace-pre-wrap transition-colors duration-700 ${
                  darkMode ? 'text-green-400' : 'text-gray-800'
                }`}
                style={monoFont}
              >
                {typedText}
                <span
                  className={`inline-block w-2 h-5 ml-1 align-middle animate-pulse ${
                    darkMode ? 'bg-red-500' : 'bg-red-600'
                  }`}
                />
              </pre>
            </div>
          </div>

          {/* Name + tagline */}
          <div className="mt-16 text-center">
            <p
              className={`text-sm uppercase tracking-[0.3em] mb-4 transition-colors duration-700 ${
                darkMode ? 'text-red-500' : 'text-red-600'
              }`}
              style={monoFont}
            >
              {'<'} Hello world {'/>'}
            </p>
            <h1
              className={`text-5xl md:text-7xl lg:text-8xl font-black mb-6 transition-all duration-700 tracking-tight ${
                darkMode
                  ? 'text-transparent bg-clip-text bg-gradient-to-br from-white via-red-100 to-red-500'
                  : 'text-transparent bg-clip-text bg-gradient-to-br from-gray-900 via-gray-800 to-red-600'
              }`}
              style={headingFont}
            >
              Mike Vision
            </h1>
            <p
              className={`text-lg md:text-2xl font-light transition-colors duration-700 max-w-2xl mx-auto ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}
              style={headingFont}
            >
              Software Engineer crafting clean code & thoughtful solutions
            </p>

            <button
              onClick={scrollToSkills}
              className={`mt-12 inline-flex flex-col items-center gap-2 text-sm transition-colors duration-300 animate-bounce-slow ${
                darkMode ? 'text-gray-500 hover:text-red-500' : 'text-gray-500 hover:text-red-600'
              }`}
            >
              <span style={monoFont}>scroll.down()</span>
              <ArrowDown size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-32 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p
              className={`text-sm uppercase tracking-[0.3em] mb-3 ${
                darkMode ? 'text-red-500' : 'text-red-600'
              }`}
              style={monoFont}
            >
              {'// '} What I do
            </p>
            <h2
              className={`text-4xl md:text-6xl font-bold transition-colors duration-700 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}
              style={headingFont}
            >
              Technical <span className={darkMode ? 'text-red-500' : 'text-red-600'}>Skills</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((skill, index) => (
              <div
                key={skill.name}
                className={`group rounded-2xl border p-6 transition-all duration-500 hover:-translate-y-2 cursor-default ${
                  darkMode
                    ? 'bg-zinc-950/60 border-red-900/30 hover:border-red-500/60 hover:shadow-2xl hover:shadow-red-900/30 backdrop-blur-sm'
                    : 'bg-white/80 border-gray-200 hover:border-red-300 hover:shadow-2xl hover:shadow-red-100 backdrop-blur-sm'
                }`}
                style={{
                  animationDelay: `${index * 80}ms`,
                  animation: 'slideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                  opacity: 0,
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl transition-transform duration-500 group-hover:scale-125 group-hover:rotate-12 inline-block">
                      {skill.icon}
                    </span>
                    <div>
                      <h3
                        className={`text-xl font-bold transition-colors duration-500 ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}
                        style={headingFont}
                      >
                        {skill.name}
                      </h3>
                      <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                        {skill.tagline}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-sm font-bold transition-colors duration-500 ${
                      darkMode ? 'text-red-400' : 'text-red-600'
                    }`}
                    style={monoFont}
                  >
                    {skill.level}%
                  </span>
                </div>

                <div
                  className={`h-1.5 rounded-full overflow-hidden ${
                    darkMode ? 'bg-zinc-900' : 'bg-gray-100'
                  }`}
                >
                  <div
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: `${skill.level}%`,
                      background: darkMode
                        ? 'linear-gradient(to right, #DC2626, #EF4444, #F87171)'
                        : 'linear-gradient(to right, #DC2626, #B91C1C)',
                      transitionDelay: `${index * 100 + 400}ms`,
                      boxShadow: darkMode
                        ? '0 0 12px rgba(239, 68, 68, 0.5)'
                        : '0 0 8px rgba(220, 38, 38, 0.3)',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section (NEW) */}
      <ProjectsSection darkMode={darkMode} />

      {/* About Section */}
      <section id="about" className="py-32 px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p
              className={`text-sm uppercase tracking-[0.3em] mb-3 ${
                darkMode ? 'text-red-500' : 'text-red-600'
              }`}
              style={monoFont}
            >
              {'// '} Who I am
            </p>
            <h2
              className={`text-4xl md:text-6xl font-bold transition-colors duration-700 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}
              style={headingFont}
            >
              About <span className={darkMode ? 'text-red-500' : 'text-red-600'}>Me</span>
            </h2>
          </div>

          <div
            className={`rounded-2xl border p-8 md:p-12 transition-all duration-700 backdrop-blur-sm ${
              darkMode ? 'bg-zinc-950/60 border-red-900/30' : 'bg-white/80 border-gray-200'
            }`}
          >
            <p
              className={`text-lg md:text-xl leading-relaxed mb-6 transition-colors duration-700 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}
              style={headingFont}
            >
              I&apos;m a passionate software engineer with expertise in multiple programming
              languages and frameworks. I love solving complex problems and building efficient,
              scalable solutions.
            </p>
            <p
              className={`text-lg md:text-xl leading-relaxed transition-colors duration-700 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}
              style={headingFont}
            >
              My journey in programming has equipped me with a diverse skill set, allowing me to
              adapt to various technologies and tackle challenges from different perspectives.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <p
            className={`text-sm uppercase tracking-[0.3em] mb-3 ${
              darkMode ? 'text-red-500' : 'text-red-600'
            }`}
            style={monoFont}
          >
            {'// '} Get in touch
          </p>
          <h2
            className={`text-4xl md:text-6xl font-bold mb-4 transition-colors duration-700 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}
            style={headingFont}
          >
            Let&apos;s <span className={darkMode ? 'text-red-500' : 'text-red-600'}>Connect</span>
          </h2>
          <p
            className={`text-lg mb-10 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
            style={headingFont}
          >
            Check out my projects and let&apos;s build something amazing together.
          </p>

          <a
            href="https://github.com/Mike-Vision"
            target="_blank"
            rel="noopener noreferrer"
            className={`group inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-500 transform hover:scale-105 ${
              darkMode
                ? 'bg-red-600 hover:bg-red-700 text-white shadow-xl shadow-red-900/40'
                : 'bg-gray-900 hover:bg-gray-800 text-white shadow-xl shadow-gray-300'
            }`}
            style={headingFont}
          >
            <i className="fa-brands fa-github text-2xl" />
            View My GitHub
            <ExternalLink
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </a>
        </div>
      </section>

      {/* Finale Section (NEW) - prompts user to keep scrolling, then rickrolls */}
      <RickRollFinale darkMode={darkMode} />

      <style jsx global>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2.5s ease-in-out infinite;
        }
        html {
          scroll-behavior: smooth;
        }
        body {
          overflow-x: hidden;
        }
        ::selection {
          background-color: rgba(239, 68, 68, 0.3);
        }
      `}</style>
    </div>
  );
}
