# Todo Real

Modern Todo/Notes app built with Next.js 15, Tailwind CSS, Zustand, Framer Motion, and Recharts.

## Get started
1. Copy `.env.example` to `.env.local` and customize values
2. Ensure MongoDB is running and MONGO_URL is correct
3. Install dependencies
4. Start the dev server

## Scripts
- dev: start the dev server
- build: build for production
- start: start production server

## Environment
Create a `.env.local` file (gitignored) using `.env.example` as a template.

Required variables:
- `MONGO_URL`: MongoDB connection string (e.g., mongodb://127.0.0.1:27017/todo-real)
- `JWT_SECRET`: Long random string for signing auth cookies
- `DEFAULT_USERNAME`: Seed username for the single-user app (defaults to `admin`)
- `DEFAULT_PASSWORD`: Seed password (defaults to `admin123`)

In production, set these via your hosting provider's environment configuration and use a strong `JWT_SECRET`.

## Features
- Add, edit, delete todos with multiple subtasks
- Creation timestamps and completion tracking
- History log with date/status filters
- Progress summary and dashboard (Pie, Line, Bar)
- Glassmorphism UI with gradients and dark mode
- Smooth animations with Framer Motion

