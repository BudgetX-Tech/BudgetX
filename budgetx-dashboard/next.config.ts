import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {},
};

export default withSentryConfig(nextConfig, {
  silent: true,
  org: "budgetx",
  project: "budgetx-dashboard",
});
