const GITHUB_USERNAME = process.env.GITHUB_USERNAME || "Maliskandar";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

let tokenRejected = false;

function getHeaders(useAuth = true): Record<string, string> {
  const h: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "Maliskandar-Portfolio",
  };
  if (GITHUB_TOKEN && useAuth && !tokenRejected) {
    h.Authorization = `Bearer ${GITHUB_TOKEN}`;
  }
  return h;
}

export type GitHubProfile = {
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
  bio: string | null;
  followers: number;
  following: number;
  public_repos: number;
  total_private_repos?: number;
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
  private: boolean;
};

export type LanguageStat = { name: string; bytes: number; percentage: number };

export type ContributionDay = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 };

export type GitHubStats = {
  profile: GitHubProfile;
  totals: {
    stars: number;
    forks: number;
    repos: number;
    publicRepos: number;
    privateRepos: number;
    commits_year: number;
    public_commits_year: number;
    private_commits_year: number;
  };
  topRepos: GitHubRepo[];
  languages: LanguageStat[];
  contributions: {
    total: number;
    weeks: ContributionDay[][];
  };
  fetchedAt: string;
  source: "live" | "fallback";
  authenticated: boolean;
};

async function gh<T>(path: string, useAuth = true): Promise<T> {
  const reqHeaders = getHeaders(useAuth);
  let res = await fetch(`https://api.github.com${path}`, {
    headers: reqHeaders,
    next: { revalidate: 3600 },
  });

  // If token is invalid or expired (401 Bad credentials), fallback to public request
  if ((res.status === 401 || res.status === 403) && GITHUB_TOKEN && useAuth) {
    if (!tokenRejected) {
      console.warn(`[github] Token returned ${res.status} on ${path}. Falling back to unauthenticated public requests.`);
      tokenRejected = true;
    }
    const retrySep = path.includes("?") ? "&" : "?";
    res = await fetch(`https://api.github.com${path}${retrySep}_public=1`, {
      headers: getHeaders(false),
      next: { revalidate: 3600 },
    });
  }

  if (!res.ok) throw new Error(`GitHub ${path} -> ${res.status}`);
  return res.json() as Promise<T>;
}

async function fetchAllRepos(): Promise<GitHubRepo[]> {
  const all: GitHubRepo[] = [];
  const useUserEndpoint = Boolean(GITHUB_TOKEN && !tokenRejected);
  const basePath = useUserEndpoint
    ? `/user/repos?per_page=100&affiliation=owner&visibility=all&sort=updated`
    : `/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`;

  try {
    for (let page = 1; page <= 5; page++) {
      const sep = basePath.includes("?") ? "&" : "?";
      const batch = await gh<GitHubRepo[]>(`${basePath}${sep}page=${page}`);
      all.push(...batch);
      if (batch.length < 100) break;
    }
  } catch (err) {
    if (useUserEndpoint) {
      console.warn(`[github] /user/repos failed, falling back to public /users/${GITHUB_USERNAME}/repos`);
      tokenRejected = true;
      for (let page = 1; page <= 5; page++) {
        const batch = await gh<GitHubRepo[]>(
          `/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated&page=${page}`,
          false
        );
        all.push(...batch);
        if (batch.length < 100) break;
      }
    } else {
      throw err;
    }
  }
  return all;
}

async function fetchContributionsGraphQL(
  username: string
): Promise<(GitHubStats["contributions"] & { restrictedCount: number; publicCount: number }) | null> {
  if (!GITHUB_TOKEN || tokenRejected) return null;
  const query = `query($login:String!){
    user(login:$login){
      contributionsCollection{
        totalCommitContributions
        totalIssueContributions
        totalPullRequestContributions
        totalPullRequestReviewContributions
        restrictedContributionsCount
        contributionCalendar{
          totalContributions
          weeks{
            contributionDays{ date contributionCount contributionLevel }
          }
        }
      }
    }
  }`;
  try {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        "Content-Type": "application/json",
        "User-Agent": "Maliskandar-Portfolio",
      },
      body: JSON.stringify({ query, variables: { login: username } }),
      next: { revalidate: 3600 },
    });
    if (!res.ok) {
      if (res.status === 401) tokenRejected = true;
      return null;
    }
    const json = (await res.json()) as {
      data?: {
        user?: {
          contributionsCollection?: {
            totalCommitContributions: number;
            totalIssueContributions: number;
            totalPullRequestContributions: number;
            totalPullRequestReviewContributions: number;
            restrictedContributionsCount: number;
            contributionCalendar?: {
              totalContributions: number;
              weeks: { contributionDays: { date: string; contributionCount: number; contributionLevel: string }[] }[];
            };
          };
        };
      };
    };
    const cc = json.data?.user?.contributionsCollection;
    const cal = cc?.contributionCalendar;
    if (!cal || !cc) return null;
    const levelMap: Record<string, 0 | 1 | 2 | 3 | 4> = {
      NONE: 0, FIRST_QUARTILE: 1, SECOND_QUARTILE: 2, THIRD_QUARTILE: 3, FOURTH_QUARTILE: 4,
    };
    const weeks: ContributionDay[][] = cal.weeks.map((w) =>
      w.contributionDays.map((d) => ({
        date: d.date,
        count: d.contributionCount,
        level: levelMap[d.contributionLevel] ?? 0,
      }))
    );
    // Kalau "Include private contributions on my profile" aktif, cal.totalContributions
    // sudah include private. restrictedContributionsCount = subset private dari total itu.
    // Kalau setting OFF, cal.totalContributions = public-only, restricted di-expose
    // terpisah tapi tidak masuk kalender — jadi total real = public + private.
    const restricted = cc.restrictedContributionsCount;
    const calTotal = cal.totalContributions;
    // Heuristik: kalau calTotal >= restricted, asumsikan setting ON (private sudah dihitung).
    // Kalau calTotal < restricted, setting OFF — total real = calTotal + restricted.
    const total = calTotal >= restricted ? calTotal : calTotal + restricted;
    const publicCount = calTotal >= restricted ? calTotal - restricted : calTotal;
    return {
      total,
      weeks,
      restrictedCount: restricted,
      publicCount,
    };
  } catch {
    return null;
  }
}

async function fetchContributionsFallback(username: string): Promise<GitHubStats["contributions"]> {
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

    const allRepos = await fetchAllRepos();

    const ownRepos = allRepos.filter((r) => !r.fork);
    const publicOwn = ownRepos.filter((r) => !r.private);
    const privateOwn = ownRepos.filter((r) => r.private);
    const stars = ownRepos.reduce((s, r) => s + r.stargazers_count, 0);
    const forks = ownRepos.reduce((s, r) => s + r.forks_count, 0);

    const topRepos = [...ownRepos]
      .sort(
        (a, b) =>
          b.stargazers_count - a.stargazers_count ||
          +new Date(b.updated_at) - +new Date(a.updated_at)
      )
      .slice(0, 9);

    const langMap: Record<string, number> = {};
    const topForLang = [...ownRepos]
      .sort((a, b) => +new Date(b.updated_at) - +new Date(a.updated_at))
      .slice(0, 20);
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

    const gqlContrib = await fetchContributionsGraphQL(GITHUB_USERNAME);
    const contributions = gqlContrib ?? (await fetchContributionsFallback(GITHUB_USERNAME));
    const publicCommits = gqlContrib?.publicCount ?? contributions.total;
    const privateCommits = gqlContrib?.restrictedCount ?? 0;

    return {
      profile,
      totals: {
        stars,
        forks,
        repos: ownRepos.length,
        publicRepos: publicOwn.length,
        privateRepos: privateOwn.length,
        commits_year: contributions.total,
        public_commits_year: publicCommits,
        private_commits_year: privateCommits,
      },
      topRepos,
      languages,
      contributions,
      fetchedAt: new Date().toISOString(),
      source: "live",
      authenticated: Boolean(GITHUB_TOKEN && !tokenRejected),
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
    totals: { stars: 0, forks: 0, repos: 0, publicRepos: 0, privateRepos: 0, commits_year: 0, public_commits_year: 0, private_commits_year: 0 },
    topRepos: [],
    languages: [],
    contributions: { total: 0, weeks: [] },
    fetchedAt: new Date().toISOString(),
    source: "fallback",
    authenticated: false,
  };
}
