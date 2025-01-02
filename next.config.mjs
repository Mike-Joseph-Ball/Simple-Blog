/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Enables React Strict Mode
  swcMinify: true,       // Uses SWC for faster builds and smaller bundles

  // Enable advanced Webpack configurations
  webpack(config) {
    // Enable WebAssembly
    config.experiments = { 
      ...config.experiments, 
      asyncWebAssembly: true 
    };

    // Example: Custom rules or plugins can go here if needed
    // config.plugins.push(new SomeCustomWebpackPlugin());

    return config;
  },
};

export default nextConfig;

