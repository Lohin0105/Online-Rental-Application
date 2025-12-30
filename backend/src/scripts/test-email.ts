import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';

// Load env from one level up (since this is in src/scripts) or from root
const result = dotenv.config({ path: path.join(__dirname, '../../.env') });
if (result.error) {
    console.error('Dotenv Error:', result.error);
    // Try default
    const defaultResult = dotenv.config();
    if (defaultResult.error) {
        console.error('Dotenv Default Load Error:', defaultResult.error);
    }
}


console.log('Testing Email Service...');
console.log('SMTP Config:', {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    user: process.env.SMTP_USER,
    // Mask password
    pass: process.env.SMTP_PASS ? '****' : 'MISSING',
    from: process.env.EMAIL_FROM
});

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

const sendTestEmail = async () => {
    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: process.env.EMAIL_FROM, // Send to self
            subject: 'Test Email from Debug Script',
            html: '<p>If you see this, the email service is working!</p>',
        });
        console.log('✅ Email sent successfully!');
        console.log('Message ID:', info.messageId);
    } catch (error) {
        console.error('❌ Error sending email:', error);
    }
};

sendTestEmail();
