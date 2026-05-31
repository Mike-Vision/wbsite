'use client';

import { useEffect, useState } from 'react';
import { Star, GitFork, Eye, ExternalLink, Loader2 } from 'lucide-react';

interface Project {
  id: number;
  name: string;
  description: string | null;
  url: string;
  stars: number;
  watchers: number;
  forks: number;
  language: string | null;
  updatedAt: string;
  topics: string[];
}

interface ProjectsSectionProps {
  darkMode: boolean;
}

const languageColors: Record<string, string> = {
  Python: '#3776AB',
  JavaScript: '#F7DF1E',
  TypeScript: '#3178C6',
  'C++': '#00599C',
  'C#': '#239120',
  Java: '#007396',
  Lua: '#2C2D72',
  HTML: '#E34F26',
  CSS: '#1572B6',
};

export default function ProjectsSection({ darkMode }: ProjectsSectionProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/github-projects');
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }
        const data = await response.json();
        setProjects(data.projects || []);
      } catch (err) {
        console.error(err);
        setError('Could not load projects from GitHub');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const headingFont = { fontFamily: "'Outfit', sans-serif" };
  const monoFont = { fontFamily: "'JetBrains Mono', monospace" };

  return (
    <section id="projects" className="py-32 px-6 relative z-10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p
            className={`text-sm uppercase tracking-[0.3em] mb-3 ${
              darkMode ? 'text-red-500' : 'text-red-600'
            }`}
            style={monoFont}
          >
            {'// '} What I&apos;ve built
          </p>
          <h2
            className={`text-4xl md:text-6xl font-bold transition-colors duration-700 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}
            style={headingFont}
          >
            My <span className={darkMode ? 'text-red-500' : 'text-red-600'}>Projects</span>
          </h2>
          <p
            className={`mt-4 text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
            style={headingFont}
          >
            Live from{' '}
            <a
              href="https://github.com/Mike-Vision"
              target="_blank"
              rel="noopener noreferrer"
              className={`underline ${darkMode ? 'text-red-400' : 'text-red-600'}`}
            >
              github.com/Mike-Vision
            </a>
          </p>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2
              size={32}
              className={`animate-spin ${darkMode ? 'text-red-500' : 'text-red-600'}`}
            />
          </div>
        )}

        {error && !loading && (
          <div
            className={`text-center py-12 rounded-2xl border ${
              darkMode
                ? 'bg-zinc-950/60 border-red-900/30 text-gray-400'
                : 'bg-white/60 border-gray-200 text-gray-600'
            }`}
          >
            <p style={headingFont}>{error}</p>
            <p className="text-sm mt-2" style={monoFont}>
              Visit my GitHub directly to see my work
            </p>
          </div>
        )}

        {!loading && !error && projects.length === 0 && (
          <div
            className={`text-center py-12 rounded-2xl border ${
              darkMode
                ? 'bg-zinc-950/60 border-red-900/30 text-gray-400'
                : 'bg-white/60 border-gray-200 text-gray-600'
            }`}
          >
            <p style={headingFont}>No public projects found yet.</p>
          </div>
        )}

        {!loading && !error && projects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <a
                key={project.id}
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`group rounded-2xl border p-6 transition-all duration-500 hover:-translate-y-2 flex flex-col ${
                  darkMode
                    ? 'bg-zinc-950/60 border-red-900/30 hover:border-red-500/60 hover:shadow-2xl hover:shadow-red-900/30 backdrop-blur-sm'
                    : 'bg-white/80 border-gray-200 hover:border-red-300 hover:shadow-2xl hover:shadow-red-100 backdrop-blur-sm'
                }`}
                style={{
                  animationDelay: `${index * 60}ms`,
                  animation: 'slideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                  opacity: 0,
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3
                    className={`text-lg font-bold transition-colors duration-500 line-clamp-1 ${
                      darkMode
                        ? 'text-white group-hover:text-red-400'
                        : 'text-gray-900 group-hover:text-red-600'
                    }`}
                    style={headingFont}
                  >
                    {project.name}
                  </h3>
                  <ExternalLink
                    size={16}
                    className={`flex-shrink-0 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 ${
                      darkMode ? 'text-gray-500' : 'text-gray-400'
                    }`}
                  />
                </div>

                <p
                  className={`text-sm mb-4 flex-grow line-clamp-3 ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}
                  style={headingFont}
                >
                  {project.description || 'No description provided.'}
                </p>

                {/* Topics */}
                {project.topics.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.topics.slice(0, 3).map((topic) => (
                      <span
                        key={topic}
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          darkMode
                            ? 'bg-red-950/40 text-red-300 border border-red-900/50'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}
                        style={monoFont}
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                )}

                <div
                  className={`flex items-center justify-between pt-3 border-t ${
                    darkMode ? 'border-red-900/20' : 'border-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-4 text-xs">
                    {project.language && (
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{
                            backgroundColor: languageColors[project.language] || '#888',
                          }}
                        />
                        <span
                          className={darkMode ? 'text-gray-400' : 'text-gray-600'}
                          style={monoFont}
                        >
                          {project.language}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <div
                      className={`flex items-center gap-1 ${
                        darkMode ? 'text-yellow-500' : 'text-yellow-600'
                      }`}
                      title={`${project.stars} stars`}
                    >
                      <Star size={13} fill="currentColor" />
                      <span style={monoFont}>{project.stars}</span>
                    </div>
                    <div
                      className={`flex items-center gap-1 ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}
                      title={`${project.watchers} watchers`}
                    >
                      <Eye size={13} />
                      <span style={monoFont}>{project.watchers}</span>
                    </div>
                    <div
                      className={`flex items-center gap-1 ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}
                      title={`${project.forks} forks`}
                    >
                      <GitFork size={13} />
                      <span style={monoFont}>{project.forks}</span>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
