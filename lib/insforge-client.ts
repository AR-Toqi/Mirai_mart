import { createClient } from "@insforge/sdk";

const baseUrl =
  process.env.NEXT_PUBLIC_INSFORGE_URL ||
  "https://mirai-mart.region.insforge.app";
const anonKey =
  process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY || "mock-anon-key";

export const insforge = createClient({
  baseUrl,
  anonKey,
});
