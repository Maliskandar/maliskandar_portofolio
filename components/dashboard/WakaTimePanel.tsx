"use client";

import { motion } from "framer-motion";
import { FiClock, FiCalendar, FiCode, FiZap, FiMonitor, FiCpu, FiLayers } from "react-icons/fi";
import { WakaStats, WakaItem, WakaDaySummary } from "@/lib/wakatime";
import StatCard from "./StatCard";

function formatRelativeDate(iso?: string | null): string {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "short" });
}

const PALETTE = [
  "#00f0ff", "#a78bfa", "#f472b6", "#fbbf24",
  "#34d399", "#60a5fa", "#fb7185", "#facc15",
];

function PercentRow({ items, color }: { items: WakaItem[]; color?: string }) {
  if (!items.length) {
    return <div className="text-xs text-gray-500 italic">No data yet.</div>;
  }
  return (
    <div className="space-y-2.5">
      {items.map((it, i) => (
        <div key={it.name + i}>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-gray-300 font-medium truncate pr-2">{it.name}</span>
            <span className="text-gray-500 font-mono tabular-nums shrink-0">
              {it.text || `${it.percent.toFixed(0)}%`}
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${it.percent}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.05 * i, ease: [0.16, 1, 0.3, 1] }}
              className="h-full rounded-full"
              style={{ backgroundColor: color ?? PALETTE[i % PALETTE.length] }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Donut chart inline SVG */
function DonutChart({ items, total, label }: { items: WakaItem[]; total: number; label?: string }) {
  if (!items.length || total === 0) {
    return <div className="text-xs text-gray-500 italic">No data yet.</div>;
  }
  const radius = 70;
  const circ = 2 * Math.PI * radius;
  let offset = 0;
  const segments = items.map((it, i) => {
    const frac = it.total_seconds / total;
    const dash = circ * frac;
    const seg = (
      <circle
        key={it.name}
        cx={90}
        cy={90}
        r={radius}
        fill="none"
        stroke={PALETTE[i % PALETTE.length]}
        strokeWidth={18}
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeDashoffset={-offset}
        transform="rotate(-90 90 90)"
      />
    );
    offset += dash;
    return seg;
  });

  return (
    <div className="flex items-center gap-5">
      <svg width={180} height={180} viewBox="0 0 180 180" className="shrink-0">
        <circle cx={90} cy={90} r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={18} />
        {segments}
        {label && (
          <text
            x={90}
            y={88}
            textAnchor="middle"
            className="fill-white font-bold"
            style={{ fontSize: 14 }}
          >
            {label}
          </text>
        )}
        <text
          x={90}
          y={108}
          textAnchor="middle"
          className="fill-gray-500"
          style={{ fontSize: 10 }}
        >
          7 DAYS
        </text>
      </svg>
      <div className="min-w-0 flex-1 space-y-1.5">
        {items.slice(0, 6).map((it, i) => (
          <div key={it.name} className="flex items-center gap-2 text-xs min-w-0">
            <span
              className="h-2.5 w-2.5 rounded-full shrink-0"
              style={{ backgroundColor: PALETTE[i % PALETTE.length] }}
            />
            <span className="text-gray-200 font-medium truncate">{it.name}</span>
            <span className="text-gray-500 font-mono tabular-nums ml-auto shrink-0">
              {it.percent.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Per-day area chart for coding activity */
function CodingActivityChart({ summaries }: { summaries: WakaDaySummary[] }) {
  if (!summaries.length || summaries.every((d) => d.total_seconds === 0)) {
    return (
      <div className="h-40 flex items-center justify-center text-xs text-gray-500 italic">
        No activity in the last 7 days.
      </div>
    );
  }
  const W = 700;
  const H = 160;
  const PAD = 8;
  const max = Math.max(...summaries.map((d) => d.total_seconds), 1);
  const stepX = (W - PAD * 2) / Math.max(summaries.length - 1, 1);

  const points = summaries.map((d, i) => {
    const x = PAD + i * stepX;
    const y = PAD + (H - PAD * 2) * (1 - d.total_seconds / max);
    return { x, y, d };
  });

  // Build smooth path (catmull-rom-ish via quadratic curves)
  let linePath = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cx = (prev.x + curr.x) / 2;
    linePath += ` Q ${cx} ${prev.y}, ${cx} ${(prev.y + curr.y) / 2} T ${curr.x} ${curr.y}`;
  }
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${H - PAD} L ${points[0].x} ${H - PAD} Z`;

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H + 24}`} className="w-full" preserveAspectRatio="none" style={{ minWidth: 600 }}>
        <defs>
          <linearGradient id="codeGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00f0ff" stopOpacity={0.45} />
            <stop offset="100%" stopColor="#00f0ff" stopOpacity={0} />
          </linearGradient>
        </defs>
        {/* baseline */}
        <line x1={PAD} x2={W - PAD} y1={H - PAD} y2={H - PAD} stroke="rgba(255,255,255,0.08)" />
        <motion.path
          d={areaPath}
          fill="url(#codeGrad)"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        />
        <motion.path
          d={linePath}
          stroke="#00f0ff"
          strokeWidth={2}
          fill="none"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: "easeInOut" }}
        />
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={3.5} fill="#0a0a0a" stroke="#00f0ff" strokeWidth={2} />
            <text x={p.x} y={H + 16} textAnchor="middle" fill="#6b7280" fontSize={10} fontFamily="monospace">
              {p.d.date.slice(5)}
            </text>
            <title>{`${p.d.date}: ${p.d.text}`}</title>
          </g>
        ))}
      </svg>
    </div>
  );
}

/** Weekday bar chart */
function WeekdaysChart({ weekdays }: { weekdays: WakaStats["weekdayDistribution"] }) {
  const max = Math.max(...weekdays.map((w) => w.total_seconds), 1);
  return (
    <div className="flex items-end gap-2 h-32">
      {weekdays.map((w, i) => {
        const h = (w.total_seconds / max) * 100;
        return (
          <div key={w.day} className="flex-1 flex flex-col items-center gap-2 group">
            <div className="relative w-full flex flex-col justify-end" style={{ height: 100 }}>
              <motion.div
                initial={{ height: 0 }}
                whileInView={{ height: `${Math.max(h, w.total_seconds > 0 ? 4 : 0)}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.05 * i, ease: [0.16, 1, 0.3, 1] }}
                className="w-full rounded-md bg-gradient-to-t from-violet-500/50 to-violet-400 relative cursor-pointer"
              >
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-black/80 border border-white/10 text-[10px] text-white font-mono px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {w.text}
                </div>
              </motion.div>
            </div>
            <div className="text-[10px] text-gray-500 font-mono">{w.day}</div>
          </div>
        );
      })}
    </div>
  );
}

export default function WakaTimePanel({ data }: { data: WakaStats }) {
  const isConnected = data.source === "live";
  const langTotal = data.languages.reduce((s, l) => s + l.total_seconds, 0);
  const editorTotal = data.editors.reduce((s, l) => s + l.total_seconds, 0);

  return (
    <section className="space-y-8">
      <header className="border-l-2 border-violet-400/40 pl-5">
        <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-none">
          Time at the editor.
        </h2>
        <p className="text-gray-400 text-base mt-3 max-w-2xl leading-relaxed">
          Where my last 7 days went — tracked from VSCode by WakaTime.
          {data.bestDay && (
            <>
              {" "}Most active on <span className="text-white">{formatRelativeDate(data.bestDay.date)}</span> ({data.bestDay.text}).
            </>
          )}
          {!isConnected && (
            <span className="ml-2 text-amber-400">
              · not connected (set <code className="font-mono text-xs bg-white/5 px-1.5 py-0.5 rounded">WAKATIME_API_KEY</code>)
            </span>
          )}
        </p>
      </header>

      {/* Top stat cards: Total 7d, Today, Daily Avg, Most Active */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total (7d)" value={data.totalText} icon={FiClock} accent="violet" delay={0} />
        <StatCard
          label="Today"
          value={data.today?.text || "0 mins"}
          icon={FiCalendar}
          accent="primary"
          delay={0.05}
        />
        <StatCard
          label="Daily Avg"
          value={data.dailyAverageText}
          hint="over 7 days"
          icon={FiZap}
          accent="emerald"
          delay={0.1}
        />
        <StatCard
          label="Most Active"
          value={data.bestDay ? data.bestDay.text : "—"}
          hint={data.bestDay?.date}
          icon={FiCode}
          accent="amber"
          delay={0.15}
        />
      </div>

      {/* Coding Activity chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-white">Coding Activity</h3>
          <span className="text-[10px] text-gray-500 font-mono uppercase">hover dots for time</span>
        </div>
        <CodingActivityChart summaries={data.dailySummaries} />
      </motion.div>

      {/* Languages + Editors as donuts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white flex items-center gap-2">
              <FiCode className="text-violet-300" /> Languages
            </h3>
            <span className="text-[10px] text-gray-500 font-mono uppercase">by time</span>
          </div>
          <DonutChart items={data.languages} total={langTotal} label={data.languages[0]?.name || ""} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white flex items-center gap-2">
              <FiLayers className="text-primary" /> Editors
            </h3>
            <span className="text-[10px] text-gray-500 font-mono uppercase">by time</span>
          </div>
          <DonutChart items={data.editors} total={editorTotal} label={data.editors[0]?.name || ""} />
        </motion.div>
      </div>

      {/* Weekdays + Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/[0.03] p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white">Weekdays</h3>
            <span className="text-[10px] text-gray-500 font-mono uppercase">last 7 days</span>
          </div>
          <WeekdaysChart weekdays={data.weekdayDistribution} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
        >
          <h3 className="font-bold text-white mb-4">Categories</h3>
          <PercentRow items={data.categories} color="#fbbf24" />
        </motion.div>
      </div>

      {/* OS + Machines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
        >
          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
            <FiMonitor className="text-rose-300" /> Operating Systems
          </h3>
          <PercentRow items={data.operatingSystems} color="#fb7185" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
        >
          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
            <FiCpu className="text-primary" /> Machines
          </h3>
          <PercentRow items={data.machines} color="#60a5fa" />
        </motion.div>
      </div>
    </section>
  );
}
