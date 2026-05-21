"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { allProjects, Project } from '@/data/projects';
import ProjectModal from '@/components/ProjectModal';
import Link from 'next/link';
import { FiArrowLeft, FiExternalLink, FiMaximize2 } from 'react-icons/fi';

export default function ProjectsPage() {
    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    const categories: string[] = ["All", ...Array.from(new Set(allProjects.map((p: Project) => p.category)))];

    const filteredProjects = selectedCategory === "All"
        ? allProjects
        : allProjects.filter((p: Project) => p.category === selectedCategory);

    return (
        <main className="min-h-screen bg-dark text-white font-sans selection:bg-primary/30 selection:text-white pb-24">
            {/* Header / Nav */}
            <div className="w-full bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-800/50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/#work" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
                        <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                        <span>Back to Home</span>
                    </Link>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-20 md:py-24">
                {/* Titles */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12 md:mb-16"
                >
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
                        All <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400">Projects</span>.
                    </h1>
                    <p className="text-gray-400 text-lg md:text-xl max-w-2xl leading-relaxed">
                        A comprehensive look at my work, spanning web development, UI/UX design, and complex application architecture.
                    </p>
                </motion.div>

                {/* Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex gap-3 mb-12 overflow-x-auto md:flex-wrap pb-2 -mx-6 px-6 md:mx-0 md:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >
                    {categories.map((cat: string, idx: number) => (
                        <button
                            key={idx}
                            onClick={() => setSelectedCategory(cat)}
                            className={`shrink-0 whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                                selectedCategory === cat
                                    ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                                    : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white"
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </motion.div>

                {/* BENTO GRID */}
                <motion.div
                    layout
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 auto-rows-[250px] md:auto-rows-[320px] [grid-auto-flow:dense]"
                >
                    <AnimatePresence mode="popLayout">
                        {filteredProjects.map((project: Project) => (
                            <BentoCard
                                key={project.id}
                                project={project}
                                onClick={() => setSelectedProject(project)}
                            />
                        ))}
                    </AnimatePresence>
                </motion.div>
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
        </main>
    );
}

// --- BENTO CARD ---
const BentoCard = ({ project, onClick }: { project: Project, onClick: () => void }) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            onClick={onClick}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className={`group relative overflow-hidden rounded-3xl border border-gray-800 cursor-pointer transition-shadow hover:shadow-[0_20px_40px_-15px_rgba(0,240,255,0.15)] ${project.span} ${project.bg}`}
        >
            {/* Watermark Fallback */}
            <div className="absolute -right-10 -bottom-10 text-[12rem] text-white/5 rotate-12 transition-transform duration-700 group-hover:rotate-0 group-hover:scale-110 pointer-events-none">
                {project.stack[0]}
            </div>

            {/* Content Container */}
            <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between z-20">
                {/* Top Tags */}
                <div className="flex justify-between items-start">
                    <span className="px-3 py-1 bg-black/40 backdrop-blur-md rounded-full text-xs font-medium tracking-wide text-gray-300 border border-white/5">
                        {project.category}
                    </span>
                    <button
                        onClick={(e) => {
                            if (project.externalLink) {
                                e.stopPropagation();
                                window.open(project.externalLink, '_blank', 'noopener,noreferrer');
                            }
                        }}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-md border border-white/5 text-white/70 group-hover:bg-primary group-hover:text-dark group-hover:border-primary transition-all duration-300 -translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0"
                    >
                        {project.externalLink ? <FiExternalLink size={18} /> : <FiMaximize2 size={18} />}
                    </button>
                </div>

                {/* Bottom Info */}
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight group-hover:text-primary transition-colors duration-300">
                        {project.title}
                    </h3>
                    <p className="text-gray-300 text-sm md:text-base line-clamp-2 md:line-clamp-3 mb-5 max-w-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 hidden md:block">
                        {project.desc}
                    </p>

                    {/* Tech Stack Bar */}
                    <div className="flex items-center gap-3 text-xl text-gray-400">
                        {project.stack.map((icon: React.ReactNode, i: number) => (
                            <span key={i} className="group-hover:text-white transition-colors duration-300">
                                {icon}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
