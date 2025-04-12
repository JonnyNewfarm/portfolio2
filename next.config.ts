import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.(mp4|webm|mov)$/, // Add other video file formats as needed
      use: {
        loader: 'file-loader',
        options: {
          publicPath: '/_next/static/videos/', // Adjust the public path if needed
          outputPath: 'static/videos/', // Store videos in static folder
        },
      },
    });

    return config;
  },
};

export default nextConfig;
