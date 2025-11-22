# 3D Latency Topology Visualizer

## 1. Project Title + Description

**3D Latency Topology Visualizer** is a high-performance, interactive 3D web application designed to visualize network latency between crypto exchange servers and major cloud provider regions (AWS, GCP, Azure).

Built with **Next.js**, **TypeScript**, and **Three.js** (via **react-globe.gl**), this application renders a real-time, interactive globe that simulates network traffic and latency metrics. It provides a powerful visual tool for understanding the geographical distribution of infrastructure and the performance characteristics of global networks.

The application operates entirely client-side, simulating realistic latency patterns based on geographical distance (Haversine formula) and provider-specific network characteristics, complete with jitter and real-time updates.

---

## 2. Live Features Implemented

The application successfully implements all core assignment objectives, delivering a polished and responsive user experience:

*   **3D Globe Visualization**: A fully interactive 3D globe rendering the Earth, capable of smooth zooming, rotation, and dragging.
*   **Real-Time Simulated Latency**: Dynamic calculation and visualization of latency between exchange servers and cloud regions, updated in real-time.
*   **Exchange Server Markers**: Distinct visual markers representing major crypto exchanges (e.g., Binance, Coinbase, Kraken) placed at their approximate geographical locations.
*   **Cloud Region Markers**: Differentiated markers for major cloud providers (AWS, GCP, Azure), color-coded for easy identification.
*   **Provider-Based Color Coding**:
    *   **AWS**: Orange
    *   **GCP**: Blue
    *   **Azure**: Blue/Green (Teal)
    *   **Exchanges**: Gold/Yellow
*   **Interactive Controls**: A comprehensive control panel allowing users to:
    *   Filter visible cloud providers.
    *   Toggle specific exchanges.
    *   Adjust latency thresholds for visualization.
*   **Metrics Dashboard**: An overlay dashboard displaying real-time statistics, including average latency, jitter, and active connection counts.
*   **Historical Latency Charts**: Integrated **Recharts** line graphs showing the historical latency trends for selected connections over time.
*   **Responsive Design**: A fluid UI that adapts to different screen sizes, ensuring usability across devices.

---

## 3. Tech Stack

This project leverages a modern, robust, and type-safe technology stack:

*   **Framework**: [Next.js 16 (App Router)](https://nextjs.org/) - React framework for production.
*   **Language**: [TypeScript](https://www.typescriptlang.org/) - Static typing for reliability and maintainability.
*   **UI Library**: [React 19](https://react.dev/) - Component-based UI architecture.
*   **3D Visualization**:
    *   [react-globe.gl](https://github.com/vasturiano/react-globe.gl) - React bindings for Globe.gl.
    *   [Three.js](https://threejs.org/) - WebGL 3D library.
*   **Charting**: [Recharts](https://recharts.org/) - Composable charting library for React.
*   **Styling**: [TailwindCSS v4](https://tailwindcss.com/) - Utility-first CSS framework.
*   **Icons**: [Lucide React](https://lucide.dev/) - Beautiful & consistent icons.
*   **Utilities**: `clsx`, `tailwind-merge` for dynamic class management.

---

## 4. How to Install & Run

Follow these steps to set up the project locally:

### Prerequisites
*   Node.js (v18+ recommended)
*   npm or yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repo-url>
    cd latency-visualizer
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Production Build

To create an optimized production build:

```bash
npm run build
npm start
```

---

## 5. Project Folder Structure

The project follows a clean, modular architecture:

*   **/src/app**: Next.js App Router pages and layouts. Contains the main entry point `page.tsx`.
*   **/src/components**: Reusable UI components.
    *   `GlobeViz.tsx`: The core 3D globe component.
    *   `Dashboard.tsx`: The overlay UI for metrics and controls.
    *   `LatencyChart.tsx`: Historical data visualization.
*   **/src/context**: React Context providers for global state management (e.g., `SimulationContext` for managing latency data).
*   **/src/data**: Static data definitions for Cloud Regions (`cloudRegions.ts`) and Exchanges (`exchanges.ts`).
*   **/src/hooks**: Custom React hooks for logic encapsulation (e.g., `useLatencySimulation`).
*   **/src/types**: TypeScript type definitions and interfaces.

---

## 6. Simulation Logic Explanation

The application uses a sophisticated client-side simulation engine to mimic real-world network conditions:

1.  **Haversine Distance**: The base latency is calculated using the Haversine formula to determine the great-circle distance between an exchange and a cloud region. This provides a realistic "speed of light" baseline (approx. 1ms per 100km).
2.  **Provider Mapping**: Specific "penalties" or "boosts" are applied based on the cloud provider to simulate different network backbone efficiencies.
3.  **Jitter & Noise**: A random jitter factor is added to every update tick to simulate network congestion and variability.
    *   `Latency = (Distance * Factor) + Base_Overhead + Random_Jitter`
4.  **Update Intervals**: The simulation runs on a configurable interval (default: 1000ms), updating the state of all active connections and pushing new data points to the historical arrays.

---

## 7. Key Features & How to Use the Application

*   **Navigation**:
    *   **Rotate**: Left-click and drag.
    *   **Zoom**: Mouse wheel or pinch.
    *   **Pan**: Right-click and drag.
*   **Interaction**:
    *   **Hover**: Hover over any marker (Exchange or Cloud Region) to see a tooltip with detailed information (Name, Location, Provider).
    *   **Click**: Click a marker to focus on it and filter connections related only to that node.
*   **Dashboard Controls**:
    *   Use the **Filters** section to show/hide specific Cloud Providers (AWS, GCP, Azure).
    *   Use the **Exchange Toggles** to focus on specific markets.
    *   Adjust the **Latency Threshold** slider to filter out high-latency connections from the visualizer.
*   **Historical Data**:
    *   Select a specific connection (by clicking an arc or a node) to view its latency history in the chart at the bottom of the panel.

---

## 8. Assumptions Made

*   **No Backend**: The project is designed as a pure frontend application. All data generation and processing happen in the browser.
*   **Simulated Latency**: Latency values are mathematically simulated approximations and do not represent actual real-time network pings to these servers.
*   **Mocked Locations**: While major regions are accurate, some specific server coordinates are approximated for visualization purposes.
*   **No Authentication**: The application is open access and does not require user login.

---

## 9. Bonus Features

*   **Auto-Rotation**: The globe gently auto-rotates when idle to provide a dynamic screensaver-like effect (can be toggled).
*   **Day/Night Cycle**: Visual rendering of the globe includes atmosphere and lighting effects.
*   **Responsive Layout**: The dashboard collapses into a mobile-friendly drawer on smaller screens.

---

## 10. Recording Instructions for the Company

To record a demo of this application, follow this flow:

1.  **Overview**: Start with a wide shot of the globe rotating. Mention the tech stack (Next.js, Three.js).
2.  **Architecture**: Briefly explain the client-side simulation logic (Haversine distance).
3.  **Real-Time Updates**: Zoom in to a specific region (e.g., US East). Point out the animated arcs and the changing latency numbers in the dashboard.
4.  **Interaction**: Demonstrate rotating, zooming, and hovering over markers to show tooltips.
5.  **Filtering**: Toggle off "AWS" and "GCP" to show only Azure nodes. Show how the arcs update instantly.
6.  **Code Walkthrough**: Briefly switch to VS Code and show:
    *   `src/components/GlobeViz.tsx` (The 3D rendering logic).
    *   `src/hooks/useLatencySimulation.ts` (The math behind the latency).

---

## 11. Future Improvements

*   **Real API Integration**: Connect to a WebSocket feed for live exchange status.
*   **Server-Side Probes**: Implement a backend with distributed nodes to ping actual endpoints for ground-truth latency.
*   **Path Tracing**: Visualize multi-hop routes instead of direct great-circle arcs.
*   **More Regions**: Expand the dataset to include more niche cloud providers and edge locations.
