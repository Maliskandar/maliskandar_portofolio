"use client";

import React, { useRef } from "react";
import { TypeAnimation } from "react-type-animation";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import Image from "next/image";
import { FiUser, FiBriefcase, FiLayers, FiMail, FiGrid } from "react-icons/fi";

const Hero = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    // Parallax Scroll Effects
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"],
    });

    const textY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
    const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    // Background Marquee Parallax (moves faster)
    const marqueeX1 = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
    const marqueeX2 = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

    // Subtle 3D Mouse Tilt just for the Image Card
    const mouseX = useMotionValue(0.5);
    const mouseY = useMotionValue(0.5);

    // Dampened springs for elegant feel
    const rotateX = useSpring(useTransform(mouseY, [0, 1], [8, -8]), { stiffness: 100, damping: 25 });
    const rotateY = useSpring(useTransform(mouseX, [0, 1], [-8, 8]), { stiffness: 100, damping: 25 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        mouseX.set(x);
        mouseY.set(y);
    };

    const handleMouseLeave = () => {
        mouseX.set(0.5);
        mouseY.set(0.5);
    };

    return (
        <section
            ref={containerRef}
            className="relative w-full min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center overflow-hidden font-sans selection:bg-primary selection:text-black"
        >
            {/* Fixed Floating Navigation — Desktop / Tablet */}
            <nav className="hidden md:flex fixed top-6 left-1/2 -translate-x-1/2 items-center gap-1 pl-6 pr-2 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full z-50 shadow-2xl">
                <a href="#about" className="text-xs md:text-sm font-bold tracking-widest uppercase text-gray-400 hover:text-white transition-colors cursor-pointer px-3 py-2 border border-transparent leading-none flex items-center">About</a>
                <a href="#work" className="text-xs md:text-sm font-bold tracking-widest uppercase text-gray-400 hover:text-white transition-colors cursor-pointer px-3 py-2 border border-transparent leading-none flex items-center">Work</a>
                <a href="#stack" className="text-xs md:text-sm font-bold tracking-widest uppercase text-gray-400 hover:text-white transition-colors cursor-pointer px-3 py-2 border border-transparent leading-none flex items-center">Stack</a>
                <a href="#contact" className="text-xs md:text-sm font-bold tracking-widest uppercase text-gray-400 hover:text-white transition-colors cursor-pointer px-3 py-2 border border-transparent leading-none flex items-center">Contact</a>
                <span className="w-px h-5 bg-white/10 mx-2" aria-hidden />
                <a
                    href="/dashboard"
                    className="relative text-xs md:text-sm font-bold tracking-widest uppercase text-primary hover:text-white hover:bg-primary/25 hover:border-primary hover:shadow-[0_0_24px_rgba(0,240,255,0.45)] transition-all cursor-pointer flex items-center px-4 py-2 rounded-full border border-primary/30 bg-primary/10 ml-1 leading-none"
                >
                    <span className="absolute top-0.5 right-0.5 h-2 w-2 rounded-full bg-primary animate-pulse ring-2 ring-[#0a0a0a]" />
                    Dashboard
                </a>
            </nav>

            {/* Bottom Navigation Bar — Mobile only (Android-style) */}
            <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-[#0a0a0a]/85 backdrop-blur-xl border-t border-white/10 px-2 pt-2 pb-[calc(env(safe-area-inset-bottom)+0.4rem)] shadow-[0_-8px_24px_rgba(0,0,0,0.4)]">
                <ul className="flex items-stretch justify-around">
                    {[
                        { href: "#about", label: "About", Icon: FiUser },
                        { href: "#work", label: "Work", Icon: FiBriefcase },
                        { href: "#stack", label: "Stack", Icon: FiLayers },
                        { href: "#contact", label: "Contact", Icon: FiMail },
                        { href: "/dashboard", label: "Dashboard", Icon: FiGrid, primary: true },
                    ].map(({ href, label, Icon, primary }) => (
                        <li key={href} className="flex-1">
                            <a
                                href={href}
                                className={`flex flex-col items-center justify-center gap-1 py-1.5 rounded-2xl transition-all active:scale-90 ${primary
                                        ? "text-primary"
                                        : "text-gray-400 hover:text-white active:text-primary"
                                    }`}
                            >
                                <span className="relative flex items-center justify-center">
                                    <Icon className="text-[22px]" />
                                    {primary && (
                                        <span className="absolute -top-0.5 -right-1 h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                                    )}
                                </span>
                                <span className="text-[10px] font-medium tracking-wide leading-none">{label}</span>
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* ================================================== */}
            {/* BACKGROUND ANIMATED MARQUEE TEXT (Fills empty space) */}
            {/* ================================================== */}
            <div className="absolute inset-0 z-0 flex flex-col justify-center gap-10 opacity-[0.03] select-none pointer-events-none min-w-[200vw] -left-[50vw]">
                <motion.h1 style={{ x: marqueeX1 }} className="text-[12vw] font-black leading-none whitespace-nowrap text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
                    FULLSTACK DEVELOPER • FULLSTACK DEVELOPER • FULLSTACK DEVELOPER
                </motion.h1>
                <motion.h1 style={{ x: marqueeX2 }} className="text-[12vw] font-black leading-none whitespace-nowrap text-transparent bg-clip-text bg-gradient-to-l from-white to-gray-500">
                    SOFTWARE ENGINEER • SOFTWARE ENGINEER • SOFTWARE ENGINEER
                </motion.h1>
            </div>


            {/* ================================================== */}
            {/* MAIN CONTENT WRAPPER */}
            {/* ================================================== */}
            <motion.div
                style={{ opacity }}
                className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20"
            >

                {/* ----------------------------- */}
                {/* LEFT: Information & Typography */}
                {/* ----------------------------- */}
                <motion.div
                    style={{ y: textY }}
                    className="flex-1 flex flex-col justify-center items-center lg:items-start text-center lg:text-left mt-20 lg:mt-0"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    >
                        {/* Eyebrow Label */}
                        <div className="flex items-center gap-3 justify-center lg:justify-start mb-6">
                            {/* <span className="w-8 h-[2px] bg-primary rounded-full"></span> */}
                            <span className="font-mono text-primary text-sm tracking-widest uppercase">Hello, World!</span>
                        </div>

                        {/* Huge Name Headline */}
                        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black leading-[1.05] tracking-tighter mb-6 relative">
                            Muhammad <br />
                            Akmal <span className="text-gray-500/30 font-serif italic font-light absolute -z-10 -ml-10"></span> <br />
                            Iskandar.
                        </h1>

                        {/* Specialized Typewriter */}
                        <div className="text-xl sm:text-2xl lg:text-3xl font-light text-gray-300 mb-8 h-10 flex items-center justify-center lg:justify-start gap-2">
                            <span className="text-primary font-mono">{">"}</span>
                            <TypeAnimation
                                sequence={[
                                    "Laravel Expert", 1500,
                                    "Frontend Enthusiast", 1500,
                                    "Database Architect", 1500,
                                    "Building Robust Systems", 1500,
                                ]}
                                wrapper="span"
                                speed={40}
                                repeat={Infinity}
                            />
                        </div>

                        {/* Minimalist Bio */}
                        <p className="text-gray-400 max-w-lg text-base sm:text-lg leading-relaxed font-light">
                            Bridging the gap between scalable backend architecture and exceptional frontend experiences.
                        </p>
                    </motion.div>
                </motion.div>

                {/* ----------------------------- */}
                {/* RIGHT: Modern 3D Portrait Box */}
                {/* ----------------------------- */}
                <motion.div
                    style={{ y: imageY, perspective: 1000 }}
                    className="flex-shrink-0 w-full max-w-md lg:max-w-lg h-[400px] sm:h-[500px] relative group"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                >
                    <motion.div
                        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                        className="w-full h-full relative"
                    >
                        {/* Background subtle glow */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-transparent blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>

                        {/* The Glass Portrait Card */}
                        <div className="absolute inset-4 md:inset-8 bg-white/[0.02] backdrop-blur-md rounded-3xl border border-white/10 overflow-hidden shadow-2xl flex items-end justify-center group-hover:border-primary/30 transition-colors duration-500">

                            {/* Inner ambient light */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[60px] translate-x-1/2 -translate-y-1/2"></div>

                            {/* Photo (Assuming Akmal 1.png is a transparent PNG of the person) */}
                            <motion.div
                                initial={{ y: 100, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                                style={{ translateZ: 50 }} // Push image forward in 3D space
                                className="relative w-4/5 h-4/5 z-20"
                            >
                                <Image
                                    src="/Akmal 1.png"
                                    alt="Muhammad Akmal Iskandar"
                                    fill
                                    sizes="(max-width: 768px) 100vw, 500px"
                                    className="object-contain object-bottom drop-shadow-2xl"
                                    priority
                                />
                                {/* Bottom gradient fade to blend with frame */}
                                <div className="absolute bottom-0 w-full h-1/4 bg-gradient-to-t from-[#0f1115] to-transparent"></div>
                            </motion.div>

                            {/* Floating Tech Badges (3D depth effect) */}
                            {/* <motion.div
                                style={{ translateZ: 80 }}
                                className="absolute top-8 left-8 bg-black/40 backdrop-blur px-4 py-2 border border-white/10 rounded-lg text-xs font-mono text-gray-300"
                            >

                            </motion.div> */}
                            <motion.div
                                style={{ translateZ: 100 }}
                                className="absolute bottom-16 -right-6 md:-right-2 bg-primary/10 backdrop-blur px-4 py-2 border border-primary/20 rounded-lg text-xs font-bold text-primary"
                            >
                                S.Kom
                            </motion.div>
                        </div>
                    </motion.div>
                </motion.div>

            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 opacity-50 z-20"
            >
                <div className="text-[10px] font-mono tracking-widest text-gray-500 uppercase">Scroll</div>
                <div className="w-[1px] h-12 bg-gradient-to-b from-gray-500 to-transparent"></div>
            </motion.div>
        </section>
    );
};

export default Hero;
