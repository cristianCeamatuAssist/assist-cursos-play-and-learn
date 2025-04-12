import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import WelcomeEmail from "../../../emails/welcome-email";

// Initialize Resend with API key on the server
const resend = new Resend(process.env.RESEND_API_KEY);

// Email request validation schema
const emailSchema = z.object({
  to: z.string().email("Invalid email address"),
  name: z.string().min(1, "Name is required"),
  verificationLink: z.string().optional(),
  template: z.enum(["welcome"]).default("welcome"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const result = emailSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { message: "Validation failed", errors: result.error.errors },
        { status: 400 }
      );
    }
    
    const { to, name, verificationLink, template } = result.data;
    
    let data;
    let error;

    // Choose email template based on the template parameter
    if (template === "welcome") {
      const response = await resend.emails.send({
        from: "hello@evalio.app",
        to,
        subject: "Welcome to Cursos Play and Learn!",
        react: WelcomeEmail({ 
          name, 
          verificationLink: verificationLink || `${process.env.NEXT_PUBLIC_APP_URL}/verify`
        }),
      });
      
      data = response.data;
      error = response.error;
    }
    
    if (error) {
      return NextResponse.json(
        { message: "Failed to send email", error },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { 
        message: "Email sent successfully", 
        data 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Email sending error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
} 