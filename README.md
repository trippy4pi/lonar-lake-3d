# 🌋 Lonar Crater 3D Geomorphology & Historical Timeline

An interactive, scientifically calibrated **3D WebGL Application** visualizing the **Lonar Impact Crater**—a hypervelocity meteor impact crater in Deccan Traps flood basalt located in Buldhana district, Maharashtra, India.

[![React 19](https://img.shields.io/badge/React-19.0-61dafb.svg?style=flat-square&logo=react)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-r185-black.svg?style=flat-square&logo=three.js)](https://threejs.org/)
[![Vite](https://img.shields.io/badge/Vite-8.2-646cff.svg?style=flat-square&logo=vite)](https://vitejs.dev/)
[![PWA Ready](https://img.shields.io/badge/PWA-Installable-22c55e.svg?style=flat-square)](https://web.dev/progressive-web-apps/)
[![Author](https://img.shields.io/badge/Created_by-Picmica-38bdf8.svg?style=flat-square)](https://www.picmica.in)

---

## 🌟 Overview

Lonar Crater is one of the world's rare, pristine hypervelocity impact craters formed in basaltic rock. This web application provides a full 3D interactive model featuring real-time limnological soda lake telemetry, sub-surface geological cross-sections, shock wave metamorphism mapping, and a historical timeline spanning from 50,000 years BP to the present day.

---

## 🚀 Key Features

### ⏳ 1. Historical Timeline Slider (5 Epochs)
- **~50,000 BP (Pre-Impact Plateau)**: Visualizes the flat Deccan Traps basalt plateau with dense 3D monsoon flora (*Teak & Acacia*) before the meteor collision.
- **Impact Day (Hypervelocity Collision)**: Simulates the energetic impact event ($300-400\text{ kt}$ TNT equivalent) excavating the 1.8km wide crater basin.
- **~1,200 AD (Medieval Temple Era)**: Features ancient Yadava/Chalukya Hindu temple architecture (*Daitya Sudan*) nestled along the crater slopes and freshwater springs.
- **June 2020 (Pink Lake Bloom)**: Recreates the rare biological phenomenon where extreme salinity and high pH ($>10.8$) triggered *Haloarchaea* microbes and *Dunaliella salina* microalgae, turning the lake vibrant rose pink.
- **Present Day (Modern Satellite DEM)**: Current high-resolution satellite imagery integrated with NASA SRTM 30m Digital Elevation Model telemetry.

### 🎨 2. Terrain Visual Modes
- **Satellite Orthophoto**: High-resolution photogrammetric satellite imagery texture overlay.
- **Deccan Basalt Geology**: Geological Survey of India (GSI) formation map delineating rim bedrock, ejecta blanket debris, and crater basin mud.
- **Elevation DEM Scale**: Color-contoured NASA SRTM radar topography from lake floor ($479\text{m MSL}$) to crater rim crest ($608\text{m MSL}$).
- **Shock Pressure Model**: Isobaric shockwave pressure gradient ($0 \text{ to } >60\text{ GPa}$) displaying Planar Deformation Features (PDFs) and Maskelynite impact glass formation zones.

### 🧪 3. Soda Lake Chemistry & pH Telemetry
- **Dynamic pH Slider ($7.0 - 11.5$)**: Real-time water color transitions reflecting limnological changes:
  - $\text{pH } 9.5 - 10.0$: Deep Emerald Green (*Spirulina bloom*)
  - $\text{pH } 10.0 - 10.5$: Greenish-Cyan (*Alkaline scatter*)
  - $\text{pH } 10.5 - 10.8$: Murky Greenish-Brown (*Evaporation shift*)
  - $\text{pH } > 10.8$: Vibrant Rose Pink (*Haloarchaea pigment*)
- **Water Level Modulation & Drain Toggle**: Simulates seasonal water volume fluctuations.

### 📱 4. Mobile & PWA Optimization
- **Progressive Web App (PWA)**: Standalone installable app on iOS, Android, Chrome, and Edge with custom location pin favicon and manifest.
- **Thermal & Battery Optimization**: Automatic Device Pixel Ratio capping (`dpr={[1, 1.5]}`) and dynamic low-power GPU preference on mobile screens to prevent phone overheating.
- **Fluid Touch HUD**: Auto-collapsing controls, screen-width dynamic card fitting, and responsive touch gestures.

---

## 🎮 Navigation Controls & Keybindings

| Input | Action |
| :--- | :--- |
| **Mouse Left Drag** | Orbit 3D camera around target |
| **Mouse Right Drag / Scroll** | Pan camera & Zoom in / out |
| **`W` `A` `S` `D` Keys** | Pan camera horizontally relative to view direction |
| **`Up` / `Down` Arrow Keys** | Vertical pitch rotation ($0^\circ - 180^\circ$ unlocked) |
| **`Left` / `Right` Arrow Keys** | Horizontal 360-degree yaw rotation |
| **`+` / `-` Keys** | Zoom camera in and out |
| **Auto Rotate** | Automatic orbit rotation (disables on manual navigation) |

---

## 🛠️ Technology Stack

- **Core Library**: [React 19](https://react.dev/)
- **3D Graphics**: [Three.js](https://threejs.org/) & [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber)
- **3D Helper Utilities**: [@react-three/drei](https://github.com/pmndrs/drei)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Build System**: [Vite 8](https://vitejs.dev/)

---

## 📚 Scientific Data Sources & Citations

1. **NASA SRTM 30m Global Digital Elevation Model (DEM)**  
   *Radar topography data for Lonar crater rim ($608\text{m MSL}$) & basin floor ($479\text{m MSL}$).*  
   🔗 [USGS EarthExplorer DEM Data](https://earthexplorer.usgs.gov/)

2. **Geological Survey of India (GSI) National Geo-Heritage Monuments**  
   *Deccan Traps flood basalt stratigraphy and impact ejecta blanket mapping.*  
   🔗 [GSI Geo-Heritage Sites Repository](https://www.gsi.gov.in/web/guest/geo-heritage-sites)

3. **CSIR-NEERI & ARI Haloarchaea Microbes Remote Sensing Study (2020)**  
   *Limnology study on Haloarchaea carotenoid bloom & hyper-alkalinity ($\text{pH } 9.5 - 11.2$).*  
   🔗 [NIH NCBI PMC8574169: Haloarchaea Pigmentation in Lonar Lake](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8574169/)

4. **LPI / GSA Shock Metamorphic Effects Handbook (French, B.M.)**  
   *Impact shock pressure equation of state ($0 - 60+\text{ GPa}$), shatter cones, and Maskelynite glass.*  
   🔗 [LPI/USRA Traces of Catastrophe Handbook](https://www.lpi.usra.edu/publications/books/CB-954/cb-954.intro.html)

5. **Archaeological Survey of India (ASI) Protected Monuments**  
   *Historical records of Daitya Sudan & Chalukya/Yadava temple architecture (~1,200 AD).*  
   🔗 [ASI List of Protected Monuments in Maharashtra](https://asi.nic.in/protected-monuments-in-maharashtra/)

---

## 📦 Local Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/picmica/lonar-lake-3d.git
   cd lonar-lake-3d
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start local development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000/` in your browser.

---

## 👤 Author & Attribution

Created with ❤️ by **Picmica**  
🌐 Website: [www.picmica.in](https://www.picmica.in)  
✍️ Lead Developer: **Abhishek**

---

## 📄 License

This project is open-source under the **MIT License**.
