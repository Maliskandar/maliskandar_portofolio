# Muhammad Akmal Iskandar Portfolio & Analytics Dashboard

A modern **next-generation portfolio website** featuring a **live analytics dashboard** that aggregates data from multiple sources: GitHub contribution activity, WakaTime coding statistics, and first-party website pageview tracking.

**[View Live Demo](https://portfolio.maliskandar.dev)** · **[Dashboard](https://portfolio.maliskandar.dev/dashboard)**

---

## 🚀 Tech Stack

| Layer | Technologies |
|-------|---|
| **Framework** | Next.js 16 (App Router) |
| **UI Library** | React 19 |
| **Styling** | Tailwind CSS 4 |
| **Animations** | Framer Motion |
| **Language** | TypeScript (strict mode) |
| **Database** | Upstash Redis (analytics) |
| **Icons** | react-icons/fi |
| **Deploy** | Vercel (recommended) |

---

## 📋 Quick Start

### Prerequisites
- Node.js 18.17+ 
- npm or yarn

### Installation

```bash
# Clone repository
git clone https://github.com/Maliskandar/maliskandar_portofolio.git
cd maliskandar_portofolio

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local
# → Edit .env.local with your values

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
- **Landing page:** `/`
- **Projects:** `/projects`
- **Dashboard:** `/dashboard`

---

## 🏗️ Project Structure

```
app/
├── page.tsx                    # Landing page (Hero, About, Bento, CTA)
├── projects/
│   └── page.tsx               # Projects grid / portfolio showcase
├── dashboard/
│   └── page.tsx               # Analytics dashboard (server component)
└── api/
    ├── github/route.ts        # GitHub API proxy endpoint
    ├── wakatime/route.ts      # WakaTime API proxy endpoint
    └── analytics/route.ts     # Analytics tracking (GET + POST)

lib/
├── github.ts                  # GitHub REST + GraphQL integration
├── wakatime.ts                # WakaTime stats fetcher
└── analytics.ts               # Upstash KV + file system fallback

components/
├── dashboard/
│   ├── GitHubPanel.tsx        # Repos, contribution heatmap, top languages
│   ├── WakaTimePanel.tsx      # Coding time, editors, projects (7d)
│   ├── AnalyticsPanel.tsx     # Pageviews, top pages, 14-day sparkline
│   ├── PageTracker.tsx        # Client-side page view tracker
│   ├── StatCard.tsx           # Reusable stat display component
│   └── LanguageBar.tsx        # Language percentage bar
└── [other components...]

styles/
├── globals.css
└── theme.css

public/
├── assets/                    # Images, SVGs
└── robots.txt

.env.example                   # Environment variables template
.env.local                     # (⚠️ Do NOT commit) Active environment vars
package.json
tsconfig.json
tailwind.config.ts
```

---

## ⚙️ Environment Variables

All configuration is managed via `.env.local`. Copy from `.env.example` and fill in your values:

### Required Variables

| Variable | Example | Purpose |
|----------|---------|---------|
| `GITHUB_USERNAME` | `Maliskandar` | Your GitHub username for profile data |

### Optional But Recommended

| Variable | Purpose | Get From |
|----------|---------|----------|
| `GITHUB_TOKEN` | Authenticate GitHub API calls; detects private repos | [github.com/settings/tokens](https://github.com/settings/tokens) |
| `WAKATIME_API_KEY` | Fetch your coding statistics | [wakatime.com/api-key](https://wakatime.com/api-key) |
| `KV_REST_API_URL` | **[Recommended for production]** Upstash Redis endpoint | [upstash.com](https://upstash.com) |
| `KV_REST_API_TOKEN` | **[Recommended for production]** Upstash Redis token | [upstash.com](https://upstash.com) |

### Example `.env.local`

```bash
GITHUB_USERNAME=Maliskandar
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
WAKATIME_API_KEY=waka_xxxxxxxxxxxxxxxxxxxxxxxx
KV_REST_API_URL=https://xxxxxx.upstash.io
KV_REST_API_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 🔐 Security Notes

⚠️ **Never commit `.env.local` to version control.**

### Token Rotation Reminder

If you've exposed any tokens in chat history or public logs, immediately rotate them:

- **GitHub PAT:** [github.com/settings/tokens](https://github.com/settings/tokens) → Delete old token → Create new fine-grained token
- **WakaTime API Key:** [wakatime.com/api-key](https://wakatime.com/api-key) → Regenerate
- **Upstash Redis:** [upstash.com/console](https://upstash.com/console) → Regenerate REST tokens

### GitHub Token Permissions

For full functionality (detecting private repos), ensure your fine-grained PAT has:
- **Repository access:** All repositories
- **Permissions:**
  - Repository → Metadata: Read-only
  - Repository → Contents: Read-only

---

## 📊 Dashboard Data Sources

### 1. **GitHub Panel**
- Public & private repository count (with badges)
- Contribution heatmap (last 52 weeks)
- Top programming languages by usage
- Updates every **1 hour**

### 2. **WakaTime Panel**
- Coding time (last 7 days)
- Top editors
- Top projects
- Updates every **30 minutes**

### 3. **Analytics Panel**
- Total pageviews (realtime)
- Top pages (by traffic)
- 14-day pageview sparkline chart
- Visitor tracking (first-party via Upstash KV)
- Real-time updates

---

## 🛠️ Setup Guide: Upstash Redis (Analytics Storage)

Without Upstash, analytics data resets on every cold start in production. For persistent tracking:

### Step 1: Create Upstash Account
1. Go to [upstash.com](https://upstash.com) → Sign up (free tier available)
2. Create a new **Redis database**
   - Region: **Singapore** (or closest to you)
   - Tier: **Free**

### Step 2: Get REST API Credentials
1. Open your Redis database in Upstash console
2. Click **"REST API"** tab
3. Copy:
   - `UPSTASH_REDIS_REST_URL` → `KV_REST_API_URL` in `.env.local`
   - `UPSTASH_REDIS_REST_TOKEN` → `KV_REST_API_TOKEN` in `.env.local`

### Step 3: Test Locally
```bash
npm run dev
# Open http://localhost:3000/dashboard and click around

# Verify analytics backend is using Upstash (not file fallback):
curl http://localhost:3000/api/analytics
# Should return: { "backend": "upstash", ... }
```

---

## 🚀 Deploy to Vercel

### Step 1: Push to GitHub
```bash
git add .
git commit -m "ready for deployment"
git push origin main
```

### Step 2: Import to Vercel
1. Go to [vercel.com/new](https://vercel.com/new)
2. Select this repository
3. Click **"Import"**

### Step 3: Add Environment Variables
In Vercel dashboard → **Project Settings → Environment Variables**, add all from `.env.local`:

```
GITHUB_USERNAME = Maliskandar
GITHUB_TOKEN = ghp_...
WAKATIME_API_KEY = waka_...
KV_REST_API_URL = https://...upstash.io
KV_REST_API_TOKEN = ...
```

### Step 4: Deploy
- **Automatic:** Every push to `main` deploys automatically
- **Manual:** Click **"Deploy"** button

---

## 🎨 Design System

### Color Palette
- **Background:** `#0a0a0a` (near-black)
- **Primary:** `#00f0ff` (cyan)
- **Secondary:** `#64748b` (slate-500)
- **Accent:** `#6366f1` (indigo)

### Animations
- **Framer Motion:** Smooth entrance/scroll animations (`whileInView`, `viewport={{ once: true }}`)
- **Tailwind 4 CSS:** Native gradient and opacity utilities
- **Duration:** 0.3–0.8s for UI transitions

### Theme
- **Mode:** Dark theme (no light mode toggle yet)
- **Styling Framework:** Tailwind CSS 4
- **Icons:** Feather icons (react-icons/fi)

---

## 📝 Code Conventions

When adding new features, follow these rules:

### Components
```typescript
// ✅ Server components by default (pages)
export default function Page() {
  const data = await fetch('...', { next: { revalidate: 3600 } });
  return <div>{/* ... */}</div>;
}

// ✅ Mark interactive components "use client"
'use client';
export function InteractiveWidget() { /* ... */ }
```

### Data Fetching
- **GitHub:** `revalidate: 3600` (1 hour)
- **WakaTime:** `revalidate: 1800` (30 minutes)
- **Analytics:** Real-time (POST to `/api/analytics`)

### Error Handling
```typescript
// ✅ Graceful fallback (no throw to UI)
try {
  const data = await fetch('...');
  return data;
} catch (error) {
  console.error(error);
  return { default: [], error: 'failed to fetch' };
}
```

### TypeScript
- **Mode:** `strict: true`
- **Rule:** No `any` types in new code
- **Interfaces:** Prefer over inline types for reusability

---

## 🤖 AI Integration: Continuing This Project

To continue development on this dashboard with Claude AI, copy this context block:

```text
## Portfolio Dashboard — Project Context for Claude

I'm continuing development on my Next.js portfolio with a live analytics dashboard.

### Files to Review First
- README.md (this file — structure + conventions)
- app/dashboard/page.tsx (server component, fetches GitHub + WakaTime + Analytics)
- lib/github.ts (GitHub REST + GraphQL integration)
- lib/wakatime.ts (WakaTime API fetcher)
- lib/analytics.ts (Upstash KV + file fallback)
- components/dashboard/* (UI panels)
- .env.local (local environment, DO NOT COMMIT)

### Development Rules
- Dark theme: bg-[#0a0a0a], primary cyan #00f0ff
- Server components for pages; "use client" only for interactives
- Tailwind 4 syntax (new gradient/opacity utils)
- Framer Motion for animations (whileInView, viewport once)
- Fetch with next.revalidate (GitHub 1h, WakaTime 30m)
- All lib helpers must have graceful fallback (no throw to UI)
- react-icons/fi for icons
- TypeScript strict; no any in new code
- DO NOT commit unless user asks

### Pending Tasks
1. **Setup Upstash Redis** — guide user to create free Redis instance
2. **Security check** — remind user to rotate exposed tokens (GitHub, WakaTime)
3. **GitHub PAT permissions** — verify fine-grained token has correct scopes
4. **Deployment** — test on Vercel with production environment vars
5. **Enhancements** (ask user first):
   - Spotify "now playing" widget
   - LinkedIn stats integration
   - Visitor heatmap / referrer breakdown
   - Export dashboard as PDF/image
   - Dark/light mode toggle
   - i18n EN/ID labels
   - Skeleton loaders during fetch
   - Dynamic og:image for /dashboard

### Next Step
Ask user: "What would you like to work on next — Upstash setup, deployment, security review, or a feature enhancement?"
```

---

## 📚 Resources

- **Next.js Docs:** [nextjs.org](https://nextjs.org)
- **Tailwind CSS 4:** [tailwindcss.com](https://tailwindcss.com)
- **Framer Motion:** [framer.com/motion](https://www.framer.com/motion/)
- **GitHub API:** [docs.github.com/rest](https://docs.github.com/rest)
- **WakaTime API:** [wakatime.com/developers](https://wakatime.com/developers)
- **Upstash Redis:** [upstash.com/docs](https://upstash.com/docs)
- **Vercel Deployment:** [vercel.com/docs](https://vercel.com/docs)

---

## 📄 License

This project is open-sourced under the **MIT License**. See [LICENSE](LICENSE) file for details.

---

## 👨‍💻 About

Built by **Muhammad Akmal Iskandar** — a full-stack developer passionate about building beautiful, data-driven web experiences.

- **GitHub:** [@Maliskandar](https://github.com/Maliskandar)
- **Website:** [portfolio.maliskandar.dev](https://portfolio.maliskandar.dev)
- **Email:** [Contact](mailto:contact@maliskandar.dev)

---

## 🤝 Contributing

Found a bug or have an idea? Contributions are welcome!

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

**Last Updated:** May 2026 | Made with ❤️ using Next.js & Tailwind CSS
