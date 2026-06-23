"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FiClock, FiCalendar, FiCode, FiZap, FiMonitor, FiCpu, FiLayers, FiActivity } from "react-icons/fi";
import { WakaStats, WakaItem, WakaDaySummary } from "@/lib/wakatime";
import StatCard from "./StatCard";

const DAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function formatRelativeDate(iso?: string | null): string {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "short" });
}

// Cohesive cyan → blue scale (keeps the dashboard on the site's white + blue theme)
const PALETTE = [
  "#22d3ee", "#06b6d4", "#0ea5e9", "#3b82f6",
  "#2563eb", "#38bdf8", "#0891b2", "#1d4ed8",
];

/** Measure an element's live width (for a crisp, responsive SVG chart). */
function useElementWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) setWidth(e.contentRect.width);
    });
    ro.observe(el);
    setWidth(el.clientWidth);
    return () => ro.disconnect();
  }, []);
  return [ref, width] as const;
}

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
  const dashes = items.map((it) => (it.total_seconds / total) * circ);
  const offsets = dashes.map((_, i) => dashes.slice(0, i).reduce((a, b) => a + b, 0));
  const segments = items.map((it, i) => (
    <circle
      key={it.name}
      cx={90}
      cy={90}
      r={radius}
      fill="none"
      stroke={PALETTE[i % PALETTE.length]}
      strokeWidth={18}
      strokeLinecap="round"
      strokeDasharray={`${dashes[i]} ${circ - dashes[i]}`}
      strokeDashoffset={-offsets[i]}
      transform="rotate(-90 90 90)"
    />
  ));

  return (
    <div className="flex items-center gap-5">
      <svg width={180} height={180} viewBox="0 0 180 180" className="shrink-0">
        <circle cx={90} cy={90} r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={18} />
        {segments}
        {label && (
          <text x={90} y={88} textAnchor="middle" className="fill-white font-bold" style={{ fontSize: 14 }}>
            {label}
          </text>
        )}
        <text x={90} y={108} textAnchor="middle" className="fill-gray-500" style={{ fontSize: 10 }}>
          7 DAYS
        </text>
      </svg>
      <div className="min-w-0 flex-1 space-y-1.5">
        {items.slice(0, 6).map((it, i) => (
          <div key={it.name} className="flex items-center gap-2 text-xs min-w-0">
            <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: PALETTE[i % PALETTE.length] }} />
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

/** Smooth Catmull-Rom → cubic Bézier path */
function smoothPath(pts: { x: number; y: number }[]): string {
  if (pts.length < 2) return pts.length ? `M ${pts[0].x} ${pts[0].y}` : "";
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

/** Modern, interactive per-day coding-activity area chart */
function CodingActivityChart({ summaries }: { summaries: WakaDaySummary[] }) {
  const [wrapRef, width] = useElementWidth<HTMLDivElement>();
  const [active, setActive] = useState<number | null>(null);

  const hasData = summaries.length > 0 && summaries.some((d) => d.total_seconds > 0);

  const H = 240;
  const padT = 22;
  const padB = 30;
  const padL = 40;
  const padR = 14;
  const chartW = Math.max(width - padL - padR, 1);
  const chartH = H - padT - padB;

  const n = summaries.length;
  const maxSec = Math.max(...summaries.map((d) => d.total_seconds), 1);
  const maxHours = Math.max(1, Math.ceil(maxSec / 3600));
  const niceMax = maxHours * 3600;
  const avgSec = n ? summaries.reduce((s, d) => s + d.total_seconds, 0) / n : 0;
  const todayIso = new Date().toISOString().slice(0, 10);

  const stepX = chartW / Math.max(n - 1, 1);
  const xFor = (i: number) => padL + i * stepX;
  const yFor = (sec: number) => padT + chartH * (1 - sec / niceMax);

  const points = summaries.map((d, i) => ({ x: xFor(i), y: yFor(d.total_seconds), d, i }));
  const linePath = smoothPath(points);
  const areaPath = points.length
    ? `${linePath} L ${points[points.length - 1].x} ${padT + chartH} L ${points[0].x} ${padT + chartH} Z`
    : "";

  const gridStep = Math.max(1, Math.ceil(maxHours / 4));
  const gridHours: number[] = [];
  for (let h = 0; h <= maxHours; h += gridStep) gridHours.push(h);

  const avgY = yFor(avgSec);

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const idx = Math.round((mx - padL) / stepX);
    setActive(idx >= 0 && idx < n ? idx : null);
  }

  if (!hasData) {
    return (
      <div className="h-40 flex items-center justify-center text-xs text-gray-500 italic">
        No activity in the last 7 days.
      </div>
    );
  }

  const activePoint = active != null ? points[active] : null;
  const tooltipLeft = activePoint ? Math.min(Math.max(activePoint.x, 56), Math.max(width - 56, 56)) : 0;

  return (
    <div
      ref={wrapRef}
      className="relative w-full select-none"
      style={{ height: H }}
      onMouseMove={handleMove}
      onMouseLeave={() => setActive(null)}
    >
      {width > 0 && (
        <svg width={width} height={H} className="block">
          <defs>
            <linearGradient id="wakaArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.4} />
              <stop offset="55%" stopColor="#3b82f6" stopOpacity={0.12} />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="wakaLine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
            <filter id="wakaGlow" x="-20%" y="-40%" width="140%" height="180%">
              <feGaussianBlur stdDeviation="4" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Gridlines + Y labels */}
          {gridHours.map((h) => {
            const gy = yFor(h * 3600);
            return (
              <g key={h}>
                <line x1={padL} x2={width - padR} y1={gy} y2={gy} stroke="rgba(255,255,255,0.06)" strokeDasharray="3 4" />
                <text x={padL - 8} y={gy + 3} textAnchor="end" fill="#4b5563" fontSize={10} fontFamily="monospace">
                  {h}h
                </text>
              </g>
            );
          })}

          {/* Average reference line */}
          {avgSec > 0 && (
            <g>
              <line x1={padL} x2={width - padR} y1={avgY} y2={avgY} stroke="#64748b" strokeWidth={1} strokeDasharray="2 4" opacity={0.7} />
              <text x={width - padR} y={avgY - 5} textAnchor="end" fill="#64748b" fontSize={9} fontFamily="monospace">
                avg
              </text>
            </g>
          )}

          {/* Area */}
          <motion.path
            d={areaPath}
            fill="url(#wakaArea)"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
          />

          {/* Line */}
          <motion.path
            d={linePath}
            stroke="url(#wakaLine)"
            strokeWidth={2.5}
            strokeLinecap="round"
            fill="none"
            filter="url(#wakaGlow)"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, ease: "easeInOut" }}
          />

          {/* Active vertical guide */}
          {activePoint && (
            <line x1={activePoint.x} x2={activePoint.x} y1={padT} y2={padT + chartH} stroke="rgba(34,211,238,0.35)" strokeWidth={1} />
          )}

          {/* Points */}
          {points.map((p) => {
            const isActive = active === p.i;
            const isToday = p.d.date === todayIso;
            return (
              <g key={p.i}>
                {isActive && <circle cx={p.x} cy={p.y} r={9} fill="#22d3ee" opacity={0.18} />}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isActive ? 5 : isToday ? 4 : 3}
                  fill="#0a0a0a"
                  stroke={isToday ? "#22d3ee" : "#38bdf8"}
                  strokeWidth={isActive ? 3 : 2}
                />
                <text
                  x={p.x}
                  y={H - 10}
                  textAnchor="middle"
                  fill={isToday ? "#22d3ee" : "#6b7280"}
                  fontSize={10}
                  fontFamily="monospace"
                  fontWeight={isToday ? 700 : 400}
                >
                  {DAY_SHORT[p.d.dayOfWeek]}
                </text>
              </g>
            );
          })}
        </svg>
      )}

      {/* Tooltip */}
      {activePoint && (
        <div
          className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-full"
          style={{ left: tooltipLeft, top: activePoint.y - 14 }}
        >
          <div className="rounded-lg border border-white/10 bg-black/85 backdrop-blur px-3 py-2 shadow-xl whitespace-nowrap">
            <div className="text-[10px] uppercase tracking-wider text-gray-400 font-mono">
              {formatRelativeDate(activePoint.d.date)}
            </div>
            <div className="text-sm font-bold text-white">{activePoint.d.text || "0 mins"}</div>
          </div>
        </div>
      )}
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
                className="w-full rounded-md bg-gradient-to-t from-blue-600/40 to-cyan-400 relative cursor-pointer"
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
      <header className="border-l-2 border-primary/50 pl-5">
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

      {/* Top stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total (7d)" value={data.totalText} icon={FiClock} accent="primary" delay={0} />
        <StatCard label="Today" value={data.today?.text || "0 mins"} icon={FiCalendar} accent="sky" delay={0.05} />
        <StatCard label="Daily Avg" value={data.dailyAverageText} hint="over 7 days" icon={FiZap} accent="blue" delay={0.1} />
        <StatCard label="Most Active" value={data.bestDay ? data.bestDay.text : "—"} hint={data.bestDay?.date} icon={FiCode} accent="primary" delay={0.15} />
      </div>

      {/* Coding Activity chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-6"
      >
        <div className="flex items-end justify-between gap-4 flex-wrap mb-5">
          <div>
            <h3 className="font-bold text-white text-lg flex items-center gap-2">
              <FiActivity className="text-primary" /> Coding Activity
            </h3>
            <p className="text-xs text-gray-500 mt-1">Daily focus time · last 7 days</p>
          </div>
          <div className="flex items-center gap-6 text-right">
            <div>
              <div className="text-2xl font-black text-white tabular-nums leading-none">{data.totalText}</div>
              <div className="text-[10px] uppercase tracking-widest text-gray-500 font-mono mt-1">total</div>
            </div>
            {data.bestDay && (
              <div className="hidden sm:block border-l border-white/10 pl-6">
                <div className="text-2xl font-black text-primary tabular-nums leading-none">{data.bestDay.text}</div>
                <div className="text-[10px] uppercase tracking-widest text-gray-500 font-mono mt-1">peak</div>
              </div>
            )}
          </div>
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
              <FiCode className="text-primary" /> Languages
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
              <FiLayers className="text-sky-300" /> Editors
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
          <PercentRow items={data.categories} color="#3b82f6" />
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
            <FiMonitor className="text-sky-300" /> Operating Systems
          </h3>
          <PercentRow items={data.operatingSystems} color="#0ea5e9" />
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
