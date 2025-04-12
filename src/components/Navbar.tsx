"use client";

import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export function Navbar() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const isAdmin = isAuthenticated && session?.user?.role === "ADMIN";

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-indigo-600">Cursos</span>
            </Link>
            <div className="ml-6 flex space-x-4">
              <Link href="/" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900">
                Home
              </Link>
              {isAuthenticated && (
                <Link href="/profile" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900">
                  Profile
                </Link>
              )}
              {isAdmin && (
                <Link href="/admin/users" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900">
                  Users
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-gray-700">
                  {session?.user?.name || session?.user?.email}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Register</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 