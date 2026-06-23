"use client";

import React, { useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { FiArrowRight, FiArrowUpRight, FiExternalLink, FiLayers } from 'react-icons/fi';
import { allProjects, Project } from '@/data/projects';
import ProjectModal from '@/components/ProjectModal';
import Image from 'next/image';
import Link from 'next/link';

const featured = allProjects.slice(0, 5);

const ProjectBento = () => {
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    return (
        <section
            id="work"
            className="relative w-full bg-dark py-24 px-6 md:px-20 overflow-hidden font-sans border-t border-gray-800/50"
        >
            {/* Ambient accents */}
            <div className="absolute top-1/4 -right-20 w-160 h-160 bg-primary/5 blur-[150px] rounded-full pointer-events-none z-0" />
            <div className="absolute inset-0 opacity-[0.025] pointer-events-none z-0 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />

            {/* Header */}
            <div className="max-w-7xl mx-auto mb-16 md:mb-24 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex items-center gap-3 mb-5"
                    >
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 14 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.05 }}
                        className="text-4xl md:text-6xl font-bold text-white tracking-tight"
                    >
                        Selected <span className="text-primary">Works.</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.15 }}
                        className="text-gray-400 max-w-md text-sm md:text-base leading-relaxed mt-5"
                    >
                        A curated selection of projects showcasing my work building robust interfaces and scalable backend systems.
                    </motion.p>
                </div>
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.25 }}
                    className="shrink-0"
                >
                    <Link
                        href="/projects"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-primary hover:text-dark text-white border border-white/10 hover:border-primary rounded-full backdrop-blur-sm transition-all group font-medium shadow-lg hover:shadow-primary/20"
                    >
                        <span>View Full Portfolio</span>
                        <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>
            </div>

            {/* Zig-zag showcase rows */}
            <div className="max-w-7xl mx-auto relative z-10 space-y-24 md:space-y-32">
                {featured.map((project, index) => (
                    <ShowcaseRow
                        key={project.id}
                        project={project}
                        index={index}
                        onOpen={() => setSelectedProject(project)}
                    />
                ))}
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

// --- SHOWCASE ROW ---
const ShowcaseRow = ({
    project,
    index,
    onOpen,
}: {
    project: Project;
    index: number;
    onOpen: () => void;
}) => {
    const reversed = index % 2 === 1;
    const img = project.image ?? project.galleryImages?.[0];

    // Subtle parallax on the screenshot as the row scrolls through view
    const rowRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: rowRef,
        offset: ["start end", "end start"],
    });
    const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

    return (
        <motion.div
            ref={rowRef}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center"
        >
            {/* Image */}
            <div
                onClick={onOpen}
                className={`group relative cursor-pointer ${reversed ? "lg:order-2" : ""}`}
            >
                <div className="relative aspect-[16/11] rounded-3xl overflow-hidden border border-gray-800 bg-gray-900 shadow-[0_30px_60px_-25px_rgba(0,0,0,0.8)] transition-colors duration-500 group-hover:border-primary/40">
                    {img ? (
                        <motion.div style={{ y }} className="absolute inset-x-0 -top-[20%] h-[140%]">
                            <Image
                                src={img}
                                alt={project.title}
                                fill
                                sizes="(max-width: 1024px) 100vw, 640px"
                                className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                            />
                        </motion.div>
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-700">
                            <FiLayers size={48} />
                        </div>
                    )}

                    {/* Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-3xl pointer-events-none" />

                    {/* Hover CTA chip */}
                    <span className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-dark text-sm font-bold opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
                        View case <FiArrowUpRight />
                    </span>
                </div>
            </div>

            {/* Info */}
            <div className={`relative ${reversed ? "lg:order-1" : ""}`}>
                <div className="flex items-center gap-4 mb-5">
                    <span className="text-5xl md:text-7xl font-bold text-white/10 leading-none select-none">
                        {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="font-mono text-xs text-primary tracking-widest uppercase">
                        {project.category}
                    </span>
                </div>

                <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
                    {project.title}
                </h3>

                <p className="text-gray-400 leading-relaxed mb-6 max-w-lg">
                    {project.desc}
                </p>

                {project.features && project.features.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-7">
                        {project.features.slice(0, 3).map((feature) => (
                            <span
                                key={feature}
                                className="text-xs text-gray-400 bg-gray-900/70 border border-gray-800 px-3 py-1.5 rounded-full"
                            >
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

export default ProjectBento;
