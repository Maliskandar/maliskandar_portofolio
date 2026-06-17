"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { FiStar, FiGitBranch, FiFolder, FiActivity, FiExternalLink, FiUsers, FiLock, FiGlobe } from "react-icons/fi";
import { GitHubStats } from "@/lib/github";
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

function ContributionGrid({ weeks }: { weeks: GitHubStats["contributions"]["weeks"] }) {
  if (!weeks.length) {
    return <div className="text-sm text-gray-500 italic">Contribution graph unavailable.</div>;
  }
  const colors = ["#1a1a1a", "#0e3d4e", "#0a6b7a", "#0aa2b8", "#00f0ff"];
  return (
    <div className="overflow-x-auto">
      <div className="inline-flex gap-[3px] py-1">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            {Array.from({ length: 7 }).map((_, di) => {
              const day = week[di];
              if (!day) return <div key={di} className="h-[10px] w-[10px]" />;
              return (
                <div
                  key={di}
                  title={`${day.date}: ${day.count} contributions`}
                  className="h-[10px] w-[10px] rounded-[2px] border border-white/5"
                  style={{ backgroundColor: colors[day.level] }}
                />
              );
            })}
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2 text-[10px] text-gray-500 font-mono">
        <span>Less</span>
        {colors.map((c, i) => (
          <span key={i} className="h-[10px] w-[10px] rounded-[2px] border border-white/5" style={{ backgroundColor: c }} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}

export default function GitHubPanel({ data }: { data: GitHubStats }) {
  const { profile, totals, topRepos, languages, contributions, source } = data;
  return (
    <section className="space-y-8">
      <header className="flex items-end justify-between gap-4 flex-wrap border-l-2 border-primary/40 pl-5">
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
          className="inline-flex items-center gap-2 text-xs px-4 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
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
        <StatCard label="Public" value={totals.publicRepos} icon={FiGlobe} accent="emerald" delay={0.05} />
        <StatCard label="Private" value={totals.privateRepos} icon={FiLock} accent="rose" delay={0.1} hint={data.authenticated ? undefined : "auth required"} />
        <StatCard label="Total Stars" value={totals.stars} icon={FiStar} accent="amber" delay={0.15} />
        <StatCard
          label="Contribs (1y)"
          value={totals.commits_year}
          icon={FiActivity}
          accent="violet"
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
        className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
      >
        <div className="flex items-start justify-between mb-4 gap-4 flex-wrap">
          <div>
            <h3 className="font-bold text-white">Contribution Graph</h3>
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
            <div className="text-xs text-gray-300 tabular-nums font-medium">
              {contributions.total} contributions last year
            </div>
            {data.authenticated && totals.private_commits_year > 0 && (
              <div className="text-[11px] text-gray-500 tabular-nums mt-0.5">
                {totals.public_commits_year} public · <span className="text-rose-300">{totals.private_commits_year} private</span>
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
              className={`group block rounded-2xl border p-5 transition-all ${r.private
                ? "border-rose-500/20 bg-rose-500/[0.03] hover:border-rose-400/40"
                : "border-white/10 bg-white/[0.03] hover:border-primary/40 hover:bg-white/[0.05]"
                }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  {r.private ? (
                    <FiLock className="text-rose-300 shrink-0" size={14} />
                  ) : (
                    <FiGlobe className="text-emerald-300 shrink-0" size={14} />
                  )}
                  <div className={`font-bold text-white truncate transition-colors ${r.private ? "group-hover:text-rose-300" : "group-hover:text-primary"}`}>
                    {r.name}
                  </div>
                </div>
                <FiExternalLink className={`shrink-0 ${r.private ? "text-rose-300/60 group-hover:text-rose-300" : "text-gray-500 group-hover:text-primary"}`} />
              </div>
              <div className="mt-2 flex items-center gap-2">
                <span
                  className={`inline-block text-[9px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded ${r.private
                    ? "bg-rose-500/15 text-rose-300 border border-rose-500/30"
                    : "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                    }`}
                >
                  {r.private ? "Private" : "Public"}
                </span>
                {r.archived && (
                  <span className="text-[9px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
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
                    <span className={`h-2 w-2 rounded-full ${r.private ? "bg-rose-400" : "bg-primary"}`} />
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
