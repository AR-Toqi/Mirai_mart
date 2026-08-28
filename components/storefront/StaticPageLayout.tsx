import Link from "next/link";
import { ChevronRightIcon } from "@/components/ui/Icons";

type Props = {
  title: string;
  lead?: string;
  notice?: string;
  children: React.ReactNode;
};

export function StaticPageLayout({ title, lead, notice, children }: Props) {
  return (
    <main className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <nav
        aria-label="Breadcrumb"
        className="mb-6 flex items-center gap-1.5 font-sans text-xs text-neutral-muted"
      >
        <Link href="/" className="transition-colors hover:text-primary">
          Home
        </Link>
        <ChevronRightIcon size={14} aria-hidden="true" />
        <span className="font-medium text-neutral-dark">{title}</span>
      </nav>

      <header className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-neutral-dark sm:text-4xl">
          {title}
        </h1>
        {lead ? (
          <p className="mt-3 max-w-2xl font-sans text-base leading-relaxed text-neutral-muted">
            {lead}
          </p>
        ) : null}
      </header>

      {notice ? (
        <div className="mb-6 rounded-xl border border-primary/30 bg-primary-surface/30 px-4 py-3 font-sans text-sm text-neutral-dark">
          {notice}
        </div>
      ) : null}

      <div className="rounded-2xl border border-neutral-border bg-surface p-6 font-sans shadow-sm sm:p-8">
        {children}
      </div>
    </main>
  );
}
