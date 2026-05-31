export async function GET() {
  try {
    const response = await fetch(
      'https://api.github.com/users/Mike-Vision/repos?sort=updated&per_page=12',
      {
        headers: {
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
        },
        next: { revalidate: 300 },
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API responded with ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    const projects = data.map(
      (repo: {
        id: number;
        name: string;
        description: string | null;
        html_url: string;
        stargazers_count: number;
        watchers_count: number;
        forks_count: number;
        language: string | null;
        updated_at: string;
        topics: string[];
      }) => ({
        id: repo.id,
        name: repo.name,
        description: repo.description,
        url: repo.html_url,
        stars: repo.stargazers_count,
        watchers: repo.watchers_count,
        forks: repo.forks_count,
        language: repo.language,
        updatedAt: repo.updated_at,
        topics: repo.topics || [],
      })
    );

    return Response.json({ projects });
  } catch (error) {
    console.error('Failed to fetch GitHub projects:', error);
    return Response.json({ error: 'Failed to fetch projects', projects: [] }, { status: 500 });
  }
}
