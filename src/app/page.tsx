import { Navbar } from "@/components/Navbar";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <h1 className="text-4xl font-bold mb-6">Welcome to Cursos Play and Learn</h1>
        <p className="text-xl mb-8 max-w-2xl">
          An interactive learning platform for courses and educational content
        </p>
        <div className="flex gap-4 flex-col sm:flex-row">
          <Link 
            href="/register" 
            className="bg-indigo-600 text-white px-6 py-3 rounded-md font-medium hover:bg-indigo-700 transition-colors"
          >
            Get Started
          </Link>
          <Link 
            href="/login" 
            className="border border-gray-300 px-6 py-3 rounded-md font-medium hover:bg-gray-50 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </main>
      
      <footer className="py-6 border-t border-gray-200 text-center text-sm text-gray-600">
        <p>© {new Date().getFullYear()} Cursos Play and Learn. All rights reserved.</p>
      </footer>
    </div>
  );
}
