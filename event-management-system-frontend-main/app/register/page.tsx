// frontend/app/register/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../hooks/useAuth";
import { apiFetch } from "../../lib/api";
import { FeatureTile, GlassPanel, Notice } from "../../components/ui";

const REGISTER_FEATURES = [
  {
    kicker: "Timeline",
    title: "Clear planning windows",
    description: "Structure every event around readable start and end times.",
  },
  {
    kicker: "Inventory",
    title: "Organized details",
    description: "Keep venues, categories, and event notes in one flow.",
  },
];

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

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
      await apiFetch("/register", {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      });
      router.push("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="hero-grid min-h-screen px-6 py-10">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="fade-up order-2 lg:order-1">
          <GlassPanel className="p-8 md:p-10">
            <div className="mb-8">
              <p className="pill mb-4">Create account</p>
              <h1 className="section-title text-stone-900">
                Join the event workspace.
              </h1>
              <p className="muted-text mt-2 text-base leading-7">
                Set up your account to start building event schedules, venue
                details, and guest-ready plans.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
              aria-describedby={error ? "register-error" : undefined}
            >
              <div>
                <label className="mb-2 block text-sm font-medium text-stone-700">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field"
                  placeholder="Alex Morgan"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-stone-700">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  placeholder="alex@example.com"
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
                  placeholder="At least 8 characters"
                  required
                />
              </div>
              {error && (
                <Notice className="text-sm" tone="error">
                  <span id="register-error">{error}</span>
                </Notice>
              )}
              <button
                type="submit"
                disabled={loading}
                className="primary-button w-full"
                aria-busy={loading}
              >
                {loading ? "Registering..." : "Create account"}
              </button>
            </form>

            <p className="muted-text mt-6 text-center">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-[var(--accent-strong)] hover:opacity-80"
              >
                Login
              </Link>
            </p>
          </GlassPanel>
        </section>

        <section className="fade-up-delayed order-1 lg:order-2">
          <div className="mx-auto max-w-xl">
            <div className="pill mb-5">Built for planners</div>
            <h2 className="display-title mb-5 text-balance text-stone-900">
              From first draft to event day.
            </h2>
            <p className="body-lg muted-text mb-8 text-pretty">
              Keep event details organized with a dashboard that highlights
              timing, location, and category without burying the important
              decisions.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {REGISTER_FEATURES.map((feature) => (
                <FeatureTile
                  key={feature.kicker}
                  kicker={feature.kicker}
                  title={feature.title}
                  description={feature.description}
                />
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
