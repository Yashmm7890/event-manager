"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../../../hooks/useAuth";
import EventForm from "../../../../components/EventForm";
import { useRouter, useParams } from "next/navigation";
import { ApiError, apiFetch } from "../../../../lib/api";
import type { Event, EventFormValues } from "../../../../types/event";
import { AppShell, GlassPanel, Notice, SectionHeading } from "../../../../components/ui";

export default function EditEvent() {
  const { token, logout, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && !token) {
      router.replace("/login");
    }
  }, [authLoading, router, token]);

  useEffect(() => {
    if (!id || !token) {
      setLoading(false);
      return;
    }

    const fetchEvent = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await apiFetch<Event>(`/events/${id}`, { token });
        setEvent(data);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to fetch event";

        if (err instanceof ApiError && err.status === 401) {
          logout();
          return;
        }

        setError(message);
      } finally {
        setLoading(false);
      }
    };

    void fetchEvent();
  }, [id, logout, token]);

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
      await apiFetch(`/events/${id}`, {
        method: "PUT",
        token,
        body: JSON.stringify(data),
      });
      router.push("/dashboard");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update event";

      if (err instanceof ApiError && err.status === 401) {
        logout();
        return;
      }

      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AppShell className="flex items-center justify-center">
        <GlassPanel className="px-8 py-6">
          <p className="text-lg font-medium text-stone-800">Loading event...</p>
        </GlassPanel>
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell className="flex items-center justify-center">
        <GlassPanel className="max-w-xl p-8">
          <Notice>{error}</Notice>
        </GlassPanel>
      </AppShell>
    );
  }

  if (!event) {
    return (
      <AppShell className="flex items-center justify-center">
        <GlassPanel className="p-8 text-center">
          <p className="text-2xl font-semibold text-stone-900">
            Event not found
          </p>
          <p className="muted-text mt-3">
            It may have been removed or is no longer available for editing.
          </p>
        </GlassPanel>
      </AppShell>
    );
  }

  return (
    <AppShell className="py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <SectionHeading
            eyebrow="Edit event"
            title="Refine the event details"
            description="Update timing, location, and category details without losing the original event context."
          />
        </div>

        <GlassPanel className="p-6 md:p-8">
          {error && <Notice className="mb-6">{error}</Notice>}
          <EventForm
            key={event.id}
            event={event}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
          />
        </GlassPanel>
      </div>
    </AppShell>
  );
}
