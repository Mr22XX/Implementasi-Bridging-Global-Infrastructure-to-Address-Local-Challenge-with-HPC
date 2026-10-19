# HPC Local Impact Dashboard

An interactive educational dashboard demonstrating how High-Performance Computing (HPC) can help address local challenges through large-scale data processing and simulation.

## Use cases included

- **Flood modelling:** explore how terrain, rainfall, and river-flow datasets could support flood scenario analysis.
- **Forest monitoring:** explore large-scale satellite imagery analysis and land-cover change detection.
- **Energy planning:** explore computational scenarios for local energy demand and grid planning.

## Features

- Interactive local-challenge selector.
- HPC workload simulator with adjustable compute nodes and workload sizes.
- Illustrative runtime, speedup, and time-reduction estimates.
- Runtime comparison and scaling charts powered by Chart.js.
- Responsive layout, mobile navigation, and dark mode.
- Explanation of a typical data-to-decision workflow.

## Tech stack

- HTML5
- CSS3
- Vanilla JavaScript
- [Chart.js](https://www.chartjs.org/)

## Run locally

No build step is required.

1. Download or clone this repository.
2. Open `index.html` in your browser, or use the VS Code Live Server extension.
3. An internet connection is needed to load Chart.js and Google Fonts from their CDNs.

## Publish with GitHub Pages

1. Create a GitHub repository and upload all four project files to the root.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select `main` and `/ (root)`, then save.
5. Wait for GitHub Pages to publish the site.

## How the simulator works

The simulator uses a simplified model with a serial fraction and an assumed parallel efficiency. It estimates how runtime may change as the number of compute nodes increases. The values are illustrative and are not measured benchmarks or performance claims about a real HPC cluster.

Real-world performance depends on processor and accelerator architecture, memory, interconnect, storage, workload parallelizability, software implementation, and data movement.

## Important note

All displayed values are synthetic examples for educational and portfolio purposes. The dashboard does not connect to a real HPC cluster, execute a scientific model, process live satellite data, or provide real flood/forest/energy predictions.
