"use client";

import React, { useRef } from "react";
import { TypeAnimation } from "react-type-animation";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { FiFileText } from "react-icons/fi";
import Image from "next/image";

const Hero = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    
    // Parallax
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"],
    });
    const textY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const textOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    // 3D Tilt
    const mouseX = useMotionValue(0.5);
    const mouseY = useMotionValue(0.5);
    
    const rotateX = useSpring(useTransform(mouseY, [0, 1], [15, -15]), { stiffness: 150, damping: 20 });
    const rotateY = useSpring(useTransform(mouseX, [0, 1], [-15, 15]), { stiffness: 150, damping: 20 });
    
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
        <section ref={containerRef} className="relative w-full min-h-screen bg-dark text-white flex flex-col justify-center px-6 md:px-20 overflow-hidden font-sans">
            {/* Background Grid Pattern (Opsional: Supaya tidak terlalu kosong) */}
            <div
                className="absolute inset-0 opacity-5 pointer-events-none"
                style={{
                    backgroundImage: "radial-gradient(#444 1px, transparent 1px)",
                    backgroundSize: "30px 30px",
                }}
            />

            {/* Simple Navigation */}
            <nav className="absolute top-6 right-6 md:right-20 flex gap-6 text-sm md:text-base text-gray-400 font-mono z-50">
                <a href="#about" className="hover:text-primary transition-colors cursor-pointer">
                    About
                </a>
                <a href="#stack" className="hover:text-primary transition-colors cursor-pointer">
                    Stack
                </a>
                <a href="#work" className="hover:text-primary transition-colors cursor-pointer">
                    Work
                </a>
                <a href="#contact" className="hover:text-primary transition-colors cursor-pointer">
                    Contact
                </a>
            </nav>

        {/* Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center z-10 max-w-7xl mx-auto w-full pt-20 md:pt-0">
                {/* Left Column Data */}
                <motion.div style={{ y: textY, opacity: textOpacity }} className="lg:col-span-3 space-y-8 order-2 lg:order-1 relative z-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-6xl md:text-8xl font-bold leading-[1.1] tracking-tight mb-4">
                            Muhammad Akmal <br />
                            <span className="bg-clip-text bg-gradient-to-r from-primary to-secondary">
                                Iskandar.
                            </span>
                        </h1>
                        <div className="h-1 w-20 bg-primary rounded"></div>
                    </motion.div>

                    <div className="text-2xl md:text-4xl font-mono text-gray-300 h-16 flex items-center">
                        <span className="mr-4 text-secondary text-3xl">{">"}</span>
                        <TypeAnimation
                            sequence={[
                                "Full-Stack Web Developer.",
                                1000,
                                "Laravel & MySQL Expert.",
                                1000,
                                "Building Scalable Apps.",
                                1000,
                                "Informatics Graduate.",
                                1000,
                            ]}
                            wrapper="span"
                            speed={50}
                            repeat={Infinity}
                            className="font-bold text-gray-200"
                        />
                    </div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-gray-400 max-w-2xl text-lg md:text-xl leading-relaxed text-justify"
                    >
                        Motivated Informatics graduate with a strong foundation in software engineering.
                        Experienced in building efficient web-based applications using
                        <span className="text-primary font-semibold"> Laravel, MySQL,</span> and modern CSS frameworks like
                        <span className="text-secondary font-semibold"> Tailwind.</span>
                    </motion.p>
                </motion.div>

                {/* Right Column Data */}
                <motion.div 
                    style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    className="lg:col-span-2 flex justify-center items-end relative h-[500px] order-1 lg:order-2"
                >
                    {/* Layer 1: Glow Effect */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-primary/20 rounded-full blur-[80px] animate-pulse" />

                    {/* Outer Orbit */}
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                        className="absolute top-1/2 left-1/2 -ml-[180px] -mt-[180px] w-[360px] h-[360px] border border-gray-700/60 rounded-full border-dashed z-0"
                    />

                    {/* Middle Orbit */}
                    <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute top-1/2 left-1/2 -ml-[150px] -mt-[150px] w-[300px] h-[300px] border border-primary/30 rounded-full z-0"
                    />

                    {/* Inner Orbit */}
                    <motion.div
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-1/2 left-1/2 -ml-[130px] -mt-[130px] w-[260px] h-[260px] bg-gradient-to-b from-card to-dark rounded-full border border-secondary/50 z-0 shadow-2xl"
                    />

                    {/* Image */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 50 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        whileHover={{ y: -10, transition: { duration: 0.3 } }}
                        className="absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 w-[260px] h-[260px] flex items-center justify-center"
                    >
                        <Image
                            src="/Akmal 1.png"
                            alt="Muhammad Akmal Iskandar"
                            width={200}
                            height={300}
                            className="object-contain drop-shadow-[0_0_15px_rgba(0,0,0,0)]"
                            priority
                        />

                        <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-dark to-transparent z-20" />
                    </motion.div>

                    {/* Badges */}
                    <motion.div
                        className="absolute top-20 right-0 bg-dark/90 backdrop-blur px-4 py-2 rounded-lg border-l-4 border-primary text-sm font-bold text-white shadow-xl z-30"
                        animate={{ y: [0, -15, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    >
                        Full-Stack
                    </motion.div>

                    <motion.div
                        className="absolute bottom-20 -left-4 bg-dark/90 backdrop-blur px-4 py-2 rounded-lg border-l-4 border-secondary text-sm font-bold text-white shadow-xl z-30"
                        animate={{ y: [0, 15, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    >
                        Laravel Expert
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
