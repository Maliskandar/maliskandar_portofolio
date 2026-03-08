"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
    SiReact, SiNextdotjs, SiTailwindcss, SiVuedotjs, 
    SiLaravel, SiNodedotjs, SiExpress, SiPhp, 
    SiMysql, SiPostgresql, SiMongodb, SiFirebase,
    SiTypescript, SiJavascript, SiFigma, SiGit 
} from 'react-icons/si';

// Defining tech stack with categories
const frontendRow = [
    { name: "React", icon: <SiReact />, color: "#61DAFB" },
    { name: "Next.js", icon: <SiNextdotjs />, color: "#FFFFFF" },
    { name: "Tailwind CSS", icon: <SiTailwindcss />, color: "#06B6D4" },
    { name: "Vue.js", icon: <SiVuedotjs />, color: "#4FC08D" },
    { name: "TypeScript", icon: <SiTypescript />, color: "#3178C6" },
    { name: "JavaScript", icon: <SiJavascript />, color: "#F7DF1E" },
    { name: "Figma", icon: <SiFigma />, color: "#F24E1E" },
];

const backendRow = [
    { name: "Laravel", icon: <SiLaravel />, color: "#FF2D20" },
    { name: "Node.js", icon: <SiNodedotjs />, color: "#339933" },
    { name: "Express", icon: <SiExpress />, color: "#FFFFFF" },
    { name: "PHP", icon: <SiPhp />, color: "#777BB4" },
    { name: "MySQL", icon: <SiMysql />, color: "#4479A1" },
    { name: "PostgreSQL", icon: <SiPostgresql />, color: "#4169E1" },
    { name: "MongoDB", icon: <SiMongodb />, color: "#47A248" },
    { name: "Git", icon: <SiGit />, color: "#F05032" },
];

const MarqueeRow = ({ items, reverse = false, speed = 40 }: { items: typeof frontendRow, reverse?: boolean, speed?: number }) => {
    // Duplicate items to ensure smooth infinite loop
    const duplicatedItems = [...items, ...items, ...items];

    return (
        <div className="relative flex w-full overflow-hidden py-4 group">
            {/* Fade overlays for the edges */}
            <div className="absolute top-0 left-0 w-24 md:w-48 h-full bg-gradient-to-r from-dark to-transparent z-10 pointer-events-none" />
            <div className="absolute top-0 right-0 w-24 md:w-48 h-full bg-gradient-to-l from-dark to-transparent z-10 pointer-events-none" />

            <motion.div
                className="flex gap-4 md:gap-8 min-w-max"
                animate={{ x: reverse ? [0, "-33.33%"] : ["-33.33%", 0] }} // Move one full set length
                transition={{
                    duration: speed,
                    ease: "linear",
                    repeat: Infinity,
                }}
            >
                {duplicatedItems.map((tech, index) => (
                    <div 
                        key={index} 
                        className="flex flex-col items-center justify-center min-w-[120px] md:min-w-[160px] p-6 bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl hover:bg-gray-800/80 transition-all duration-300 group-hover:pause"
                        style={{ '--hover-color': tech.color } as React.CSSProperties}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = tech.color;
                            e.currentTarget.style.boxShadow = `0 0 20px -5px ${tech.color}`;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = '';
                            e.currentTarget.style.boxShadow = '';
                        }}
                    >
                        <div 
                            className="text-4xl md:text-5xl mb-3 text-gray-500 transition-colors duration-300 transform group-hover/card:scale-110"
                            style={{ color: "currentColor" }}
                            onMouseEnter={(e) => e.currentTarget.style.color = tech.color}
                            onMouseLeave={(e) => e.currentTarget.style.color = "#6b7280"} // text-gray-500
                        >
                            {tech.icon}
                        </div>
                        <span className="text-sm md:text-base font-medium text-gray-400 font-mono tracking-wide">
                            {tech.name}
                        </span>
                    </div>
                ))}
            </motion.div>
        </div>
    );
};

const TechMarquee = () => {
    return (
        <section id="stack" className="relative w-full py-24 bg-dark overflow-hidden border-t-2 border-b-2 border-gray-900/50">
            
            {/* Grid Background Pattern */}
            <div className="absolute inset-x-0 top-0 h-full opacity-[0.03] pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-dark to-dark" />

            {/* Section Header */}
            <div className="max-w-7xl mx-auto px-6 md:px-20 mb-16 relative z-10 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-2">Tech Ecosystem</h2>
                        <div className="h-1 w-16 bg-primary rounded mx-auto md:mx-0"></div>
                    </motion.div>
                </div>
                <motion.p 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="text-gray-400 font-mono text-sm max-w-sm mx-auto md:mx-0"
                >
                    Empowered by industry-standard frameworks and reliable backend architecture to deliver exceptional performance.
                </motion.p>
            </div>

            {/* Configured Marquee Rows */}
            <div className="flex flex-col gap-4 relative z-20">
                <MarqueeRow items={frontendRow} reverse={false} speed={35} />
                <MarqueeRow items={backendRow} reverse={true} speed={40} />
            </div>

            {/* Instruction tooltip (mobile optional, nice for UX) */}
            <div className="text-center mt-12 text-xs text-gray-600 font-mono tracking-widest uppercase relative z-20">
                <span className="hidden md:inline">Hover over</span> 
                <span className="md:hidden">Tap</span> 
                {' '}icons to illuminate
            </div>

        </section>
    );
};

export default TechMarquee;
