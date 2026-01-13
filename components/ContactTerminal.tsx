"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiGithub, FiLinkedin, FiTwitter, FiSend, FiTerminal, FiInstagram } from 'react-icons/fi';

const ContactTerminal = () => {
    const [formData, setFormData] = useState({ email: '', message: '' });
    const [status, setStatus] = useState<'idle' | 'processing' | 'success'>('idle');
    const [logs, setLogs] = useState<string[]>([]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.email || !formData.message) return;

        setStatus('processing');
        setLogs(["> Initializing handshake...", "> Validating input fields..."]);

        // Efek visual tetap ada agar terlihat keren
        setTimeout(() => setLogs(prev => [...prev, "> Encrypting data (TLSv1.3)..."]), 500);
        setTimeout(() => setLogs(prev => [...prev, "> Connecting to mail server..."]), 1000);

        try {
            // PANGGIL API SUNGGUHAN DI SINI
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                // Jika sukses
                setLogs(prev => [...prev, "> Payload delivered.", "> Server responded: 200 OK"]);
                setStatus('success');
                setFormData({ email: '', message: '' });
            } else {
                // Jika gagal
                setLogs(prev => [...prev, "> Error: Server rejected connection.", "> Status: 500"]);
                setStatus('idle'); // Kembalikan ke mode input
            }
        } catch (error) {
            setLogs(prev => [...prev, "> Critical Error: Network unreachable."]);
        }
    };

    return (
        <section id="contact" className="w-full py-20 bg-dark text-white relative">
            <div className="max-w-4xl mx-auto px-6">

                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Initialize <span className="text-primary">Contact</span></h2>
                    <p className="text-gray-400">Siap memulai proyek baru? Kirimkan transmisi di bawah ini.</p>
                </div>

                {/* Terminal Window */}
                <div className="w-full bg-[#0d1117] rounded-lg border border-gray-700 shadow-2xl overflow-hidden font-mono text-sm md:text-base">

                    {/* Terminal Header */}
                    <div className="bg-gray-800 px-4 py-2 flex items-center gap-2 border-b border-gray-700">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <div className="ml-4 text-gray-400 text-xs flex items-center gap-2">
                            <FiTerminal /> contact
                        </div>
                    </div>

                    {/* Terminal Body */}
                    <div className="p-6 md:p-8 space-y-4">

                        {status === 'success' ? (
                            // Tampilan Sukses
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-green-400 space-y-2"
                            >
                                {logs.map((log, idx) => (
                                    <div key={idx}>{log}</div>
                                ))}
                                <div className="mt-4 p-4 border border-green-500/30 bg-green-500/10 rounded">
                                    <span className="font-bold">✓ MESSAGE SENT SUCCESSFULLY.</span>
                                    <br />
                                    <span className="text-gray-400 text-xs">Terima kasih. Saya akan membalas secepatnya.</span>
                                    <button
                                        onClick={() => { setStatus('idle'); setLogs([]); }}
                                        className="block mt-4 text-white underline hover:text-primary"
                                    >
                                        Send another message
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            // Tampilan Form Input
                            <form onSubmit={handleSubmit} className="space-y-4">

                                {/* Email Input Line */}
                                <div className="flex flex-col md:flex-row md:items-center gap-2">
                                    <span className="text-primary whitespace-nowrap">email</span>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="Enter your email..."
                                        disabled={status === 'processing'}
                                        className="bg-transparent border-none outline-none text-gray-200 w-full focus:ring-0 placeholder-gray-600"
                                    />
                                </div>

                                {/* Message Input Line */}
                                <div className="flex flex-col gap-2">
                                    <span className="text-secondary whitespace-nowrap">message</span>
                                    <textarea
                                        required
                                        rows={4}
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        placeholder="Type your message here..."
                                        disabled={status === 'processing'}
                                        className="bg-transparent border border-gray-700 p-2 rounded outline-none text-gray-200 w-full focus:border-secondary transition-colors placeholder-gray-600 resize-none"
                                    />
                                </div>

                                {/* Logs Output (jika processing) */}
                                {status === 'processing' && (
                                    <div className="text-gray-400 text-xs space-y-1 py-2">
                                        {logs.map((log, idx) => <div key={idx}>{log}</div>)}
                                    </div>
                                )}

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={status === 'processing'}
                                    className="mt-4 flex items-center gap-2 px-6 py-2 bg-gray-800 border border-gray-600 hover:bg-gray-700 hover:border-primary text-white transition-all group"
                                >
                                    <span className="text-primary"></span>send-message
                                    <FiSend className={`ml-2 group-hover:translate-x-1 transition-transform ${status === 'processing' ? 'animate-ping' : ''}`} />
                                </button>
                            </form>
                        )}

                    </div>
                </div>

                {/* Footer Links */}
                <footer className="mt-20 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm border-t border-gray-800 pt-8">
                    <p>© {new Date().getFullYear()} The Interactive Architect. Built with Next.js & Tailwind.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <a href="https://github.com/Maliskandar" target='blank' className="hover:text-white transition-colors"><FiGithub size={20} /></a>
                        <a href="https://www.linkedin.com/in/muhammad-akmal-iskandar-94aa8b242?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target='blank' className="hover:text-white transition-colors"><FiLinkedin size={20} /></a>
                        <a href="https://www.instagram.com/maliskandar_19/" target='blank' className="hover:text-white transition-colors"><FiInstagram size={20} /></a>
                    </div>
                </footer>

            </div>
        </section>
    );
};

export default ContactTerminal;