/** @type {import('next').NextConfig} */
import WebpackObfuscator from "webpack-obfuscator";

const nextConfig = {
      compiler: {
        removeConsole: {
          exclude: ['error', 'warn'], // Keeps console.error and console.warn
        },
      },
    webpack: (config, { isServer }) => {
        if (!isServer && process.env.NODE_ENV === "production") {
            config.plugins.push(
                new WebpackObfuscator(
                    {
                        rotateStringArray: true,
                        stringArray: true,
                        stringArrayThreshold: 0.75,
                        compact: true,
                        controlFlowFlattening: true,
                        deadCodeInjection: true,
                        debugProtection: true,
                        selfDefending: true,
                    },
                    ["**/*.js"] // Targets all client-side JS files
                )
            );
        }
        return config;
    },
};

export default nextConfig;
