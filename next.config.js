/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.agoda.net" },
      { protocol: "https", hostname: "pix*.agoda.net" },
      { protocol: "https", hostname: "**.trvl-media.com" },
      { protocol: "https", hostname: "**.bstatic.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  async redirects() {
    return [
      // /guides/pai was misleading — its content was always Mae Hong Son.
      // Renamed the slug on 2026-09-25; 301 so any inbound links keep working.
      { source: "/guides/pai", destination: "/guides/mae-hong-son", permanent: true },
      { source: "/zh/guides/pai", destination: "/zh/guides/mae-hong-son", permanent: true },
      { source: "/guides/khao-sok-&-chew-lan-lake", destination: "/guides/khao-sok-cheow-lan-lake", permanent: true },
      { source: "/zh/guides/khao-sok-&-chew-lan-lake", destination: "/zh/guides/khao-sok-cheow-lan-lake", permanent: true },
    ];
  },
};

module.exports = nextConfig;
