import { MetadataRoute } from "next";

import pkg from "@/../package.json";
export const APP_VERSION = pkg.version;

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `Nefira ${APP_VERSION}`,
    short_name: "Nefira",
    start_url: "/",
    id: "/",
    display: "standalone",
    background_color: "#000000",
    orientation: "portrait",
    theme_color: "#1E40AF",
    icons: [
      {
        src: "/xyrdron.png",
        sizes: "200x200",
        type: "image/png",
      },
      {
        src: "/favicon.ico",
        sizes: "596x596",
        type: "image/x-icon",
      },
    ],
    description: `Nefira ${APP_VERSION}`,
  };
}
