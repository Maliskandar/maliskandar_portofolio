"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiGlobe, FiPlay } from 'react-icons/fi';
import { SiLaravel, SiMysql, SiPhp } from 'react-icons/si';

// Definisi tipe data untuk properti bintang
type Star = {
    id: number;
    top: number;
    left: number;
    size: number;
    duration: number;
    delay: number;
};

const BackendSpotlight = () => {
    const [isSimulating, setIsSimulating] = useState(false);
    const [hasRun, setHasRun] = useState(false);
    const [logs, setLogs] = useState<string[]>(["> php artisan serve", "> Server running on 127.0.0.1:8000"]);

    // State untuk menampung data bintang
    const [stars, setStars] = useState<Star[]>([]);

    // Generate bintang di sisi client (useEffect) agar aman dari error Hydration
    useEffect(() => {
        const generateStars = () => {
            const newStars = Array.from({ length: 50 }).map((_, i) => ({
                id: i,
                top: Math.random() * 100, // 0-100% vertikal
                left: Math.random() * 100, // 0-100% horizontal
                size: Math.random() * 2 + 1, // Ukuran 1-3px
                duration: Math.random() * 3 + 2, // Durasi kedip 2-5 detik
                delay: Math.random() * 2, // Delay acak
            }));
            setStars(newStars);
        };
        generateStars();
    }, []);

    // Fungsi untuk menjalankan simulasi Request Laravel
    const runSimulation = () => {
        if (isSimulating) return;
        setIsSimulating(true);
        setHasRun(true);
        setLogs(["> php artisan serve", "> Waiting for requests..."]);

        // Jadwal log ala Laravel
        const steps = [
            { msg: "> [HTTP] GET /dashboard/patients", delay: 500, type: 'info' },
            { msg: "> [Routing] Matched route: web.php (auth:sanctum)", delay: 1200, type: 'info' },
            { msg: "> [Controller] PatientController@index hit", delay: 2000, type: 'process' },
            { msg: "> [Eloquent] select * from `patients` where `active` = 1", delay: 3000, type: 'db' },
            { msg: "> [View] Rendering: patients.index (Blade)", delay: 4000, type: 'process' },
            { msg: "> [200] OK - Response sent in 45ms", delay: 5000, type: 'success' },
        ];

        steps.forEach(({ msg, delay }) => {
            setTimeout(() => {
                setLogs((prev) => [...prev, msg]);
            }, delay);
        });

        setTimeout(() => setIsSimulating(false), 6000);
    };

    return (
        <section className="w-full py-20 bg-dark relative overflow-hidden text-white">

            {/* ========================================= */}
            {/* 🌌 SPACE BACKGROUND ANIMATION 🌌         */}
            {/* ========================================= */}
            {/* Stars Container */}
            <div className="absolute inset-0 opacity-10"
                style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
                {stars.map((star) => (
                    <motion.div
                        key={star.id}
                        className="absolute bg-white rounded-full opacity-20"
                        style={{
                            top: `${star.top}%`,
                            left: `${star.left}%`,
                            width: `${star.size}px`,
                            height: `${star.size}px`,
                        }}
                        animate={{
                            opacity: [0.2, 1, 0.2], // Efek twinkle (kedip)
                            scale: [1, 1.2, 1], // Sedikit membesar saat berkedip
                        }}
                        transition={{
                            duration: star.duration,
                            repeat: Infinity,
                            delay: star.delay,
                            ease: "easeInOut"
                        }}
                    />
                ))}
            </div>

            {/* ========================================= */}
            {/* END BACKGROUND                           */}
            {/* ========================================= */}


            <div className="max-w-7xl mx-auto px-6 md:px-20 relative z-10">

                {/* Header */}
                <div className="mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Arsitektur <span className="text-secondary">MVC</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl">
                        Penerapan pola desain Model-View-Controller menggunakan <span className="text-primary">Laravel</span>.
                        Memastikan kode yang bersih, aman, dan mudah dikelola (Maintainable).
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">

                    {/* Kolom Kiri: Visualisasi Diagram MVC */}
                    <motion.div 
                        onViewportEnter={() => {
                            if (!hasRun) runSimulation();
                        }}
                        viewport={{ once: true, amount: 0.5 }}
                        className="bg-card/30 backdrop-blur-md border border-gray-700/50 rounded-xl p-8 relative flex flex-col justify-between min-h-[500px]"
                    >
                        {/* Label Arsitektur */}
                        <div className="absolute top-4 left-4 text-xs font-mono text-gray-500 uppercase tracking-widest flex items-center gap-2">
                            <SiLaravel className="text-red-500" /> Laravel System Flow
                        </div>

                        {/* Diagram Flow */}
                        <div className="flex flex-col gap-6 mt-8 relative">

                            {/* Garis Vertikal Penghubung (Animated SVG Line) */}
                            <svg className="absolute left-[20px] top-8 bottom-8 w-2 h-[calc(100%-4rem)] z-0" overflow="visible">
                                <motion.line
                                    x1="4"
                                    y1="0"
                                    x2="4"
                                    y2="100%"
                                    stroke="#4b5563"
                                    strokeWidth="2"
                                    strokeDasharray="6 6"
                                    initial={{ pathLength: 0 }}
                                    whileInView={{ pathLength: 1 }}
                                    viewport={{ once: true, amount: 0.5 }}
                                    transition={{ duration: 2, ease: "easeOut" }}
                                />
                            </svg>

                            {/* Node 1: Route */}
                            <div className="flex items-center gap-4 relative z-10">
                                <div className={`w-12 h-12 rounded-lg flex items-center justify-center border transition-colors duration-500 ${isSimulating ? 'bg-orange-900/30 border-orange-500 text-orange-400' : 'bg-gray-800 border-gray-600 text-gray-500'}`}>
                                    <FiGlobe size={24} />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-sm">Routing (web.php)</h4>
                                    <p className="text-xs text-gray-400">Menangani Request & Middleware</p>
                                </div>
                                {/* Animasi Dot 1 */}
                                {isSimulating && (
                                    <motion.div
                                        className="absolute left-[19px] top-8 w-3 h-3 bg-orange-500 rounded-full shadow-[0_0_10px_orange]"
                                        animate={{ y: [0, 65], opacity: [1, 0] }}
                                        transition={{ duration: 1, delay: 0 }}
                                    />
                                )}
                            </div>

                            {/* Node 2: Controller */}
                            <div className="flex items-center gap-4 relative z-10 mt-6">
                                <div className={`w-12 h-12 rounded-lg flex items-center justify-center border transition-colors duration-500 ${isSimulating ? 'bg-blue-900/30 border-purple-500 text-purple-400' : 'bg-gray-800 border-gray-600 text-gray-500'}`}>
                                    <SiPhp size={24} />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-sm">Controller Logic</h4>
                                    <p className="text-xs text-gray-400">Validasi & Business Logic</p>
                                </div>
                                {/* Animasi Dot 2 */}
                                {isSimulating && (
                                    <motion.div
                                        className="absolute left-[19px] top-8 w-3 h-3 bg-purple-500 rounded-full shadow-[0_0_10px_blue]"
                                        animate={{ y: [0, 65], opacity: [1, 0] }}
                                        transition={{ duration: 1, delay: 1 }}
                                    />
                                )}
                            </div>

                            {/* Node 3: Model (Eloquent) */}
                            <div className="flex items-center gap-4 relative z-10 mt-6">
                                <div className={`w-12 h-12 rounded-lg flex items-center justify-center border transition-colors duration-500 ${isSimulating ? 'bg-emerald-900/30 border-blue-500 text-blue-400' : 'bg-gray-800 border-gray-600 text-gray-500'}`}>
                                    <SiMysql size={24} />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-sm">Eloquent ORM</h4>
                                    <p className="text-xs text-gray-400">Query Database MySQL</p>
                                </div>
                                {/* Animasi Dot 3 */}
                                {isSimulating && (
                                    <motion.div
                                        className="absolute left-[19px] top-8 w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_10px_emerald]"
                                        animate={{ y: [0, 65], opacity: [1, 0] }}
                                        transition={{ duration: 1, delay: 2 }}
                                    />
                                )}
                            </div>

                            {/* Node 4: View (Blade) */}
                            <div className="flex items-center gap-4 relative z-10 mt-6">
                                <div className={`w-12 h-12 rounded-lg flex items-center justify-center border transition-colors duration-500 ${isSimulating ? 'bg-pink-900/30 border-red-500 text-red-400' : 'bg-gray-800 border-gray-600 text-gray-500'}`}>
                                    <SiLaravel size={24} />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-sm">Blade View</h4>
                                    <p className="text-xs text-gray-400">Rendering HTML & UI</p>
                                </div>
                            </div>

                        </div>

                        {/* Tombol Simulasi */}
                        <button
                            onClick={runSimulation}
                            disabled={isSimulating}
                            className={`mt-8 w-full py-3 rounded-lg font-mono text-sm flex items-center justify-center gap-2 transition-all
                  ${isSimulating ? 'bg-gray-700 cursor-not-allowed text-gray-400' : 'bg-transparent text-white border border-white hover:bg-white hover:text-black hover:border-black'}
                `}
                        >
                            {isSimulating ? 'Processing Request...' : <><FiPlay /> Run Laravel Request</>}
                        </button>
                    </motion.div>

                    {/* Kolom Kanan: Terminal Logs */}
                    <div className="bg-[#0c0c0c]/90 backdrop-blur-md border border-gray-800 rounded-xl p-6 font-mono text-xs md:text-sm h-full max-h-[500px] overflow-y-auto shadow-2xl relative flex flex-col z-20">
                        {/* Terminal Header */}
                        <div className="flex items-center gap-2 mb-4 border-b border-gray-800 pb-2">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <span className="ml-2 text-gray-500 flex items-center gap-2"><SiPhp /> artisan serve</span>
                        </div>

                        {/* Logs Content */}
                        <div className="space-y-3 flex-1">
                            {logs.map((log, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`
                    ${log.includes('[HTTP]') ? 'text-gray-400' : ''}
                    ${log.includes('[Routing]') ? 'text-orange-300' : ''}
                    ${log.includes('[Controller]') ? 'text-purple-300' : ''}
                    ${log.includes('[Eloquent]') ? 'text-blue-300' : ''}
                    ${log.includes('[View]') ? 'text-red-300' : ''}
                    ${log.includes('[200]') ? 'text-green-400 font-bold' : ''}
                  `}
                                >
                                    {log}
                                </motion.div>
                            ))}
                            {isSimulating && (
                                <motion.div
                                    animate={{ opacity: [0, 1, 0] }}
                                    transition={{ repeat: Infinity, duration: 0.8 }}
                                    className="w-2 h-4 bg-gray-500 inline-block align-middle ml-1"
                                />
                            )}
                        </div>

                        <div className="mt-4 pt-2 border-t border-gray-800 flex justify-between text-[10px] text-gray-600">
                            <span>Laravel v10.x</span>
                            <span>PHP v8.2</span>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default BackendSpotlight;