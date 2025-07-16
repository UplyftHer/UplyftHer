/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['UplyftHer.s3.eu-central-1.amazonaws.com','d1jobo9bn0qtxs.cloudfront.net'], // Add the S3 bucket domain here
    },
};

export default nextConfig;
