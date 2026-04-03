// frontend/app/login/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import Link from "next/link";
import { apiFetch } from "../../lib/api";
import { FeatureTile, GlassPanel, Notice } from "../../components/ui";

const LOGIN_FEATURES = [
  {
    title: "Fast",
    description: "Quick auth and event flows.",
  },
  {
    title: "Clear",
    description: "Readable timelines and actions.",
  },
  {
    title: "Focused",
    description: "No clutter, just the work.",
  },
];

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, isLoading, login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await apiFetch<{ token: string }>("/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      login(data.token);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="hero-grid min-h-screen px-6 py-10">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="fade-up max-w-xl">
          <div className="pill mb-5">Curated event operations</div>
          <h1 className="display-title mb-5 text-balance text-stone-900">
            Plan sharper events with a calmer dashboard.
          </h1>
          <p className="body-lg muted-text mb-8 max-w-lg text-pretty">
            Manage schedules, venues, and categories in one place with a
            workspace that feels polished from the first click.
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {LOGIN_FEATURES.map((feature) => (
              <FeatureTile
                key={feature.title}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </section>

        <section className="fade-up-delayed">
          <GlassPanel className="w-full p-8 md:p-10">
            <div className="mb-8">
              <p className="pill mb-4">Welcome back</p>
              <h2 className="section-title text-stone-900">Login</h2>
              <p className="muted-text mt-2 text-base leading-7">
                Continue to your event workspace and pick up where you left off.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
              aria-describedby={error ? "login-error" : undefined}
            >
              <div>
                <label className="mb-2 block text-sm font-medium text-stone-700">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-stone-700">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                  placeholder="Enter your password"
                  required
                />
              </div>
              {error && (
                <Notice className="text-sm" tone="error">
                  <span id="login-error">{error}</span>
                </Notice>
              )}
              <button
                type="submit"
                disabled={loading}
                className="primary-button w-full"
                aria-busy={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <p className="muted-text mt-6 text-center">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-semibold text-[var(--accent-strong)] hover:opacity-80"
              >
                Register
              </Link>
            </p>
          </GlassPanel>
        </section>
      </div>
    </main>
  );
}
