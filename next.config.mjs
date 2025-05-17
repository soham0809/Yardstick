/** @type {import('next').NextConfig} */
const nextConfig = {
    // Output in standalone mode for better Vercel compatibility
    output: 'standalone',

    // Ensure we can make requests to MongoDB Atlas
    async headers() {
        return [
            {
                // Apply to all routes
                source: '/:path*',
                headers: [
                    { key: 'Access-Control-Allow-Credentials', value: 'true' },
                    { key: 'Access-Control-Allow-Origin', value: '*' },
                    { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
                    { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
                ],
            },
        ];
    }
};

export default nextConfig;
