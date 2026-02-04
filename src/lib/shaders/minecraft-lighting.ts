/**
 * Minecraft-style Lighting Shader
 *
 * Replicates the characteristic lighting system from Minecraft:
 * - Block light (0-15 levels) with smooth falloff
 * - Sky light (directional from above)
 * - Vertex-based ambient occlusion
 * - No specular highlights (flat diffuse only)
 * - Minimal ambient for proper darkness
 */

export const MinecraftVertexShader = `
varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec2 vUv;
varying vec3 vWorldPosition;
varying float vAmbientOcclusion;

// Vertex colors can store AO data from modeling software
attribute vec4 color;

void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);

  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  vViewPosition = -mvPosition.xyz;
  vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;

  // Use vertex colors for ambient occlusion if available
  // Minecraft uses vertex-based AO for smooth lighting
  vAmbientOcclusion = color.r;

  gl_Position = projectionMatrix * mvPosition;
}
`;

export const MinecraftFragmentShader = `
uniform vec3 diffuse;
uniform sampler2D map;
uniform bool hasTexture;

// Lighting uniforms
uniform vec3 skyLightDirection;  // Direction of sky/sun light
uniform vec3 skyLightColor;      // Color of sky light (usually white with slight blue tint)
uniform float skyLightIntensity; // Sky light intensity (0-15 in Minecraft scale, normalized to 0-1)

uniform vec3 blockLightColor;    // Color of block lights (torches, glowstone, etc.)
uniform float blockLightIntensity; // Block light intensity
uniform vec3 blockLightPosition; // Position of nearest block light source

uniform float ambientIntensity;  // Minimal ambient (Minecraft caves are DARK)
uniform vec3 ambientColor;

uniform float aoIntensity;       // Ambient occlusion strength
uniform bool enableSmoothLighting; // Toggle between smooth and flat lighting

varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec2 vUv;
varying vec3 vWorldPosition;
varying float vAmbientOcclusion;

// Minecraft uses simplified lighting - no specular, simple diffuse
float minecraftDiffuse(vec3 normal, vec3 lightDir) {
  // Classic Minecraft uses a modified diffuse that's less harsh than Lambert
  // It ensures minimum visibility even on faces pointing away from light
  float diff = dot(normal, lightDir);

  // Minecraft lighting formula: clamp to ensure minimum light level
  // This prevents completely black surfaces
  return clamp(diff * 0.6 + 0.4, 0.0, 1.0);
}

// Calculate block light attenuation (inverse square law with Minecraft's discrete levels)
float blockLightAttenuation(vec3 worldPos, vec3 lightPos) {
  float distance = length(lightPos - worldPos);

  // Minecraft light propagates 15 blocks from source
  // Each block decreases light level by 1
  float maxDistance = 15.0;
  float attenuation = max(0.0, 1.0 - (distance / maxDistance));

  // Apply smooth falloff
  return attenuation * attenuation;
}

// Calculate ambient occlusion effect
// Minecraft's AO darkens corners and edges where blocks meet
float calculateAO(float vertexAO) {
  // If we have vertex AO data, use it; otherwise assume full brightness
  float ao = vertexAO > 0.0 ? vertexAO : 1.0;

  // Minecraft AO is quite strong - creates distinctive shadows in corners
  return mix(1.0, ao, aoIntensity);
}

void main() {
  // Base color from texture or diffuse color
  vec4 baseColor = hasTexture ? texture2D(map, vUv) : vec4(diffuse, 1.0);

  // Discard fully transparent pixels
  if (baseColor.a < 0.01) {
    discard;
  }

  vec3 normal = normalize(vNormal);

  // 1. Sky Light (Directional from above)
  vec3 skyDir = normalize(skyLightDirection);
  float skyDiffuse = minecraftDiffuse(normal, skyDir);
  vec3 skyContribution = skyLightColor * skyLightIntensity * skyDiffuse;

  // 2. Block Light (Point light with Minecraft attenuation)
  vec3 blockLightDir = normalize(blockLightPosition - vWorldPosition);
  float blockDiffuse = minecraftDiffuse(normal, blockLightDir);
  float blockAtten = blockLightAttenuation(vWorldPosition, blockLightPosition);
  vec3 blockContribution = blockLightColor * blockLightIntensity * blockDiffuse * blockAtten;

  // 3. Ambient Light (minimal - Minecraft is dark!)
  vec3 ambientContribution = ambientColor * ambientIntensity;

  // 4. Ambient Occlusion
  float ao = calculateAO(vAmbientOcclusion);

  // Combine all lighting
  vec3 totalLight = skyContribution + blockContribution + ambientContribution;

  // Apply lighting to base color
  vec3 finalColor = baseColor.rgb * totalLight * ao;

  // Minecraft doesn't use gamma correction, but we should for proper display
  // Comment this out for truly authentic Minecraft look (darker)
  finalColor = pow(finalColor, vec3(1.0 / 2.2));

  gl_FragColor = vec4(finalColor, baseColor.a);
}
`;
