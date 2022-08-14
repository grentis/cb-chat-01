import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';
import { reactOutputTarget } from '@stencil/react-output-target';

import tailwind, { tailwindHMR } from 'stencil-tailwind-plugin';

export const config: Config = {
  namespace: 'ui-components-stencil',
  plugins: [
    tailwind(),
    tailwindHMR(),
    sass()
  ],
  outputTargets: [
    reactOutputTarget({
      componentCorePackage: 'ui-components-stencil',
      proxiesFile: '../ui-components-react/src/index.ts',
      includeDefineCustomElements: true
    }),
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-custom-elements',
    },
    {
      type: 'docs-readme',
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
    },
  ],
};
