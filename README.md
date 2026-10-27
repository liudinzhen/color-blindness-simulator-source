# Color Blindness Simulator Source

Source code for a browser-based color blindness simulator with protan, deutan, and tritan image previews.

## What it does

Choose a local JPEG, PNG, or WebP image, or one of the built-in examples. The simulator renders selected color vision model previews, grayscale difference maps, and downloadable PNG comparisons. Image processing runs in the browser; selected images are not uploaded by this source code.

The controls include Brettel (1997), Viénot (1999), Machado (2009), and DeficiencyView methods; protan, deutan, tritan, and achromatopsia views; and a strength slider. These are design-review simulations, not clinical tests or diagnoses.

## Run locally

Requires Node.js 18 or newer. From this directory, start the included local static server:

```sh
node server.mjs
```

Then open `http://localhost:8000` in a browser. No package installation or build step is required.

## Demo

Try the browser-based simulator at https://colorvisionsimulator.com/.

