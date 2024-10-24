import { google } from "googleapis";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const MAIL = process.env.MAIL_USER as string;
const CLIENT_ID = process.env.MAIL_CLIENT_ID as string;
const CLIENT_SECRET = process.env.MAIL_CLIENT_SECRET as string;
const REDIRECT_URI = process.env.MAIL_REDIRECT_URL as string;
const REFRESH_TOKEN = process.env.MAIL_REFRESH_TOKEN as string;

const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

export async function sendEmail(to: string, subject: string, text: string) {
  try {
    const accessToken = await oauth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: MAIL,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken.token as string,
      },
    });

    const mailOptions = {
      from: MAIL,
      to,
      subject,
      text,
    };

    const result = await transport.sendMail(mailOptions);
    return result;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}
