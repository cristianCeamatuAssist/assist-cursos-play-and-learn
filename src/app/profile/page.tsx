"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRequireAuth } from "@/lib/hooks";
import { signOut } from "next-auth/react";

export default function ProfilePage() {
  const { session, loading } = useRequireAuth();
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  if (!session) {
    return null; // useRequireAuth will handle the redirect
  }

  return (
    <div className="max-w-4xl mx-auto p-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <div className="font-medium">Name</div>
            <div>{session.user.name || "Not provided"}</div>
          </div>
          
          <div className="grid gap-2">
            <div className="font-medium">Email</div>
            <div>{session.user.email}</div>
          </div>
          
          <div className="grid gap-2">
            <div className="font-medium">Role</div>
            <div className="capitalize">{session.user.role}</div>
          </div>
          
          <Button 
            variant="destructive" 
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 