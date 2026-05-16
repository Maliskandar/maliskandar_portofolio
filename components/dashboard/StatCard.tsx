"use client";

import { motion } from "framer-motion";
import { IconType } from "react-icons";

type Props = {
  label: string;
  value: string | number;
  hint?: string;
  icon?: IconType;
  accent?: "primary" | "violet" | "amber" | "rose" | "emerald";
  delay?: number;
};

const accentMap: Record<NonNullable<Props["accent"]>, string> = {
  primary: "from-primary/30 to-cyan-500/0 text-primary",
  violet: "from-violet-500/30 to-violet-500/0 text-violet-300",
  amber: "from-amber-500/30 to-amber-500/0 text-amber-300",
  rose: "from-rose-500/30 to-rose-500/0 text-rose-300",
  emerald: "from-emerald-500/30 to-emerald-500/0 text-emerald-300",
};

export default function StatCard({ label, value, hint, icon: Icon, accent = "primary", delay = 0 }: Props) {
  const accentCls = accentMap[accent];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm hover:border-white/20 transition-colors group"
    >
      <div className={`pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full bg-gradient-to-br opacity-60 blur-2xl ${accentCls}`} />
      <div className="relative z-10 flex items-start justify-between">
        <div>
          <div className="text-xs uppercase tracking-widest text-gray-500 font-mono">{label}</div>
          <div className="mt-2 text-3xl md:text-4xl font-black text-white tabular-nums">{value}</div>
          {hint && <div className="mt-1 text-[11px] text-gray-500">{hint}</div>}
        </div>
        {Icon && (
          <div className={`shrink-0 rounded-xl border border-white/10 bg-black/30 p-2.5 ${accentCls.split(" ")[2]}`}>
            <Icon size={18} />
          </div>
        )}
      </div>
    </motion.div>
  );
}
