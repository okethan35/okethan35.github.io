# 3D Models Implementation Guide

## Overview
This guide explains how to add 3D models to your grocery store items that can be rotated to show the backside when clicked.

---

## 🎨 Where to Create 3D Models

### **Option 1: Blender (Recommended - Free & Powerful)**
**Best for:** Full control, professional results, custom textures

**Steps:**
1. **Download:** [blender.org](https://www.blender.org) (free, open-source)
2. **Create a cereal box:**
   - Start with a cube (`Shift+A` → Mesh → Cube)
   - Scale it to match cereal box proportions (roughly 1:1.3:0.2)
   - Add materials/textures for front and back faces
   - Add your design elements (text, logos, etc.)
3. **Export as GLB:**
   - File → Export → glTF 2.0 (.glb/.gltf)
   - Choose `.glb` (binary, smaller file size)
   - Save to `portfolio/public/models/`

**Tutorials:**
- [Blender Beginner Tutorial](https://www.youtube.com/watch?v=JYj6e-0RMDQ)
- [Creating a Simple Box](https://www.youtube.com/watch?v=7MRonzqYJgw)
- [Exporting to GLB](https://docs.blender.org/manual/en/latest/addons/io_scene_gltf2.html)

**Pros:**
- ✅ Free and open-source
- ✅ Full control over geometry and textures
- ✅ Industry standard
- ✅ Can create complex models

**Cons:**
- ❌ Steeper learning curve
- ❌ Takes time to learn

---

### **Option 2: Spline (Web-Based, Easier)**
**Best for:** Quick results, no installation, beginner-friendly

**Steps:**
1. **Sign up:** [spline.design](https://spline.design) (free tier available)
2. **Create a box:**
   - Start with a cube primitive
   - Customize dimensions
   - Add materials and textures
   - Export to React Three Fiber
3. **Export:**
   - Click "Export" → "React Three Fiber"
   - Copy the code or download the GLB file

**Pros:**
- ✅ Web-based (no installation)
- ✅ Easier learning curve
- ✅ Built-in React Three Fiber export
- ✅ Good for quick prototypes

**Cons:**
- ❌ Less control than Blender
- ❌ Free tier has limitations
- ❌ Models may be larger file size

---

### **Option 3: Tinkercad (Simplest)**
**Best for:** Very simple shapes, absolute beginners

**Steps:**
1. **Sign up:** [tinkercad.com](https://www.tinkercad.com) (free)
2. **Create:**
   - Drag a box shape
   - Resize to cereal box proportions
   - Export as OBJ or STL
3. **Convert:**
   - Use online converter (OBJ → GLB) or Blender to convert

**Pros:**
- ✅ Easiest to learn
- ✅ Web-based
- ✅ Good for simple shapes

**Cons:**
- ❌ Very limited detail
- ❌ Not ideal for complex designs
- ❌ May need conversion

---

### **Option 4: Ready-Made Models**
**Best for:** Quick start, inspiration

**Sources:**
- [Sketchfab](https://sketchfab.com) - Free and paid models
- [Poly Haven](https://polyhaven.com) - Free CC0 models
- [TurboSquid](https://www.turbosquid.com) - Paid models

**Note:** Make sure models are licensed for your use!

---

## 📦 File Format Recommendations

### **GLB (Recommended)**
- **What:** Binary GLTF format
- **Why:** Small file size, includes textures, widely supported
- **Export from:** Blender, Spline, most 3D tools
- **File extension:** `.glb`

### **GLTF**
- **What:** Text-based GLTF (JSON + separate files)
- **Why:** Human-readable, can edit JSON
- **When:** For debugging or when you need to edit textures separately
- **File extension:** `.gltf` + `.bin` + textures

### **OBJ**
- **What:** Older format
- **Why:** Simple, widely supported
- **When:** Fallback option
- **Note:** Doesn't include materials/textures (need separate `.mtl` file)

---

## 🚀 Implementation Steps

### Step 1: Install Dependencies (if not already installed)

```bash
npm install @react-three/fiber @react-three/drei three
```

### Step 2: Create Model Directory

```bash
mkdir -p portfolio/public/models
```

Place your `.glb` files here, e.g.:
- `portfolio/public/models/project-1.glb`
- `portfolio/public/models/project-2.glb`
- etc.

### Step 3: Create a 3D Model Component

Create `portfolio/src/components/3D/ProductModel3D.jsx`:

```jsx
import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';
import { gsap } from 'gsap';
import * as THREE from 'three';

/**
 * 3D Product Model Component
 * Loads a GLB model and allows rotation/flip
 */
export default function ProductModel3D({ 
  modelPath, 
  isFlipped, 
  isFocused,
  position = [0, 0, 0],
  scale = 1 
}) {
  const { scene } = useGLTF(modelPath);
  const meshRef = useRef();
  const controlsRef = useRef();

  // Clone the scene to avoid sharing geometry between instances
  const clonedScene = scene.clone();

  // Animate rotation when flipped
  useFrame(() => {
    if (meshRef.current) {
      // Smooth rotation to back when flipped
      if (isFlipped) {
        gsap.to(meshRef.current.rotation, {
          y: Math.PI, // 180 degrees
          duration: 0.6,
          ease: 'power2.inOut',
        });
      } else {
        gsap.to(meshRef.current.rotation, {
          y: 0,
          duration: 0.6,
          ease: 'power2.inOut',
        });
      }
    }
  });

  return (
    <group ref={meshRef} position={position} scale={scale}>
      <primitive object={clonedScene} />
      
      {/* Optional: Add orbit controls when focused */}
      {isFocused && (
        <OrbitControls
          ref={controlsRef}
          enableZoom={true}
          enablePan={false}
          minDistance={2}
          maxDistance={5}
          autoRotate={false}
        />
      )}
    </group>
  );
}

// Preload models (optional, for better performance)
useGLTF.preload('/models/project-1.glb');
```

### Step 4: Update Product Data Structure

In `GroceryStore3D.jsx`, add `modelPath` (and optionally `modelScale`) to your product data:

```jsx
const AISLES = [
  {
    id: 'featured',
    products: [
      {
        id: 'project-1',
        title: 'FEATURED PROJECT',
        // ... other fields
        modelPath: '/models/project-1.glb', // Required: Path to GLB file
        modelScale: 1.5, // Optional: Custom scale (default: 1.5)
      },
      {
        id: 'project-2',
        title: 'ANOTHER PROJECT',
        modelPath: '/models/project-2.glb',
        modelScale: 2.0, // Larger model
      },
      {
        id: 'project-3',
        title: 'SMALL PROJECT',
        modelPath: '/models/project-3.glb',
        modelScale: 1.0, // Smaller model
        // If modelScale is omitted, defaults to 1.5
      },
      // ...
    ],
  },
];
```

**Scale Guidelines:**
- **Default:** `1.5` (if not specified)
- **Small models:** `0.8 - 1.2` (if your model is already large)
- **Normal models:** `1.5 - 2.0` (most common)
- **Large models:** `2.5 - 3.5` (if your model is very small)

### Step 5: Integrate into FocusedProductCard

Update `FocusedProductCard` in `GroceryStore3D.jsx` to use the 3D model:

```jsx
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import ProductModel3D from './3D/ProductModel3D';

function FocusedProductCard({ product, isFlipped }) {
  return (
    <div className="relative" style={{ width: '400px', height: '500px' }}>
      {product.modelPath ? (
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <Suspense fallback={null}>
            <ProductModel3D
              modelPath={product.modelPath}
              isFlipped={isFlipped}
              isFocused={true}
              scale={1.5}
            />
          </Suspense>
        </Canvas>
      ) : (
        // Fallback to CSS 3D card if no model
        <div className="relative preserve-3d">
          {/* Your existing CSS 3D card code */}
        </div>
      )}
    </div>
  );
}
```

---

## 🎯 Quick Start: Simple Box Model in Blender

1. **Open Blender** → Delete default cube if needed
2. **Add Cube:** `Shift+A` → Mesh → Cube
3. **Scale:** Select cube → `S` → `X` → `1.3` (makes it taller)
4. **Add Material:**
   - Select cube → Material Properties tab
   - Click "New"
   - Set Base Color to your product color
5. **Add Text (Front):**
   - `Shift+A` → Text
   - Type your product name
   - Extrude: `E` → `0.1`
   - Position on front face
6. **Export:**
   - File → Export → glTF 2.0 (.glb/.gltf)
   - Choose `.glb`
   - Save to `public/models/your-product.glb`

---

## 📐 Model Specifications

### **Recommended Dimensions:**
- **Width:** 1 unit
- **Height:** 1.3 units (taller)
- **Depth:** 0.2 units (thin, like a cereal box)

### **Texture Resolution:**
- **Front/Back:** 512x512 or 1024x1024 pixels
- **Sides:** 256x256 pixels (smaller, less visible)

### **Polygon Count:**
- **Target:** < 1000 triangles per model
- **Why:** Better performance, faster loading
- **How:** Use "Decimate" modifier in Blender if needed

---

## 🔄 Rotation Implementation Options

### **Option A: Click-to-Flip (Current CSS Approach)**
- Click card → Rotates 180° to show back
- Simple, works with CSS transforms
- **Best for:** Simple models, quick implementation

### **Option B: Orbit Controls (Interactive)**
- Click card → Can drag to rotate freely
- More interactive, user controls rotation
- **Best for:** Complex models, detailed examination

### **Option C: Hybrid (Recommended)**
- Click card → Smooth rotation to back (180°)
- While focused → Can drag to rotate freely
- **Best for:** Best of both worlds

---

## 🎨 Adding Textures to Models

### **In Blender:**
1. **UV Unwrap:**
   - Select model → `Tab` (Edit Mode)
   - `U` → Unwrap
2. **Create Texture:**
   - Use image editor or external tool (Photoshop, GIMP)
   - Design front and back faces
   - Save as PNG/JPG
3. **Apply Texture:**
   - Material Properties → Base Color → Image Texture
   - Select your image file
4. **Export:**
   - GLB includes textures automatically

### **Texture Tips:**
- Use **PNG** for transparency
- Keep file sizes small (< 500KB per texture)
- Use **power-of-2 dimensions** (512, 1024, 2048)
- Consider **texture atlases** (multiple faces on one image)

---

## 🚀 Performance Optimization

### **1. Model Optimization:**
- Reduce polygon count
- Compress textures
- Use texture atlases
- Remove unnecessary details

### **2. Loading Strategy:**
```jsx
// Lazy load models only when needed
const ProductModel3D = lazy(() => import('./3D/ProductModel3D'));

// Preload on hover
const handleMouseEnter = () => {
  useGLTF.preload(product.modelPath);
};
```

### **3. Level of Detail (LOD):**
- Use simpler models when far away
- Load detailed models when focused

### **4. Compression:**
- Use [gltf-pipeline](https://github.com/CesiumGS/gltf-pipeline) to compress GLB files
- Reduces file size by 50-70%

---

## 📝 Example: Complete Integration

See `portfolio/src/components/3D/ProductModel3D.jsx` for a complete implementation example.

---

## 🐛 Troubleshooting

### **Model not loading:**
- Check file path (should be in `public/models/`)
- Check file format (use `.glb`)
- Check browser console for errors

### **Model too large/small:**
- Adjust `scale` prop in `ProductModel3D`
- Or scale in Blender before export

### **Rotation not working:**
- Check `isFlipped` prop is being passed correctly
- Verify GSAP is installed
- Check rotation axis (should be `y` for horizontal flip)

### **Performance issues:**
- Reduce polygon count
- Compress textures
- Use LOD (Level of Detail)
- Lazy load models

---

## 📚 Resources

- **Blender Tutorials:** [Blender Guru](https://www.blenderguru.com)
- **React Three Fiber Docs:** [docs.pmnd.rs/react-three-fiber](https://docs.pmnd.rs/react-three-fiber)
- **GLTF Spec:** [github.com/KhronosGroup/glTF](https://github.com/KhronosGroup/glTF)
- **Model Optimization:** [gltf.report](https://gltf.report)

---

## Next Steps

1. **Choose your tool** (Blender recommended)
2. **Create your first model** (start simple!)
3. **Export as GLB**
4. **Place in `public/models/`**
5. **Update product data** with `modelPath`
6. **Test the integration**

Good luck! 🎨

