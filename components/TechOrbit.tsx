// src/components/TechOrbit.tsx
"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
// Import ikon lama + ikon baru (Laravel, MySQL, Figma)
import {
    SiReact,
    SiNodedotjs,
    SiNextdotjs,
    SiTailwindcss,
    SiTypescript,
    SiMongodb,
    SiPostgresql,
    SiDocker,
    SiLaravel, // Baru
    SiMysql,   // Baru
    SiFigma    // Baru
} from 'react-icons/si';

// Data Tech Stack Gabungan (Original + CV)
const techStack = [
    // --- Skill Utama dari CV ---
    { name: 'Laravel', icon: <SiLaravel />, color: '#FF2D20', desc: 'PHP Framework', exp: 'Expert' },
    { name: 'MySQL', icon: <SiMysql />, color: '#4479A1', desc: 'Relational Database', exp: 'Advanced' },
    { name: 'Figma', icon: <SiFigma />, color: '#F24E1E', desc: 'UI/UX Design', exp: 'Expert' },

    // --- Stack Modern (Bawaan Template) ---
    { name: 'React', icon: <SiReact />, color: '#61DAFB', desc: 'Frontend Library', exp: 'Intermediate' },
    { name: 'Node.js', icon: <SiNodedotjs />, color: '#339933', desc: 'Backend Runtime', exp: 'Basic' },
    { name: 'Next.js', icon: <SiNextdotjs />, color: '#FFFFFF', desc: 'React Framework', exp: 'Intermediate' },
    { name: 'Tailwind', icon: <SiTailwindcss />, color: '#38B2AC', desc: 'Styling Engine', exp: 'Expert' },
    { name: 'TypeScript', icon: <SiTypescript />, color: '#3178C6', desc: 'Type Safety', exp: 'Basic' },
    { name: 'MongoDB', icon: <SiMongodb />, color: '#47A248', desc: 'NoSQL Database', exp: 'Basic' },
    { name: 'PostgreSQL', icon: <SiPostgresql />, color: '#336791', desc: 'SQL Database', exp: 'Basic' },
    { name: 'Docker', icon: <SiDocker />, color: '#2496ED', desc: 'Containerization', exp: 'Basic' },
];

const TechOrbit = () => {
    const [activeTech, setActiveTech] = useState<typeof techStack[0] | null>(null);

    return (
        <section id="stack" className="relative w-full min-h-screen bg-dark overflow-hidden flex flex-col items-center justify-center py-20">

            {/* Section Title */}
            <div className="absolute top-10 text-center z-10 px-4">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Tech Ecosystem</h2>
                <p className="text-gray-400 font-mono text-sm">Empowered by Laravel & Modern Stack.</p>
            </div>

            {/* Main Orbit Container */}
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative w-[340px] h-[340px] md:w-[600px] md:h-[600px] flex items-center justify-center mt-10 md:mt-20"
            >

                {/* Orbit Rings (Thin Lines) */}
                <div className="absolute w-full h-full border border-gray-700/50 rounded-full"></div>
                <div className="absolute top-1/2 left-1/2 w-[65%] h-[65%] -translate-x-1/2 -translate-y-1/2 border border-gray-700/30 rounded-full"></div>

                {/* Center Core - Changes on Hover */}
                <div className="relative z-20 w-32 h-32 md:w-48 md:h-48 bg-card/80 backdrop-blur-md border border-gray-600 rounded-full flex flex-col items-center justify-center text-center p-4 transition-all duration-300 shadow-[0_0_30px_rgba(0,240,255,0.1)]">
                    {activeTech ? (
                        <motion.div
                            key={activeTech.name}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center"
                        >
                            <div className="text-3xl md:text-5xl mb-1 md:mb-2" style={{ color: activeTech.color }}>{activeTech.icon}</div>
                            <h3 className="text-white font-bold text-base md:text-xl">{activeTech.name}</h3>
                            <span className="text-[10px] md:text-xs text-primary font-mono bg-primary/10 px-2 py-0.5 rounded mt-1">{activeTech.exp}</span>
                            <p className="text-gray-400 text-[10px] md:text-xs mt-1">{activeTech.desc}</p>
                        </motion.div>
                    ) : (
                        <div className="flex flex-col items-center animate-pulse">
                            <span className="text-3xl md:text-5xl mb-2">⚛️</span>
                            <h3 className="text-white font-bold text-sm md:text-lg">Full Stack</h3>
                            <p className="text-gray-500 text-[10px] md:text-xs text-center px-2">Hover orbit icons</p>
                        </div>
                    )}
                </div>

                {/* Rotator Container - Berputar */}
                <div className="absolute w-full h-full animate-spin-slow group hover:pause-animation">
                    {techStack.map((tech, index) => {
                        // Matematika untuk menempatkan item melingkar
                        const angle = (360 / techStack.length) * index;

                        return (
                            <div
                                key={index}
                                className="absolute top-1/2 left-1/2 w-10 h-10 md:w-14 md:h-14 -ml-5 -mt-5 md:-ml-7 md:-mt-7 cursor-pointer"
                                style={{
                                    // Responsive translate: Jarak ikon dari pusat
                                    transform: `rotate(${angle}deg) translate(var(--orbit-radius)) rotate(-${angle + 360}deg)`,
                                }}
                                onMouseEnter={() => setActiveTech(tech)}
                                onMouseLeave={() => setActiveTech(null)}
                            >
                                {/* Responsive Radius CSS Variable */}
                                <style jsx>{`
                  div {
                    --orbit-radius: 170px; /* Mobile */
                  }
                  @media (min-width: 768px) {
                    div {
                      --orbit-radius: 300px; /* Laptop */
                    }
                  }
                `}</style>

                                {/* Icon Item */}
                                <div
                                    className="w-full h-full bg-card border border-gray-600 rounded-full flex items-center justify-center text-xl md:text-3xl hover:scale-110 hover:border-primary transition-all duration-300 shadow-lg animate-reverse-spin group-hover:pause-animation"
                                    style={{ color: tech.color }}
                                >
                                    {tech.icon}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </motion.div>

        </section>
    );
};

export default TechOrbit;