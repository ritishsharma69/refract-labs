import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Line, Text } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

const IS_MOBILE = typeof window !== 'undefined' && window.innerWidth < 768;
const RAIN_COUNT = IS_MOBILE ? 400 : 800;
const DUST_COUNT = IS_MOBILE ? 30 : 60;
const FOG_COUNT = IS_MOBILE ? 15 : 30;
const LOGO_TEXT = 'REFRACT LABS';
const LOGO_LETTERS = LOGO_TEXT.split('');
const SPACE_INDEX = LOGO_TEXT.indexOf(' '); // Index of space character
const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>[]{}+=-*%$#/?!'.split('');

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

type AnimationValues = {
  rainIntensity: number;
  rainFade: number;
  columnMix: number;
  strike: number;
  chipReveal: number;
  cards: number;
  logo: number;
  finalGlow: number;
  ambientBolts: number;
  flash: number;
  chipEnergy: number;
};

type CameraState = {
  x: number;
  y: number;
  z: number;
  tx: number;
  ty: number;
  tz: number;
};

type LightningBolt = {
  id: number;
  points: THREE.Vector3[];
  width: number;
  color: string;
  opacity: number;
};

type AnimationRef = {
  current: AnimationValues;
};

type CameraStateRef = {
  current: CameraState;
};

function createCharacterAtlas() {
  const cols = 8;
  const rows = Math.ceil(CHARACTERS.length / cols);
  const cell = 64; // Reduced from 128 for better performance
  const canvas = document.createElement('canvas');
  canvas.width = cols * cell;
  canvas.height = rows * cell;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    const texture = new THREE.CanvasTexture(canvas);
    return { texture, cols, rows };
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '700 38px monospace'; // Reduced font size

  CHARACTERS.forEach((character, index) => {
    const col = index % cols;
    const row = Math.floor(index / cols);
    const x = col * cell + cell * 0.5;
    const y = row * cell + cell * 0.56;

    ctx.save();
    ctx.shadowBlur = 12; // Reduced shadow blur
    ctx.shadowColor = '#ffffff';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(character, x, y);
    ctx.restore();
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

  return { texture, cols, rows };
}

const rainVertexShader = `
attribute vec3 aBase;
attribute float aSpeed;
attribute float aSize;
attribute float aGlyph;
attribute vec3 aColumn;
attribute vec3 aChip;
attribute vec3 aExplode;
attribute float aTint;

uniform float uTime;
uniform float uIntensity;
uniform float uColumnMix;
uniform float uStrikeMix;
uniform float uChipMix;
uniform float uRainFade;
uniform float uPulse;

varying float vGlyph;
varying float vAlpha;
varying vec3 vColor;
varying float vRotation;

void main() {
  vec3 rainPos = aBase;
  float rainSpan = 18.0;
  float fall = mod((uTime * (1.5 + aSpeed * (1.0 + uIntensity))) + (aBase.y * 0.35) + aGlyph * 0.23, rainSpan);
  rainPos.y = 8.5 - fall;
  rainPos.x += sin(uTime * 0.7 + aBase.z * 1.7 + aGlyph * 0.2) * 0.08 * uIntensity;
  rainPos.z += cos(uTime * 0.55 + aBase.x * 1.4 + aGlyph * 0.18) * 0.12 * uIntensity;

  vec3 columnPos = aColumn;
  columnPos.y += sin(uTime * 3.2 + aGlyph * 0.4) * 0.06;

  vec3 exploded = columnPos + aExplode * (0.7 * uStrikeMix);
  vec3 chipPos = aChip + aExplode * (0.18 * (1.0 - uChipMix));

  vec3 finalPos = mix(rainPos, columnPos, uColumnMix);
  finalPos = mix(finalPos, exploded, clamp(uStrikeMix, 0.0, 1.0));
  finalPos = mix(finalPos, chipPos, uChipMix);

  vec4 mvPosition = modelViewMatrix * vec4(finalPos, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = aSize * (290.0 / max(1.0, -mvPosition.z));

  vGlyph = aGlyph;
  vRotation = uIntensity * (uTime * 0.25 + aGlyph * 0.07);
  vAlpha = mix(1.0, 0.14, uChipMix) * uRainFade * (0.55 + aSpeed * 0.45) * (0.88 + uPulse * 0.08);
  vColor = mix(vec3(0.0, 1.0, 0.61), vec3(0.0, 0.78, 1.0), aTint);
  vColor = mix(vColor, vec3(0.63, 0.42, 1.0), uStrikeMix * 0.35);
}
`;

const rainFragmentShader = `
uniform sampler2D uAtlas;
uniform float uAtlasCols;
uniform float uAtlasRows;

varying float vGlyph;
varying float vAlpha;
varying vec3 vColor;
varying float vRotation;

void main() {
  vec2 centered = gl_PointCoord - 0.5;
  float c = cos(vRotation);
  float s = sin(vRotation);
  vec2 rotated = vec2(c * centered.x - s * centered.y, s * centered.x + c * centered.y) + 0.5;

  if (rotated.x < 0.0 || rotated.x > 1.0 || rotated.y < 0.0 || rotated.y > 1.0) discard;

  float col = mod(vGlyph, uAtlasCols);
  float row = floor(vGlyph / uAtlasCols);
  vec2 atlasUv = (vec2(col, row) + vec2(rotated.x, 1.0 - rotated.y)) / vec2(uAtlasCols, uAtlasRows);
  vec4 glyph = texture2D(uAtlas, atlasUv);

  float glow = pow(max(0.0, 1.0 - length(gl_PointCoord - 0.5) * 1.8), 3.0);
  float trail = smoothstep(0.95, 0.15, gl_PointCoord.y) * 0.25;
  float alpha = max(glyph.a, glow * 0.22 + trail * 0.18) * vAlpha;

  if (alpha < 0.02) discard;

  vec3 color = vColor * (0.85 + glow * 1.2) + vec3(1.0) * glyph.a * 0.12;
  gl_FragColor = vec4(color, alpha);
}
`;

function createLightningPath(start: THREE.Vector3, end: THREE.Vector3, jitter = 0.45, segments = 9) {
  const points = [start.clone()];
  for (let i = 1; i < segments; i += 1) {
    const point = start.clone().lerp(end, i / segments);
    point.x += (Math.random() - 0.5) * jitter;
    point.y += (Math.random() - 0.5) * jitter * 0.6;
    point.z += (Math.random() - 0.5) * jitter;
    points.push(point);
  }
  points.push(end.clone());
  return points;
}

function AtmosphereField({
  count,
  radius,
  height,
  size,
  opacity,
  speed,
  colors,
  animation,
}: {
  count: number;
  radius: number;
  height: number;
  size: number;
  opacity: number;
  speed: number;
  colors: string[];
  animation: AnimationRef;
}) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);
  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colorArray = new Float32Array(count * 3);
    const geometryInstance = new THREE.BufferGeometry();

    for (let i = 0; i < count; i += 1) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * radius;
      const y = (Math.random() - 0.5) * height;
      const color = new THREE.Color(colors[i % colors.length]);

      positions[i * 3] = Math.cos(angle) * dist;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.sin(angle) * dist;

      colorArray[i * 3] = color.r;
      colorArray[i * 3 + 1] = color.g;
      colorArray[i * 3 + 2] = color.b;
    }

    geometryInstance.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometryInstance.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
    return geometryInstance;
  }, [colors, count, height, radius]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame(({ clock }, delta) => {
    if (!pointsRef.current || !materialRef.current) return;
    pointsRef.current.rotation.y += delta * speed;
    pointsRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.08) * 0.08;
    materialRef.current.opacity = opacity * (0.75 + animation.current.finalGlow * 0.35);
  });

  return (
    <points ref={pointsRef} geometry={geometry} frustumCulled={false} renderOrder={1}>
      <pointsMaterial
        ref={materialRef}
        size={size}
        sizeAttenuation
        vertexColors
        transparent
        opacity={opacity}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function DigitalRain({ animation }: { animation: AnimationRef }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const atlas = useMemo(() => createCharacterAtlas(), []);
  const geometry = useMemo(() => {
    const positions = new Float32Array(RAIN_COUNT * 3);
    const base = new Float32Array(RAIN_COUNT * 3);
    const speed = new Float32Array(RAIN_COUNT);
    const size = new Float32Array(RAIN_COUNT);
    const glyph = new Float32Array(RAIN_COUNT);
    const column = new Float32Array(RAIN_COUNT * 3);
    const chip = new Float32Array(RAIN_COUNT * 3);
    const explode = new Float32Array(RAIN_COUNT * 3);
    const tint = new Float32Array(RAIN_COUNT);
    const geometryInstance = new THREE.BufferGeometry();
    const columnCount = 9;

    for (let i = 0; i < RAIN_COUNT; i += 1) {
      const lane = i % columnCount;
      const depthLayer = i % 3;
      const x = (Math.random() - 0.5) * 13;
      const y = (Math.random() - 0.5) * 18;
      const z = -7 + Math.random() * 10;
      const speedBase = depthLayer === 0 ? 1.2 : depthLayer === 1 ? 0.9 : 0.65;
      const targetX = (lane - (columnCount - 1) / 2) * 0.72 + (Math.random() - 0.5) * 0.06;
      const targetY = -1.8 + (Math.floor(i / columnCount) % 22) * 0.24;
      const targetZ = (depthLayer - 1) * 0.5 + (Math.random() - 0.5) * 0.18;
      const chipX = (Math.random() - 0.5) * 2.5;
      const chipY = 0.12 + Math.random() * 0.34;
      const chipZ = (Math.random() - 0.5) * 2.5;
      const explodeDir = new THREE.Vector3(
        chipX * 0.55 + (Math.random() - 0.5),
        Math.random() * 1.6,
        chipZ * 0.55 + (Math.random() - 0.5),
      )
        .normalize()
        .multiplyScalar(0.8 + Math.random() * 1.4);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      base[i * 3] = x;
      base[i * 3 + 1] = y;
      base[i * 3 + 2] = z;

      speed[i] = speedBase + Math.random() * 0.4;
      size[i] = (depthLayer === 0 ? 30 : depthLayer === 1 ? 24 : 18) + Math.random() * 6;
      glyph[i] = Math.floor(Math.random() * CHARACTERS.length);
      tint[i] = depthLayer === 0 ? 0.15 : depthLayer === 1 ? 0.45 : 0.72;

      column[i * 3] = targetX;
      column[i * 3 + 1] = targetY;
      column[i * 3 + 2] = targetZ;

      chip[i * 3] = chipX;
      chip[i * 3 + 1] = chipY;
      chip[i * 3 + 2] = chipZ;

      explode[i * 3] = explodeDir.x;
      explode[i * 3 + 1] = explodeDir.y;
      explode[i * 3 + 2] = explodeDir.z;
    }

    geometryInstance.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometryInstance.setAttribute('aBase', new THREE.BufferAttribute(base, 3));
    geometryInstance.setAttribute('aSpeed', new THREE.BufferAttribute(speed, 1));
    geometryInstance.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
    geometryInstance.setAttribute('aGlyph', new THREE.BufferAttribute(glyph, 1));
    geometryInstance.setAttribute('aColumn', new THREE.BufferAttribute(column, 3));
    geometryInstance.setAttribute('aChip', new THREE.BufferAttribute(chip, 3));
    geometryInstance.setAttribute('aExplode', new THREE.BufferAttribute(explode, 3));
    geometryInstance.setAttribute('aTint', new THREE.BufferAttribute(tint, 1));

    return geometryInstance;
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uIntensity: { value: 0 },
      uColumnMix: { value: 0 },
      uStrikeMix: { value: 0 },
      uChipMix: { value: 0 },
      uRainFade: { value: 1 },
      uPulse: { value: 1 },
      uAtlas: { value: atlas.texture },
      uAtlasCols: { value: atlas.cols },
      uAtlasRows: { value: atlas.rows },
    }),
    [atlas.cols, atlas.rows, atlas.texture],
  );

  useEffect(
    () => () => {
      geometry.dispose();
      atlas.texture.dispose();
    },
    [atlas.texture, geometry],
  );

  useFrame(({ clock }) => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uTime.value = clock.elapsedTime;
    materialRef.current.uniforms.uIntensity.value = animation.current.rainIntensity;
    materialRef.current.uniforms.uColumnMix.value = animation.current.columnMix;
    materialRef.current.uniforms.uStrikeMix.value = animation.current.strike;
    materialRef.current.uniforms.uChipMix.value = animation.current.chipReveal;
    materialRef.current.uniforms.uRainFade.value = animation.current.rainFade;
    materialRef.current.uniforms.uPulse.value = 1 + animation.current.flash * 1.8;
  });

  return (
    <points geometry={geometry} frustumCulled={false} renderOrder={2}>
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={rainVertexShader}
        fragmentShader={rainFragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function CodeColumns({ animation }: { animation: AnimationRef }) {
  const materials = useRef<(THREE.MeshBasicMaterial | null)[]>([]);
  const columns = useMemo(
    () =>
      Array.from({ length: 9 }, (_, index) => ({
        x: (index - 4) * 0.72,
        z: ((index % 3) - 1) * 0.45,
        color: index % 2 === 0 ? '#00FF9C' : '#00C8FF',
      })),
    [],
  );

  useFrame(({ clock }) => {
    const columnVisibility = animation.current.columnMix * (1 - animation.current.chipReveal * 0.95);
    materials.current.forEach((material, index) => {
      if (!material) return;
      const pulse = 0.5 + Math.sin(clock.elapsedTime * 3.2 + index * 0.6) * 0.5;
      material.opacity = columnVisibility * (0.12 + pulse * 0.18);
    });
  });

  return (
    <group renderOrder={3}>
      {columns.map((column, index) => (
        <mesh key={index} position={[column.x, 0.8, column.z]}>
          <cylinderGeometry args={[0.035, 0.035, 5.4, 10, 1, true]} />
          <meshBasicMaterial
            ref={material => {
              materials.current[index] = material;
            }}
            color={column.color}
            transparent
            opacity={0}
            depthWrite={false}
            toneMapped={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

function Microchip({ animation }: { animation: AnimationRef }) {
  const groupRef = useRef<THREE.Group>(null);
  const reflectionRef = useRef<THREE.MeshBasicMaterial>(null);
  const traces = useMemo(
    () => [
      { position: [-0.9, 0.31, -0.7], scale: [0.9, 0.025, 0.06], color: '#00FF9C' },
      { position: [0.65, 0.31, -0.3], scale: [1.05, 0.025, 0.06], color: '#00C8FF' },
      { position: [-0.3, 0.31, 0.15], scale: [1.35, 0.025, 0.06], color: '#00FF9C' },
      { position: [0.5, 0.31, 0.75], scale: [0.85, 0.025, 0.06], color: '#7E5BFF' },
      { position: [-1.1, 0.31, 0.55], scale: [0.6, 0.025, 0.06], color: '#00C8FF' },
      { position: [0.0, 0.31, -1.0], scale: [0.06, 0.025, 0.9], color: '#00FF9C' },
      { position: [-0.65, 0.31, 0.0], scale: [0.06, 0.025, 1.2], color: '#00C8FF' },
      { position: [1.0, 0.31, 0.0], scale: [0.06, 0.025, 0.95], color: '#7E5BFF' },
      { position: [0.2, 0.31, 0.5], scale: [0.06, 0.025, 1.05], color: '#00FF9C' },
    ],
    [],
  );

  const pins = useMemo(() => {
    const result: Array<{ position: [number, number, number]; scale: [number, number, number] }> = [];
    const count = 14;
    const spacing = 0.22;
    for (let i = 0; i < count; i += 1) {
      const offset = (i - (count - 1) / 2) * spacing;
      result.push({ position: [offset, -0.03, -1.72], scale: [0.08, 0.16, 0.22] });
      result.push({ position: [offset, -0.03, 1.72], scale: [0.08, 0.16, 0.22] });
      result.push({ position: [-1.72, -0.03, offset], scale: [0.22, 0.16, 0.08] });
      result.push({ position: [1.72, -0.03, offset], scale: [0.22, 0.16, 0.08] });
    }
    return result;
  }, []);

  const currents = useMemo(
    () => [
      [new THREE.Vector3(-1.1, 0.34, -0.85), new THREE.Vector3(-0.4, 0.34, -0.25), new THREE.Vector3(0.3, 0.34, -0.6)],
      [new THREE.Vector3(-0.9, 0.34, 0.65), new THREE.Vector3(-0.15, 0.34, 0.12), new THREE.Vector3(0.8, 0.34, 0.55)],
      [new THREE.Vector3(-0.2, 0.34, -1.1), new THREE.Vector3(0.1, 0.34, -0.2), new THREE.Vector3(0.45, 0.34, 0.8)],
    ],
    [],
  );

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const reveal = clamp01(animation.current.chipReveal);
    const energy = animation.current.chipEnergy;
    const hover = reveal > 0.5 ? Math.sin(clock.elapsedTime * 1.4) * 0.04 : 0;
    const wobble = reveal > 0.3 ? Math.sin(clock.elapsedTime * 0.8) * 0.05 : 0;

    groupRef.current.visible = reveal > 0.01;
    groupRef.current.position.y = mix(-1.0, 0.12 + hover, reveal);
    groupRef.current.scale.setScalar(Math.max(0.001, reveal));
    groupRef.current.rotation.y = wobble * (1 - animation.current.logo * 0.8);

    if (reflectionRef.current) {
      reflectionRef.current.opacity = 0.06 + energy * 0.18 + animation.current.finalGlow * 0.1;
    }
  });

  return (
    <group ref={groupRef} visible={false}>
      <mesh position={[0, -0.12, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.55, 0.35, 3.55]} />
        <meshPhysicalMaterial color="#10151b" metalness={1} roughness={0.26} clearcoat={1} clearcoatRoughness={0.18} />
      </mesh>

      <mesh position={[0, 0.08, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.9, 0.28, 2.9]} />
        <meshPhysicalMaterial
          color="#1a232f"
          metalness={1}
          roughness={0.18}
          clearcoat={1}
          clearcoatRoughness={0.08}
          emissive="#062120"
          emissiveIntensity={0.5}
        />
      </mesh>

      <mesh position={[0, 0.24, 0]}>
        <boxGeometry args={[1.2, 0.16, 1.2]} />
        <meshPhysicalMaterial
          color="#0f1822"
          metalness={1}
          roughness={0.12}
          clearcoat={1}
          clearcoatRoughness={0.02}
          emissive="#0d5d63"
          emissiveIntensity={1.25}
        />
      </mesh>

      <mesh position={[0, 0.33, 0]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={5}>
        <planeGeometry args={[2.75, 2.75]} />
        <meshBasicMaterial
          ref={reflectionRef}
          color="#66e3ff"
          transparent
          opacity={0.1}
          depthWrite={false}
          toneMapped={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {traces.map((trace, index) => (
        <mesh key={index} position={trace.position as [number, number, number]} scale={trace.scale as [number, number, number]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color={trace.color} transparent opacity={0.75} toneMapped={false} blending={THREE.AdditiveBlending} />
        </mesh>
      ))}

      {pins.map((pin, index) => (
        <mesh key={index} position={pin.position} scale={pin.scale}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#8f6e43" metalness={1} roughness={0.22} emissive="#c58b37" emissiveIntensity={0.18} />
        </mesh>
      ))}

      {currents.map((path, index) => (
        <group key={index} renderOrder={6}>
          <Line points={path} color="#ffffff" lineWidth={0.9} transparent opacity={0.28 + animation.current.flash * 0.45} />
          <Line
            points={path}
            color={index === 2 ? '#7E5BFF' : index % 2 === 0 ? '#00FF9C' : '#00C8FF'}
            lineWidth={3}
            transparent
            opacity={0.16 + animation.current.chipEnergy * 0.24}
          />
        </group>
      ))}
    </group>
  );
}

function HologramCards({ animation }: { animation: AnimationRef }) {
  const groups = useRef<(THREE.Group | null)[]>([]);
  const fills = useRef<(THREE.MeshBasicMaterial | null)[]>([]);
  const borders = useRef<(THREE.MeshBasicMaterial | null)[]>([]);
  const glows = useRef<(THREE.MeshBasicMaterial | null)[]>([]);

  useFrame(({ clock }) => {
    const cardsProgress = clamp01(animation.current.cards);
    const logoProgress = clamp01(animation.current.logo);
    const finalGlow = animation.current.finalGlow;

    LOGO_LETTERS.forEach((_, index) => {
      const group = groups.current[index];
      if (!group) return;

      const emerge = clamp01(cardsProgress * 1.2 - index * 0.08);
      const assemble = clamp01(logoProgress * 1.16 - index * 0.055);
      const angle = (index / LOGO_LETTERS.length) * Math.PI * 2 - Math.PI / 2;
      const startRadius = 1.65 - emerge * 0.42;
      const sx = Math.cos(angle) * startRadius;
      const sy = 0.95 + emerge * 1.55 + Math.sin(clock.elapsedTime * 1.5 + index * 0.8) * 0.11;
      const sz = Math.sin(angle) * 0.9;

      // Calculate visual position (exclude space from visual count)
      const visualIndex = index > SPACE_INDEX ? index - 1 : index;
      const totalVisualLetters = LOGO_LETTERS.length - 1; // Exclude space
      const spaceGap = 0.28; // Extra gap where space would be
      const baseX = (visualIndex - (totalVisualLetters - 1) / 2) * 0.38;
      const ex = index > SPACE_INDEX ? baseX + spaceGap : baseX;
      const ey = 2.42;
      const ez = 0;
      const lockPulse = clamp01(1 - Math.abs(logoProgress * LOGO_LETTERS.length - index - 0.6));

      group.visible = emerge > 0.01;
      group.position.set(mix(sx, ex, assemble), mix(sy, ey, assemble), mix(sz, ez, assemble));
      group.rotation.set(
        mix(0.25 + Math.sin(clock.elapsedTime + index) * 0.08, 0, assemble),
        mix(clock.elapsedTime * 0.48 + index * 0.6, 0, assemble),
        mix(Math.cos(clock.elapsedTime * 0.9 + index) * 0.15, 0, assemble),
      );

      const cardScale = Math.max(0.001, emerge * (0.82 + assemble * 0.15));
      group.scale.setScalar(cardScale);

      if (fills.current[index]) {
        fills.current[index]!.opacity = emerge * (0.08 + (1 - assemble) * 0.07 + finalGlow * 0.02);
      }
      if (borders.current[index]) {
        borders.current[index]!.opacity = emerge * (0.24 + lockPulse * 0.45 + finalGlow * 0.18);
      }
      if (glows.current[index]) {
        glows.current[index]!.opacity = emerge * (0.1 + lockPulse * 0.35 + finalGlow * 0.28);
      }
    });
  });

  return (
    <group renderOrder={8}>
      {LOGO_LETTERS.map((letter, index) => {
        // Skip rendering for space but keep position
        if (letter === ' ') {
          return (
            <group
              key={`space-${index}`}
              ref={group => {
                groups.current[index] = group;
              }}
              visible={false}
            />
          );
        }
        return (
          <group
            key={`${letter}-${index}`}
            ref={group => {
              groups.current[index] = group;
            }}
            visible={false}
          >
            <mesh position={[0, 0, -0.02]}>
              <planeGeometry args={[0.56, 0.82]} />
              <meshBasicMaterial
                ref={material => {
                  fills.current[index] = material;
                }}
                color="#0a2640"
                transparent
                opacity={0.08}
                depthWrite={false}
              />
            </mesh>
            <mesh position={[0, 0, -0.01]}>
              <planeGeometry args={[0.64, 0.9]} />
              <meshBasicMaterial
                ref={material => {
                  glows.current[index] = material;
                }}
                color={index % 2 === 0 ? '#00C8FF' : '#00FF9C'}
                transparent
                opacity={0.18}
                depthWrite={false}
                toneMapped={false}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
            <mesh>
              <ringGeometry args={[0.34, 0.37, 4, 1]} />
              <meshBasicMaterial
                ref={material => {
                  borders.current[index] = material;
                }}
                color={index % 3 === 0 ? '#7E5BFF' : index % 2 === 0 ? '#00FF9C' : '#00C8FF'}
                transparent
                opacity={0.3}
                depthWrite={false}
                toneMapped={false}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
            <Text position={[0, 0, 0.02]} fontSize={0.34} color="#e8feff" anchorX="center" anchorY="middle">
              {letter}
            </Text>
          </group>
        );
      })}
    </group>
  );
}

function LightningSystem({ animation }: { animation: AnimationRef }) {
  const [bolts, setBolts] = useState<LightningBolt[]>([]);
  const idRef = useRef(0);
  const lastSpawnRef = useRef(0);
  const lastStrikeRef = useRef(0);
  const flashRef = useRef<THREE.PointLight>(null);
  const timeoutIds = useRef<number[]>([]);

  const spawnBolt = useCallback((points: THREE.Vector3[], width: number, color: string, opacity: number, lifetimeMs: number) => {
    const bolt: LightningBolt = {
      id: idRef.current += 1,
      points,
      width,
      color,
      opacity,
    };
    setBolts(prev => [...prev.slice(-6), bolt]);
    const timeoutId = window.setTimeout(() => {
      setBolts(prev => prev.filter(entry => entry.id !== bolt.id));
    }, lifetimeMs);
    timeoutIds.current.push(timeoutId);
  }, []);

  useEffect(
    () => () => {
      timeoutIds.current.forEach(id => window.clearTimeout(id));
      timeoutIds.current = [];
    },
    [],
  );

  useFrame(({ clock }) => {
    const time = clock.elapsedTime;
    const stagePower = animation.current.ambientBolts + animation.current.logo * 0.5 + animation.current.finalGlow * 0.35;

    if (stagePower > 0.08 && time - lastSpawnRef.current > Math.max(0.12, 0.32 - stagePower * 0.08)) {
      const logoPhase = animation.current.logo > 0.25;
      const start = logoPhase
        ? new THREE.Vector3((Math.random() - 0.5) * 5.8, 3.7 + Math.random() * 1.2, -1.4 - Math.random())
        : new THREE.Vector3((Math.random() - 0.5) * 7.5, 4.5 + Math.random() * 2.5, -3 - Math.random() * 2);
      const end = logoPhase
        ? new THREE.Vector3((Math.random() - 0.5) * 4.6, 2.2 + Math.random() * 1.0, -0.2)
        : new THREE.Vector3((Math.random() - 0.5) * 5.5, 1 + Math.random() * 2.2, -1.5 + (Math.random() - 0.5));
      const color = logoPhase ? '#7E5BFF' : Math.random() > 0.5 ? '#00C8FF' : '#ffffff';
      spawnBolt(createLightningPath(start, end, logoPhase ? 0.55 : 0.9, logoPhase ? 7 : 10), logoPhase ? 2.2 : 1.5, color, logoPhase ? 0.9 : 0.75, logoPhase ? 180 : 130);
      lastSpawnRef.current = time;
    }

    if (animation.current.strike > 0.15 && time - lastStrikeRef.current > 0.85) {
      const strikePoints = createLightningPath(new THREE.Vector3(0, 6.8, -0.4), new THREE.Vector3(0, 0.65, 0), 0.28, 12);
      spawnBolt(strikePoints, 4.5, '#ffffff', 1, 220);
      lastStrikeRef.current = time;
    }

    if (flashRef.current) {
      flashRef.current.intensity = 0.3 + animation.current.flash * 18 + bolts.length * 0.22;
    }
  });

  return (
    <group renderOrder={9}>
      <pointLight ref={flashRef} position={[0, 2.4, 1.6]} color="#ffffff" intensity={0.3} distance={10} decay={2} />
      {bolts.map(bolt => (
        <group key={bolt.id}>
          <Line points={bolt.points} color="#ffffff" lineWidth={bolt.width * 0.6} transparent opacity={bolt.opacity} />
          <Line points={bolt.points} color={bolt.color} lineWidth={bolt.width * 2.3} transparent opacity={bolt.opacity * 0.16} />
        </group>
      ))}
    </group>
  );
}

function CameraRig({
  animation,
  cameraState,
}: {
  animation: AnimationRef;
  cameraState: CameraStateRef;
}) {
  const { camera } = useThree();
  const target = useMemo(() => new THREE.Vector3(), []);
  const desiredPosition = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ clock }) => {
    desiredPosition.set(
      cameraState.current.x + Math.sin(clock.elapsedTime * 0.28) * 0.06,
      cameraState.current.y + Math.sin(clock.elapsedTime * 0.42) * 0.05,
      cameraState.current.z + Math.cos(clock.elapsedTime * 0.31) * 0.08,
    );

    camera.position.lerp(desiredPosition, 0.08);
    target.set(cameraState.current.tx, cameraState.current.ty, cameraState.current.tz);
    camera.lookAt(target);
    camera.rotation.z = Math.sin(clock.elapsedTime * 0.18) * 0.015 * (1 - animation.current.logo * 0.7);
  });

  return null;
}

// PostEffects disabled to preserve transparency
function PostEffects() {
  return null;
}

function Scene() {
  const { scene } = useThree();
  const animation = useRef<AnimationValues>({
    rainIntensity: 0.15,
    rainFade: 1,
    columnMix: 0,
    strike: 0,
    chipReveal: 0,
    cards: 0,
    logo: 0,
    finalGlow: 0,
    ambientBolts: 0,
    flash: 0,
    chipEnergy: 0.2,
  });

  const cameraState = useRef<CameraState>({
    x: 0.25,
    y: 2.2,
    z: 9.2,
    tx: 0,
    ty: 1,
    tz: 0,
  });

  const keyLight = useRef<THREE.DirectionalLight>(null);
  const rimLight = useRef<THREE.DirectionalLight>(null);
  const purpleLight = useRef<THREE.PointLight>(null);

  const resetValues = useCallback(() => {
    Object.assign(animation.current, {
      rainIntensity: 0.15,
      rainFade: 1,
      columnMix: 0,
      strike: 0,
      chipReveal: 0,
      cards: 0,
      logo: 0,
      finalGlow: 0,
      ambientBolts: 0,
      flash: 0,
      chipEnergy: 0.2,
    });

    Object.assign(cameraState.current, {
      x: 0.25,
      y: 2.2,
      z: 9.2,
      tx: 0,
      ty: 1,
      tz: 0,
    });
  }, []);

  useEffect(() => {
    scene.background = null;

    // Check if animation already played this session
    const hasPlayed = sessionStorage.getItem('chipAnimationPlayed');

    if (hasPlayed === 'true') {
      // Skip to final state immediately
      Object.assign(animation.current, {
        rainIntensity: 0.15,
        rainFade: 0.06,
        columnMix: 1,
        strike: 0.08,
        chipReveal: 1,
        cards: 1,
        logo: 1,
        finalGlow: 1,
        ambientBolts: 0.55,
        flash: 0,
        chipEnergy: 1.2,
      });
      Object.assign(cameraState.current, {
        x: 0.2,
        y: 2.72,
        z: 8.25,
        tx: 0,
        ty: 1.85,
        tz: 0,
      });
      return;
    }

    resetValues();

    const timeline = gsap.timeline({ repeat: 0 }); // No repeat - runs once

    timeline.to(animation.current, { rainIntensity: 0.35, duration: 1.5, ease: 'sine.inOut' }, 0);
    timeline.to(cameraState.current, { x: 0.05, y: 2.1, z: 8.2, tx: 0, ty: 1.05, tz: 0, duration: 1.5, ease: 'power2.inOut' }, 0);

    timeline.to(animation.current, { rainIntensity: 1, ambientBolts: 0.42, duration: 1.5, ease: 'power2.inOut' }, 2);
    timeline.to(cameraState.current, { x: -1.25, y: 2.45, z: 7.25, tx: 0, ty: 1.35, tz: 0, duration: 1.5, ease: 'sine.inOut' }, 2);

    timeline.to(animation.current, { columnMix: 1, rainFade: 0.95, duration: 1, ease: 'power2.inOut' }, 4);
    timeline.to(cameraState.current, { x: 2.1, y: 2.75, z: 6.85, tx: 0, ty: 1.9, tz: 0, duration: 1, ease: 'power2.inOut' }, 4);

    timeline.to(animation.current, { flash: 1, duration: 0.08, repeat: 1, yoyo: true, ease: 'power4.out' }, 5);
    timeline.to(animation.current, { strike: 1, duration: 0.16, ease: 'power3.out' }, 5);
    timeline.to(animation.current, { chipReveal: 1, rainFade: 0.18, chipEnergy: 1, ambientBolts: 1, duration: 1.15, ease: 'power3.inOut' }, 5.15);
    timeline.to(animation.current, { strike: 0.08, duration: 0.42, ease: 'sine.out' }, 5.55);
    timeline.to(cameraState.current, { x: 0.45, y: 1.95, z: 5.95, tx: 0, ty: 0.6, tz: 0, duration: 1.5, ease: 'power2.inOut' }, 5);

    timeline.to(animation.current, { cards: 1, chipEnergy: 1.2, duration: 1.5, ease: 'power2.out' }, 6.5);
    timeline.to(cameraState.current, { x: 0, y: 2.65, z: 6.55, tx: 0, ty: 2.2, tz: 0, duration: 1.5, ease: 'sine.inOut' }, 6.5);

    timeline.to(animation.current, { logo: 1, ambientBolts: 1.15, flash: 0.25, duration: 1, ease: 'power2.inOut' }, 8);
    timeline.to(cameraState.current, { x: 0, y: 2.9, z: 7.05, tx: 0, ty: 2.4, tz: 0, duration: 1, ease: 'power2.inOut' }, 8);

    timeline.to(animation.current, { finalGlow: 1, rainFade: 0.06, ambientBolts: 0.55, duration: 1.5, ease: 'power2.inOut' }, 9);
    timeline.to(cameraState.current, { x: 0.2, y: 2.72, z: 8.25, tx: 0, ty: 1.85, tz: 0, duration: 1.5, ease: 'sine.inOut' }, 9);

    // Mark animation as played when complete
    timeline.call(() => {
      sessionStorage.setItem('chipAnimationPlayed', 'true');
    }, [], 10.5);

    return () => {
      timeline.kill();
    };
  }, [resetValues, scene]);

  useFrame(({ clock }) => {
    if (keyLight.current) {
      keyLight.current.intensity = 2.8 + animation.current.finalGlow * 1.2 + animation.current.flash * 2.4;
    }
    if (rimLight.current) {
      rimLight.current.intensity = 2.2 + animation.current.chipReveal * 0.8;
    }
    if (purpleLight.current) {
      purpleLight.current.intensity = 0.6 + animation.current.ambientBolts * 1.8 + animation.current.flash * 4;
      purpleLight.current.position.x = Math.sin(clock.elapsedTime * 0.6) * 1.2;
    }
  });

  return (
    <>
      <CameraRig animation={animation} cameraState={cameraState} />

      <ambientLight intensity={0.18} />
      <directionalLight ref={keyLight} position={[4, 6, 5]} intensity={3.2} color="#00C8FF" />
      <directionalLight ref={rimLight} position={[-5, 4, -3]} intensity={2.4} color="#00FF9C" />
      <pointLight ref={purpleLight} position={[0, 2.5, 1.5]} intensity={1.2} color="#7E5BFF" distance={10} decay={2} />

      <AtmosphereField
        count={FOG_COUNT}
        radius={8.5}
        height={6}
        size={IS_MOBILE ? 0.24 : 0.36}
        opacity={0.12}
        speed={0.035}
        colors={['#00C8FF', '#00FF9C', '#7E5BFF']}
        animation={animation}
      />
      <AtmosphereField
        count={DUST_COUNT}
        radius={6.8}
        height={5}
        size={IS_MOBILE ? 0.045 : 0.06}
        opacity={0.22}
        speed={0.08}
        colors={['#ffffff', '#8ceaff', '#7fffd4']}
        animation={animation}
      />

      <DigitalRain animation={animation} />
      <CodeColumns animation={animation} />
      <Microchip animation={animation} />
      <HologramCards animation={animation} />
      <LightningSystem animation={animation} />

      <PostEffects />
    </>
  );
}

export default function ChipAnimation() {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', background: 'transparent' }}>
      <Canvas
        camera={{ position: [0.25, 2.2, 9.2], fov: 45 }}
        dpr={[1, IS_MOBILE ? 1 : 1.5]}
        gl={{ alpha: true, antialias: false, powerPreference: 'high-performance' }}
        frameloop="demand"
        onCreated={({ gl, scene, invalidate }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.05;
          gl.setClearColor(0x000000, 0);
          scene.background = null;
          // Start continuous rendering
          const animate = () => {
            invalidate();
            requestAnimationFrame(animate);
          };
          animate();
        }}
        style={{ background: 'transparent' }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}