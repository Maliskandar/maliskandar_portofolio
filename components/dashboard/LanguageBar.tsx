"use client";

import { motion } from "framer-motion";

export type LangSegment = {
  name: string;
  percentage: number;
};

const COLORS = [
  "#00f0ff", "#a78bfa", "#f472b6", "#fbbf24",
  "#34d399", "#60a5fa", "#fb7185", "#facc15",
];

export default function LanguageBar({ items, label }: { items: LangSegment[]; label?: string }) {
  if (!items.length) {
    return (
      <div className="text-sm text-gray-500 italic">No language data available.</div>
    );
  }
  return (
    <div>
      {label && <div className="text-xs uppercase tracking-widest text-gray-500 font-mono mb-3">{label}</div>}
      <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-white/5">
        {items.map((item, i) => (
          <motion.div
            key={item.name}
            initial={{ width: 0 }}
            whileInView={{ width: `${item.percentage}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 * i, ease: [0.16, 1, 0.3, 1] }}
            style={{ backgroundColor: COLORS[i % COLORS.length] }}
            title={`${item.name} ${item.percentage.toFixed(1)}%`}
          />
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
        {items.map((item, i) => (
          <div key={item.name} className="flex items-center gap-2 text-xs">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: COLORS[i % COLORS.length] }}
            />
            <span className="text-gray-300 font-medium">{item.name}</span>
            <span className="text-gray-500 tabular-nums">{item.percentage.toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
