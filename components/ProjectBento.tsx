// src/components/ProjectBento.tsx
"use client";

import React, { useState, useEffect, JSX } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiGithub, FiExternalLink, FiX, FiLayers, FiLayout, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { SiLaravel, SiMysql, SiTailwindcss, SiFigma, SiReact, SiNodedotjs } from 'react-icons/si';
import Image from 'next/image';

// --- TIPE DATA PROYEK ---
type Project = {
    id: number;
    title: string;
    category: "UI/UX Design" | "Web Development";
    desc: string;
    stack: React.ReactNode[];
    span: string;
    bg: string;
    image?: string;

    type: "external" | "gallery";
    externalLink?: string;

    galleryImages?: string[];
    features?: string[];
    techDetails?: string;
};

// --- DATA PROYEK ---
const projects: Project[] = [
    // 1. PROYEK FIGMA (Mobile)
    {
        id: 1,
        title: "Wallet Go! Mobile App",
        category: "UI/UX Design",
        desc: "Desain aplikasi dompet digital modern dengan fokus pada kemudahan transfer dan top-up.",
        stack: [<SiFigma key="figma" />],
        span: "md:col-span-1 md:row-span-1",
        bg: "bg-gray-800",
        image: "/projects/wallet-mobile.png",
        type: "external",
        externalLink: "https://www.figma.com/design/JE3q5Cftdo8iYZZH9Z9zWa/Wallet-Go-?node-id=0-1&t=q59sqGfb1XTIUifw-1"
    },

    // 2. PROYEK FIGMA (Web)
    {
        id: 2,
        title: "Wallet Go! Website",
        category: "UI/UX Design",
        desc: "Landing page responsif untuk promosi aplikasi Wallet Go!.",
        stack: [<SiFigma key="figma" />],
        span: "md:col-span-1 md:row-span-1",
        bg: "bg-gray-800",
        image: "/projects/wallet-web.png",
        type: "external",
        externalLink: "https://www.figma.com/design/6uCiDMV4E78OdkMfef7lKV/Wallet-Go---Web?node-id=0-1&t=AGR0frFOBnCxaG54-1"
    },

    // 3. PROYEK WEB UTAMA (EMR)
    {
        id: 3,
        title: "Electronic Medical Records",
        category: "Web Development",
        desc: "Sistem manajemen pasien dan rekam medis elektronik untuk praktik bidan mandiri.",
        stack: [<SiLaravel key="laravel" />, <SiMysql key="mysql" />, <SiTailwindcss key="tw" />],
        span: "md:col-span-2 md:row-span-2",
        bg: "bg-gradient-to-br from-blue-900 to-slate-900",
        image: "/projects/emr-thumb.png",
        type: "gallery",
        galleryImages: [
            "/projects/emr-thumb.png",
            "/projects/emr-1.png",
            "/projects/emr-2.png"
        ],
        techDetails: "Dibangun menggunakan Laravel 10 dengan arsitektur MVC. Database MySQL dinormalisasi untuk menangani ribuan data pasien. Frontend menggunakan Blade Template + Tailwind CSS.",
        features: [
            "Manajemen Data Pasien & Rekam Medis",
            "Pencetakan Surat Rujukan & Resep Otomatis",
            "Laporan Kunjungan Harian & Bulanan",
            "Sistem Billing & Kasir Sederhana"
        ]
    },

    // 4. PROYEK WEB (Sentry)
    {
        id: 4,
        title: "Office Sentry App",
        category: "Web Development",
        desc: "Aplikasi manajemen keamanan kantor dan monitoring personil.",
        stack: [<SiLaravel key="laravel" />, <SiTailwindcss key="tw" />],
        span: "md:col-span-1 md:row-span-2",
        bg: "bg-gray-900",
        image: "/projects/sentry-thumb.png",
        type: "gallery",
        galleryImages: ["/projects/sentry-thumb.png", "/projects/sentry-1.png"],
        techDetails: "Sistem monitoring internal untuk mencatat aktivitas keamanan kantor BKPM. Menggunakan Laravel Breeze untuk autentikasi.",
        features: [
            "Real-time Monitoring Dashboard",
            "Shift Management System",
            "QR Code Check-in",
            "Incident Reporting"
        ]
    },
];

// --- KONFIGURASI ANIMASI SLIDE ---
const slideVariants = {
    enter: (direction: number) => ({
        x: direction > 0 ? 1000 : -1000, // Masuk dari kanan jika next, kiri jika prev
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
        x: direction < 0 ? 1000 : -1000, // Keluar ke kiri jika next, kanan jika prev
        opacity: 0
    })
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
};

const ProjectBento = () => {
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    // State untuk Slider: [[index, direction]]
    // Kita simpan direction agar animasi tahu harus geser ke kiri atau kanan
    const [[page, direction], setPage] = useState([0, 0]);

    // Reset slider ke 0 setiap kali membuka project baru
    useEffect(() => {
        if (selectedProject) {
            setPage([0, 0]);
        }
    }, [selectedProject]);

    // Helper untuk mendapatkan list gambar aktif
    const getActiveImages = () => {
        if (!selectedProject) return [];
        return (selectedProject.galleryImages && selectedProject.galleryImages.length > 0)
            ? selectedProject.galleryImages
            : (selectedProject.image ? [selectedProject.image] : []);
    };

    const activeImages = getActiveImages();

    // Menghitung index gambar saat ini (0, 1, 2...) dari page infinite
    const imageIndex = Math.abs(page % activeImages.length);

    // Logic Auto Slide
    useEffect(() => {
        if (!selectedProject || activeImages.length <= 1) return;

        const interval = setInterval(() => {
            paginate(1); // Auto slide selalu ke arah "Next"
        }, 4000);

        return () => clearInterval(interval);
    }, [selectedProject, activeImages.length, page]); // Re-run effect saat page berubah

    // Fungsi Navigasi (Next/Prev)
    const paginate = (newDirection: number) => {
        setPage([page + newDirection, newDirection]);
    };

    return (
        <section id="work" className="w-full min-h-screen bg-dark py-20 px-6 md:px-20">
            <div className="max-w-7xl mx-auto mb-16">
                <h2 className="text-3xl md:text-5xl font-bold mb-4">
                    Selected <span className="text-primary">Work</span>
                </h2>
                <p className="text-gray-400 max-w-xl">
                    Kombinasi antara desain antarmuka (Figma) dan sistem web kompleks (Laravel/React).
                </p>
            </div>

            {/* GRID LAYOUT */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
                {projects.map((project, index) => (
                    <ProjectCard
                        key={project.id}
                        project={project}
                        index={index}
                        onClick={() => {
                            if (project.type === 'external' && project.externalLink) {
                                window.open(project.externalLink, '_blank');
                            } else {
                                setSelectedProject(project);
                            }
                        }}
                    />
                ))}
            </div>

            {/* MODAL / POPUP DETAIL */}
            <AnimatePresence>
                {selectedProject && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                        onClick={() => setSelectedProject(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 50 }}
                            className="bg-gray-900 w-full max-w-5xl max-h-[90vh] rounded-2xl border border-gray-700 overflow-hidden flex flex-col shadow-2xl relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setSelectedProject(null)}
                                className="absolute top-4 right-4 z-20 p-2 bg-black/50 rounded-full hover:bg-red-500 hover:text-white transition-colors text-white"
                            >
                                <FiX size={24} />
                            </button>

                            <div className="overflow-y-auto p-0 h-full">
                                {/* --- HEADER GAMBAR (SLIDER AREA) --- */}
                                <div className={`w-full h-[300px] md:h-[450px] relative flex items-center justify-center overflow-hidden bg-gray-800 group`}>

                                    {activeImages.length === 0 ? (
                                        <div className="text-white/20"><FiLayers size={64} /></div>
                                    ) : (
                                        <>
                                            {/* Container Gambar dengan Animasi Slide */}
                                            <AnimatePresence initial={false} custom={direction}>
                                                <motion.div
                                                    key={page} // Key harus unik per halaman agar dideteksi sebagai elemen baru
                                                    custom={direction}
                                                    variants={slideVariants}
                                                    initial="enter"
                                                    animate="center"
                                                    exit="exit"
                                                    transition={{
                                                        x: { type: "spring", stiffness: 300, damping: 30 },
                                                        opacity: { duration: 0.2 }
                                                    }}
                                                    drag="x" // Fitur swipe manual (touchscreen support)
                                                    dragConstraints={{ left: 0, right: 0 }}
                                                    dragElastic={1}
                                                    onDragEnd={(e, { offset, velocity }) => {
                                                        const swipe = swipePower(offset.x, velocity.x);
                                                        if (swipe < -swipeConfidenceThreshold) {
                                                            paginate(1);
                                                        } else if (swipe > swipeConfidenceThreshold) {
                                                            paginate(-1);
                                                        }
                                                    }}
                                                    className="absolute inset-0 w-full h-full"
                                                >
                                                    <Image
                                                        src={activeImages[imageIndex]}
                                                        alt={selectedProject.title}
                                                        fill
                                                        className="object-cover"
                                                        draggable={false}
                                                    />
                                                </motion.div>
                                            </AnimatePresence>

                                            {/* Tombol Navigasi (Hanya muncul jika gambar > 1) */}
                                            {activeImages.length > 1 && (
                                                <>
                                                    {/* Tombol Kiri */}
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); paginate(-1); }}
                                                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-primary hover:text-black text-white rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 z-10"
                                                    >
                                                        <FiChevronLeft size={24} />
                                                    </button>

                                                    {/* Tombol Kanan */}
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); paginate(1); }}
                                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-primary hover:text-black text-white rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 z-10"
                                                    >
                                                        <FiChevronRight size={24} />
                                                    </button>

                                                    {/* Indikator Dots (Bawah) */}
                                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                                                        {activeImages.map((_, idx) => (
                                                            <div
                                                                key={idx}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    // Logika untuk lompat ke dot tertentu
                                                                    const diff = idx - imageIndex;
                                                                    if (diff !== 0) paginate(diff);
                                                                }}
                                                                className={`w-2 h-2 rounded-full cursor-pointer transition-all ${idx === imageIndex ? 'bg-primary w-6' : 'bg-white/50 hover:bg-white'}`}
                                                            ></div>
                                                        ))}
                                                    </div>
                                                </>
                                            )}
                                        </>
                                    )}

                                    <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur px-4 py-1 rounded-full text-primary font-mono text-sm border border-primary/30 z-10">
                                        {selectedProject.category}
                                    </div>
                                </div>

                                {/* Konten Detail */}
                                <div className="p-6 md:p-10 grid grid-cols-1 md:grid-cols-3 gap-10">
                                    <div className="md:col-span-2 space-y-6">
                                        <h2 className="text-3xl md:text-4xl font-bold text-white">{selectedProject.title}</h2>
                                        <p className="text-gray-300 leading-relaxed text-lg">
                                            {selectedProject.desc}
                                        </p>

                                        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                                            <h4 className="text-primary font-bold mb-2 flex items-center gap-2">
                                                <FiLayout /> Technical Overview
                                            </h4>
                                            <p className="text-sm text-gray-400 font-mono leading-relaxed">
                                                {selectedProject.techDetails || "Dokumentasi teknis belum tersedia."}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        <div>
                                            <h4 className="text-gray-400 uppercase text-xs font-bold tracking-wider mb-4">Tech Stack</h4>
                                            <div className="flex flex-wrap gap-3 text-2xl text-gray-300">
                                                {selectedProject.stack}
                                            </div>
                                        </div>
                                        {selectedProject.features && (
                                            <div>
                                                <h4 className="text-gray-400 uppercase text-xs font-bold tracking-wider mb-4">Key Features</h4>
                                                <ul className="space-y-2">
                                                    {selectedProject.features.map((feature, i) => (
                                                        <li key={i} className="flex items-start gap-2 text-sm text-gray-300 border-b border-gray-800 pb-2 last:border-0">
                                                            <span className="text-secondary mt-1">▹</span>
                                                            {feature}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

// --- SUB-KOMPONEN KARTU ---
const ProjectCard = ({ project, index, onClick }: { project: Project, index: number, onClick: () => void }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={onClick}
            className={`relative group overflow-hidden rounded-2xl border border-gray-700/50 cursor-pointer ${project.span} ${project.bg}`}
        >
            {project.image && (
                <>
                    <div className="absolute inset-0 w-full h-full">
                        <Image
                            src={project.image}
                            alt={project.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent z-10 transition-transform duration-500 ease-in-out origin-bottom group-hover:scale-y-0"></div>
                </>
            )}

            {!project.image && (
                <div className="absolute -right-4 -bottom-4 text-9xl text-white/5 rotate-12 group-hover:rotate-0 transition-transform duration-500">
                    {project.stack[0]}
                </div>
            )}

            <div className="absolute inset-0 p-6 flex flex-col justify-between z-20">
                <div className="flex justify-between items-start">
                    <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-gray-600 text-xs font-mono text-gray-300 shadow-lg">
                        {project.category}
                    </div>
                    <div className="p-2 bg-black/50 rounded-full text-white/80 hover:bg-primary hover:text-black transition-colors">
                        {project.type === 'external' ? <FiExternalLink /> : <FiLayers />}
                    </div>
                </div>

                <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-1 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                        {project.title}
                    </h3>
                    <p className="text-gray-200 text-sm mb-4 line-clamp-2 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                        {project.desc}
                    </p>
                    <div className="flex items-center gap-3 text-lg text-gray-200 drop-shadow-md">
                        {project.stack}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ProjectBento;