"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiExternalLink, FiX, FiLayers, FiChevronLeft, FiChevronRight, FiMaximize2 } from 'react-icons/fi';
import { SiLaravel, SiMysql, SiTailwindcss, SiFigma, SiReact, SiNextdotjs, SiTypescript, SiVuedotjs, SiNodedotjs, SiMongodb } from 'react-icons/si';
import Image from 'next/image';

// --- DATA TYPES ---
type Project = {
    id: number;
    title: string;
    category: string;
    desc: string;
    stack: React.ReactNode[];
    span: string; // Grid col/row span
    bg: string;
    image?: string;
    galleryImages?: string[];
    features?: string[];
    techDetails?: string;
    externalLink?: string;
};

// --- DUMMY PROJECTS DATA ---
const projects: Project[] = [
    {
        id: 1,
        title: "Wallet Go! Mobile App",
        category: "UI/UX Design",
        desc: "Modern digital wallet application design focusing on seamless money transfers and top-ups.",
        stack: [<SiFigma key="f" />],
        span: "md:col-span-1 md:row-span-1",
        bg: "bg-[#1E1E2E] hover:bg-[#252538]",
        image: "/projects/wallet-mobile.png", // Keep original images if any, fallback handles missing
        galleryImages: ["/projects/wallet-mobile.png"],
        features: ["Intuitive User Flow", "Light & Dark Mode", "Interactive Prototyping"],
        techDetails: "Designed entirely from scratch in Figma focusing on mobile-first user experience and material design guidelines.",
        externalLink: "https://www.figma.com/design/JE3q5Cftdo8iYZZH9Z9zWa/Wallet-Go-?node-id=0-1&t=q59sqGfb1XTIUifw-1"
    },
    {
        id: 2,
        title: "E-Commerce Dashboard",
        category: "Web Application",
        desc: "Comprehensive admin dashboard for managing products, orders, and customer analytics in real-time.",
        stack: [<SiReact key="r" />, <SiTailwindcss key="t" />, <SiNodedotjs key="n" />],
        span: "md:col-span-2 md:row-span-1",
        bg: "bg-gradient-to-br from-indigo-900/40 to-slate-900",
        // No image = fallback to watermark icon
        features: ["Real-time Sales Charts", "Inventory Management", "Role-based Access Control"],
        techDetails: "Built using React and Recharts for data visualization, backed by a robust Node.js REST API."
    },
    {
        id: 3,
        title: "Electronic Medical Records",
        category: "Web Development",
        desc: "Electronic medical records and patient management system for independent midwife practices.",
        stack: [<SiLaravel key="l" />, <SiMysql key="m" />, <SiTailwindcss key="t" />],
        span: "md:col-span-2 md:row-span-2",
        bg: "bg-gradient-to-br from-blue-900/80 to-slate-900",
        image: "/projects/emr-thumb.png",
        galleryImages: ["/projects/emr-thumb.png", "/projects/emr-1.png", "/projects/emr-2.png"],
        techDetails: "Built on Laravel 10 using MVC architecture. Normalized MySQL database handles thousands of patient records efficiently.",
        features: [
            "Patient & Medical Record Management",
            "Automated Referral & Prescription Printing",
            "Daily & Monthly Visit Reports",
            "Simple Billing System"
        ]
    },
    {
        id: 4,
        title: "TaskFlow Manager",
        category: "Productivity Tool",
        desc: "A Kanban-style task management application with real-time collaboration features.",
        stack: [<SiNextdotjs key="nx" />, <SiTypescript key="ts" />, <SiMongodb key="mdb" />],
        span: "md:col-span-1 md:row-span-1",
        bg: "bg-gradient-to-tr from-emerald-900/40 to-dark",
        features: ["Drag and Drop Kanban Board", "Real-time Updates via WebSockets", "Team Workspaces"],
        techDetails: "Utilizes Next.js App Router with Server Actions and MongoDB for seamless serverless data fetching."
    },
    {
        id: 5,
        title: "Office Sentry App",
        category: "Web Development",
        desc: "Office security management and personnel monitoring application.",
        stack: [<SiLaravel key="l" />, <SiTailwindcss key="t" />],
        span: "md:col-span-1 md:row-span-1",
        bg: "bg-[#111827] hover:bg-[#1F2937]",
        image: "/projects/sentry-thumb.png",
        galleryImages: ["/projects/sentry-thumb.png", "/projects/sentry-1.png"],
        techDetails: "Internal monitoring system for recording BKPM office security activities. Uses Laravel Breeze for authentication.",
        features: [
            "Real-time Monitoring Dashboard",
            "Shift Management System",
            "QR Code Check-in",
            "Incident Reporting"
        ]
    },
];

const ProjectBento = () => {
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    return (
        <section id="work" className="relative w-full min-h-screen bg-dark py-24 px-6 md:px-20 overflow-hidden font-sans">
            
            {/* Header */}
            <div className="max-w-7xl mx-auto mb-16 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
                <div>
                    <motion.p 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-primary font-mono mb-2"
                    >
                        // Portfolio
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
                {projects.map((project, index) => (
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
            {/* Image Cover */}
            {project.image ? (
                <>
                    <div className="absolute inset-0 w-full h-full">
                        <Image
                            src={project.image}
                            alt={project.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                    </div>
                    {/* Gradient overlay for text */}
                    <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                </>
            ) : (
                /* Watermark Fallback if no Image */
                <div className="absolute -right-10 -bottom-10 text-[12rem] text-white/5 rotate-12 transition-transform duration-700 group-hover:rotate-0 group-hover:scale-110 pointer-events-none">
                    {project.stack[0]}
                </div>
            )}

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

// --- MODAL COMPONENT ---
const slideVariants = {
    enter: (direction: number) => ({
        x: direction > 0 ? 1000 : -1000,
        opacity: 0,
        zIndex: 0
    }),
    center: {
        zIndex: 1,
        x: 0,
        opacity: 1
    },
    exit: (direction: number) => ({
        zIndex: 0,
        x: direction < 0 ? 1000 : -1000,
        opacity: 0
    })
};
const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => Math.abs(offset) * velocity;

const ProjectModal = ({ project, onClose }: { project: Project, onClose: () => void }) => {
    const [[page, direction], setPage] = useState([0, 0]);
    
    // Prevent body scroll when modal opens
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'unset'; };
    }, []);

    const activeImages = project.galleryImages?.length ? project.galleryImages : (project.image ? [project.image] : []);
    const imageIndex = Math.abs(page % activeImages.length);

    useEffect(() => {
        if (activeImages.length <= 1) return;
        const interval = setInterval(() => setPage([page + 1, 1]), 4000);
        return () => clearInterval(interval);
    }, [activeImages.length, page]);

    const paginate = (newDirection: number) => setPage([page + newDirection, newDirection]);

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/80 backdrop-blur-md"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="bg-[#0f1115] w-full max-w-5xl md:max-h-[90vh] max-h-[95vh] rounded-3xl border border-gray-800 overflow-hidden flex flex-col shadow-2xl relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-50 p-2.5 bg-black/50 backdrop-blur rounded-full hover:bg-white hover:text-black transition-colors text-white border border-white/10"
                >
                    <FiX size={20} />
                </button>

                <div className="overflow-y-auto w-full h-full text-white">
                    
                    {/* Header Image Slider */}
                    <div className="w-full h-[250px] md:h-[450px] relative flex items-center justify-center bg-gray-900 group overflow-hidden">
                        {activeImages.length === 0 ? (
                            <div className="text-gray-600 flex flex-col items-center">
                                <FiLayers size={48} className="mb-2" />
                                <span className="text-sm font-mono tracking-widest uppercase">No Image</span>
                            </div>
                        ) : (
                            <>
                                <AnimatePresence initial={false} custom={direction}>
                                    <motion.div
                                        key={page}
                                        custom={direction} variants={slideVariants}
                                        initial="enter" animate="center" exit="exit"
                                        transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
                                        drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={1}
                                        onDragEnd={(e, { offset, velocity }) => {
                                            const swipe = swipePower(offset.x, velocity.x);
                                            if (swipe < -swipeConfidenceThreshold) paginate(1);
                                            else if (swipe > swipeConfidenceThreshold) paginate(-1);
                                        }}
                                        className="absolute inset-0 w-full h-full"
                                    >
                                        <Image src={activeImages[imageIndex]} alt={project.title} fill className="object-cover" draggable={false} />
                                    </motion.div>
                                </AnimatePresence>

                                {/* Controls */}
                                {activeImages.length > 1 && (
                                    <>
                                        <button onClick={(e) => { e.stopPropagation(); paginate(-1); }} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/40 hover:bg-white hover:text-black text-white rounded-full backdrop-blur transition-all opacity-0 group-hover:opacity-100 z-30 border border-white/10">
                                            <FiChevronLeft size={24} />
                                        </button>
                                        <button onClick={(e) => { e.stopPropagation(); paginate(1); }} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/40 hover:bg-white hover:text-black text-white rounded-full backdrop-blur transition-all opacity-0 group-hover:opacity-100 z-30 border border-white/10">
                                            <FiChevronRight size={24} />
                                        </button>
                                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-30 bg-black/20 px-3 py-2 rounded-full backdrop-blur-sm border border-white/10">
                                            {activeImages.map((_, idx) => (
                                                <div key={idx} onClick={(e) => { e.stopPropagation(); const diff = idx - imageIndex; if (diff !== 0) paginate(diff); }} className={`w-2 h-2 rounded-full cursor-pointer transition-all ${idx === imageIndex ? 'bg-white w-6' : 'bg-white/40 hover:bg-white/80'}`}></div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </>
                        )}
                        {/* Overlay Gradient Soft */}
                        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0f1115] to-transparent z-10 pointer-events-none" />
                    </div>

                    {/* Content Details */}
                    <div className="p-6 md:p-12 md:-mt-10 relative z-20">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                            
                            {/* Main Info */}
                            <div className="lg:col-span-2 space-y-6">
                                <div>
                                    <span className="text-primary font-mono text-sm tracking-widest uppercase mb-2 block">{project.category}</span>
                                    <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">{project.title}</h2>
                                </div>
                                <p className="text-gray-300 text-lg leading-relaxed text-justify">
                                    {project.desc}
                                </p>
                                
                                {project.techDetails && (
                                    <div className="mt-8 p-6 bg-gray-900 border border-gray-800 rounded-2xl">
                                        <h4 className="text-white font-bold mb-3">Technical Overview</h4>
                                        <p className="text-sm text-gray-400 font-mono leading-relaxed">
                                            {project.techDetails}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Sidebar Info */}
                            <div className="space-y-8">
                                <div>
                                    <h4 className="text-gray-500 uppercase text-xs font-bold tracking-widest mb-4">Technologies</h4>
                                    <div className="flex flex-wrap gap-4 text-3xl text-gray-300">
                                        {project.stack}
                                    </div>
                                </div>

                                {project.features && (
                                    <div>
                                        <h4 className="text-gray-500 uppercase text-xs font-bold tracking-widest mb-4">Key Features</h4>
                                        <ul className="space-y-3">
                                            {project.features.map((feature, i) => (
                                                <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                                                    <span className="text-primary mt-1">▹</span>
                                                    <span>{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {project.externalLink && (
                                    <div className="pt-4 border-t border-gray-800">
                                        <a href={project.externalLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-primary hover:text-white transition-colors">
                                            Visit Project <FiExternalLink />
                                        </a>
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>

                </div>
            </motion.div>
        </motion.div>
    );
};

export default ProjectBento;