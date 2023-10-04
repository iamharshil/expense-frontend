/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	env: {
		API_PATH: process.env.API_PATH,
	},
	async headers() {
		return [
			{
				source: "/api/:path*",
				headers: [
					{
						key: "Content-Type",
						value: "application/json",
					},
				],
			},
		];
	},
};

module.exports = nextConfig;
