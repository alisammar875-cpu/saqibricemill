/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // ImgBB — used for product image uploads
      { protocol: 'https', hostname: 'i.ibb.co' },
      { protocol: 'https', hostname: 'ibb.co' },
      // Firebase Storage
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com' },
      // Unsplash — used in email banners & placeholders
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
};

export default nextConfig;
