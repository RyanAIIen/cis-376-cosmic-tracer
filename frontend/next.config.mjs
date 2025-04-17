/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  async rewrites() {
    return [
      // Handle URLs with trailing slash
      {
        source: '/api/scores/leaderboard/',
        destination: 'http://localhost:8000/api/scores/leaderboard/',
      },
      // Handle URLs without trailing slash
      {
        source: '/api/scores/leaderboard',
        destination: 'http://localhost:8000/api/scores/leaderboard/',
      },
      // Handle URL for submitting scores with trailing slash
      {
        source: '/api/scores/submit/',
        destination: 'http://localhost:8000/api/scores/submit/',
      },
      // Handle URL for submitting scores without trailing slash
      {
        source: '/api/scores/submit',
        destination: 'http://localhost:8000/api/scores/submit/',
      },
      // General fallback for other API routes
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/api/:path*',
      },
    ];
  },
};

export default nextConfig;
