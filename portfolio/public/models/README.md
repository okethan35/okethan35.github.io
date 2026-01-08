# 3D Models Directory

Place your `.glb` model files here.

## File Structure

```
public/
  models/
    project-1.glb
    project-2.glb
    skill-1.glb
    ...
```

## Usage

In your product data (in `GroceryStore3D.jsx`), add the `modelPath` property:

```jsx
{
  id: 'project-1',
  title: 'FEATURED PROJECT',
  // ... other fields
  modelPath: '/models/project-1.glb', // Add this line
}
```

## Model Requirements

- **Format:** GLB (binary GLTF)
- **Recommended size:** < 500KB per model
- **Polygon count:** < 1000 triangles
- **Dimensions:** Match cereal box proportions (roughly 1:1.3:0.2)

## Creating Models

See `3D_MODELS_IMPLEMENTATION_GUIDE.md` for detailed instructions on creating models with:
- Blender (recommended)
- Spline
- Tinkercad
- Or other tools

## Testing

1. Create a simple box model
2. Export as `.glb`
3. Place in this directory
4. Add `modelPath` to product data
5. Click the product to see it in 3D!

