"use client";

import React, { useRef, useState, useMemo } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
    FiCalendar, FiArrowUpRight, FiCode, FiDatabase,
    FiPenTool, FiBarChart2, FiAward, FiChevronDown, FiChevronUp
} from 'react-icons/fi';
import type { IconType } from 'react-icons';

type Category = "Programming" | "Database" | "Design" | "Data" | "Professional";

interface CategoryStyle {
    icon: IconType;
    color: string;
    label: string;
}

// Unified white + blue palette: cyan as the single accent across every category.
const ACCENT = "#06b6d4";

const categoryStyles: Record<Category, CategoryStyle> = {
    Programming: { icon: FiCode, color: ACCENT, label: "Programming" },
    Database: { icon: FiDatabase, color: ACCENT, label: "Database" },
    Design: { icon: FiPenTool, color: ACCENT, label: "Design" },
    Data: { icon: FiBarChart2, color: ACCENT, label: "Data Science" },
    Professional: { icon: FiAward, color: ACCENT, label: "Professional" },
};

interface Certification {
    id: number;
    title: string;
    issuer: string;
    date: string;
    category: Category;
    link: string;
}

const certifications: Certification[] = [
    {
        id: 1,
        title: "Android Application Development",
        issuer: "Dicoding Indonesia",
        date: "Jun 2024",
        category: "Programming",
        link: "https://drive.google.com/file/d/1voHs6JqULZicmLqgAod2x0LLeqxGcM7B/view?usp=sharing",
    },
    {
        id: 2,
        title: "SOLID Programming Principles",
        issuer: "Dicoding Indonesia",
        date: "May 2024",
        category: "Programming",
        link: "https://drive.google.com/file/d/1xShMw4-FSztO84NXLP59PRAtP05esCZg/view?usp=sharing",
    },
    {
        id: 3,
        title: "Getting Started with Kotlin",
        issuer: "Dicoding Indonesia",
        date: "Apr 2024",
        category: "Programming",
        link: "https://drive.google.com/file/d/1UL1Sqt-fe8OmFhDO7E5nmnd-MGe3IGVL/view?usp=sharing",
    },
    {
        id: 4,
        title: "Programming Fundamentals",
        issuer: "Dicoding Indonesia",
        date: "Feb 2024",
        category: "Programming",
        link: "https://drive.google.com/file/d/1kS5c_szXPBZoTjsdL8IW8KtLZGPFHcy4/view?usp=sharing",
    },
    {
        id: 5,
        title: "Oracle Primavera P6 Professional Project",
        issuer: "Oracle Academy",
        date: "Apr 2024",
        category: "Database",
        link: "https://drive.google.com/file/d/1b3s_PfksUQledkAkOMavvOY3WenRA2fq/view?usp=drive_link",
    },
    {
        id: 6,
        title: "PL/SQL Database Programming",
        issuer: "Oracle Academy",
        date: "May 2023",
        category: "Database",
        link: "https://drive.google.com/file/d/1MhcX94G6GVmHIGDBFMhjzKJ8Evhk-5PE/view?usp=drive_link",
    },
    {
        id: 7,
        title: "Database Programming with SQL",
        issuer: "Oracle Academy",
        date: "Mar 2023",
        category: "Database",
        link: "https://drive.google.com/file/d/1zzRxVUHSYM1viQGRdDn8ND8cbORs-4hu/view?usp=drive_link",
    },
    {
        id: 8,
        title: "UI/UX Design Bootcamp",
        issuer: "BuildWithAngga",
        date: "Aug 2022",
        category: "Design",
        link: "https://drive.google.com/file/d/1HSW3dhxlnR80_Gi08pvbAqFFDSvNLow3/view?usp=drive_link",
    },
    {
        id: 9,
        title: "Diponegoro Big Data School",
        issuer: "Diponegoro University",
        date: "Nov 2021",
        category: "Data",
        link: "https://drive.google.com/file/d/1Nn0Q7eTF8uT5dTeh_gZ6zhFojpEd4VXd/view?usp=drive_link",
    },
    {
        id: 10,
        title: "Software Engineering Internship",
        issuer: "Ministry of Investment (BKPM)",
        date: "Feb 2024",
        category: "Professional",
        link: "https://drive.google.com/file/d/1qnmlbWbkXU-ramaZBn12KqCHXPE-AfSk/view?usp=sharing",
    },
    {
        id: 11,
        title: "Scientific Article (Final Thesis)",
        issuer: "Diponegoro University",
        date: "2025",
        category: "Professional",
        link: "https://drive.google.com/file/d/1Xls_hw0CWvlNM2jOpl_Qjw5QIls0ZfKJ/view?usp=drive_link",
    },
];

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
};

const Certifications = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start center", "end center"]
    });

    // Horizontal "laser" spreads across the top early in the scroll
    const scaleX = useTransform(scrollYProgress, [0, 0.15], [0, 1]);

    const [activeFilter, setActiveFilter] = useState<Category | "All">("All");
    const [showAll, setShowAll] = useState(false);

    // Filter pills (only show categories that actually exist), with live counts
    const filters = useMemo(() => {
        const counts = certifications.reduce<Record<string, number>>((acc, c) => {
            acc[c.category] = (acc[c.category] || 0) + 1;
            return acc;
        }, {});
        const cats = (Object.keys(categoryStyles) as Category[]).filter((c) => counts[c]);
        return [
            { key: "All" as const, label: "All", count: certifications.length },
            ...cats.map((c) => ({ key: c, label: categoryStyles[c].label, count: counts[c] })),
        ];
    }, []);

    const visibleCerts = useMemo(
        () => activeFilter === "All"
            ? certifications
            : certifications.filter((c) => c.category === activeFilter),
        [activeFilter]
    );

    const displayedCerts = useMemo(
        () => showAll ? visibleCerts : visibleCerts.slice(0, 3),
        [visibleCerts, showAll]
    );

    const handleFilterChange = (filter: Category | "All") => {
        setActiveFilter(filter);
        setShowAll(false);
    };

    return (
        <section ref={sectionRef} id="certifications" className="relative w-full min-h-screen bg-dark py-20 md:py-28 px-6 md:px-20 border-t border-gray-800/50 overflow-hidden">

            {/* Horizontal laser line spreading from the center */}
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gray-800/30 z-0">
                <motion.div
                    style={{ scaleX }}
                    className="w-full h-full bg-linear-to-r from-transparent via-secondary to-transparent origin-center shadow-[0_0_20px_rgba(0,240,255,0.8)]"
                />
            </div>

            {/* Ambient glow */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-160 h-160 bg-primary/5 blur-[140px] rounded-full pointer-events-none z-0"></div>

            <div className="max-w-7xl mx-auto relative z-10">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.6 }}
                    className="mb-10 md:mb-12 text-center md:text-left"
                >
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">
                        Professional <span className="text-primary">Certifications</span>
                    </h2>
                    <p className="text-gray-400 max-w-xl mx-auto md:mx-0">
                        {certifications.length} verified courses, licenses &amp; awards from leading institutions. Click any card to view the original certificate.
                    </p>
                </motion.div>

                {/* Filter pills - slidable on mobile */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="flex overflow-x-auto md:overflow-visible gap-3 mb-10 md:mb-12 py-3 scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden -mr-6 pr-6 md:mr-0 md:pr-0 flex-nowrap md:flex-wrap justify-start items-center"
                >
                    {filters.map((f) => {
                        const active = activeFilter === f.key;
                        return (
                            <button
                                key={f.key}
                                onClick={() => handleFilterChange(f.key)}
                                className={`group shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all duration-300 cursor-pointer ${
                                    active
                                        ? "bg-primary text-black border-primary shadow-[0_0_18px_rgba(0,240,255,0.35)]"
                                        : "bg-gray-900/50 text-gray-400 border-gray-800 hover:text-white hover:border-gray-600"
                                }`}
                            >
                                {f.label}
                                <span className={`text-xs font-mono px-1.5 py-0.5 rounded-md ${active ? "bg-black/20" : "bg-gray-800/70 group-hover:bg-gray-700/70"}`}>
                                    {f.count}
                                </span>
                            </button>
                        );
                    })}
                </motion.div>

                {/* Cards grid on desktop, slidable peeked row on mobile */}
                <motion.div
                    layout
                    className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory py-2 pb-6 md:pb-0 scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden -mr-6 pr-6 md:mr-0 md:pr-0"
                >
                    <AnimatePresence mode="popLayout">
                        {displayedCerts.map((cert) => {
                            const style = categoryStyles[cert.category];
                            const Icon = style.icon;
                            return (
                                <motion.a
                                    key={cert.id}
                                    href={cert.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    layout
                                    variants={cardVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    whileHover={{ y: -6 }}
                                    style={{ ['--accent' as string]: style.color }}
                                    className="relative w-[75vw] sm:w-[320px] max-w-[340px] shrink-0 snap-start md:w-auto md:max-w-none md:shrink bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 md:p-7 flex flex-col justify-between transition-colors duration-300 group overflow-hidden hover:border-(--accent) hover:shadow-[0_12px_40px_-12px_var(--accent)]"
                                >
                                    {/* Accent corner glow */}
                                    <div
                                        className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"
                                        style={{ backgroundColor: style.color }}
                                    />

                                    <div className="relative z-10">
                                        <div className="flex items-start justify-between mb-6">
                                            <div
                                                className="p-3 rounded-xl transition-transform duration-300 group-hover:scale-110"
                                                style={{ backgroundColor: `${style.color}1a`, color: style.color }}
                                            >
                                                <Icon size={24} />
                                            </div>
                                            <span
                                                className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full border"
                                                style={{ color: style.color, borderColor: `${style.color}40`, backgroundColor: `${style.color}0d` }}
                                            >
                                                {style.label}
                                            </span>
                                        </div>

                                        <h3 className="text-lg md:text-xl font-bold text-white mb-2 leading-snug transition-colors group-hover:text-(--accent)">
                                            {cert.title}
                                        </h3>
                                        <p className="text-gray-400 font-medium text-sm">
                                            {cert.issuer}
                                        </p>
                                    </div>

                                    <div className="relative z-10 flex items-center justify-between border-t border-gray-800/60 pt-4 mt-6">
                                        <div className="flex items-center gap-2 text-sm text-gray-500 font-mono">
                                            <FiCalendar size={14} />
                                            <span>{cert.date}</span>
                                        </div>
                                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 group-hover:text-(--accent) transition-colors">
                                            View
                                            <FiArrowUpRight className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                        </span>
                                    </div>
                                </motion.a>
                            );
                        })}
                    </AnimatePresence>
                </motion.div>

                {/* Show More / Show Less Button */}
                {visibleCerts.length > 3 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-10 flex justify-center"
                    >
                        <button
                            onClick={() => setShowAll(!showAll)}
                            className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gray-900/80 border border-gray-700/80 text-gray-200 text-sm font-medium hover:text-white hover:border-primary hover:shadow-[0_0_20px_rgba(0,240,255,0.25)] transition-all duration-300 cursor-pointer"
                        >
                            <span>
                                {showAll ? "Show Less" : `Show More (${visibleCerts.length - 3} more)`}
                            </span>
                            {showAll ? (
                                <FiChevronUp className="w-4 h-4 text-primary transition-transform group-hover:-translate-y-0.5" />
                            ) : (
                                <FiChevronDown className="w-4 h-4 text-primary transition-transform group-hover:translate-y-0.5" />
                            )}
                        </button>
                    </motion.div>
                )}

            </div>
        </section>
    );
};

export default Certifications;

