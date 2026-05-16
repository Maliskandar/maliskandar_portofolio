"use client";

import { motion } from "framer-motion";
import { FiClock, FiCalendar, FiCode, FiZap } from "react-icons/fi";
import { WakaStats } from "@/lib/wakatime";
import StatCard from "./StatCard";
import LanguageBar from "./LanguageBar";

function Bar({ items, color = "#a78bfa" }: { items: { name: string; percent: number; text: string }[]; color?: string }) {
  if (!items.length) {
    return <div className="text-xs text-gray-500 italic">No data.</div>;
  }
  return (
    <div className="space-y-2.5">
      {items.map((it, i) => (
        <div key={it.name + i}>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-gray-300 font-medium truncate pr-2">{it.name}</span>
            <span className="text-gray-500 font-mono tabular-nums shrink-0">{it.text || `${it.percent.toFixed(0)}%`}</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${it.percent}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.05 * i, ease: [0.16, 1, 0.3, 1] }}
              className="h-full rounded-full"
              style={{ backgroundColor: color }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function WakaTimePanel({ data }: { data: WakaStats }) {
  const isConnected = data.source === "live";
  return (
    <section className="space-y-6">
      <header>
        <div className="text-xs uppercase tracking-widest text-violet-300 font-mono mb-1">{"// section 02"}</div>
        <h2 className="text-3xl md:text-4xl font-black tracking-tight">Coding Time</h2>
        <p className="text-gray-400 text-sm mt-1">
          Tracked via WakaTime · last 7 days
          {!isConnected && (
            <span className="ml-2 text-amber-400">
              · not connected (set <code className="font-mono text-xs bg-white/5 px-1.5 py-0.5 rounded">WAKATIME_API_KEY</code> in .env)
            </span>
          )}
        </p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total (7d)" value={data.totalText} icon={FiClock} accent="violet" delay={0} />
        <StatCard label="Daily Avg" value={data.dailyAverageText} icon={FiCalendar} accent="primary" delay={0.05} />
        <StatCard
          label="Best Day"
          value={data.bestDay ? data.bestDay.text : "—"}
          hint={data.bestDay?.date}
          icon={FiZap}
          accent="amber"
          delay={0.1}
        />
        <StatCard label="Top Lang" value={data.languages[0]?.name || "—"} icon={FiCode} accent="emerald" delay={0.15} />
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
            <h3 className="font-bold text-white">Languages</h3>
            <span className="text-[10px] text-gray-500 font-mono uppercase">by time spent</span>
          </div>
          <LanguageBar items={data.languages.map((l) => ({ name: l.name, percentage: l.percent }))} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
        >
          <h3 className="font-bold text-white mb-4">Editors</h3>
          <Bar items={data.editors} color="#00f0ff" />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
        >
          <h3 className="font-bold text-white mb-4">Top Projects</h3>
          <Bar items={data.projects} color="#34d399" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
        >
          <h3 className="font-bold text-white mb-4">Operating Systems</h3>
          <Bar items={data.operatingSystems} color="#fb7185" />
        </motion.div>
      </div>
    </section>
  );
}
