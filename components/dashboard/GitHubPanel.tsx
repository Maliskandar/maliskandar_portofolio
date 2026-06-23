"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { FiStar, FiGitBranch, FiFolder, FiActivity, FiExternalLink, FiUsers, FiLock, FiGlobe } from "react-icons/fi";
import { GitHubStats, ContributionDay } from "@/lib/github";
import StatCard from "./StatCard";
import LanguageBar from "./LanguageBar";

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const d = Math.floor(diff / 86400_000);
  if (d <= 0) return "today";
  if (d === 1) return "1 day ago";
  if (d < 30) return `${d} days ago`;
  const m = Math.floor(d / 30);
  if (m < 12) return `${m} mo ago`;
  return `${Math.floor(m / 12)} yr ago`;
}

const HEAT_LEVELS = ["rgba(255,255,255,0.05)", "#0e4a5e", "#0a7e96", "#0fb6d6", "#22d3ee"];

/** Interactive contribution heatmap with month labels + hover tooltip */
function ContributionGrid({ weeks }: { weeks: GitHubStats["contributions"]["weeks"] }) {
  const [hover, setHover] = useState<{ wi: number; di: number; day: ContributionDay } | null>(null);

  if (!weeks.length) {
    return <div className="text-sm text-gray-500 italic">Contribution graph unavailable.</div>;
  }

  const CELL = 11;
  const GAP = 3;
  const PITCH = CELL + GAP;
  const LABEL_H = 16;

  const monthLabels = weeks.map((week, wi) => {
    const first = week.find(Boolean);
    if (!first) return null;
    const m = new Date(first.date + "T00:00:00").getMonth();
    const prev = weeks[wi - 1]?.find(Boolean);
    const pm = prev ? new Date(prev.date + "T00:00:00").getMonth() : -1;
    return m !== pm ? new Date(first.date + "T00:00:00").toLocaleString("en", { month: "short" }) : null;
  });

  return (
    <div className="overflow-x-auto pt-1 pb-1">
      <div className="relative inline-block" style={{ minWidth: weeks.length * PITCH }}>
        {/* Month labels */}
        <div className="flex" style={{ gap: GAP, height: LABEL_H }}>
          {weeks.map((_, wi) => (
            <div key={wi} className="relative" style={{ width: CELL }}>
              {monthLabels[wi] && (
                <span className="absolute left-0 top-0 text-[9px] text-gray-500 font-mono whitespace-nowrap">
                  {monthLabels[wi]}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="flex" style={{ gap: GAP }}>
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col" style={{ gap: GAP }}>
              {Array.from({ length: 7 }).map((_, di) => {
                const day = week[di];
                if (!day) return <div key={di} style={{ width: CELL, height: CELL }} />;
                const isHover = hover?.wi === wi && hover?.di === di;
                return (
                  <div
                    key={di}
                    onMouseEnter={() => setHover({ wi, di, day })}
                    onMouseLeave={() => setHover(null)}
                    style={{ width: CELL, height: CELL, backgroundColor: HEAT_LEVELS[day.level] }}
                    className={`rounded-[2px] border transition-transform duration-150 ${isHover ? "border-white/70 scale-[1.35] relative z-10" : "border-white/5"}`}
                  />
                );
              })}
            </div>
          ))}
        </div>

        {/* Tooltip */}
        {hover && (
          <div
            className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-full"
            style={{ left: hover.wi * PITCH + CELL / 2, top: LABEL_H + hover.di * PITCH - 4 }}
          >
            <div className="rounded-md border border-white/10 bg-black/85 backdrop-blur px-2.5 py-1.5 shadow-xl whitespace-nowrap">
              <div className="text-[11px] font-bold text-white tabular-nums">
                {hover.day.count} contribution{hover.day.count === 1 ? "" : "s"}
              </div>
              <div className="text-[9px] text-gray-400 font-mono">{hover.day.date}</div>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="mt-3 flex items-center gap-1.5 text-[10px] text-gray-500 font-mono">
          <span>Less</span>
          {HEAT_LEVELS.map((c, i) => (
            <span key={i} className="rounded-[2px] border border-white/5" style={{ width: CELL, height: CELL, backgroundColor: c }} />
          ))}
          <span>More</span>
        </div>
      </div>
    </div>
  );
}

export default function GitHubPanel({ data }: { data: GitHubStats }) {
  const { profile, totals, topRepos, languages, contributions, source } = data;
  return (
    <section className="space-y-8">
      <header className="flex items-end justify-between gap-4 flex-wrap border-l-2 border-primary/50 pl-5">
        <div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-none">
            What I&apos;m shipping.
          </h2>
          <p className="text-gray-400 text-base mt-3 max-w-2xl leading-relaxed">
            Public side of{" "}
            <a href={profile.html_url} target="_blank" rel="noreferrer" className="text-primary hover:underline font-medium">
              @{profile.login}
            </a>
            {" "}{totals.repos} repos, {totals.stars} stars, and whatever I committed in the last year.
            {source === "fallback" && <span className="ml-2 text-amber-400">· using fallback data</span>}
          </p>
        </div>
        <a
          href={profile.html_url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-xs px-4 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-primary hover:text-dark hover:border-primary transition-colors"
        >
          View Profile <FiExternalLink />
        </a>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard
          label="Total Repos"
          value={totals.repos}
          hint={data.authenticated ? `${totals.publicRepos} public · ${totals.privateRepos} private` : "public only"}
          icon={FiFolder}
          accent="primary"
          delay={0}
        />
        <StatCard label="Public" value={totals.publicRepos} icon={FiGlobe} accent="sky" delay={0.05} />
        <StatCard label="Private" value={totals.privateRepos} icon={FiLock} accent="slate" delay={0.1} hint={data.authenticated ? undefined : "auth required"} />
        <StatCard label="Total Stars" value={totals.stars} icon={FiStar} accent="blue" delay={0.15} />
        <StatCard
          label="Contribs (1y)"
          value={totals.commits_year}
          icon={FiActivity}
          accent="primary"
          delay={0.2}
          hint={
            data.authenticated && totals.private_commits_year > 0
              ? `${totals.public_commits_year} public · ${totals.private_commits_year} private`
              : data.authenticated
                ? "public only — enable in settings"
                : "public only"
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-1 rounded-2xl border border-white/10 bg-white/[0.03] p-6"
        >
          <div className="flex items-center gap-4">
            <Image
              src={profile.avatar_url}
              alt={profile.login}
              width={64}
              height={64}
              className="rounded-2xl border border-white/10"
              unoptimized
            />
            <div className="min-w-0">
              <div className="font-bold text-white truncate">{profile.name || profile.login}</div>
              <div className="text-xs text-gray-400 font-mono truncate">@{profile.login}</div>
            </div>
          </div>
          {profile.bio && <p className="text-gray-400 text-sm mt-4 leading-relaxed">{profile.bio}</p>}
          <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-gray-300">
              <FiUsers className="text-primary" /> {profile.followers} followers
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <FiUsers className="text-gray-500" /> {profile.following} following
            </div>
          </div>
          {profile.location && (
            <div className="mt-3 text-xs text-gray-500">📍 {profile.location}</div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/[0.03] p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white">Top Languages</h3>
            <span className="text-[10px] text-gray-500 font-mono uppercase">by bytes</span>
          </div>
          <LanguageBar items={languages.map((l) => ({ name: l.name, percentage: l.percentage }))} />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-6"
      >
        <div className="flex items-start justify-between mb-4 gap-4 flex-wrap">
          <div>
            <h3 className="font-bold text-white text-lg flex items-center gap-2">
              <FiActivity className="text-primary" /> Contribution Graph
            </h3>
            {data.authenticated && totals.private_commits_year === 0 && (
              <p className="text-[11px] text-amber-400/80 mt-1 max-w-md">
                Private contributions tidak muncul di kotak. Aktifkan di{" "}
                <a
                  href="https://github.com/settings/profile"
                  target="_blank"
                  rel="noreferrer"
                  className="underline hover:text-amber-300"
                >
                  GitHub Settings → Profile
                </a>
                {" "}→ centang &quot;Include private contributions on my profile&quot;.
              </p>
            )}
          </div>
          <div className="text-right">
            <div className="text-2xl font-black text-white tabular-nums leading-none">{contributions.total}</div>
            <div className="text-[10px] uppercase tracking-widest text-gray-500 font-mono mt-1">contributions · 1y</div>
            {data.authenticated && totals.private_commits_year > 0 && (
              <div className="text-[11px] text-gray-500 tabular-nums mt-1">
                {totals.public_commits_year} public · <span className="text-slate-300">{totals.private_commits_year} private</span>
              </div>
            )}
          </div>
        </div>
        <ContributionGrid weeks={contributions.weeks} />
      </motion.div>

      <div>
        <h3 className="font-bold text-white mb-4">Top Repositories</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topRepos.length === 0 && (
            <div className="text-sm text-gray-500 italic col-span-full">No repositories to show.</div>
          )}
          {topRepos.map((r, i) => (
            <motion.a
              key={r.id}
              href={r.html_url}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.05 * i }}
              whileHover={{ y: -4 }}
              className={`group block rounded-2xl border p-5 transition-colors ${r.private
                ? "border-slate-500/20 bg-slate-500/[0.04] hover:border-slate-400/40"
                : "border-white/10 bg-white/[0.03] hover:border-primary/40 hover:bg-white/[0.05]"
                }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  {r.private ? (
                    <FiLock className="text-slate-300 shrink-0" size={14} />
                  ) : (
                    <FiGlobe className="text-primary shrink-0" size={14} />
                  )}
                  <div className={`font-bold text-white truncate transition-colors ${r.private ? "group-hover:text-slate-200" : "group-hover:text-primary"}`}>
                    {r.name}
                  </div>
                </div>
                <FiExternalLink className={`shrink-0 ${r.private ? "text-slate-300/60 group-hover:text-slate-200" : "text-gray-500 group-hover:text-primary"}`} />
              </div>
              <div className="mt-2 flex items-center gap-2">
                <span
                  className={`inline-block text-[9px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded ${r.private
                    ? "bg-slate-500/15 text-slate-300 border border-slate-500/30"
                    : "bg-primary/15 text-primary border border-primary/30"
                    }`}
                >
                  {r.private ? "Private" : "Public"}
                </span>
                {r.archived && (
                  <span className="text-[9px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded bg-white/5 text-gray-400 border border-white/10">
                    Archived
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-3 line-clamp-2 leading-relaxed min-h-[2lh]">
                {r.description || <span className="italic text-gray-600">No description</span>}
              </p>
              <div className="mt-4 flex items-center gap-4 text-[11px] text-gray-500 font-mono">
                {r.language && (
                  <span className="flex items-center gap-1.5">
                    <span className={`h-2 w-2 rounded-full ${r.private ? "bg-slate-400" : "bg-primary"}`} />
                    {r.language}
                  </span>
                )}
                <span className="flex items-center gap-1"><FiStar /> {r.stargazers_count}</span>
                <span className="flex items-center gap-1"><FiGitBranch /> {r.forks_count}</span>
                <span className="ml-auto">{timeAgo(r.updated_at)}</span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
