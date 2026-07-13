import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  output: "standalone",
  // Legacy unprefixed Spanish URLs from when es was the default locale
  async redirects() {
    return [
      { source: "/producto", destination: "/es/producto", permanent: true },
      { source: "/precios", destination: "/es/precios", permanent: true },
      { source: "/privacidad", destination: "/es/privacidad", permanent: true },
      { source: "/terminos", destination: "/es/terminos", permanent: true },
      { source: "/blog/bienvenido", destination: "/es/blog/bienvenido", permanent: true },
    ];
  },
  turbopack: {
    rules: {
      "*.mdx": {
        loaders: ["raw-loader"],
        as: "*.js",
      },
    },
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.mdx?$/,
      type: "asset/source",
    });
    return config;
  },
};

export default withNextIntl(nextConfig);
