import React from 'react';
import { SiLaravel, SiMysql, SiTailwindcss, SiFigma, SiReact, SiNextdotjs, SiTypescript, SiVuedotjs, SiNodedotjs, SiMongodb } from 'react-icons/si';

// --- DATA TYPES ---
export type Project = {
    id: number;
    title: string;
    category: string;
    desc: string;
    stack: React.ReactNode[];
    span: string; // Grid col/row span
    bg: string;
    image?: string;
    galleryImages?: string[];
    features?: string[];
    techDetails?: string;
    externalLink?: string;
};

// --- ALL PROJECTS DATA ---
// Tambahkan project baru di array ini. 
// Halaman Home (ProjectBento) otomatis hanya menampilkan 5 project teratas.
export const allProjects: Project[] = [
    {
        id: 1,
        title: "Wallet Go! Mobile App",
        category: "UI/UX Design",
        desc: "Modern digital wallet application design focusing on seamless money transfers and top-ups.",
        stack: [<SiFigma key="f" />],
        span: "md:col-span-1 md:row-span-1",
        bg: "bg-gradient-to-br from-cyan-400/40 to-slate-900",
        image: "/projects/wallet-mobile.png", // Keep original images if any, fallback handles missing
        galleryImages: ["/projects/wallet-mobile.png"],
        features: ["Intuitive User Flow", "Light & Dark Mode", "Interactive Prototyping"],
        techDetails: "Designed entirely from scratch in Figma focusing on mobile-first user experience and material design guidelines.",
        externalLink: "https://www.figma.com/design/JE3q5Cftdo8iYZZH9Z9zWa/Wallet-Go-?node-id=0-1&t=q59sqGfb1XTIUifw-1"
    },
    {
        id: 2,
        title: "Nihloh Coffee & Eatery",
        category: "Landing Page",
        desc: "High-performance landing page for F&B business focusing on SEO and responsive design.",
        stack: [<SiNextdotjs key="nx" />, <SiTypescript key="ts" />, <SiTailwindcss key="t" />],
        span: "md:col-span-2 md:row-span-1",
        bg: "bg-gradient-to-br from-orange-700/40 to-slate-900",
        image: "/projects/nihloh-1.png",
        galleryImages: ["/img/NihlohLandingpage.png"],
        features: ["Fully Responsive UI/UX", "Performance & SEO Optimized", "Strong Type Safety"],
        techDetails: "Developed a high-performance landing page using Next.js and TypeScript, with Tailwind CSS for layout optimizations.",
        externalLink: "https://nihlohcafe.vercel.app"
    },
    {
        id: 3,
        title: "Electronic Medical Records",
        category: "Full-Stack Development",
        desc: "Electronic medical records and patient management system for independent midwife practices.",
        stack: [<SiLaravel key="l" />, <SiMysql key="m" />, <SiTailwindcss key="t" />],
        span: "md:col-span-2 md:row-span-2",
        bg: "bg-gradient-to-br from-pink-900/80 to-slate-900",
        image: "/projects/emr-thumb.png",
        galleryImages: ["/projects/emr-1.png", "/projects/emr-2.png", "/projects/emr-3.png"],
        techDetails: "Built on Laravel 10 using MVC architecture. Normalized MySQL database handles thousands of patient records efficiently.",
        features: [
            "Patient & Medical Record Management",
            "Automated Referral & Prescription Printing",
            "Daily & Monthly Visit Reports",
            "Simple Billing System"
        ]
    },
    {
        id: 4,
        title: "Noiia Studio",
        category: "Creative Agency Website",
        desc: "Immersive digital experience showcasing modern aesthetics and smooth interactions.",
        stack: [<SiNextdotjs key="nx" />, <SiTypescript key="ts" />, <SiTailwindcss key="t" />],
        span: "md:col-span-1 md:row-span-1",
        bg: "bg-gradient-to-tr from-emerald-900/40 to-dark",
        image: "/projects/photo-studio-1.png",
        galleryImages: ["/img/NoiaLandingpage.png"],
        features: ["Pixel-perfect Minimalist UI", "Smooth Interactions", "Optimized Image Rendering & CLS"],
        techDetails: "Engineered using Next.js and TypeScript, focused on high-performance rendering and modern aesthetics.",
        externalLink: "https://noiia-studio.vercel.app"
    },
    {
        id: 5,
        title: "CV Satya Perkasa Mobilindo",
        category: "Front-End Development",
        desc: "Official digital showroom and dealership website for Suzuki Indonesia.",
        stack: [<SiLaravel key="l" />, <SiTailwindcss key="t" />],
        span: "md:col-span-1 md:row-span-1",
        bg: "bg-[#111827] hover:bg-[#1F2937]",
        image: "/img/Landingpage.png",
        galleryImages: ["/img/Landingpage.png", "/img/Detail Mobil 2.png", "/img/Login.png", "/img/Booking Services.png", "/img/Booking Test Drive.png", "/img/Dashboard Admin.png"],
        techDetails: "A comprehensive automotive dealership platform built covering Suzuki passenger and commercial vehicles. It features role-based access control, allowing users to book services and schedule test drives, while providing an admin dashboard to manage inquiries.",
        features: [
            "Interactive Vehicle Digital Showroom",
            "Online Test Drive & Service Booking",
            "Role-based Dashboard (Admin & User)",
            "Vehicle Catalog with Pricing Simulation"
        ]
    },
    {
        id: 6,
        title: "Office Sentry App",
        category: "Web Development",
        desc: "Office security management and personnel monitoring application.",
        stack: [<SiLaravel key="l" />, <SiTailwindcss key="t" />],
        span: "md:col-span-1 md:row-span-1",
        bg: "bg-[#111827] hover:bg-[#1F2937]",
        image: "/projects/sentry-thumb.png",
        galleryImages: ["/projects/sentry-thumb.png", "/projects/sentry-1.png"],
        techDetails: "Internal monitoring system for recording BKPM office security activities. Uses Laravel Breeze for authentication.",
        features: [
            "Real-time Monitoring Dashboard",
            "Shift Management System",
            "QR Code Check-in",
            "Incident Reporting"
        ]
    },
];
