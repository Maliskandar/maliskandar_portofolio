"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FiAward, FiCalendar } from 'react-icons/fi';

const certifications = [
    {
        id: 1,
        title: "Intermediate Android Application Development",
        issuer: "Dicoding",
        date: "June 2024",
    },
    {
        id: 2,
        title: "Oracle Primavera P6 Professional Project",
        issuer: "Oracle Academy",
        date: "April 2024",
    },
    {
        id: 3,
        title: "Introduction to Programming Basics for Software Developers",
        issuer: "Dicoding",
        date: "February 2024",
    },
    {
        id: 4,
        title: "PL/SQL Database Programming",
        issuer: "Oracle Academy",
        date: "May 2023",
    },
    {
        id: 5,
        title: "Database Programming with SQL",
        issuer: "Oracle Academy",
        date: "March 2023",
    },
    {
        id: 6,
        title: "UI-UX",
        issuer: "Build with Angga",
        date: "August 2022",
    },
    {
        id: 7,
        title: "Diponegoro Big Data School",
        issuer: "Diponegoro University",
        date: "November 2021",
    }
];

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const Certifications = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start center", "end center"]
    });

    // Horizontal spread logic: Completes by the time user scrolls 15% of the section
    const scaleX = useTransform(scrollYProgress, [0, 0.15], [0, 1]);

    return (
        <section ref={sectionRef} id="certifications" className="relative w-full min-h-screen bg-dark py-20 px-6 md:px-20 border-t border-gray-800/50 overflow-hidden">
            
            {/* Horizontal Branch Line (Spreads Left & Right at the top) */}
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gray-800/30 z-0">
                <motion.div 
                    style={{ scaleX }}
                    className="w-full h-full bg-linear-to-r from-transparent via-secondary to-transparent origin-center shadow-[0_0_20px_rgba(0,240,255,0.8)]"
                />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.6 }}
                    className="mb-16 text-center md:text-left"
                >
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">
                        Professional <span className="text-primary">Certifications</span>
                    </h2>
                    <p className="text-gray-400 max-w-xl mx-auto md:mx-0">
                        Validating academic and technical capabilities through courses & licenses held by leading institutions.
                    </p>
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    variants={{
                        hidden: { opacity: 0 },
                        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
                    }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {certifications.map((cert) => (
                        <motion.div
                            key={cert.id}
                            variants={cardVariants}
                            whileHover={{ y: -5, boxShadow: "0 10px 30px -10px rgba(0, 240, 255, 0.1)" }}
                            className="bg-gray-900/30 backdrop-blur-sm border border-gray-800 hover:border-primary/50 rounded-2xl p-6 md:p-8 flex flex-col justify-between transition-colors duration-300 group"
                        >
                            <div>
                                <div className="p-3 bg-gray-800/50 w-fit rounded-lg text-primary mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <FiAward size={24} />
                                </div>
                                <h3 className="text-lg md:text-xl font-bold text-white mb-2 leading-snug group-hover:text-primary transition-colors">
                                    {cert.title}
                                </h3>
                                <p className="text-gray-400 font-medium mb-6">
                                    {cert.issuer}
                                </p>
                            </div>
                            
                            <div className="flex items-center gap-2 text-sm text-gray-500 font-mono border-t border-gray-800/50 pt-4 mt-auto">
                                <FiCalendar />
                                <span>{cert.date}</span>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

            </div>
        </section>
    );
};

export default Certifications;
