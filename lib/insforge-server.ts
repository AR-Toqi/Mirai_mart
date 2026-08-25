import { createClient, InsForgeClient } from "@insforge/sdk";

let serverClient: InsForgeClient | null = null;

export async function createInsforgeServer(): Promise<InsForgeClient> {
  if (serverClient) {
    return serverClient;
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_INSFORGE_URL ||
    process.env.INSFORGE_URL ||
    "https://mirai-mart.region.insforge.app";
  const anonKey =
    process.env.INSFORGE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY ||
    "mock-anon-key";

  serverClient = createClient({
    baseUrl,
    anonKey,
  });

  return serverClient;
}
