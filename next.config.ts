import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client", "bcryptjs", ".prisma"]
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Exclude Prisma client from client-side bundle
      config.externals = config.externals || [];
      config.externals.push({
        '@prisma/client': 'commonjs @prisma/client',
        '.prisma/client': 'commonjs .prisma/client',
        '.prisma/client/default': 'commonjs .prisma/client/default'
      });
    }
    return config;
  }
};

export default nextConfig;