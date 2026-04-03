// /frontend/app/page.tsx
// This file is a Next.js page component that serves as the main entry point for the application.
// It includes a simple layout with a logo, instructions, and links to deploy and read documentation.
// It uses Tailwind CSS for styling and includes responsive design for different screen sizes.
// Importing necessary modules and components

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";
import { AppShell, GlassPanel, Notice } from "../components/ui";

export default function Home() {
  const { isLoading, token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    router.replace(token ? "/dashboard" : "/login");
  }, [isLoading, token, router]);

  return (
    <AppShell className="flex items-center justify-center">
      <GlassPanel className="px-8 py-6">
        <Notice tone="neutral">Redirecting to your workspace...</Notice>
      </GlassPanel>
    </AppShell>
  );
}
