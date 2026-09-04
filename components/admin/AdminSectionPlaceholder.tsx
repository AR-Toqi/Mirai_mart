"use client";

import React from "react";
import Link from "next/link";
import { LayoutDashboard, ArrowLeft, Construction, Sparkles } from "lucide-react";

interface AdminSectionPlaceholderProps {
  title: string;
  description: string;
  featurePhase: string;
  upcomingFeatures: string[];
}

export function AdminSectionPlaceholder({
  title,
  description,
  featurePhase,
  upcomingFeatures,
}: AdminSectionPlaceholderProps) {
  return (
    <div className="space-y-6 font-sans max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-neutral-border">
        <div>
          <h2 className="font-heading font-bold text-2xl text-neutral-dark">
            {title}
          </h2>
          <p className="text-xs text-neutral-muted mt-1">{description}</p>
        </div>
        <Link
          href="/admin"
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-neutral-border bg-surface hover:bg-neutral-bg text-xs font-semibold text-neutral-dark transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      {/* Info Card */}
      <div className="bg-surface border border-neutral-border rounded-2xl p-8 shadow-xs text-center">
        <div className="w-14 h-14 rounded-2xl bg-primary-surface/40 text-primary flex items-center justify-center mx-auto mb-4 border border-primary/20">
          <Sparkles className="w-7 h-7" />
        </div>

        <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-2">
          {featurePhase}
        </span>

        <h3 className="font-heading font-bold text-xl text-neutral-dark">
          {title} Management Module
        </h3>

        <p className="text-xs text-neutral-muted max-w-md mx-auto mt-2 leading-relaxed">
          This management module is scheduled in the build plan. All metrics, links, and orders
          from this area are actively tracked and aggregated on the main Admin Dashboard.
        </p>

        {/* Feature Highlights */}
        <div className="max-w-md mx-auto mt-6 text-left bg-neutral-bg rounded-xl p-4 border border-neutral-border/60">
          <p className="text-xs font-bold text-neutral-dark mb-2">
            Features In Scope:
          </p>
          <ul className="space-y-1.5 text-xs text-neutral-muted">
            {upcomingFeatures.map((f, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            href="/admin"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-tertiary transition-all shadow-xs"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Return to Admin Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
