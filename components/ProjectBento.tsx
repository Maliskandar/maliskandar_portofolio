"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowRight, FiArrowUpRight, FiExternalLink } from 'react-icons/fi';
import { allProjects, Project } from '@/data/projects';
import ProjectModal from '@/components/ProjectModal';
import Link from 'next/link';

const featured = allProjects.slice(0, 5);

const ProjectBento = () => {
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    return (
        <section
            id="work"
            className="relative w-full bg-dark py-20 md:py-28 px-6 md:px-20 overflow-hidden font-sans border-t border-gray-800/50"
        >
            {/* Ambient background accents */}
            <div className="absolute top-1/4 -right-20 w-160 h-160 bg-primary/5 blur-[150px] rounded-full pointer-events-none z-0" />
            <div className="absolute bottom-10 -left-20 w-140 h-140 bg-secondary/5 blur-[140px] rounded-full pointer-events-none z-0" />
            <div className="absolute inset-0 opacity-[0.025] pointer-events-none z-0 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <div className="mb-10 md:mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="text-3xl md:text-5xl font-bold text-white tracking-tight"
                        >
                            Selected <span className="text-primary">Works.</span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-gray-400 max-w-md text-sm md:text-base leading-relaxed mt-3"
                        >
                            A curated selection of projects highlighting the technology stack, system architecture, and core features built for each solution.
                        </motion.p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="shrink-0"
                    >
                        <Link
                            href="/projects"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900/80 hover:bg-primary hover:text-dark text-white border border-gray-800 hover:border-primary rounded-full backdrop-blur-sm transition-all duration-300 group font-semibold text-sm shadow-lg hover:shadow-[0_0_20px_rgba(0,240,255,0.25)]"
                        >
                            <span>View Full Portfolio</span>
                            <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>
                </div>

                {/* Bento Grid Showcase: Grid on desktop, slidable row on mobile */}
                <div className="flex md:grid md:grid-cols-3 gap-5 md:gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory py-2 pb-6 md:pb-0 scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden -mr-6 pr-6 md:mr-0 md:pr-0">
                    {featured.map((project, index) => (
                        <BentoCard
                            key={project.id}
                            project={project}
                            index={index}
                            onOpen={() => setSelectedProject(project)}
                        />
                    ))}
                </div>
            </div>

            {/* PROJECT MODAL */}
            <AnimatePresence>
                {selectedProject && (
                    <ProjectModal
                        project={selectedProject}
                        onClose={() => setSelectedProject(null)}
                    />
                )}
            </AnimatePresence>
        </section>
    );
};

// --- BENTO GRID CARD (NO IMAGE BG, TECH STACK FOCUS) ---
const BentoCard = ({
    project,
    index,
    onOpen,
}: {
    project: Project;
    index: number;
    onOpen: () => void;
}) => {
    // Bento column spans for desktop
    const getSpanClass = (i: number) => {
        if (i === 0) return "md:col-span-2";
        return "md:col-span-1";
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.07 }}
            className={`w-[80vw] sm:w-[330px] md:w-auto shrink-0 snap-start md:shrink ${getSpanClass(index)}`}
        >
            <div
                onClick={onOpen}
                className="group relative cursor-pointer rounded-3xl bg-gray-900/40 backdrop-blur-xl border border-gray-800/80 hover:border-primary/50 p-6 md:p-7 flex flex-col justify-between h-full min-h-[350px] md:min-h-[370px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,240,255,0.15)]"
            >
                {/* Background Ambient Mesh Glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-transparent blur-3xl rounded-full opacity-30 group-hover:opacity-80 transition-opacity duration-500 pointer-events-none" />
                <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.03] group-hover:opacity-[0.07] transition-opacity pointer-events-none" />

                <div className="relative z-10">
                    {/* Header: Category & Number */}
                    <div className="flex items-center justify-between mb-5">
                        <span className="text-[11px] font-mono font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                            {project.category}
                        </span>
                        <span className="text-2xl font-mono font-bold text-white/15 group-hover:text-primary/60 transition-colors">
                            0{index + 1}
                        </span>
                    </div>

                    {/* Title & Description */}
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
                        {project.title}
                    </h3>
                    <p className="text-gray-400 text-xs md:text-sm leading-relaxed mb-6 line-clamp-3">
                        {project.desc}
                    </p>

                    {/* Tech Stack Focus Box */}
                    <div className="mb-5 bg-gray-950/60 border border-gray-800/90 rounded-2xl p-4 transition-colors group-hover:border-primary/30">
                        <span className="block text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-2.5">
                            Tech Stack & Architecture
                        </span>
                        <div className="flex flex-wrap items-center gap-3 text-2xl text-primary">
                            {project.stack.map((icon, i) => (
                                <div key={i} className="p-2 rounded-xl bg-gray-900/90 border border-gray-800/80 text-primary hover:scale-110 transition-transform shadow-md">
                                    {icon}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Key Features Pills */}
                    {project.features && project.features.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                            {project.features.slice(0, 3).map((feat, fIdx) => (
                                <span key={fIdx} className="text-[11px] text-gray-400 bg-gray-900/60 border border-gray-800 px-2.5 py-1 rounded-md">
                                    • {feat}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer CTA */}
                <div className="flex items-center justify-between border-t border-gray-800/80 pt-4 mt-2 z-10 relative">
                    <span className="text-xs font-semibold text-gray-400 group-hover:text-white transition-colors">
                        Explore Project
                    </span>
                    <div className="flex items-center gap-2">
                        {project.externalLink && (
                            <a
                                href={project.externalLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="p-1.5 rounded-full text-gray-400 hover:text-primary hover:bg-primary/10 transition-colors"
                                title="Live Demo"
                            >
                                <FiExternalLink size={14} />
                            </a>
                        )}
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-primary group-hover:translate-x-1 transition-transform">
                            View Details <FiArrowUpRight size={15} />
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ProjectBento;


