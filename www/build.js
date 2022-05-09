const esbuild = require('esbuild');
const svgr = require('esbuild-plugin-svgr');

const mode = process.argv[2];

const config = {
  entryPoints: ['dist/index.tsx'],
  bundle: true,
  target: ['chrome100'],
  outfile: 'dist/bundle/index.js',
  loader: {
    '.woff': 'file',
    '.woff2': 'file'
  },
  plugins: [
    svgr(),
  ]
}

if (mode === 'dev') {
  esbuild.serve(
    {
      port: 8000,
      servedir: 'dist',
      onRequest({ method, path, status }) {
        const red = '\x1b[31m';
        const green = '\x1b[32m';
        const reset =  '\x1b[0m'
        const color = parseInt(status / 100) === 2 ? green : red;
        console.error(`${color}${status}${reset} ${method} ${path}`);
      }
    },
    config
  ).then(({ port, host }) => {
    console.log(`Server started at http://${host}:${port}`)
  });
} else {
  esbuild.build(config).then(({
    errors,
    warnings,
    outputFiles,
  }) => {
    console.log('Build done');
    if (errors) {
      esbuild.formatMessages(errors, { kind: 'error', color: true });
    }
    if (warnings) {
      esbuild.formatMessages(errors, { kind: 'warning', color: true });
    }

    if (outputFiles) {
      for (const file of outputFiles) {
        console.log(file.path)
      }
    }
  }, ({ errors, warnings}) => {
    if (errors) {
      esbuild.formatMessages(errors, { kind: 'error', color: true });
    }
    if (warnings) {
      esbuild.formatMessages(errors, { kind: 'warning', color: true });
    }
  });
}
