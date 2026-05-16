const GITHUB_USERNAME = process.env.GITHUB_USERNAME || "Maliskandar";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const headers: Record<string, string> = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
};
if (GITHUB_TOKEN) headers.Authorization = `Bearer ${GITHUB_TOKEN}`;

export type GitHubProfile = {
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
  bio: string | null;
  followers: number;
  following: number;
  public_repos: number;
  created_at: string;
  location: string | null;
};

export type GitHubRepo = {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  topics?: string[];
  fork: boolean;
  archived: boolean;
};

export type LanguageStat = { name: string; bytes: number; percentage: number };

export type ContributionDay = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 };

export type GitHubStats = {
  profile: GitHubProfile;
  totals: {
    stars: number;
    forks: number;
    repos: number;
    commits_year: number;
  };
  topRepos: GitHubRepo[];
  languages: LanguageStat[];
  contributions: {
    total: number;
    weeks: ContributionDay[][];
  };
  fetchedAt: string;
  source: "live" | "fallback";
};

async function gh<T>(path: string): Promise<T> {
  const res = await fetch(`https://api.github.com${path}`, {
    headers,
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`GitHub ${path} -> ${res.status}`);
  return res.json() as Promise<T>;
}

async function fetchContributions(username: string): Promise<GitHubStats["contributions"]> {
  try {
    const res = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${username}?y=last`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) throw new Error(`contrib ${res.status}`);
    const data = (await res.json()) as {
      total: Record<string, number>;
      contributions: { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 }[];
    };
    const flat = data.contributions;
    const weeks: ContributionDay[][] = [];
    let current: ContributionDay[] = [];
    flat.forEach((day, idx) => {
      current.push(day);
      const d = new Date(day.date);
      if (d.getDay() === 6 || idx === flat.length - 1) {
        weeks.push(current);
        current = [];
      }
    });
    const totalNum = Object.values(data.total).reduce((a, b) => a + b, 0);
    return { total: totalNum, weeks };
  } catch {
    return { total: 0, weeks: [] };
  }
}

export async function getGitHubStats(): Promise<GitHubStats> {
  try {
    const profile = await gh<GitHubProfile>(`/users/${GITHUB_USERNAME}`);

    const allRepos: GitHubRepo[] = [];
    for (let page = 1; page <= 4; page++) {
      const batch = await gh<GitHubRepo[]>(
        `/users/${GITHUB_USERNAME}/repos?per_page=100&page=${page}&sort=updated`
      );
      allRepos.push(...batch);
      if (batch.length < 100) break;
    }

    const ownRepos = allRepos.filter((r) => !r.fork);
    const stars = ownRepos.reduce((s, r) => s + r.stargazers_count, 0);
    const forks = ownRepos.reduce((s, r) => s + r.forks_count, 0);

    const topRepos = [...ownRepos]
      .sort((a, b) => b.stargazers_count - a.stargazers_count || +new Date(b.updated_at) - +new Date(a.updated_at))
      .slice(0, 6);

    const langMap: Record<string, number> = {};
    const topForLang = [...ownRepos]
      .sort((a, b) => +new Date(b.updated_at) - +new Date(a.updated_at))
      .slice(0, 15);
    await Promise.all(
      topForLang.map(async (r) => {
        try {
          const langs = await gh<Record<string, number>>(`/repos/${r.full_name}/languages`);
          for (const [k, v] of Object.entries(langs)) {
            langMap[k] = (langMap[k] || 0) + v;
          }
        } catch {
          if (r.language) langMap[r.language] = (langMap[r.language] || 0) + 1;
        }
      })
    );
    const totalBytes = Object.values(langMap).reduce((a, b) => a + b, 0) || 1;
    const languages: LanguageStat[] = Object.entries(langMap)
      .map(([name, bytes]) => ({
        name,
        bytes,
        percentage: (bytes / totalBytes) * 100,
      }))
      .sort((a, b) => b.bytes - a.bytes)
      .slice(0, 8);

    const contributions = await fetchContributions(GITHUB_USERNAME);

    return {
      profile,
      totals: {
        stars,
        forks,
        repos: profile.public_repos,
        commits_year: contributions.total,
      },
      topRepos,
      languages,
      contributions,
      fetchedAt: new Date().toISOString(),
      source: "live",
    };
  } catch (err) {
    console.error("[github] falling back:", err);
    return fallbackStats();
  }
}

function fallbackStats(): GitHubStats {
  return {
    profile: {
      login: GITHUB_USERNAME,
      name: "Muhammad Akmal Iskandar",
      avatar_url: `https://github.com/${GITHUB_USERNAME}.png`,
      html_url: `https://github.com/${GITHUB_USERNAME}`,
      bio: null,
      followers: 0,
      following: 0,
      public_repos: 0,
      created_at: new Date().toISOString(),
      location: null,
    },
    totals: { stars: 0, forks: 0, repos: 0, commits_year: 0 },
    topRepos: [],
    languages: [],
    contributions: { total: 0, weeks: [] },
    fetchedAt: new Date().toISOString(),
    source: "fallback",
  };
}
