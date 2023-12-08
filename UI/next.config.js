/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/",
        destination: "/dashboard",
        permanent: true,
      },
    ];
  },
  env: {
    BASEURL: "http://localhost:3001/",
  },
};

module.exports = nextConfig;
