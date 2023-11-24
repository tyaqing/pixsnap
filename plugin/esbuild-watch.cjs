#!/usr/bin/env node
require("esbuild")
    .build({
        entryPoints: ["src/plugin/code.ts"],
        outdir: "dist",
        bundle: true,
        watch: {
            onRebuild(error, result) {
                if (error) console.error('watch build failed:', error)
                else {
                    console.log('watch build succeeded:', result)
                    // HERE: somehow restart the server from here, e.g., by sending a signal that you trap and react to inside the server.
                }
            },
        },
    }).then(() => {
        console.log('watching...')
    })
    .catch(() => process.exit(1));
