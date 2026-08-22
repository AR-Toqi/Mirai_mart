"use client";

import { useState } from "react";
import { MailIcon } from "@/components/ui/Icons";

export function NewsletterBanner() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email.trim()) {
      setIsSubscribed(true);
      setEmail("");
    }
  }

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#EBF5FB] via-[#F3F9FD] to-[#E5F4FC] border border-[#D0EBFB] p-6 sm:p-10 lg:p-12 shadow-xs">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
        {/* Left Illustration & Headline */}
        <div className="flex items-center gap-5 sm:gap-7 w-full lg:w-auto">
          {/* Decorative Mail Envelope & Paper Airplane */}
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 bg-white rounded-2xl border border-[#BEE9FF] shadow-xs flex items-center justify-center">
            <div className="w-10 h-10 rounded-xl bg-primary-surface text-primary flex items-center justify-center">
              <MailIcon size={22} className="w-6 h-6 stroke-[1.75]" />
            </div>
            {/* Small decorative paper airplane badge */}
            <span className="absolute -top-2 -right-2 text-primary text-base transform -rotate-12 animate-pulse">
              ✈️
            </span>
          </div>

          <div>
            <h3 className="font-heading font-bold text-xl sm:text-2xl text-neutral-dark leading-tight">
              Stay in the loop
            </h3>
            <p className="text-xs sm:text-sm text-neutral-muted mt-1 max-w-md font-sans">
              Get exclusive deals, new arrivals & parenting tips straight to your inbox.
            </p>
          </div>
        </div>

        {/* Right Form */}
        <div className="w-full lg:max-w-md">
          {isSubscribed ? (
            <div className="bg-success-surface border border-success/30 text-success font-semibold text-xs sm:text-sm p-3.5 rounded-xl text-center">
              🎉 Thank you for subscribing to Mirai Mart!
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-2.5 w-full">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full flex-1 bg-white border border-neutral-border text-sm text-neutral-dark placeholder:text-neutral-muted px-4 py-2.5 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all shadow-2xs"
              />
              <button
                type="submit"
                className="w-full sm:w-auto bg-primary hover:bg-tertiary text-white font-sans font-semibold text-sm px-6 py-2.5 rounded-xl transition-all shadow-xs shrink-0 cursor-pointer active:scale-98"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
