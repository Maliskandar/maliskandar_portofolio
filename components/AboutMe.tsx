"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FiDownload, FiBriefcase, FiBookOpen } from 'react-icons/fi';

const experiences = [
    {
        id: 1,
        role: "Full-Stack Web Developer Intern",
        company: "Independent Midwife Practice",
        date: "Apr 2025 – Aug 2025",
        desc: "Developed a web-based application (EMR) to facilitate patient management and digitize medical records.",
    },
    {
        id: 2,
        role: "Web Developer Intern",
        company: "Ministry of Investment | BKPM",
        date: "Feb 2025 – Apr 2025",
        desc: "Updated and maintained department website using WordPress. Collaborated with cross-functional teams.",
    },
    {
        id: 3,
        role: "Software Engineer Intern",
        company: "Ministry of Investment | BKPM",
        date: "Jan 2024 – Feb 2024",
        desc: "Built a web-based application for office guard management using Laravel to streamline operations.",
    }
];

const AboutMe = () => {
    return (
        <section id="about" className="w-full min-h-screen bg-dark py-20 px-6 md:px-20 border-t border-gray-800/50 relative overflow-hidden">
            
            {/* Background Accent */}
            <div className="absolute top-0 right-0 -mr-40 -mt-40 w-96 h-96 bg-primary/10 blur-[100px] rounded-full pointer-events-none z-0"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-3xl md:text-5xl font-bold mb-16">
                        About <span className="text-primary">Me</span>
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
                    {/* Kiri: Summary & Konteks Profil */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="space-y-8"
                    >
                        <h3 className="text-2xl font-bold text-white mb-4">
                            Passionate Developer Crafting <br /> Seamless Digital Experiences
                        </h3>
                        
                        <div className="space-y-4 text-gray-300 leading-relaxed text-lg text-justify">
                            <p>
                                Hi, saya <strong>Muhammad Akmal Iskandar</strong>. Seorang lulusan Informatika yang sangat mudah beradaptasi dengan pengalaman langsung di ranah Full-Stack Web Development.
                            </p>
                            <p>
                                Saya memiliki keahlian kuat di bidang <em>backend engineering</em> menggunakan <strong>Laravel & MySQL</strong>, yang dibuktikan melalui pengembangan sistem manajemen kompleks untuk sektor pemerintahan dan kesehatan.
                            </p>
                            <p>
                                Di samping itu, saya juga cukup mahir menggunakan ekosistem frontend modern seperti <strong>Next.js, React, dan Tailwind CSS</strong> untuk membangun user interface yang responsif dengan performa tinggi.
                            </p>
                        </div>

                        {/* Education Highlight (Compact format) */}
                        <div className="mt-8 p-6 bg-gray-900/50 border border-gray-800 rounded-2xl flex items-start gap-4">
                            <div className="p-3 bg-primary/10 rounded-xl text-primary mt-1">
                                <FiBookOpen size={24} />
                            </div>
                            <div>
                                <h4 className="text-white font-bold text-lg">Bachelor of Informatics</h4>
                                <p className="text-gray-400">Diponegoro University <span className="text-gray-500 mx-2">•</span> 2021 - 2025</p>
                                <p className="text-sm text-gray-500 mt-2">GPA: 3.14 / 4.00. Focus: Web-based app development.</p>
                            </div>
                        </div>

                        {/* Download CV Action */}
                        <div className="pt-6">
                            <a 
                                href="/CV Muhammad Akmal Iskandar.pdf" 
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-primary hover:text-white transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-primary/30"
                            >
                                <FiDownload size={18} /> Download Full CV
                            </a>
                        </div>
                    </motion.div>

                    {/* Kanan: Timeline Pengalaman */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={{
                            hidden: { opacity: 0 },
                            visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
                        }}
                        className="space-y-8"
                    >
                        <div className="flex items-center gap-3 mb-8">
                            <FiBriefcase className="text-primary text-2xl" />
                            <h3 className="text-2xl font-bold text-white">Work Experience</h3>
                        </div>

                        <div className="relative border-l border-gray-800 ml-3 md:ml-4 space-y-12 pb-4">
                            {experiences.map((exp) => (
                                <motion.div 
                                    key={exp.id}
                                    variants={{
                                        hidden: { opacity: 0, y: -50 }, // Mulai dari atas
                                        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } // Meluncur ke bawah (posisi normal)
                                    }}
                                    className="relative pl-8 md:pl-10"
                                >
                                    {/* Timeline Dot */}
                                    <div className="absolute w-4 h-4 rounded-full bg-primary -left-[8.5px] top-1 shadow-[0_0_10px_rgba(0,240,255,0.8)] border-4 border-dark"></div>
                                    
                                    <div className="bg-gray-900/40 hover:bg-gray-800/60 p-6 rounded-2xl border border-gray-800 hover:border-gray-600 transition-colors duration-300">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 gap-2">
                                            <h4 className="text-xl font-bold text-white">{exp.role}</h4>
                                            <span className="text-xs font-mono text-primary bg-primary/10 px-3 py-1 rounded-full w-fit">
                                                {exp.date}
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-400 mb-3 font-medium uppercase tracking-wider">{exp.company}</div>
                                        <p className="text-gray-400 text-sm leading-relaxed">
                                            {exp.desc}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default AboutMe;
