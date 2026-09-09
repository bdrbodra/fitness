import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Bruno — Coaching & Training",
    short_name: "Bruno",
    description: "Train. Eat. Don't miss a day.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f2f2f3",
    theme_color: "#f2f2f3",
    icons: [
      { src: "/icons/192", sizes: "192x192", type: "image/png" },
      { src: "/icons/512", sizes: "512x512", type: "image/png" },
      {
        src: "/icons/maskable-512",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
