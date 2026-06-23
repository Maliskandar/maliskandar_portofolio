"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { allProjects, Project } from '@/data/projects';
import ProjectModal from '@/components/ProjectModal';
import Image from 'next/image';
import Link from 'next/link';
import { FiArrowLeft, FiExternalLink, FiArrowUpRight, FiLayers } from 'react-icons/fi';

export default function ProjectsPage() {
    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    const categories: string[] = ["All", ...Array.from(new Set(allProjects.map((p: Project) => p.category)))];

    const filteredProjects = selectedCategory === "All"
        ? allProjects
        : allProjects.filter((p: Project) => p.category === selectedCategory);

    const [featured, ...rest] = filteredProjects;

    return (
        <main className="min-h-screen bg-dark text-white font-sans selection:bg-primary/30 selection:text-white pb-24">
            {/* Header / Nav */}
            <div className="w-full bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-800/50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/#work" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
                        <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                        <span>Back to Home</span>
                    </Link>
                    <span className="font-mono text-xs text-gray-500 tracking-widest uppercase">{allProjects.length} Projects</span>
                </div>
            </div>

            {/* Subtle grid backdrop */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:80px_80px]" />

            <div className="max-w-7xl mx-auto px-6 py-20 md:py-24 relative">
                {/* Titles */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12 md:mb-16"
                >
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
                        All <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Projects</span>.
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
                                    ? "bg-primary text-dark border border-primary shadow-[0_0_20px_rgba(0,240,255,0.3)]"
                                    : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white"
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </motion.div>

                {/* Content re-keyed per filter to replay entrance */}
                <div key={selectedCategory}>
                    {/* SPOTLIGHT */}
                    {featured && (
                        <FeaturedSpotlight project={featured} onOpen={() => setSelectedProject(featured)} />
                    )}

                    {/* GRID (the rest) */}
                    {rest.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                            {rest.map((project: Project, index: number) => (
                                <ProjectCard
                                    key={project.id}
                                    project={project}
                                    index={index}
                                    onOpen={() => setSelectedProject(project)}
                                />
                            ))}
                        </div>
                    )}
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
        </main>
    );
}

// --- FEATURED SPOTLIGHT ---
const FeaturedSpotlight = ({ project, onOpen }: { project: Project; onOpen: () => void }) => {
    const img = project.image ?? project.galleryImages?.[0];

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-16 md:mb-20 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center rounded-3xl border border-gray-800 bg-gray-900/30 p-5 md:p-8"
        >
            {/* Visual */}
            <div onClick={onOpen} className="group relative cursor-pointer">
                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-gray-800 bg-gray-900 shadow-[0_30px_60px_-25px_rgba(0,0,0,0.8)] group-hover:border-primary/40 transition-colors duration-500">
                    {img ? (
                        <Image
                            src={img}
                            alt={project.title}
                            fill
                            sizes="(max-width: 1024px) 100vw, 640px"
                            className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                            priority
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-700">
                            <FiLayers size={48} />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                </div>
            </div>

            {/* Details */}
            <div>
                <div className="flex items-center gap-3 mb-5">
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-[11px] font-mono uppercase tracking-widest">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" /> Featured
                    </span>
                    <span className="font-mono text-xs text-gray-500 tracking-widest uppercase">{project.category}</span>
                </div>

                <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">
                    {project.title}
                </h2>
                <p className="text-gray-400 text-base md:text-lg leading-relaxed mb-6 max-w-xl">
                    {project.desc}
                </p>

                {project.features && project.features.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-7">
                        {project.features.slice(0, 4).map((feature) => (
                            <span key={feature} className="text-xs text-gray-300 bg-gray-900/70 border border-gray-800 px-3 py-1.5 rounded-full">
                                {feature}
                            </span>
                        ))}
                    </div>
                )}

                <div className="flex items-center gap-5 mb-8 text-2xl text-gray-500">
                    {project.stack}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <button
                        onClick={onOpen}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white text-dark font-bold rounded-full hover:bg-primary transition-colors duration-300"
                    >
                        View Project <FiArrowUpRight />
                    </button>
                    {project.externalLink && (
                        <a
                            href={project.externalLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 border border-gray-700 text-gray-300 font-medium rounded-full hover:border-primary hover:text-primary transition-colors duration-300"
                        >
                            Live Demo <FiExternalLink size={16} />
                        </a>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

// --- GRID CARD ---
const ProjectCard = ({ project, index, onOpen }: { project: Project; index: number; onOpen: () => void }) => {
    const img = project.image ?? project.galleryImages?.[0];

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: (index % 6) * 0.06, ease: "easeOut" }}
        >
            <div
                onClick={onOpen}
                className="group relative rounded-2xl overflow-hidden border border-gray-800 hover:border-primary/40 cursor-pointer transition-colors duration-500 shadow-[0_20px_40px_-25px_rgba(0,0,0,0.8)]"
            >
                <div className="relative aspect-[16/10] bg-gray-900 overflow-hidden">
                    {img ? (
                        <Image
                            src={img}
                            alt={project.title}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                        />
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-dark flex items-center justify-center">
                            <div className="text-7xl text-white/[0.06] transition-transform duration-700 group-hover:scale-110">
                                {project.stack[0]}
                            </div>
                        </div>
                    )}
                </div>

                {/* Bottom gradient + info */}
                <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none">
                    <span className="inline-block mb-2 px-2.5 py-1 rounded-full bg-primary/15 border border-primary/30 text-primary text-[10px] font-mono uppercase tracking-wider">
                        {project.category}
                    </span>
                    <h3 className="text-lg md:text-xl font-bold text-white leading-tight group-hover:text-primary transition-colors duration-300">
                        {project.title}
                    </h3>
                </div>

                {/* Top-right action */}
                <div className="absolute top-3 right-3 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    {project.externalLink ? (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                window.open(project.externalLink, "_blank", "noopener,noreferrer");
                            }}
                            aria-label="Open live site"
                            className="w-9 h-9 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white hover:bg-primary hover:text-dark hover:border-primary transition-colors"
                        >
                            <FiExternalLink size={16} />
                        </button>
                    ) : (
                        <span className="w-9 h-9 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white">
                            <FiArrowUpRight size={16} />
                        </span>
                    )}
                </div>
            </div>
        </motion.div>
    );
};
