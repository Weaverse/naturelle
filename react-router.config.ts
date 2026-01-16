import type { Config } from "@react-router/dev/config";
import { hydrogenPreset } from "@shopify/hydrogen/react-router-preset";

export default {
  presets: [hydrogenPreset()],
  appDirectory: "app",
  buildDirectory: "dist",
  ssr: true,
  future: {
    unstable_viteEnvironmentApi: true,
  },
} satisfies Config;
