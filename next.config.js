/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	env: {
		API_PATH: process.env.API_PATH,
	},
	async rewrites() {
		return [
			{
				source: "/api/:path*",
				destination: "http://localhost:4000/api/:path*",
			},
		];
	},
};

module.exports = nextConfig;
