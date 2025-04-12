# Cursos Play and Learn

A fullstack web application for course management and interactive learning, built with Next.js 15, React 19, TypeScript, and PostgreSQL.

## Tech Stack

- **Frontend**: Next.js 15.3 with App Router, React 19, Tailwind CSS 4, Shadcn UI
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: JWT
- **Forms**: React Hook Form with Zod validation
- **Email**: React Email with Resend

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables (copy `.env.example` to `.env` and update the values)
4. Start the development server:
   ```bash
   npm run dev
   ```

## Database Setup

1. Make sure PostgreSQL is running
2. Update the `DATABASE_URL` in your `.env` file
3. Run the initial migration:
   ```bash
   npm run prisma:migration:run initial
   ```
4. Generate the Prisma client:
   ```bash
   npm run prisma:generate
   ```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check for code issues
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Deploy Prisma migrations
- `npm run prisma:migration:run` - Create a new migration
- `npm run prisma:studio` - Open Prisma Studio to manage your database

## Project Structure

- `/src/app` - Next.js App Router pages and layout
- `/src/components` - Reusable UI components
- `/src/lib` - Utility functions and shared code
- `/src/generated` - Generated Prisma client
- `/src/emails` - Email templates
- `/prisma` - Prisma schema and migrations

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
