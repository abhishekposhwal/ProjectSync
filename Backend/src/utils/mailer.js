import nodemailer from 'nodemailer';
import { ApiError } from './apiError';

export const sendEmail = async ({ email, emailType, userId }) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // Use `true` for port 465, `false` for all other ports
            auth: {
                user: "maddison53@ethereal.email",
                pass: "jn7jnAPss4f63QBp6D",
            },
        });

        const mailOption = {
            from: 'rashid@malik.ai', // sender address
            to: email, // list of receivers
            subject: emailType === 'VERIFY' ? "Verify your email" : "Reset your password",
            html: "<b>Hello world?</b>", // html body
        }
    } catch (error) {
        throw new ApiError(400, error.message);
    }
}