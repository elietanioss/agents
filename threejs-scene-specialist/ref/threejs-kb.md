# THREE.JS SCENE SPECIALIST — KNOWLEDGE BASE
*Distilled from "Architectural Specification of the WebGL Scene Agent and Enterprise Three.js Optimization Standards" (source PDF, July 2026) + currency layer verified against threejs.org release notes, GitHub releases, gpuweb Implementation Status wiki, npm, and pmndrs (react-three-fiber/drei/rapier) release notes as of 2026-07-09, + scroll-driven 3D patterns (§10) distilled from award-tier reference-site analysis and Sonnet deep research (2026-07-11). Sections 7–10 supersede the source PDF's WebGL-era framing; version numbers and browser-support figures are corroborated by primary sources, vendor-blog performance claims are directional only.*

---

## 1. Domain split vs ui-specialist (roster rationale)

| Dimension | ui-specialist (Tailwind/shadcn) | threejs-scene-specialist (WebGL/R3F) |
|---|---|---|
| Primary domain | Component layouts, design systems, flat web UI | 3D scene graphs, spatial math, hardware-accelerated rendering |
| Core libraries | Tailwind, React, shadcn/ui, Radix | Three.js, R3F, drei, Rapier, TSL/GLSL |
| State paradigm | Declarative DOM state, event handlers | Ref mutation, high-frequency frame loops, Zustand stores |
| Memory target | Main thread, DOM, system GC | VRAM, vertex buffers, manual disposal |
| Core bottlenecks | Main-thread blocks, bundle size, DOM passes | CPU→GPU draw calls, shader compiles, unmanaged VRAM leaks |

Without this split, generated 3D code exhibits: inefficient render loops, VRAM leaks, poor mobile frame rates.

## 2. Diagnostic playbook (full detail)

Sequence (never skip ahead; never make unguided edits before step 1):
1. **Context validation** — DevTools console for WebGL/WebGPU init errors, shader compile logs, asset 404s. Verifies a stable canvas context exists.
2. **Canvas color test** — `scene.background = new THREE.Color('red')`. Red canvas ⇒ core engine + render loop operational ⇒ problem narrowed to asset visibility / camera / lighting.
3. **Material override** — `scene.overrideMaterial = new THREE.MeshBasicMaterial({ color: 'green' })`. Bypasses lighting entirely; visible meshes ⇒ missing/mis-configured lights.
4. **Frustum verification** — `camera.far = 100000; camera.updateProjectionMatrix()`. Visible ⇒ assets were outside clipping planes.
5. **Coordinate scaling** — `camera.position.z = 10`. Default camera AND objects spawn at origin (0,0,0) — camera loads *inside* the geometry.
6. **Scale anomalies** — DCC-tool imports (Blender, CAD) may use mm/cm units vs Three.js standard 1 unit ≈ 1 m. Measure with `Box3.setFromObject().getSize()`; rescale at import or asset stage.

## 3. Draw-call minimization

Every unique geometry+material pair = one CPU→GPU draw call. Principal web-graphics bottleneck.

- **InstancedMesh** — identical geometry, many copies; per-instance transform/color buffers, offsets computed on GPU. One draw call.
- **BatchedMesh** — distinct geometries sharing one material; unified buffer, per-item show/hide/move preserved, draw calls stay low. (Note r18x: deprecated instancing render paths removed from BatchedMesh — use current API.)
- **mergeGeometries** — static + shared material; eliminates the CPU-GPU bottleneck entirely; per-object manipulation impossible afterwards.
- **LOD** — substitute low-poly meshes by camera distance; Blender Decimate for background elements at asset stage.
- **Baked lighting** — pre-render static lights/shadow maps into textures; removes runtime lighting cost.

Reference benchmark table (naive → optimized → action):

| Metric | Naive | Optimized | Action |
|---|---|---|---|
| Draw calls | 10,000/frame | 3/frame | InstancedMesh + merge static |
| Frame rate | 12–15 fps | stable 60 fps | Cap DPR, optimize frame loop |
| VRAM | 1.2 GB, leaking | 180 MB, zero leaks | Disposal routines on unmount |
| Initial load | 4.2 s | 0.8 s | Draco + gltfjsx transform |
| Raycast | 8 ms CPU/frame | 0.1 ms | 30 Hz throttle + analytical bounds |

## 4. GPU memory lifecycle

- WebGL/WebGPU allocations are invisible to the JS garbage collector. Geometry, material, texture, render target ⇒ locked in VRAM until `.dispose()`.
- SPA navigation without disposal ⇒ cumulative leak ⇒ tab crash.
- Disposal order per mesh: remove from parent → `geometry.dispose()` → each material → each texture-valued property on the material (`Object.values(mat)` + duck-typed `.dispose` check).
- R3F disposes declarative JSX objects on unmount automatically; imperative creations (loader results, `new THREE.X()` inside effects) and `dispose={null}` subtrees are the developer's responsibility.
- **Texture VRAM math:** PNG/JPEG decompress fully — width × height × 4 bytes (+ ~33% mipmaps). 4096² RGBA ≈ 64–90 MB regardless of file size on disk. KTX2/Basis stays compressed in VRAM and skips decode cost.
- Monitor: `renderer.info.memory.geometries` / `.textures` must return to baseline across route navigation. `renderer.info.render.calls` for draw-call count.

## 5. R3F state & frame-loop doctrine

- React state at 60 Hz ⇒ continuous re-renders ⇒ frame collapse. High-frequency values (position, rotation, uniforms) mutate Three objects directly via refs inside `useFrame`.
- Pre-allocate `Vector3`/`Euler`/`Matrix4`/`Quaternion` in `useMemo` outside the loop; `.set()`/`.copy()` in place. Never `new` inside `useFrame`.
- Zustand > React Context for 3D↔HTML global state: selector subscriptions avoid subtree-wide re-renders; `store.getState()` inside `useFrame` for transient per-frame reads.
- Physics (@react-three/rapier): analytical colliders (ball/cuboid/capsule) — auto-generated trimesh/hull colliders from visual meshes inflate CPU collision cost.

## 6. Asset compilation pipeline

```bash
npx gltfjsx production-scene.glb --simplify --transform --types
```
Applies compression, strips redundant attributes, resizes textures to power-of-two, emits typed R3F component. Geometry buffer reduction up to ~90%; directly cuts network + parse time. `--transform` runs gltf-transform under the hood (Draco + prune + resize 1024 + webp + dedup + instance); for non-React targets or finer control, call `gltf-transform optimize`/`gltf-transform meshopt` directly.

**Draco vs meshoptimizer (2026 guidance):** Draco gives the best geometry-only compression ratio but is heavier to decode and doesn't touch morph targets or keyframe animation. `EXT_meshopt_compression` (meshoptimizer, via `gltfpack` or `gltf-transform meshopt`) compresses geometry + morph targets + animation and decodes faster; combined with gzip/brotli it can match Draco's ratio. **Default to meshopt for animated/most assets; use Draco only for static geometry where maximum ratio matters more than decode speed.** Always pair either with `KHR_mesh_quantization`.

Pipeline order: Blender (apply transforms, decimate, bake, real-world scale) → gltfjsx/gltf-transform → KTX2 texture encode (toktx) → drei `useGLTF` + `preload` → Suspense fallback matched to final layout.

## 7. WebGPU / TSL currency layer (verified 2026-07 against threejs.org release notes, gpuweb Implementation Status wiki, npm, pmndrs release notes; PDF source is WebGL-era)

- **Version floor: r185** (npm `three@0.185.1`). Releases monthly; migrate in increments of 10 per the official Migration Guide; deprecation warnings persist 10 releases before removal.
- WebGPURenderer production-ready since ~r171 (Sep 2025), automatic WebGL2 backend fallback built in. **Coverage, precisely:** ~85% direct WebGPU support (caniuse, Mar 2026); ~95%+ effective coverage once the automatic WebGL2 fallback is counted. **Not universal:** Firefox on Linux and Android remains behind flags — Mozilla's own tracking says both ship "sometime in 2026," not shipped yet. Some Android GPUs (Samsung Xclipse) are still WIP. → **WebGL2 fallback is a hard requirement, not a nicety.**
- Import split: `import * as THREE from 'three/webgpu'` + `import { ... } from 'three/tsl'`. Never mix `three` and `three/webgpu` imports in one scene.
- Init is async: `await renderer.init()` — missing await = silent blank canvas.
- R3F v9.6.x (React 19.0–19.2): `gl` prop accepts an async factory returning the renderer; `extend(THREE)` + `ThreeToJSXElements` module augmentation for node-material JSX elements. Known pitfalls: `gl.capabilities.isWebGL2` is `undefined` on WebGPU (branch on `gl.isWebGPURenderer` instead); v9 removed automatic sRGB conversion of texture props — set `texture.colorSpace = SRGBColorSpace` explicitly on color textures.
- **R3F v10 is in alpha** (`@react-three/fiber@alpha`), drei v11 alongside it. Headline break: `state.gl` → `state.renderer`; new TSL-native hooks `useUniforms`, `useNodes`, `useLocalNodes`, `usePostProcessing`; new frame scheduler lets `useFrame` run outside `<Canvas>`. **Do not ship v10 to production** — track for promotion once it leaves alpha.
- Shaders: TSL node functions transpile to WGSL (WebGPU) or GLSL (WebGL fallback) — write once. `ShaderMaterial`/`RawShaderMaterial`/`onBeforeCompile` do NOT work on WebGPURenderer; port to TSL.
  - **Rename/removal list (r171→r181, verify current signature before using):** node chaining removed (`fxaa(outputPass)` not `.fxaa()`); `viewportTopLeft`→`viewportUV` (`viewportBottomLeft` gone, use `.flipY()`); `uniforms()`→`uniformArray()`; `storageObject()`→`storage().setPBO(true)`; blend fns `burn/dodge/screen/overlay`→`blendBurn/blendDodge/blendScreen/blendOverlay`; `TextureNode.uv()`→`.sample()`; `varying()`→`toVarying()`; `label()`→`setName()`; `PI2`→`TWO_PI`. `Material.type` is now a static, immutable property.
- Post-processing: `RenderPipeline` (renamed from `PostProcessing` in **r183**, identical API — node graph, MRT built in, auto tone-mapping/resize, swap effects via `outputNode` + `needsUpdate`) replaces `EffectComposer` for new work. EffectComposer / pmndrs-postprocessing = WebGL-only legacy, no WebGPU port planned; `<SSR/>` was removed from `@react-three/postprocessing` (unmaintained).
- WebGPU wins biggest on: high draw-call counts, compute workloads (particles/physics), heavy post-processing, large instanced sets. Not a silver bullet for texture-upload or shader-compile bottlenecks.
- Three.js releases monthly with breaking changes per release (migration guide per rXXX). ALWAYS verify API signatures via Context7/current docs before writing non-trivial code — training-data signatures go stale within months.
- **Confirmed in-range renames worth knowing:** `USDZLoader`→`USDLoader` (r179); `RGBELoader`→`HDRLoader` (r180, use with `UltraHDRLoader` for modern HDR); `MeshPostProcessingMaterial` removed (r183); `WebGLCubeRenderTarget` blocked on WebGPU → use `CubeRenderTarget` (r183); `colorBufferType`→`outputBufferType` (r182); `PCFSoftShadowMap` deprecated for WebGLRenderer (r182); `SVGLoader.createShapes()` deprecated (r185). Texture format additions: BC4/BC5, PVRTC1 RGBA, RGB9E5, R11G11B10 (r180); EXT_texture_norm16 (r185).

## 8. New ecosystem additions (2025–2026, not in source PDF — drop-in facts)

**Node materials & compute:**
- Materials: `MeshStandardNodeMaterial`, `MeshPhysicalNodeMaterial`, `MeshBasicNodeMaterial`, `SpriteNodeMaterial`, `PointsNodeMaterial`. Slots: `colorNode`, `positionNode`, `normalNode`, `roughnessNode`, `metalnessNode`, `emissiveNode`, `opacityNode`, `outputNode`.
- Vanilla WebGPU init: `const r = new THREE.WebGPURenderer({antialias:true}); await r.init();` — `renderAsync`/`computeAsync` deprecated r181 (sync methods work post-init); `forceWebGL:true` to test the fallback path; `renderer.isWebGPURenderer` to branch logic.
- R3F WebGPU canvas: `gl={async (props) => { const r = new THREE.WebGPURenderer(props as any); await r.init(); return r; }}` + `extend(THREE as any)` + `interface ThreeElements extends ThreeToJSXElements<typeof THREE> {}`.
- Compute/GPGPU (particles, physics init, procedural data): `instancedArray(count, 'vec3')`, `storage()`, `Fn(() => {...})`, `instanceIndex`, `.toAttribute()` to feed a render material's `positionNode`. This is how 1M+ particle systems run at 60fps — reach for this instead of CPU-side loops when instance count is large.
- RenderPipeline usage: `const rp = new THREE.RenderPipeline(renderer); rp.outputNode = pass(scene, camera); rp.render();` — compose effects as function calls (`rgbShift(dotScreen(scenePass))`), MRT via `scenePass.setMRT(mrt({output, normal: directionToColor(normalView)}))`. Auto tone-mapping/color-space/resize (`outputColorTransform` defaults true).

**Gaussian splatting:** Spark (`@sparkjsdev/spark`, by World Labs) is the current Three.js-native production choice — `SplatMesh` extends `Object3D` and composites with regular meshes in the same scene graph; supports PLY/SPZ/SPLAT/KSPLAT/SOG; targets WebGL2 (98%+ device coverage) so it works even without WebGPU; Spark 2.0 adds streamable LoD for 100M+ splat scenes incl. mobile/VR. `mkkellogg/GaussianSplats3D` is now deprecated in favor of Spark — don't scaffold new work on it. `.spz` (Niantic) is emerging as the standard compressed delivery format.
```js
import { SparkRenderer, SplatMesh } from '@sparkjsdev/spark';
const splat = new SplatMesh({ url: 'scene.spz' });
scene.add(splat);
```

**uikit (in-canvas UI):** `@react-three/uikit` (vanilla core `@pmndrs/uikit`) — flexbox-based, instanced/GPU-cheap UI rendered inside the 3D scene graph, not DOM overlay. Use for XR/game HUDs, in-scene dashboards, spatial menus — where drei `<Html>` (DOM overlay) is the wrong tool because it can't occlude correctly behind 3D geometry or render in WebXR. 1.0 stabilized the vanilla core with HTML/CSS-aligned APIs (zIndex, display:contents, classList).

**WebXR:** Safari 26.2 added WebXR-over-WebGPU support (Vision Pro). `@react-three/xr` is the R3F XR layer — reach for it when a request needs VR/AR sessions, hand tracking, or passthrough, not vanilla `<Canvas>` + manual XR session code.

**Physics detail (@react-three/rapier v2.2.0):** requires R3F v9 + React 19 (React 18 → pin rapier v1 + R3F v8). Wrap `<Physics>` in `<Suspense>` (WASM load). Helpers: `interactionGroups(group, [interactsWith])`, `vec3`/`quat`/`euler` converters. Joints: fixed, spherical, revolute, prismatic, rope, spring. `InstancedRigidBodies` for instanced meshes with individual physics bodies. World-prop renames from v1: `allowedLinearError`→`normalizedAllowedLinearError`, `predictionDistance`→`normalizedPredictionDistance`. Underlying `rapier3d-compat` is 0.19.2 (adds sparse voxel storage, `World.timing*` profiling when `profilerEnabled=true`, `RAPIER.reserveMemory`).

## 9. Profiling tooling (2026 — corrects source PDF, which predates WebGPU)

- **WebGL path:** `r3f-perf` (still maintained) — reads `gl.info` for draw calls/triangles/memory; works fine here.
- **WebGPU path:** `gl.info` is unreliable/unavailable on WebGPURenderer. Use **`r3f-webgpu-perf`** (scene-traversal-based stats: draw calls, triangles, geometries, textures, VRAM estimate; components `<Perf/>`/`<PerfHeadless/>`, hook `usePerf`) plus **`stats-gl`** (FPS/CPU/GPU monitor, explicit WebGL+WebGPU support). Real WebGPU timestamp queries aren't implemented in these yet — treat VRAM figures as estimates.
- **Frame capture / shader debugging:** Spector.js is WebGL-only and cannot see WebGPU frames at all — do not recommend it for a WebGPU scene. Use the **WebGPU Inspector** browser DevTools extension instead (object inspection, frame capture, live shader editing; has a documented R3F integration path).
- **Universal:** `renderer.info.render.calls` / `renderer.info.memory.geometries|textures` remains the canonical leak signal on both backends — must return to baseline after unmount/route navigation. drei `<PerformanceMonitor>` for adaptive DPR under load.

## 10. Scroll-driven 3D patterns (product stories + zoom-into-world)

Golden rule everywhere: scroll → normalized 0–1 progress → damped ref mutation in `useFrame`. Never scroll→setState, never raw scroll events per frame, exactly one scroll owner per page.

### 10a. Pattern A — pinned product story (drei ScrollControls, hijacked scroll)
```tsx
// Canvas fills viewport; ScrollControls creates N pages of virtual scroll
<Canvas dpr={[1, 2]}>
  <ScrollControls pages={4} damping={0.2}>
    <ProductStory />
    <Scroll html>{/* DOM copy layers, translate with scroll */}</Scroll>
  </ScrollControls>
</Canvas>

function ProductStory() {
  const scroll = useScroll();
  const product = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    // phase 1 (pages 0→1): rotate product
    const r1 = scroll.range(0 / 4, 1 / 4);        // 0→1 across first quarter
    // phase 2 (pages 1→2): explode / move camera in
    const r2 = scroll.range(1 / 4, 1 / 4);
    // curve() = 0→1→0 bell across a range — good for temporary emphasis
    const glow = scroll.curve(2 / 4, 1 / 4);
    easing.dampE(product.current!.rotation, [0, r1 * Math.PI * 2, 0], 0.25, delta); // maath/easing
    easing.damp3(state.camera.position, [0, 1 - r2 * 0.5, 4 - r2 * 2.5], 0.3, delta);
  });
  return (
    <group ref={product}>
      <Model />
      <ContactShadows opacity={0.6} blur={2} />   {/* grounding on "table" */}
      <Environment preset="studio" />              {/* realism = HDRI, not lights */}
    </group>
  );
}
```
Key API: `scroll.offset` (total 0–1), `scroll.range(start, distance)` (0–1 within a segment), `scroll.curve(start, distance)` (0→1→0), `scroll.visible(start, distance)` (bool). All fractions of total pages.

### 10b. Pattern A alt — GSAP ScrollTrigger (native scroll, mixed DOM+3D page)
```ts
gsap.registerPlugin(ScrollTrigger);
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: '#product-section',
    start: 'top top',
    end: '+=300%',        // 3 viewport-heights of scroll distance
    pin: true,            // canvas stays fixed while story plays
    scrub: 1,             // NUMERIC scrub = 1s smoothing; `true` = raw/steppy
  },
});
tl.to(camera.position, { z: 2, y: 0.5 }, 0)
  .to(product.rotation, { y: Math.PI * 2 }, 0)
  .to(product.position, { x: 1.2 }, 0.5);       // position params = timeline labels
```
- Works vanilla or R3F. In R3F, target refs' `.current` objects; build the timeline in `useLayoutEffect` inside `gsap.context()` and `ctx.revert()` on cleanup.
- GSAP mutates the same objects `useFrame` reads — do NOT also damp the same property in `useFrame` (double-writer conflict).
- `frameloop="demand"` breaks scrub (GSAP mutates outside R3F's loop) — either stay on `always`, or call `invalidate()` in `onUpdate`.

### 10c. Pattern B — zoom-into-world / camera fly-through
```tsx
const curve = useMemo(() => new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, 2, 10),    // outside, looking at the "world"
  new THREE.Vector3(0, 1.2, 4),   // approaching
  new THREE.Vector3(0, 0.8, 0),   // through the doorway/portal plane
  new THREE.Vector3(0, 1, -6),    // inside the world
], false, 'centripetal'), []);

const pos = useMemo(() => new THREE.Vector3(), []);
const look = useMemo(() => new THREE.Vector3(), []);

useFrame((state, delta) => {
  const t = scroll.offset;                         // or ScrollTrigger progress
  curve.getPointAt(Math.min(t, 0.999), pos);
  curve.getPointAt(Math.min(t + 0.01, 1), look);   // look slightly ahead on path
  easing.damp3(state.camera.position, pos, 0.25, delta);
  state.camera.lookAt(look);
  // "pulled in" feel: widen fov + thicken fog as we enter
  state.camera.fov = 50 + t * 25;
  state.camera.updateProjectionMatrix();
  (state.scene.fog as THREE.Fog).near = 10 - t * 8;
});
```
- Scene swap options at the threshold: (a) drei `<MeshPortalMaterial>` — render the destination world inside a portal mesh, dolly the camera into it, `blend` prop 0→1 makes the portal fullscreen and it becomes the scene; (b) render-target crossfade — render both scenes to RTs, blend in a fullscreen quad; (c) hard swap behind a fog/white-out beat.
- Section state (which world is active, HTML copy visibility) flips via Zustand at progress thresholds; visuals still damp toward targets — never snap on the flip frame.
- Depth cues sell the dive: fog, parallax layers moving at different rates, dof (RenderPipeline bokeh) tightening as you enter.

### 10d. Image-sequence scrub (the "Apple technique" — decision point, not fallback)
Pre-render N frames (Blender/C4D) → scrub `<canvas>` 2D drawImage by scroll progress. Choose when: pixel-perfect brand fidelity, zero interactivity, must run on anything. Costs: no lighting/interaction/responsiveness in 3D space, heavy image payload (use WebP/AVIF sequence + preload strategy). This is a legitimate architecture choice to surface to clients, not a compromise.

### 10e. Lenis integration (smooth native scroll + ScrollTrigger)
```ts
const lenis = new Lenis();
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
```
Lenis pairs with ScrollTrigger only. Never Lenis + drei ScrollControls (two scroll hijackers = broken input).

### 10f. Gotchas checklist
- One scroll owner per page: ScrollControls XOR (ScrollTrigger [+ Lenis]).
- Mobile: address-bar show/hide fires resize → `ScrollTrigger.refresh()` debounced; test pinning on iOS Safari specifically.
- `prefers-reduced-motion`: swap scrub animations for static keyframe states.
- Pinned sections + CSS transforms on ancestors break `position: fixed` pinning — keep the pinned canvas out of transformed containers.
- Damping constants: 0.2–0.35 s feels premium; >0.5 s feels laggy/detached.
- All standard doctrine still applies inside scroll scenes: DPR cap, disposal, no `new` in loop, instancing.

### 10g. Persistent object traveling across DOM sections (waypoint projection)
Verdict: single fullscreen transparent canvas + ScrollTrigger waypoints. NOT drei `<View>` for this pattern — View = N scissored render passes (draw calls multiply per viewport), rect tracking near the loop, and broken generic post-processing. Single canvas = 1 unified pass, one world space, post-processing works natively.
```ts
function projectDOMToWorld(el: HTMLElement, cam: THREE.PerspectiveCamera, w: number, h: number, targetZ = 0) {
  const r = el.getBoundingClientRect();
  const v = new THREE.Vector3(((r.left + r.width / 2) / w) * 2 - 1, -((r.top + r.height / 2) / h) * 2 + 1, 0.5);
  v.unproject(cam).sub(cam.position).normalize();
  const pos = cam.position.clone().add(v.multiplyScalar((targetZ - cam.position.z) / v.z));
  const frustumH = 2 * Math.tan((cam.fov * Math.PI) / 360) * Math.abs(targetZ - cam.position.z);
  const upp = frustumH / h; // world units per pixel at targetZ
  return { pos, scale: new THREE.Vector3(r.width * upp, r.height * upp, 1) };
}
```
- ScrollTrigger per DOM section: `onEnter`/`onEnterBack` write the projected target (position/scale + per-section rotation) into a plain module-level store; the mesh chases it in `useFrame` with frame-rate-independent lerp `1 - Math.exp(-6 * delta)` (`position.lerp`, `scale.lerp`, `quaternion.slerp` toward a target quat — slerp, never euler-lerp).
- RULE: project rects ONCE on (debounced) resize and cache as vectors. `getBoundingClientRect` in or near the frame loop = layout thrashing.
- iOS: address-bar show/hide fires resize constantly — cache viewport height at load; re-project only when WIDTH changes past a threshold.
- Perspective scale is height-dependent: on significant aspect-ratio change, recompute `upp` or the mesh outgrows its HTML slot.
- WebGPU: fully compatible as-is (all CPU-side matrix math).

### 10h. Typography occluded by / layered around a 3D object (the sandwich look)
Verdict: in-scene SDF text (drei `<Text>`, troika engine) + invisible occluder proxy for true per-pixel occlusion. DOM sandwich (DOM text / transparent canvas / DOM text via z-index) only when the copy must remain native DOM for SEO/a11y — it can never do real depth intersection with the model.
- renderOrder ladder:
  - `0` background `<Text>` — depthWrite true
  - `1` occluder = invisible duplicate/proxy of the model geometry: `meshBasicMaterial colorWrite={false} depthWrite={true} depthTest={true}` — writes depth only, masks background text pixel-per-pixel
  - `2` real PBR model
  - `3` foreground `<Text>` — `depthTest={false} depthWrite={false}`, always on top
- troika mechanics: TTF/OTF/WOFF parsed to an SDF atlas in a web worker; 1 draw call per `<Text>` mesh; instances CANNOT merge with standard geometry buffers — many text nodes = draw-call bloat, so pool and frustum-hide offscreen text.
- Next.js/React 19: serve fonts statically from `/public`; pre-warm required glyph ranges at load to kill the SDF FOUC flash.
- WebGPU: the colorWrite/depthWrite/renderOrder occlusion recipe works on WebGPURenderer; troika's internal shader path is WebGL-oriented — verify troika's current WebGPU status before committing a WebGPU-first build to SDF text (fallback: drei `Text3D` with node materials, at higher geometry cost).

### 10i. Dark studio product staging (garment/apparel grade)
Verdict: custom `<Environment resolution={512}>` built from `<Lightformer>` strips — not named presets ("city"/"studio" read generic). Shadow doctrine: **AccumulativeShadows for static staged products** (temporal accumulation over ~100–120 frames, then frozen = zero runtime cost, raycast-quality softness); **ContactShadows only when the object moves/rotates continuously** (updates per frame, hard edges, cheaper setup) — AccumulativeShadows ghosts on animated models.
- Studio rig recipe (dark void look): near-black background + matching fog (`#08080a`, near 3 / far 8) · `ambientLight 0.03` · overhead soft rect Lightformer (low intensity ~0.4) · rear rect strip at high intensity (~3.0, cool tint) for rim/silhouette · two vertical side strips (one white ~4.0, one warm ~2.5) angled toward the product. AgX tone mapping.
- Fabric material (MeshPhysicalMaterial ↔ TSL node equivalents): `sheen: 1.0` ↔ `sheenNode = float(1.0)` · `sheenColor` ↔ `sheenColorNode = color(...)` · `sheenRoughness: 0.4–0.5` ↔ `sheenRoughnessNode` · low `clearcoat` (~0.15) with high `clearcoatRoughness` for subtle fiber highlight; `roughness ~0.7`, `metalness 0`.
- AccumulativeShadows params that matter: `temporal frames={120}`, `alphaTest ~0.8`, `RandomizedLight amount={8} radius={5}` (radius = softness), `bias 0.001`. Gotcha: it temporarily overrides scene materials during accumulation — keep gizmos/helpers OUT of its container or it crashes; low-tier mobile can fail on high-res accumulation buffers.
- Blender garment prep: decimate Marvelous-Designer-grade meshes to **15k–25k tris**, triangulate ALL quads before export; bake cloth sim to shape keys or skeletal keyframes (push to NLA actions); pack ORM texture (R=AO, G=roughness, B=metalness) to cut bindings; then the standard pipeline (meshopt/Draco + KTX2, §6).
- CC0/free garment sources to check: iMeshh CC0 clothing, CGTrader free garment section, Meshy free clothing category (verify license per item — treat listings as leads, not guarantees).

### 10j. Scroll-velocity shader effects (image warp + kinetic marquee)
Verdict: DOM-as-layout / WebGL-as-paint via a single global canvas syncing planes over proxy divs — `14islands/r3f-scroll-rig` is the reference implementation of this pattern. Velocity feeds shaders through ONE lerped uniform.
- Velocity pipeline: source = Lenis velocity (preferred, already smoothed) or `ScrollTrigger.getVelocity()` (raw — needs manual smoothing). Per frame: `u = lerp(u, rawVel * k, 1 - Math.exp(-8 * delta))`. **Clamp raw velocity before the GPU** — touch flicks spike it and explode vertex displacement.
- Image warp (WebGL/GLSL): plane per image, `planeGeometry` subdivided **≥32×32 segments** (vertex displacement needs vertices), vertex shader `pos.z += sin(uv.x * PI) * uVelocity * uStrength`. Match plane aspect to image aspect or textures stretch. Infinite carousels MUST `texture.dispose()` on swap — classic VRAM leak.
- TSL port (WebGPU) — corrected, Z-offset only:
```ts
import { MeshBasicNodeMaterial } from 'three/webgpu';
import { positionLocal, uv, sin, float, vec3, uniform, texture, Fn } from 'three/tsl';
const uVelocity = uniform(0.0);
const mat = new MeshBasicNodeMaterial();
mat.colorNode = texture(tex, uv());
mat.positionNode = Fn(() => {
  const disp = sin(uv().x.mul(float(Math.PI))).mul(uVelocity).mul(float(0.3));
  return positionLocal.add(vec3(0, 0, disp));
})();
// update per frame: uVelocity.value = lerped velocity
```
- Kinetic marquee: render the strip as drei `<Text>` (SDF stays crisp under transform) and apply a shear in the vertex stage — skew factor `tan(uVelocity * 0.1)` in a mat4 (GLSL) or a TSL positionNode offsetting `x += y * skew`. GPU shear beats GSAP `skewX` on DOM at high glyph counts; GSAP-only skew is fine for short single-line marquees.
- GLSL↔TSL mapping for this family: `uniform float` ↔ `uniform(0.0)` · `varying vec2 vUv`/`uv` ↔ `uv()` · `position` ↔ `positionLocal` · `texture2D(t, vUv)` ↔ `texture(t, uv())` (or `texture(t).sample(uv())`).

## 11. Prompt-architecture rationale (why the agent file is shaped this way)

Source spec structures the agent prompt around the U-shaped attention curve: absolute boundaries early, recency reminders late; XML/section-tagged operational rules over rigid checklists. Mapped onto this roster's house format: BOUNDARIES → inlined as anti-patterns + non-negotiable sections near top; WORKFLOW SOPs → PROCESS (diagnose → plan → surgical code → verify); TOOLING STRATEGIES → asset pipeline + profiling stack; RECENCY REMINDERS → VERIFICATION GATE at file end.

Absolute rules carried over verbatim in spirit:
1. NEVER drive render state/animation from `useState` in high-frequency loops.
2. NEVER load textures without POT validation.
3. NEVER remove a 3D asset without explicit `.dispose()`.
4. ALWAYS cap DPR at 2 (mobile thermal throttling).
5. ALWAYS pre-allocate math utility objects outside frame loops.
