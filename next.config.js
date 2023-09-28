/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	env: {
		API_PATH: process.env.API_PATH,
	},
};

module.exports = nextConfig;
