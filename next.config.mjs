/** @type {import('next').NextConfig} */
const nextConfig = {

    //ALLOWS FOR asyncWebAssembly
    webpack(config) {
        
        // Since Webpack 5 doesn't enable WebAssembly by default, we should do it manually
        config.experiments = { ...config.experiments, asyncWebAssembly: true };
    
        return config;
        
      },
    
    };

export default nextConfig;
