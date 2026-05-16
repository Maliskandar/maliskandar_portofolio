"use client";

import { motion } from "framer-motion";
import { FiEye, FiLayers, FiTrendingUp } from "react-icons/fi";
import { AnalyticsSnapshot } from "@/lib/analytics";
import StatCard from "./StatCard";

function Sparkline({ days }: { days: AnalyticsSnapshot["recentDays"] }) {
  const max = Math.max(1, ...days.map((d) => d.views));
  return (
    <div className="flex items-end gap-1.5 h-32">
      {days.map((d, i) => {
        const h = (d.views / max) * 100;
        return (
          <motion.div
            key={d.date}
            initial={{ height: 0 }}
            whileInView={{ height: `${Math.max(h, 2)}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.03 * i, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 min-w-0 rounded-t-md bg-gradient-to-t from-primary/40 to-primary relative group cursor-pointer"
          >
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-black/80 border border-white/10 text-[10px] text-white font-mono px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              {d.views} · {d.date.slice(5)}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export default function AnalyticsPanel({ data }: { data: AnalyticsSnapshot }) {
  const total = data.totalViews;
  const last14 = data.recentDays.reduce((s, d) => s + d.views, 0);
  const dailyAvg = (last14 / Math.max(data.recentDays.length, 1)).toFixed(1);

  return (
    <section className="space-y-6">
      <header>
        <div className="text-xs uppercase tracking-widest text-emerald-300 font-mono mb-1">{"// section 03"}</div>
        <h2 className="text-3xl md:text-4xl font-black tracking-tight">Website Analytics</h2>
        <p className="text-gray-400 text-sm mt-1">
          First-party pageview tracking for this portfolio.
          {total === 0 && <span className="ml-2 text-amber-400">· collecting data — visit a few pages to populate</span>}
        </p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard label="Total Views" value={total} icon={FiEye} accent="primary" delay={0} />
        <StatCard label="Tracked Pages" value={data.uniquePaths} icon={FiLayers} accent="violet" delay={0.05} />
        <StatCard label="Daily Avg (14d)" value={dailyAvg} icon={FiTrendingUp} accent="emerald" delay={0.1} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/[0.03] p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white">Views — last 14 days</h3>
            <span className="text-[10px] text-gray-500 font-mono uppercase">hover bars</span>
          </div>
          <Sparkline days={data.recentDays} />
          <div className="mt-3 flex justify-between text-[10px] text-gray-500 font-mono">
            <span>{data.recentDays[0]?.date.slice(5)}</span>
            <span>{data.recentDays[data.recentDays.length - 1]?.date.slice(5)}</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
        >
          <h3 className="font-bold text-white mb-4">Top Pages</h3>
          {data.topPages.length === 0 ? (
            <div className="text-xs text-gray-500 italic">No data yet.</div>
          ) : (
            <ul className="space-y-3">
              {data.topPages.map((p) => (
                <li key={p.path} className="flex items-center justify-between gap-3 text-sm">
                  <span className="font-mono text-gray-300 truncate">{p.path}</span>
                  <span className="text-primary font-bold tabular-nums">{p.views}</span>
                </li>
              ))}
            </ul>
          )}
        </motion.div>
      </div>
    </section>
  );
}
