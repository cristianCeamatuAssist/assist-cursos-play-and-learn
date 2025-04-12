import { ReactElement } from 'react';
import { Resend } from 'resend';
import WelcomeEmail from '../emails/welcome-email';

// Define the email options interface to avoid using any
interface SendEmailOptions {
  from: string;
  to: string | string[];
  subject: string;
  react?: ReactElement;
  text?: string;
  html?: string;
  cc?: string | string[];
  bcc?: string | string[];
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
  headers?: Record<string, string>;
}

// Initialize Resend with API key
// Use a function to get the API key to ensure it's available during runtime
const getResendClient = () => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('RESEND_API_KEY environment variable is not set');
    // Return a dummy client for development that logs instead of sending
    return {
      emails: {
        send: async (options: SendEmailOptions) => {
          console.log('Email would be sent:', options);
          return { data: { id: 'dummy-id' }, error: null };
        },
      },
    } as Resend;
  }
  return new Resend(apiKey);
};

interface SendWelcomeEmailParams {
  to: string;
  name: string;
  verificationLink?: string;
}

export async function sendWelcomeEmail({
  to,
  name,
  verificationLink = `${process.env.NEXT_PUBLIC_APP_URL}/verify`,
}: SendWelcomeEmailParams) {
  try {
    const resend = getResendClient();
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'noreply@example.com',
      to,
      subject: 'Welcome to Cursos Play and Learn!',
      react: WelcomeEmail({ name, verificationLink }),
    });

    if (error) {
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    return { success: false, error };
  }
} 