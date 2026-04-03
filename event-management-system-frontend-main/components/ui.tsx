"use client";

import Link from "next/link";
import React, { memo, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "../contexts/ThemeContext";

function joinClasses(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function AppShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <main className={joinClasses("app-page px-5 py-8 sm:px-6 sm:py-10", className)}>
      <div className="mx-auto max-w-6xl">{children}</div>
    </main>
  );
}

export function GlassPanel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <section className={joinClasses("glass-panel rounded-4xl", className)}>{children}</section>;
}

export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <p className={joinClasses("pill", className)}>{children}</p>;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
      <div className="max-w-3xl">
        {eyebrow ? <Eyebrow className="mb-4">{eyebrow}</Eyebrow> : null}
        <h1 className="display-title text-balance text-stone-950">{title}</h1>
        {description ? (
          <p className="body-lg muted-text mt-3 max-w-2xl text-pretty">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
    </div>
  );
}

export const Notice = memo(function Notice({
  children,
  tone = "error",
  className,
}: {
  children: React.ReactNode;
  tone?: "error" | "neutral";
  className?: string;
}) {
  return (
    <p
      className={joinClasses(
        tone === "error" ? "status-banner" : "soft-banner",
        className
      )}
      role={tone === "error" ? "alert" : "status"}
      aria-live={tone === "error" ? "assertive" : "polite"}
    >
      {children}
    </p>
  );
});

export const MetricCard = memo(function MetricCard({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="metric-card">
      <p className="metric-label">{label}</p>
      <p className="metric-value">{value}</p>
    </div>
  );
});

export const EmptyState = memo(function EmptyState({
  title,
  description,
  actionHref,
  actionLabel,
}: {
  title: string;
  description: string;
  actionHref: string;
  actionLabel: string;
}) {
  return (
    <GlassPanel className="p-8 text-center sm:p-10">
      <div className="mx-auto max-w-2xl">
        <h2 className="section-title text-stone-950">{title}</h2>
        <p className="body-lg muted-text mt-3 text-pretty">{description}</p>
        <Link href={actionHref} className="primary-button mt-8">
          {actionLabel}
        </Link>
      </div>
    </GlassPanel>
  );
});

export const FeatureTile = memo(function FeatureTile({
  kicker,
  title,
  description,
}: {
  kicker?: string;
  title: string;
  description: string;
}) {
  return (
    <div className="glass-panel rounded-3xl p-5">
      {kicker ? (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent-strong)]">
          {kicker}
        </p>
      ) : null}
      <h3 className="text-xl font-semibold tracking-tight text-stone-950">{title}</h3>
      <p className="muted-text mt-2 text-sm leading-6">{description}</p>
    </div>
  );
});

export const ProfileMenu = memo(function ProfileMenu({
  name,
  email,
  onLogout,
}: {
  name: string;
  email: string;
  onLogout: () => void;
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const { theme, toggleTheme } = useTheme();

  const initials = useMemo(() => {
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("");
  }, [name]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="profile-button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Open profile menu for ${name}`}
      >
        <span className="profile-avatar" aria-hidden="true">
          {initials || "U"}
        </span>
      </button>

      {open ? (
        <div className="profile-menu" role="menu">
          <div className="profile-summary">
            <span className="profile-summary-avatar" aria-hidden="true">
              {initials || "U"}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{name}</p>
              <p className="profile-email truncate">{email}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            className="menu-row menu-row-compact mt-3"
            role="menuitem"
          >
            <span className="text-sm font-semibold">
              {theme === "dark" ? "Dark mode" : "Light mode"}
            </span>
            <span className="theme-toggle" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={onLogout}
            className="menu-row menu-row-compact mt-2 profile-logout"
            role="menuitem"
          >
            <span className="inline-flex items-center gap-2 text-sm font-semibold">
              <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                fill="none"
                className="h-4 w-4"
              >
                <path
                  d="M7.5 4.5H5.75A1.25 1.25 0 0 0 4.5 5.75v8.5a1.25 1.25 0 0 0 1.25 1.25H7.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M11 13.5 14.5 10 11 6.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14.5 10H8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Logout
            </span>
          </button>
        </div>
      ) : null}
    </div>
  );
});

export { joinClasses };
