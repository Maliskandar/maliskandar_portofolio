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
        title: "Kardeşler Uygur Mutfağı",
        category: "Landing Page",
        desc: "High-performance landing page for an authentic Uyghur restaurant in Ankara, Turkey with headless CMS.",
        stack: [<SiNextdotjs key="nx" />, <SiReact key="r" />, <SiTailwindcss key="t" />],
        span: "md:col-span-1 md:row-span-1",
        bg: "bg-gradient-to-br from-green-800/40 to-slate-900",
        image: "/projects/uygur-mutfagi/landingpage.webp",
        galleryImages: ["/projects/uygur-mutfagi/landingpage.webp", "/projects/uygur-mutfagi/about.webp"],
        techDetails: "Developed with Next.js 16 and Tailwind CSS v4, featuring scroll-triggered animations via Framer Motion. Built on a Sanity headless CMS with flexible relational schemas. Data fetching pipeline uses GROQ queries and Next.js ISR with smart fallback for reliability and ultra-fast load times.",
        features: [
            "Headless CMS with Sanity",
            "Framer Motion Scroll Animations",
            "GROQ Queries with ISR Fallback",
            "Dynamic sitemap.xml & robots.txt for SEO",
            "Dynamic Multimedia & Menu Management"
        ],
        externalLink: "https://kardesleruygurmutfagi.com.tr"
    },
    {
        id: 2,
        title: "CV Satya Perkasa Mobilindo",
        category: "Full-Stack Development",
        desc: "Automotive e-commerce & service portal for vehicle sales, trade-ins, and digital service workflows.",
        stack: [<SiLaravel key="l" />, <SiMysql key="m" />, <SiTailwindcss key="t" />],
        span: "md:col-span-2 md:row-span-1",
        bg: "bg-gradient-to-br from-red-800/40 to-slate-900",
        image: "/img/Landingpage.png",
        galleryImages: ["/img/Landingpage.png", "/img/Detail Mobil 2.png", "/img/Login.png", "/img/Booking Services.png", "/img/Booking Test Drive.png", "/img/Dashboard Admin.png"],
        techDetails: "Built with Laravel 13 (PHP 8.3) managing complex backend logic for vehicle sales, trade-ins, and digital service workflows. Frontend optimized using Tailwind CSS, Vite, and Blade templates with a custom CMS. Integrated Midtrans payment gateway with reliable API webhooks for real-time payment callbacks.",
        features: [
            "Interactive Vehicle Digital Showroom",
            "Midtrans Payment Gateway Integration",
            "Online Test Drive & Service Booking",
            "Role-based Dashboard (Admin & User)",
            "Custom CMS for Landing Page Content"
        ],
        externalLink: "https://satyaperkasamobilindo.com/"
    },
    {
        id: 3,
        title: "SMK Al-Musyaffa",
        category: "School Management System",
        desc: "Comprehensive school administration system with barcode attendance and automated reporting.",
        stack: [<SiLaravel key="l" />, <SiMysql key="m" />, <SiTailwindcss key="t" />],
        span: "md:col-span-2 md:row-span-2",
        bg: "bg-gradient-to-br from-blue-900/60 to-orange-900",
        image: "/projects/smk-almusyaffa/landingpage.webp",
        galleryImages: ["/projects/smk-almusyaffa/landingpage.webp", "/projects/smk-almusyaffa/dashboard-kepsek.webp"],
        techDetails: "Built with Laravel 12 (PHP 8.2) featuring role-based access control for administrators, teachers, and finance personnel. Real-time attendance tracking via physical barcode scanners. Bulk data processing with Maatwebsite Excel and automated PDF reports with DomPDF.",
        features: [
            "Role-Based Access (Admin, Teacher, Finance)",
            "Barcode Scanner Attendance Tracking",
            "Bulk Excel Import & PDF Report Export",
            "System Audit Trail (Activity Logging)",
            "Financial Recapitulation for Students"
        ],
        externalLink: "https://smartmusyaffa.com/"
    },
    {
        id: 4,
        title: "Nox Connection",
        category: "B2B Game Top-Up Platform",
        desc: "International B2B game top-up platform with integrated payment gateway, currently in development.",
        stack: [<SiLaravel key="l" />, <SiMysql key="m" />, <SiTailwindcss key="t" />],
        span: "md:col-span-1 md:row-span-1",
        bg: "bg-gradient-to-br from-indigo-900/60 to-slate-900",
        image: "/projects/nox-connection/a.webp",
        galleryImages: [
            "/projects/nox-connection/a.webp",
            "/projects/nox-connection/b.webp",
            "/projects/nox-connection/c.webp",
            "/projects/nox-connection/d.webp",
            "/projects/nox-connection/e.webp",
            "/projects/nox-connection/f.webp"
        ],
        techDetails: "Built with Laravel and MySQL targeting international markets. Implements payment gateway integration, multi-currency support, and B2B reseller tier management for streamlined game credit distribution.",
        features: [
            "B2B Reseller Management",
            "Payment Gateway Integration",
            "Multi-Game Catalog Support",
            "Real-time Transaction Processing",
            "Admin Dashboard with Analytics"
        ],
        externalLink: "https://noxconnection.com/"
    },
    {
        id: 5,
        title: "Cashify",
        category: "SaaS",
        desc: "Smart cashier and POS system delivered as a SaaS for retail and F&B businesses.",
        stack: [<SiLaravel key="l" />, <SiMysql key="m" />, <SiTailwindcss key="t" />],
        span: "md:col-span-1 md:row-span-1",
        bg: "bg-gradient-to-br from-blue-700/40 to-slate-900",
        image: "/projects/cashify/landingpage.webp",
        galleryImages: ["/projects/cashify/landingpage.webp"],
        techDetails: "Multi-tenant SaaS POS application built with Laravel and MySQL. Provides point-of-sale, inventory tracking, and sales analytics through subscription-based tenant workspaces.",
        features: [
            "Multi-Tenant SaaS Architecture",
            "Point-of-Sale Transactions",
            "Inventory & Stock Management",
            "Sales Analytics & Reports",
            "Subscription Plan Management"
        ],
        externalLink: "http://cashify.click/"
    },
    {
        id: 6,
        title: "Apple Thrift",
        category: "Inventory Management System",
        desc: "Stock and sales management platform for a second-hand iPhone retail business.",
        stack: [<SiLaravel key="l" />, <SiMysql key="m" />, <SiTailwindcss key="t" />],
        span: "md:col-span-1 md:row-span-1",
        bg: "bg-gradient-to-br from-yellow-700/60 to-slate-900",
        image: "/img/applethrift-thumbnail.png",
        galleryImages: ["/img/applethrift-thumbnail.png"],
        techDetails: "Inventory and sales management system built with Laravel and MySQL, designed to manage iPhone unit stock, sales tracking, and customer records for a thrift retail operation.",
        features: [
            "iPhone Unit Stock Management",
            "Sales & Transaction Records",
            "Customer Database",
            "Product Condition Grading",
            "Sales Performance Dashboard"
        ],
        externalLink: "https://manajemen.applethrift.id/login"
    },
    {
        id: 7,
        title: "Wallet Go! Mobile App",
        category: "UI/UX Design",
        desc: "Modern digital wallet application design focusing on seamless money transfers and top-ups.",
        stack: [<SiFigma key="f" />],
        span: "md:col-span-1 md:row-span-1",
        bg: "bg-gradient-to-br from-cyan-400/40 to-slate-900",
        image: "/projects/wallet-mobile.png",
        galleryImages: ["/projects/wallet-mobile.png"],
        features: ["Intuitive User Flow", "Light & Dark Mode", "Interactive Prototyping"],
        techDetails: "Designed entirely from scratch in Figma focusing on mobile-first user experience and material design guidelines.",
        externalLink: "https://www.figma.com/design/JE3q5Cftdo8iYZZH9Z9zWa/Wallet-Go-?node-id=0-1&t=q59sqGfb1XTIUifw-1"
    },
    {
        id: 8,
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
        id: 9,
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
        id: 10,
        title: "Noiia Studio",
        category: "Landing Page",
        desc: "Immersive digital experience showcasing modern aesthetics and smooth interactions.",
        stack: [<SiNextdotjs key="nx" />, <SiTypescript key="ts" />, <SiTailwindcss key="t" />],
        span: "md:col-span-1 md:row-span-1",
        bg: "bg-gradient-to-tr from-slate-900/40 to-dark",
        image: "/projects/photo-studio-1.png",
        galleryImages: ["/img/NoiaLandingpage.png"],
        features: ["Pixel-perfect Minimalist UI", "Smooth Interactions", "Optimized Image Rendering & CLS"],
        techDetails: "Engineered using Next.js and TypeScript, focused on high-performance rendering and modern aesthetics.",
        externalLink: "https://noiia-studio.vercel.app"
    },
    {
        id: 11,
        title: "Office Sentry App",
        category: "Full-Stack Development",
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
