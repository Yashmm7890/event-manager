// frontend/app/dashboard/page.tsx

"use client";

import React, { memo, useCallback, useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ApiError, apiFetch } from "../../lib/api";
import type { Event, PaginatedEventsResponse } from "../../types/event";
import {
  AppShell,
  EmptyState,
  GlassPanel,
  MetricCard,
  Notice,
  ProfileMenu,
  SectionHeading,
} from "../../components/ui";

interface CurrentUser {
  id: number;
  name: string;
  email: string;
}

const DATE_FORMATTER = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

const EventCard = memo(function EventCard({
  event,
  onDelete,
}: {
  event: Event;
  onDelete: (id: number) => void;
}) {
  return (
    <article className="glass-panel event-card md:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className="pill">{event.category}</span>
            <span className="muted-text text-sm">{event.location}</span>
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-stone-950">
            {event.title}
          </h2>
          <p className="muted-text mt-3 leading-7 text-pretty">
            {event.description}
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[290px] lg:grid-cols-1">
          <div className="event-meta-card">
            <p className="muted-text text-xs uppercase tracking-[0.18em]">
              Start
            </p>
            <p className="mt-2 font-semibold text-stone-950">
              {DATE_FORMATTER.format(new Date(event.start_time))}
            </p>
          </div>
          <div className="event-meta-card">
            <p className="muted-text text-xs uppercase tracking-[0.18em]">
              End
            </p>
            <p className="mt-2 font-semibold text-stone-950">
              {DATE_FORMATTER.format(new Date(event.end_time))}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href={`/events/${event.id}/edit`} className="secondary-button">
          Edit
        </Link>
        <button onClick={() => onDelete(event.id)} className="danger-button">
          Delete
        </button>
      </div>
    </article>
  );
});

export default function Dashboard() {
  const { token, logout, isLoading: authLoading } = useAuth();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !token) {
      router.replace("/login");
    }
  }, [authLoading, token, router]);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchEvents = async () => {
      setLoading(true);
      setError("");

      try {
        const [currentUser, response] = await Promise.all([
          apiFetch<CurrentUser>("/me", { token }),
          apiFetch<PaginatedEventsResponse>(`/events?page=${page}`, { token }),
        ]);

        setUser(currentUser);
        setEvents(response.data);
        setLastPage(response.last_page);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to fetch events";

        if (err instanceof ApiError && err.status === 401) {
          logout();
          return;
        }

        setError(message);
      } finally {
        setLoading(false);
      }
    };

    void fetchEvents();
  }, [logout, page, token]);

  const handleDelete = useCallback(async (id: number) => {
    if (!confirm("Are you sure you want to delete this event?")) {
      return;
    }

    try {
      await apiFetch(`/events/${id}`, {
        method: "DELETE",
        token,
      });
      setEvents((currentEvents) =>
        currentEvents.filter((event) => event.id !== id)
      );
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete event";

      if (err instanceof ApiError && err.status === 401) {
        logout();
        return;
      }

      setError(message);
    }
  }, [logout, token]);

  if (authLoading || (token && loading)) {
    return (
      <AppShell className="flex items-center justify-center">
        <GlassPanel className="px-8 py-6">
          <p className="text-lg font-medium text-stone-800">
            Loading your events...
          </p>
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

  return (
    <AppShell className="py-10">
      <div className="mx-auto max-w-6xl">
        <GlassPanel className="relative mb-8 overflow-hidden p-8 md:p-10">
          <div className="absolute right-6 top-6 md:right-8 md:top-8">
            <ProfileMenu
              name={user?.name ?? "Account"}
              email={user?.email ?? "Signed in user"}
              onLogout={logout}
            />
          </div>
          <SectionHeading
            eyebrow="Event dashboard"
            title="Your schedule at a glance."
            description={
              <>
                <span className="mb-3 block text-xs font-semibold uppercase tracking-[0.26em] text-[var(--accent-strong)]">
                  {`Welcome, ${(user?.name ?? "User").toUpperCase()}`}
                </span>
                Review every event, adjust details quickly, and keep your
                planning flow moving with less friction.
              </>
            }
            actions={
              <Link href="/events/new" className="primary-button">
                Create event
              </Link>
            }
          />
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <MetricCard label="Visible on this page" value={events.length} />
            <MetricCard label="Current page" value={page} />
            <MetricCard label="Available pages" value={lastPage} />
          </div>
        </GlassPanel>

        {events.length === 0 ? (
          <EmptyState
            title="No events yet"
            description="Start with your first event and this dashboard will turn into a clean planning board for upcoming work."
            actionHref="/events/new"
            actionLabel="Create your first event"
          />
        ) : (
          <section className="grid gap-6">
            {events.map((event) => (
              <EventCard key={event.id} event={event} onDelete={handleDelete} />
            ))}
          </section>
        )}

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="secondary-button disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>
          <p className="muted-text text-center font-medium">
            Page {page} of {lastPage}
          </p>
          <button
            onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
            disabled={page === lastPage}
            className="secondary-button disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </AppShell>
  );
}
