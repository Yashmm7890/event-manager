"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import EventForm from "../../../components/EventForm";
import { useRouter } from "next/navigation";
import { ApiError, apiFetch } from "../../../lib/api";
import type { EventFormValues } from "../../../types/event";
import { AppShell, Eyebrow, GlassPanel, Notice } from "../../../components/ui";

export default function CreateEvent() {
  const { token, logout, isLoading } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoading && !token) {
      router.replace("/login");
    }
  }, [isLoading, router, token]);

  const handleCancel = useCallback(() => {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push("/dashboard");
  }, [router]);

  const handleSubmit = async (data: EventFormValues) => {
    setIsSubmitting(true);
    setError("");

    try {
      await apiFetch("/events", {
        method: "POST",
        token,
        body: JSON.stringify(data),
      });
      router.push("/dashboard");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create event";

      if (err instanceof ApiError && err.status === 401) {
        logout();
        return;
      }

      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppShell className="py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <div className="mb-5 flex items-center gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--foreground)] transition-colors hover:bg-[var(--surface-muted)]"
            >
              <span aria-hidden="true">←</span>
              Back
            </button>
            <Eyebrow>New event</Eyebrow>
          </div>
          <h1 className="display-title text-balance text-stone-950">
            Create a polished event brief
          </h1>
          <p className="body-lg muted-text mt-3 max-w-2xl text-pretty">
            Capture the core details now, then refine the schedule and venue
            details as the plan takes shape.
          </p>
        </div>

        <GlassPanel className="p-6 md:p-8">
          {error && <Notice className="mb-6">{error}</Notice>}
          <EventForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
          />
        </GlassPanel>
      </div>
    </AppShell>
  );
}
