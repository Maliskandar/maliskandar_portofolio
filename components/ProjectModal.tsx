import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiExternalLink, FiX, FiLayers, FiChevronLeft, FiChevronRight, FiCheckCircle } from 'react-icons/fi';
import Image from 'next/image';
import { Project } from '@/data/projects';

export default function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Lock body scroll when modal is active
    useEffect(() => {
        const originalStyle = window.getComputedStyle(document.body).overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = originalStyle;
        };
    }, []);

    const activeImages = project.galleryImages?.length
        ? project.galleryImages
        : (project.image ? [project.image] : []);

    const nextImage = () => {
        if (activeImages.length > 1) {
            setCurrentImageIndex((prev) => (prev + 1) % activeImages.length);
        }
    };

    const prevImage = () => {
        if (activeImages.length > 1) {
            setCurrentImageIndex((prev) => (prev - 1 + activeImages.length) % activeImages.length);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-6 bg-black/80 backdrop-blur-md"
            onClick={onClose}
        >
            <motion.div
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "100%", opacity: 0 }}
                transition={{ type: "spring", damping: 28, stiffness: 300 }}
                className="bg-gray-950 w-full max-w-4xl max-h-[90vh] md:max-h-[85vh] rounded-t-[32px] md:rounded-[32px] border border-gray-800/90 overflow-hidden flex flex-col shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] relative text-white"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Mobile Drag Indicator Pill */}
                <div className="flex md:hidden justify-center pt-3 pb-1 bg-gray-950">
                    <div className="w-12 h-1.5 rounded-full bg-gray-800" />
                </div>

                {/* Sticky Header Bar */}
                <div className="flex items-center justify-between px-5 md:px-7 py-3.5 md:py-4 border-b border-gray-800/80 bg-gray-950/90 backdrop-blur-md sticky top-0 z-30">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <span className="text-[10px] font-mono font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 shrink-0">
                            {project.category}
                        </span>
                        <h3 className="text-sm md:text-lg font-bold truncate text-gray-200">
                            {project.title}
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full bg-gray-900 hover:bg-primary hover:text-dark text-gray-400 hover:text-dark transition-all border border-gray-800 shrink-0 cursor-pointer ml-3"
                        aria-label="Close modal"
                    >
                        <FiX size={18} />
                    </button>
                </div>

                {/* Modal Scrollable Body */}
                <div className="overflow-y-auto w-full h-full custom-scrollbar scrollbar-none">
                    {/* Image Gallery Showcase */}
                    {activeImages.length > 0 ? (
                        <div className="relative w-full aspect-[16/9] md:aspect-[16/9] bg-gray-900 overflow-hidden group">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentImageIndex}
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.02 }}
                                    transition={{ duration: 0.3 }}
                                    className="relative w-full h-full"
                                >
                                    <Image
                                        src={activeImages[currentImageIndex]}
                                        alt={`${project.title} screenshot ${currentImageIndex + 1}`}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 900px"
                                        className="object-cover object-top"
                                        priority
                                    />
                                </motion.div>
                            </AnimatePresence>

                            {/* Carousel Controls */}
                            {activeImages.length > 1 && (
                                <>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-primary hover:text-dark text-white backdrop-blur-md border border-white/10 transition-all z-20 cursor-pointer"
                                    >
                                        <FiChevronLeft size={20} />
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-primary hover:text-dark text-white backdrop-blur-md border border-white/10 transition-all z-20 cursor-pointer"
                                    >
                                        <FiChevronRight size={20} />
                                    </button>

                                    {/* Pagination Dots */}
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 z-20">
                                        {activeImages.map((_, idx) => (
                                            <button
                                                key={idx}
                                                onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx); }}
                                                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                                                    idx === currentImageIndex ? 'w-5 bg-primary' : 'w-1.5 bg-white/40 hover:bg-white/70'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="w-full h-44 bg-gray-900 flex flex-col items-center justify-center text-gray-600">
                            <FiLayers size={36} className="mb-2" />
                            <span className="text-xs font-mono tracking-widest uppercase">No Preview Image</span>
                        </div>
                    )}

                    {/* Details Content Container */}
                    <div className="p-5 md:p-8 space-y-6">
                        {/* Title & Category Header */}
                        <div>
                            <span className="text-primary font-mono text-xs tracking-widest uppercase mb-1 block">
                                {project.category}
                            </span>
                            <h2 className="text-2xl md:text-4xl font-bold text-white tracking-tight mb-2.5">
                                {project.title}
                            </h2>
                            <p className="text-gray-300 text-xs md:text-base leading-relaxed">
                                {project.desc}
                            </p>
                        </div>

                        {/* Tech Stack Icons Grid */}
                        <div className="bg-gray-900/60 border border-gray-800/80 rounded-2xl p-4 md:p-5">
                            <h4 className="text-gray-400 font-mono text-xs uppercase tracking-wider mb-3">
                                Technology Stack
                            </h4>
                            <div className="flex flex-wrap items-center gap-3 text-2xl text-primary">
                                {project.stack.map((icon, i) => (
                                    <div key={i} className="p-2.5 rounded-xl bg-gray-950 border border-gray-800 text-primary shadow-md hover:border-primary/40 transition-colors">
                                        {icon}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Technical Overview */}
                        {project.techDetails && (
                            <div className="bg-gray-900/40 border border-gray-800/80 rounded-2xl p-4 md:p-5">
                                <h4 className="text-gray-200 font-semibold text-sm mb-2">
                                    Technical Architecture & Details
                                </h4>
                                <p className="text-gray-400 text-xs md:text-sm font-mono leading-relaxed">
                                    {project.techDetails}
                                </p>
                            </div>
                        )}

                        {/* Key Features List */}
                        {project.features && project.features.length > 0 && (
                            <div>
                                <h4 className="text-gray-200 font-semibold text-sm mb-3">
                                    Key Features & Highlights
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                                    {project.features.map((feature, i) => (
                                        <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-gray-900/40 border border-gray-800/60 text-xs md:text-sm text-gray-300">
                                            <FiCheckCircle size={16} className="text-primary shrink-0 mt-0.5" />
                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sticky Action Footer */}
                {project.externalLink && (
                    <div className="p-4 bg-gray-950/95 border-t border-gray-800/80 sticky bottom-0 z-30">
                        <a
                            href={project.externalLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full py-3.5 px-6 bg-primary text-dark font-bold text-sm rounded-2xl hover:bg-cyan-300 transition-colors duration-300 shadow-[0_0_20px_rgba(0,240,255,0.3)]"
                        >
                            <span>Visit Live Project</span>
                            <FiExternalLink size={16} />
                        </a>
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
}

