import Image from "next/image";
import Link from "next/link";

const quickLinks = [
  { label: "All Products", href: "/category/all" },
  { label: "Track Your Order", href: "/track-order" },
  { label: "Contact Us", href: "/contact" },
];

export default function NotFound() {
  return (
    <main className="flex flex-1 items-center justify-center bg-neutral-bg px-4 py-16 font-sans">
      <div className="w-full max-w-md rounded-2xl border border-neutral-border bg-surface p-8 text-center shadow-sm sm:p-10">
        <Image
          src="/mirai-mart_logo.png"
          alt="Mirai Mart"
          width={150}
          height={42}
          className="mx-auto h-9 w-auto object-contain"
        />
        <p className="mt-8 font-heading text-6xl font-bold text-primary">404</p>
        <h1 className="mt-4 font-heading text-2xl font-semibold text-neutral-dark">
          Page not found
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-neutral-muted">
          We could not find the page you wanted. It may have moved, or the link
          may be wrong.
        </p>

        <Link
          href="/"
          className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-95"
        >
          Back to home
        </Link>

        <div className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-neutral-muted">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
