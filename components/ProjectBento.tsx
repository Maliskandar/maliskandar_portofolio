"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiExternalLink, FiX, FiLayers, FiChevronLeft, FiChevronRight, FiMaximize2 } from 'react-icons/fi';
import { allProjects, Project } from '@/data/projects';
import ProjectModal from '@/components/ProjectModal';
import Image from 'next/image';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';



const ProjectBento = () => {
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    return (
        <section id="work" className="relative w-full min-h-screen bg-dark py-24 px-6 md:px-20 overflow-hidden font-sans border-t border-gray-800/50">

            {/* Header */}
            <div className="max-w-7xl mx-auto mb-16 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
                <div>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-primary font-mono mb-2"
                    >
                    </motion.p>
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-bold text-white tracking-tight"
                    >
                        Selected Works.
                    </motion.h2>
                </div>
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="text-gray-400 max-w-sm text-sm leading-relaxed"
                >
                    A collection of projects showcasing my expertise in building robust interfaces and scalable backend systems.
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="mt-6 md:mt-0 flex shrink-0"
                >
                    <Link href="/projects" className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full backdrop-blur-sm transition-all group font-medium shadow-lg hover:shadow-cyan-500/20">
                        <span>View Full Portfolio</span>
                        <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>
            </div>

            {/* BENTO GRID */}
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
                }}
                className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 auto-rows-[250px] md:auto-rows-[320px] relative z-10"
            >
                {allProjects.slice(0, 5).map((project, index) => (
                    <ProjectCard
                        key={project.id}
                        project={project}
                        onClick={() => setSelectedProject(project)}
                    />
                ))}
            </motion.div>

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

// --- CARD COMPONENT ---
const ProjectCard = ({ project, onClick }: { project: Project, onClick: () => void }) => {
    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, scale: 0.95, y: 30 },
                visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
            }}
            onClick={onClick}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className={`group relative overflow-hidden rounded-3xl border border-gray-800 cursor-pointer transition-shadow hover:shadow-[0_20px_40px_-15px_rgba(0,240,255,0.15)] ${project.span} ${project.bg}`}
        >
            {/* Watermark Fallback background for all cards */}
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
                    <button className="w-10 h-10 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-md border border-white/5 text-white/70 group-hover:bg-primary group-hover:text-dark group-hover:border-primary transition-all duration-300 -translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0">
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
                        {project.stack.map((icon, i) => (
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



export default ProjectBento;