"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { allProjects, Project } from '@/data/projects';
import ProjectModal from '@/components/ProjectModal';
import Link from 'next/link';
import Image from 'next/image';
import { FiArrowLeft, FiExternalLink, FiLayers } from 'react-icons/fi';

export default function ProjectsPage() {
    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    
    // Get unique categories
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
                    className="flex flex-wrap gap-3 mb-12"
                >
                    {categories.map((cat: string, idx: number) => (
                        <button
                            key={idx}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                                selectedCategory === cat 
                                    ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]" 
                                    : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white"
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </motion.div>

                {/* Grid */}
                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    <AnimatePresence mode="popLayout">
                        {filteredProjects.map((project: Project, idx: number) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                                key={project.id}
                                onClick={() => setSelectedProject(project)}
                                className={`group relative rounded-3xl overflow-hidden border border-gray-800/50 bg-[#111318] flex flex-col h-[480px] hover:border-gray-700 transition-colors duration-500 cursor-pointer hover:shadow-[0_20px_40px_-15px_rgba(0,240,255,0.15)]`}
                            >
                                {/* Image Container */}
                                <div className="h-[240px] w-full relative overflow-hidden bg-gray-900 shrink-0">
                                    {project.image ? (
                                        <Image 
                                            src={project.image} 
                                            alt={project.title} 
                                            fill 
                                            className="object-cover object-top transition-all duration-[4000ms] ease-in-out group-hover:object-bottom group-hover:scale-105" 
                                        />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-700">
                                            <FiLayers size={40} className="mb-2" />
                                            <span className="text-xs uppercase tracking-widest">No Image</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#111318] to-transparent opacity-100" />
                                    
                                    <div className="absolute top-4 right-4 flex gap-2">
                                        {project.externalLink && (
                                            <a 
                                                href={project.externalLink} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                onClick={(e) => e.stopPropagation()}
                                                className="w-10 h-10 flex items-center justify-center bg-black/50 backdrop-blur-md rounded-full border border-white/10 text-white hover:bg-primary hover:text-black hover:border-primary transition-all shadow-lg"
                                            >
                                                <FiExternalLink size={18} />
                                            </a>
                                        )}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6 md:p-8 flex flex-col flex-grow justify-between relative z-10 -mt-12">
                                    <div className="bg-[#111318] pt-2">
                                        <span className="text-primary text-xs font-mono uppercase tracking-widest mb-2 block">
                                            {project.category}
                                        </span>
                                        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-primary transition-colors">
                                            {project.title}
                                        </h3>
                                        <p className="text-gray-400 text-sm line-clamp-3 leading-relaxed">
                                            {project.desc}
                                        </p>
                                    </div>

                                    {/* Footer / Stack */}
                                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                                        <div className="flex gap-3 text-xl text-gray-500">
                                            {project.stack.map((icon: React.ReactNode, i: number) => (
                                                <span key={i} className="group-hover:text-gray-300 transition-colors" title="Tech Stack Icon">
                                                    {icon}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
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
