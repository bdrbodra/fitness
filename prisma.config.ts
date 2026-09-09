import path from "node:path";
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: path.join(__dirname, "prisma", "schema.prisma"),
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // Read directly from process.env (not the config's `env()` helper,
    // which throws immediately if the variable is missing) so that
    // `prisma generate` — which doesn't need a live connection — still
    // works even before a database is connected. Commands that do need a
    // connection (migrate, db seed) still fail with a clear error if this
    // is unset.
    url: process.env.DATABASE_URL,
  },
});
