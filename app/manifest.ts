import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        orientation: "any",
        display: "standalone",
        dir: "auto",
        lang: "ja",
        name: "minimalDrawer",
        short_name: "minidraw",
        start_url: "/",
        theme_color: "#ffc800",
        background_color: "#ffffff",
        icons: [
            {
                purpose: "maskable",
                sizes: "512x512",
                src: "icon512_maskable.png",
                type: "image/png"
            },
            {
                purpose: "any",
                sizes: "512x512",
                src: "icon512_rounded.png",
                type: "image/png"
            }
        ],
    }
}