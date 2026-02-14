import {
  ShaderMaterial,
  Vector3,
  Color,
  Mesh,
  Material,
  MeshStandardMaterial,
  MeshBasicMaterial,
  Texture,
} from 'three';
import type { Group, Object3DEventMap } from 'three';
import {
  MinecraftVertexShader,
  MinecraftFragmentShader,
} from './minecraft-lighting';

export interface MinecraftLightingConfig {
  // Sky light (sun/moon)
  skyLightDirection?: Vector3;
  skyLightColor?: Color;
  skyLightIntensity?: number; // 0-1 (represents Minecraft's 0-15 scale)

  // Block light (torches, glowstone, etc.)
  blockLightColor?: Color;
  blockLightIntensity?: number;
  blockLightPosition?: Vector3;

  // Ambient
  ambientColor?: Color;
  ambientIntensity?: number;

  // Ambient Occlusion
  aoIntensity?: number;

  // Options
  enableSmoothLighting?: boolean;
}

const defaultConfig: Required<MinecraftLightingConfig> = {
  // Sky light from above and slightly to the front (like Minecraft sun at noon)
  skyLightDirection: new Vector3(0.5, 1.0, 0.3).normalize(),
  skyLightColor: new Color(0xffffff),
  skyLightIntensity: 0.93, // Level 14/15 in Minecraft

  // Block light (warm torch color)
  blockLightColor: new Color(0xffaa66),
  blockLightIntensity: 0.8,
  blockLightPosition: new Vector3(5, 5, 5),

  // Minimal ambient (Minecraft caves are truly dark)
  ambientColor: new Color(0x404040),
  ambientIntensity: 0.15,

  // Strong AO like Minecraft
  aoIntensity: 0.7,

  // Smooth lighting (modern Minecraft default)
  enableSmoothLighting: true,
};

/**
 * Creates a Minecraft-style shader material
 */
export function createMinecraftMaterial(
  config: MinecraftLightingConfig = {},
): ShaderMaterial {
  const finalConfig = { ...defaultConfig, ...config };

  return new ShaderMaterial({
    uniforms: {
      diffuse: { value: new Color(0xffffff) },
      map: { value: null },
      hasTexture: { value: false },

      skyLightDirection: { value: finalConfig.skyLightDirection },
      skyLightColor: { value: finalConfig.skyLightColor },
      skyLightIntensity: { value: finalConfig.skyLightIntensity },

      blockLightColor: { value: finalConfig.blockLightColor },
      blockLightIntensity: { value: finalConfig.blockLightIntensity },
      blockLightPosition: { value: finalConfig.blockLightPosition },

      ambientColor: { value: finalConfig.ambientColor },
      ambientIntensity: { value: finalConfig.ambientIntensity },

      aoIntensity: { value: finalConfig.aoIntensity },
      enableSmoothLighting: { value: finalConfig.enableSmoothLighting },
    },
    vertexShader: MinecraftVertexShader,
    fragmentShader: MinecraftFragmentShader,
    transparent: true,
  });
}

/**
 * Extracts texture and color from an existing material
 */
function extractMaterialProperties(material: Material): {
  texture: Texture | null;
  color: Color;
} {
  let texture: Texture | null = null;
  let color = new Color(0xffffff);

  if (
    material instanceof MeshStandardMaterial ||
    material instanceof MeshBasicMaterial
  ) {
    texture = material.map;
    color = material.color.clone();
  }

  return { texture, color };
}

/**
 * Applies Minecraft lighting shader to all meshes in a GLTF scene
 */
export function applyMinecraftShaderToGLTF(
  gltfScene: Group<Object3DEventMap>,
  config: MinecraftLightingConfig = {},
): void {
  const shaderMaterial = createMinecraftMaterial(config);

  gltfScene.traverse(child => {
    if (child instanceof Mesh) {
      const materials = Array.isArray(child.material)
        ? child.material
        : [child.material];

      // Replace each material with a clone of the shader material
      const newMaterials = materials.map(oldMaterial => {
        const mat = shaderMaterial.clone();
        const { texture, color } = extractMaterialProperties(oldMaterial);

        mat.uniforms.diffuse.value = color;

        if (texture) {
          mat.uniforms.map.value = texture;
          mat.uniforms.hasTexture.value = true;
        }

        return mat;
      });

      child.material = Array.isArray(child.material)
        ? newMaterials
        : newMaterials[0];
    }
  });
}
