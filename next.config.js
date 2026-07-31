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
};

module.exports = nextConfig;
