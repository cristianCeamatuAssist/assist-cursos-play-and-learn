"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const useRequireAuth = (redirectTo = "/login") => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) router.push(redirectTo);
  }, [session, status, router, redirectTo]);

  return { session, loading: status === "loading" };
};

export const useRedirectIfAuthenticated = (redirectTo = "/") => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (session) router.push(redirectTo);
  }, [session, status, router, redirectTo]);

  return { session, loading: status === "loading" };
}; 