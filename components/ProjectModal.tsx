import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiExternalLink, FiX, FiLayers, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Image from 'next/image';
import { Project } from '@/data/projects';

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

export default function ProjectModal({ project, onClose }: { project: Project, onClose: () => void }) {
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
                                        className="absolute inset-0 w-full h-full overflow-y-auto overflow-x-hidden custom-scrollbar"
                                    >
                                        <Image 
                                            src={activeImages[imageIndex]} 
                                            alt={project.title} 
                                            width={0} 
                                            height={0} 
                                            sizes="100vw"
                                            className="w-full h-auto min-h-full object-cover object-top block" 
                                            draggable={false} 
                                        />
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
}
