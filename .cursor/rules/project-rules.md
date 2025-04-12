# Cursos Play and Learn Project Rules

## Technology Stack

This project is built using the following technologies:

- **Next.js**: Version 15.3.0 with App Router
- **React**: Version 19
- **TypeScript**: For type safety
- **Tailwind CSS**: Version 4 for styling
- **Shadcn UI**: For component library
- **Prisma**: ORM for database operations
- **PostgreSQL**: Primary database
- **React Hook Form**: For form handling
- **Zod**: For form validation
- **React Email**: For email templates
- **Resend**: For sending emails

## Project Structure

- `/src` - Main source code directory
  - `/app` - Next.js App Router pages and layout
  - `/components` - Reusable UI components
  - `/lib` - Utility functions and shared code
  - `/generated` - Generated Prisma client
  - `/emails` - Email templates

## Environment Variables

Required environment variables:
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret for JWT authentication
- `JWT_EXPIRES_IN`: JWT expiration time
- `RESEND_API_KEY`: API key for Resend email service
- `EMAIL_FROM`: Default sender email
- `NEXT_PUBLIC_APP_URL`: Public URL of the application

## Prisma Commands

Available Prisma scripts:
- `npm run prisma:generate`: Generate Prisma client
- `npm run seed`: Run database seeding script
- `npm run prisma:migrate`: Deploy Prisma migrations
- `npm run prisma:migration:run`: Create a new migration (e.g., `npm run prisma:migration:run initial`)
- `npm run prisma:studio`: Open Prisma Studio

## Coding Standards

- Use TypeScript for all files
- Use function components with hooks
- Follow Shadcn component patterns for UI consistency
- Use zod schemas for form validation
- Format dates with `date-fns`
- For API routes, follow RESTful conventions
- Use React Server Components where appropriate

## Email Sending Best Practices

- **NEVER** send emails directly from client-side code using Resend
- Always use server-side API routes for sending emails to avoid CORS issues
- Resend API should only be called from:
  - API routes in `/app/api/` directory
  - Server actions in server components
- Keep email templates in the `/src/emails/` directory using React Email
- Use centralized API endpoints for different email types (welcome, verification, etc.)
- Handle email sending errors gracefully without breaking the main user flow 