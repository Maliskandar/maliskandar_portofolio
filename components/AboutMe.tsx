"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
    FiDownload, FiBriefcase, FiBookOpen,
    FiMapPin, FiFileText,
} from 'react-icons/fi';
import {
    SiLaravel, SiNextdotjs, SiReact, SiTypescript,
    SiTailwindcss, SiMysql, SiPhp, SiNodedotjs, SiFigma,
} from 'react-icons/si';

const experiences = [
    {
        id: 1,
        role: "Web Developer Intern",
        company: "Independent Midwife Practice (Bidan Delima)",
        date: "Apr 2025 – Aug 2025",
        desc: "Built a web-based Electronic Medical Record (EMR) platform with Laravel & MySQL, covering patient management, medical record entry, prescription & billing, and multi-format report printing.",
        tags: ["Laravel", "MySQL", "EMR"],
    },
    {
        id: 2,
        role: "Web Developer Intern",
        company: "Master of Information Systems (Diponegoro University)",
        date: "Feb 2025 – Apr 2025",
        desc: "Maintained and revamped the department website on WordPress, collaborating with cross-functional teams to improve delivery and overall site performance.",
        tags: ["WordPress", "Teamwork"],
    },
    {
        id: 3,
        role: "Software Engineer Intern",
        company: "Ministry of Investment (BKPM)",
        date: "Jan 2024 – Feb 2024",
        desc: "Developed “Office Sentry”, a Laravel personnel-monitoring system that streamlined office guard management and internal operations.",
        tags: ["Laravel", "RBAC"],
    },
];

const stats = [
    { value: "5+", label: "Projects Delivered" },
    { value: "11", label: "Certifications" },
    { value: "3.14", label: "GPA / 4.00" },
];

const stack = [
    { name: "Laravel", Icon: SiLaravel },
    { name: "Next.js", Icon: SiNextdotjs },
    { name: "React", Icon: SiReact },
    { name: "TypeScript", Icon: SiTypescript },
    { name: "Tailwind", Icon: SiTailwindcss },
    { name: "MySQL", Icon: SiMysql },
    { name: "PHP", Icon: SiPhp },
    { name: "Node.js", Icon: SiNodedotjs },
    { name: "Figma", Icon: SiFigma },
];

const AboutMe = () => {
    // Scroll progress line tracker for the animated "laser" timeline
    const lineRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: lineRef,
        offset: ["start center", "end center"]
    });

    // Comet head that rides the leading edge of the laser as it draws downward
    const cometTop = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
    const cometOpacity = useTransform(scrollYProgress, [0, 0.02, 0.98, 1], [0, 1, 1, 0]);

    return (
        <section id="about" className="w-full min-h-screen bg-dark py-20 md:py-28 px-6 md:px-20 border-t border-gray-800/50 relative overflow-x-clip z-10">

            {/* Ambient background accents */}
            <div className="absolute top-0 right-0 -mr-40 -mt-40 w-96 h-96 bg-primary/10 blur-[120px] rounded-full pointer-events-none z-0"></div>
            <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-96 h-96 bg-secondary/10 blur-[120px] rounded-full pointer-events-none z-0"></div>
            <div className="absolute inset-0 opacity-[0.025] pointer-events-none z-0 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"></div>

            <div className="max-w-7xl mx-auto relative z-10">

                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.6 }}
                    className="mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-bold">
                        About <span className="text-primary">Me</span>
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

                    {/* LEFT: Summary, stats, stack, education */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="space-y-10"
                    >
                        <div>
                            <div className="flex flex-wrap items-center gap-3 mb-5">
                                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-mono">
                                    <span className="relative flex h-2 w-2">
                                        <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
                                    </span>
                                    Open to Work
                                </span>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-900/60 border border-gray-800 text-gray-400 text-xs font-mono">
                                    <FiMapPin size={12} /> Tegal, Indonesia
                                </span>
                            </div>

                            <h3 className="text-2xl md:text-3xl font-bold text-white leading-snug">
                                Turning complex problems into <br className="hidden md:block" />
                                <span className="text-primary">clean, scalable</span> software.
                            </h3>
                        </div>

                        <div className="space-y-4 text-gray-300 leading-relaxed text-base md:text-lg">
                            <p>
                                Hi, I&apos;m <strong className="text-white">Muhammad Akmal Iskandar</strong>, an adaptable, solutions-driven Full-Stack Developer with a strong foundation in Informatics.
                            </p>
                            <p>
                                I&apos;ve shipped complex management systems across the <strong className="text-white">government</strong> and <strong className="text-white">healthcare</strong> sectors, from Electronic Medical Records to personnel-monitoring platforms, engineered with <strong className="text-white">Laravel &amp; MySQL</strong> on the backend.
                            </p>
                            <p>
                                On the frontend, I craft fast, responsive interfaces with <strong className="text-white">Next.js, React &amp; Tailwind CSS</strong>, pairing clean, maintainable code with a deep care for software architecture.
                            </p>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-3 gap-3 md:gap-4">
                            {stats.map((s) => (
                                <div
                                    key={s.label}
                                    className="rounded-2xl border border-gray-800 bg-gray-900/40 p-4 md:p-5 text-center hover:border-primary/40 transition-colors duration-300"
                                >
                                    <div className="text-2xl md:text-3xl font-bold text-primary">{s.value}</div>
                                    <div className="mt-1 text-[11px] md:text-xs text-gray-500 leading-tight">{s.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* Core Toolkit */}
                        <div>
                            <h4 className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-4">Core Toolkit</h4>
                            <div className="flex flex-wrap gap-2.5">
                                {stack.map(({ name, Icon }) => (
                                    <span
                                        key={name}
                                        className="group inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-gray-900/60 border border-gray-800 text-sm text-gray-300 hover:text-white hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
                                    >
                                        <Icon className="text-gray-500 group-hover:text-primary transition-colors duration-300" />
                                        {name}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Education Highlight */}
                        <div className="p-6 bg-gradient-to-br from-gray-900/70 to-gray-900/30 border border-gray-800 rounded-2xl flex items-start gap-4 hover:border-primary/30 transition-colors duration-300">
                            <div className="p-3 bg-primary/10 rounded-xl text-primary mt-1 shrink-0">
                                <FiBookOpen size={24} />
                            </div>
                            <div>
                                <h4 className="text-white font-bold text-lg">Bachelor of Informatics</h4>
                                <p className="text-gray-400">Diponegoro University <span className="text-gray-600 mx-2">•</span> 2021 – 2025</p>
                                <p className="text-sm text-gray-500 mt-3 flex items-start gap-2 leading-relaxed">
                                    <FiFileText className="mt-0.5 shrink-0 text-gray-600" />
                                    Thesis: A Web-Based Electronic Medical Record system built with the ICONIX Process method.
                                </p>
                            </div>
                        </div>

                        {/* Download CV */}
                        <div>
                            <a
                                href="/CV Muhammad Akmal Iskandar.pdf"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group inline-flex items-center gap-2 px-8 py-3.5 bg-white text-black font-bold rounded-full hover:bg-primary hover:text-black transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-primary/40"
                            >
                                <FiDownload size={18} className="group-hover:animate-bounce" /> Download Full CV
                            </a>
                        </div>
                    </motion.div>

                    {/* RIGHT: Work Experience Timeline (animated laser) */}
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

                        <div className="relative ml-2 md:ml-4 space-y-12 pb-4">

                            {/* Animated laser line + comet head */}
                            <div ref={lineRef} className="absolute left-0 top-2 -bottom-24 md:-bottom-32 w-0.5 bg-gray-800/30 origin-top z-0">
                                <motion.div
                                    style={{ scaleY: scrollYProgress }}
                                    className="w-full h-full bg-linear-to-b from-primary via-secondary to-primary origin-top shadow-[0_0_18px_rgba(0,240,255,0.65)]"
                                />
                                {/* Glowing comet riding the leading edge */}
                                <motion.div
                                    style={{ top: cometTop, opacity: cometOpacity }}
                                    className="absolute -left-[3px] -mt-1 h-2 w-2 rounded-full bg-white shadow-[0_0_16px_5px_rgba(0,240,255,0.9)]"
                                >
                                    <span className="absolute inset-0 rounded-full bg-primary blur-[2px] animate-pulse"></span>
                                </motion.div>
                            </div>

                            {experiences.map((exp) => (
                                <motion.div
                                    key={exp.id}
                                    variants={{
                                        hidden: { opacity: 0, y: -50 },
                                        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
                                    }}
                                    className="relative pl-8 md:pl-10 group"
                                >
                                    {/* Timeline Dot */}
                                    <div className="absolute w-4 h-4 rounded-full bg-primary -left-1.75 top-1.5 shadow-[0_0_10px_rgba(0,240,255,0.8)] border-4 border-dark z-10 transition-transform duration-300 group-hover:scale-150 cursor-pointer"></div>

                                    <div className="bg-gray-900/40 hover:bg-gray-800/60 p-6 rounded-2xl border border-gray-800 hover:border-primary/40 transition-all duration-300 relative z-10 hover:-translate-y-1">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 gap-2">
                                            <h4 className="text-xl font-bold text-white group-hover:text-primary transition-colors">{exp.role}</h4>
                                            <span className="text-xs font-mono text-primary bg-primary/10 px-3 py-1 rounded-full w-fit whitespace-nowrap">
                                                {exp.date}
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-400 mb-3 font-medium uppercase tracking-wider">{exp.company}</div>
                                        <p className="text-gray-400 text-sm leading-relaxed mb-4">
                                            {exp.desc}
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {exp.tags.map((tag) => (
                                                <span key={tag} className="text-[11px] font-mono text-gray-400 bg-gray-800/60 border border-gray-700/60 px-2.5 py-1 rounded-md">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}

                            {/* Currently building: open node at the end of the timeline */}
                            <motion.div
                                variants={{
                                    hidden: { opacity: 0, y: -50 },
                                    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
                                }}
                                className="relative pl-8 md:pl-10"
                            >
                                <div className="absolute w-4 h-4 rounded-full bg-dark border-2 border-primary -left-1.75 top-1.5 z-10 animate-pulse"></div>
                                <p className="text-sm font-mono text-gray-500 pt-0.5">
                                    <span className="text-primary">{">"}</span> Currently building real-world Laravel &amp; Next.js products...
                                </p>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default AboutMe;
