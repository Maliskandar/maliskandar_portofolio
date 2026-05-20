# Muhammad Akmal Iskandar — Portfolio CV

Personal portfolio site with a **live analytics dashboard** that pulls real data from GitHub, WakaTime, and first‑party pageview tracking.

Stack: **Next.js 16 (App Router) · React 19 · Tailwind 4 · Framer Motion · TypeScript**

## Quick Start

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Dashboard di [/dashboard](http://localhost:3000/dashboard).

## Project Structure (yang penting)

```
app/
├── page.tsx                 # landing (Hero, About, Bento, dst)
├── projects/page.tsx        # daftar semua project
├── dashboard/page.tsx       # server component, fetch 3 sumber paralel
└── api/
    ├── github/route.ts
    ├── wakatime/route.ts
    └── analytics/route.ts   # GET stats + POST track

lib/
├── github.ts                # GitHub REST + GraphQL (auth-aware)
├── wakatime.ts              # WakaTime stats fetcher
└── analytics.ts             # Upstash KV + file fallback

components/dashboard/
├── GitHubPanel.tsx          # repos (public + private badge), heatmap, top langs
├── WakaTimePanel.tsx        # coding time 7d, editors, projects
├── AnalyticsPanel.tsx       # pageviews, top pages, 14d sparkline
├── PageTracker.tsx          # client tracker (POST /api/analytics on mount)
├── StatCard.tsx
└── LanguageBar.tsx
```

## Env Vars

Lihat [.env.example](.env.example) untuk daftar lengkap. Yang wajib:

| Variable | Default | Catatan |
|---|---|---|
| `GITHUB_USERNAME` | `Maliskandar` | Username GitHub |
| `GITHUB_TOKEN` | *(opsional)* | Fine‑grained PAT; tanpa ini repo private tidak terdeteksi |
| `WAKATIME_API_KEY` | *(opsional)* | https://wakatime.com/api-key |
| `KV_REST_API_URL` | *(opsional)* | Upstash Redis REST URL — wajib utk produksi |
| `KV_REST_API_TOKEN` | *(opsional)* | Upstash Redis REST token |

---

## Continue This Project — Prompt untuk Claude

Copy seluruh blok di bawah dan paste ke percakapan Claude baru (di working directory project ini) untuk melanjutkan pekerjaan dashboard.

```text
Konteks: Saya melanjutkan proyek portfolio Next.js dengan halaman /dashboard
yang menampilkan analytics GitHub, WakaTime, dan pageview website.
Baca dulu file2 ini supaya paham state-nya:

- README.md (ringkasan + struktur)
- app/dashboard/page.tsx (entry point, server component fetch 3 sumber paralel)
- lib/github.ts (REST + GraphQL contributions, auth-aware via GITHUB_TOKEN)
- lib/wakatime.ts (last_7_days endpoint)
- lib/analytics.ts (Upstash REST + file fallback, env: KV_REST_API_URL/TOKEN)
- components/dashboard/* (UI panels)
- .env.local (env aktif, jangan commit)

Convention yang harus dijaga:
- Dark theme: bg-[#0a0a0a] / bg-dark, primary = cyan (#00f0ff)
- Server components untuk page; mark "use client" hanya yang interaktif
- Tailwind 4 syntax (gradient & opacity utilities baru)
- Framer Motion untuk animasi (whileInView, viewport once)
- Fetch dengan next.revalidate (GitHub 1h, WakaTime 30m)
- Semua lib helper harus punya graceful fallback (jangan throw ke UI)
- Pakai react-icons/fi untuk icon
- TypeScript strict; jangan ada any di code baru
- TIDAK boleh commit kecuali user minta

Tugas berikutnya yang masih pending (kerjakan sesuai prioritas user):

1. [SETUP — user side] Bantu user setup Upstash Redis:
   - Cek apakah KV_REST_API_URL & KV_REST_API_TOKEN sudah ada di .env.local
   - Kalau belum, kasih instruksi step-by-step (daftar di upstash.com,
     create Redis db region Singapore, copy 2 nilai REST API)
   - Test dengan: curl http://localhost:3000/api/analytics — cek field
     "backend" harus "upstash" bukan "file"

2. [SECURITY] Token GitHub & WakaTime yang ada di .env.local sebelumnya
   pernah ter-expose di chat history. Tanya user apakah sudah di-rotate.
   Kalau belum, kasih reminder + link:
   - https://github.com/settings/tokens
   - https://wakatime.com/api-key

3. [GitHub fine-grained PAT permission] Kalau jumlah private repo di
   dashboard 0 padahal user punya private repo, kemungkinan PAT permission
   kurang. Cek permission yang dibutuhkan:
   - Repository access: All repositories
   - Permissions → Repository → Metadata: Read-only + Contents: Read-only

4. [Deploy ke Vercel] Kalau user belum deploy:
   - Pastikan semua env var di .env.local di-mirror di Vercel Project Settings
   - Add @vercel/analytics juga sebagai second layer (optional)
   - Test /dashboard di production URL

5. [Ide enhancement, tanyakan dulu sebelum mengerjakan]:
   - Spotify "now playing" widget (Spotify API + refresh token flow)
   - LinkedIn post stats (lewat Phantombuster atau scraping manual)
   - Visitor heatmap / referrer breakdown (perlu extend lib/analytics.ts)
   - Export dashboard sebagai PDF/image untuk CV
   - Dark/light mode toggle
   - i18n EN/ID untuk dashboard labels
   - Skeleton loader saat fetch (sekarang langsung render server-side)
   - SEO: og:image dinamis untuk /dashboard pakai @vercel/og

Mulai dengan menanyakan: "Mau lanjut yang mana — setup Upstash, deploy,
atau salah satu enhancement?" — jangan langsung mulai sampai user pilih.
```

---

## Deploy on Vercel

1. Push ke GitHub
2. Import di [vercel.com/new](https://vercel.com/new)
3. Tambah semua env var dari `.env.local` di **Project Settings → Environment Variables**
4. Deploy

**Penting:** tanpa Upstash KV, data analytics akan reset setiap cold start di Vercel (file system serverless ephemeral).
