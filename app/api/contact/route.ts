// src/app/api/contact/route.ts
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
    try {
        const { email, message } = await request.json();

        // 1. Validasi Input
        if (!email || !message) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        // 2. Konfigurasi Transporter (Tukang Pos)
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, // Ambil dari .env
                pass: process.env.EMAIL_PASS, // Ambil dari .env
            },
        });

        // 3. Konfigurasi Email
        const mailOptions = {
            from: email, // Dari siapa (email pengisi form)
            to: process.env.EMAIL_USER, // Ke siapa (email kamu sendiri)
            subject: `[Portfolio] Pesan Baru dari ${email}`,
            text: message, // Isi pesan
            html: `
        <h3>Pesan Baru dari Portfolio</h3>
        <p><strong>Pengirim:</strong> ${email}</p>
        <p><strong>Pesan:</strong></p>
        <blockquote style="background: #f4f4f4; padding: 10px;">${message}</blockquote>
      `,
        };

        // 4. Kirim Email
        await transporter.sendMail(mailOptions);

        return NextResponse.json({ success: true, message: 'Email sent successfully' }, { status: 200 });

    } catch (error) {
        console.error('Email Error:', error);
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }
}