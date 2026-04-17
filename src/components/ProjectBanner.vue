<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  title: string
  subtitle: string
  variant: 'neural' | 'crystal' | 'matrix' | 'wave'
  status?: string
  version?: string
}>()

// ─── Seeded PRNG for deterministic matrix characters ──────────────────
function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

// ─── Neural Pattern: node positions & connections ─────────────────────
const neuralNodes = [
  { x: 15, y: 20 }, { x: 35, y: 65 }, { x: 55, y: 30 }, { x: 75, y: 70 },
  { x: 85, y: 25 }, { x: 25, y: 80 }, { x: 65, y: 50 }, { x: 45, y: 85 },
]
const neuralConnections = [
  [0, 2], [0, 1], [1, 3], [2, 4], [2, 6],
  [1, 5], [3, 6], [5, 7], [6, 7], [3, 4],
]

// ─── Crystal Pattern: hexagons ────────────────────────────────────────
const hexagons = [
  { cx: 20, cy: 30, r: 18 }, { cx: 50, cy: 20, r: 22 },
  { cx: 80, cy: 40, r: 16 }, { cx: 35, cy: 70, r: 20 },
  { cx: 70, cy: 75, r: 14 }, { cx: 15, cy: 60, r: 12 },
  { cx: 60, cy: 50, r: 25 }, { cx: 88, cy: 15, r: 10 },
]
const hexConnections = [[0, 1], [1, 6], [6, 4], [0, 5], [5, 3], [2, 6], [1, 7]]

function hexPoints(cx: number, cy: number, r: number) {
  return Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 6
    return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`
  }).join(' ')
}

// ─── Matrix Pattern: deterministic character grid ─────────────────────
const matrixChars = '{}[]()<>|/\\=+-*&^%$#@!?;:.,~`01'
const matrixGrid = computed(() => {
  const rng = seededRandom(42)
  const cols = 14
  const rows = 16
  return Array.from({ length: cols }, (_, col) =>
    Array.from({ length: rows }, () => {
      const charIdx = Math.floor(rng() * matrixChars.length)
      const isAccent = rng() > 0.85
      const opacity = isAccent ? 0.6 : 0.1 + rng() * 0.1
      return { char: matrixChars[charIdx], isAccent, opacity }
    })
  )
})

// ─── Wave Pattern: SVG paths ──────────────────────────────────────────
const wavePaths = computed(() => {
  return Array.from({ length: 5 }, (_, i) => {
    const yBase = 40 + i * 30
    const amp = 15 - i * 2
    const d = `M 0 ${yBase} ` + Array.from({ length: 20 }, (_, j) => {
      const x = (j / 19) * 400
      const y = yBase + Math.sin((j / 19) * Math.PI * 4 + i * 0.8) * amp
      return `L ${x.toFixed(1)} ${y.toFixed(1)}`
    }).join(' ')
    return { d, opacity: 0.08 + i * 0.04, duration: 4 + i }
  })
})
</script>

<template>
  <div class="banner-root">
    <!-- ── Base Grid Layer ── -->
    <div class="banner-grid"></div>

    <!-- ── Vignette ── -->
    <div class="banner-vignette"></div>

    <!-- ═══════════ GEOMETRIC IDENTITY LAYER ═══════════ -->
    <div class="pattern-layer">

      <!-- NEURAL: SVG nodes + connections -->
      <svg v-if="variant === 'neural'" class="pattern-svg" preserveAspectRatio="none">
        <line
          v-for="([from, to], i) in neuralConnections" :key="'nl-' + i"
          :x1="neuralNodes[from].x + '%'" :y1="neuralNodes[from].y + '%'"
          :x2="neuralNodes[to].x + '%'" :y2="neuralNodes[to].y + '%'"
          stroke="var(--accent)" stroke-width="0.5" stroke-opacity="0.15"
          class="neural-line" :style="{ animationDelay: i * 0.15 + 's' }"
        />
        <circle
          v-for="(n, i) in neuralNodes" :key="'npulse-' + i"
          :cx="n.x + '%'" :cy="n.y + '%'" r="12"
          fill="var(--accent)" class="neural-pulse"
          :style="{ animationDelay: i * 0.4 + 's' }"
        />
        <circle
          v-for="(n, i) in neuralNodes" :key="'ndot-' + i"
          :cx="n.x + '%'" :cy="n.y + '%'" r="2.5"
          fill="var(--accent)" opacity="0.5"
          class="neural-dot" :style="{ animationDelay: i * 0.1 + 's' }"
        />
        <circle
          v-for="(n, i) in neuralNodes" :key="'ncore-' + i"
          :cx="n.x + '%'" :cy="n.y + '%'" r="1"
          fill="var(--accent)" opacity="0.9"
        />
        <!-- Traveling pulses -->
        <circle
          v-for="([from, to], i) in neuralConnections.slice(0, 4)" :key="'ntravel-' + i"
          r="2" fill="var(--accent)" opacity="0.4"
          class="neural-travel"
          :style="{
            '--from-x': neuralNodes[from].x + '%',
            '--from-y': neuralNodes[from].y + '%',
            '--to-x': neuralNodes[to].x + '%',
            '--to-y': neuralNodes[to].y + '%',
            animationDelay: i * 1.2 + 's',
            animationDuration: '3s'
          }"
        />
      </svg>

      <!-- CRYSTAL: SVG hexagons + connectors -->
      <svg v-if="variant === 'crystal'" class="pattern-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polygon
          v-for="(hex, i) in hexagons" :key="'hex-' + i"
          :points="hexPoints(hex.cx, hex.cy, hex.r)"
          fill="none" stroke="var(--accent)" stroke-width="0.3"
          class="crystal-hex" :style="{ animationDelay: i * 0.12 + 's' }"
        />
        <polygon
          v-for="(hex, i) in hexagons" :key="'hexfill-' + i"
          :points="hexPoints(hex.cx, hex.cy, hex.r * 0.6)"
          fill="var(--accent)" class="crystal-fill"
          :style="{ animationDelay: i * 0.5 + 1 + 's' }"
        />
        <line
          v-for="([a, b], i) in hexConnections" :key="'hconn-' + i"
          :x1="hexagons[a].cx" :y1="hexagons[a].cy"
          :x2="hexagons[b].cx" :y2="hexagons[b].cy"
          stroke="var(--accent)" stroke-width="0.2"
          stroke-dasharray="2 3" opacity="0.15"
          class="crystal-line" :style="{ animationDelay: 0.8 + i * 0.15 + 's' }"
        />
      </svg>

      <!-- MATRIX: character grid -->
      <div v-if="variant === 'matrix'" class="matrix-container">
        <div
          v-for="(col, ci) in matrixGrid" :key="'mcol-' + ci"
          class="matrix-col"
          :style="{
            left: (ci / matrixGrid.length * 100) + '%',
            width: (100 / matrixGrid.length) + '%',
            animationDelay: ci * 0.08 + 's'
          }"
        >
          <span
            v-for="(cell, ri) in col" :key="'mc-' + ci + '-' + ri"
            class="matrix-char"
            :class="{ 'matrix-accent': cell.isAccent }"
            :style="{ opacity: cell.opacity }"
          >{{ cell.char }}</span>
        </div>
        <!-- Floating highlight beams -->
        <div class="matrix-beam" style="top:15%; left:10%; width:30%"></div>
        <div class="matrix-beam matrix-beam-2" style="top:40%; left:55%; width:35%"></div>
        <div class="matrix-beam matrix-beam-3" style="top:70%; left:20%; width:25%"></div>
      </div>

      <!-- WAVE: SVG sine waves + traveling dots -->
      <svg v-if="variant === 'wave'" class="pattern-svg" viewBox="0 0 400 200" preserveAspectRatio="none">
        <path
          v-for="(w, i) in wavePaths" :key="'wp-' + i"
          :d="w.d" fill="none" stroke="var(--accent)"
          stroke-width="0.6" :stroke-opacity="w.opacity"
          class="wave-path" :style="{ animationDelay: i * 0.3 + 's' }"
        />
        <circle
          v-for="(w, i) in wavePaths" :key="'wdot-' + i"
          r="2.5" fill="var(--accent)" :opacity="0.5 - i * 0.08"
        >
          <animateMotion :dur="w.duration + 's'" repeatCount="indefinite" :path="w.d" />
        </circle>
        <!-- Vertical scan pulses -->
        <line v-for="(x, i) in [80, 200, 310]" :key="'vscan-' + i"
          :x1="x" y1="0" :x2="x" y2="200"
          stroke="var(--accent)" stroke-width="0.5"
          stroke-dasharray="3 6" class="wave-vscan"
          :style="{ animationDelay: i * 1.2 + 's' }"
        />
      </svg>
    </div>

    <!-- ── Horizontal Scan Line ── -->
    <div class="scan-line"></div>

    <!-- ── Corner Brackets ── -->
    <div class="corner corner-tl"></div>
    <div class="corner corner-tr"></div>
    <div class="corner corner-bl"></div>
    <div class="corner corner-br"></div>

    <!-- ── Top-Left System Label ── -->
    <div class="sys-label sys-label-left">
      <span class="sys-dot"></span>
      <span class="sys-text">{{ status || 'OPERATIONAL' }}</span>
    </div>

    <!-- ── Top-Right Version Label ── -->
    <div class="sys-label sys-label-right">
      <span class="sys-version">SYS.{{ version || 'v1.0' }}</span>
    </div>

    <!-- ── Central Typography Block ── -->
    <div class="banner-center">
      <div class="center-line center-line-top"></div>
      <h3 class="banner-title">{{ title }}</h3>
      <span class="banner-subtitle">{{ subtitle }}</span>
      <div class="center-line center-line-bottom"></div>
    </div>

    <!-- ── Bottom-Left Metadata ── -->
    <div class="meta-label meta-left">
      <div class="meta-dash"></div>
      <span>ARCH.CORE</span>
    </div>

    <!-- ── Bottom-Right Data Bars ── -->
    <div class="meta-label meta-right">
      <div class="data-bars">
        <div class="data-bar" style="animation-delay:0s"></div>
        <div class="data-bar" style="animation-delay:0.2s"></div>
        <div class="data-bar" style="animation-delay:0.4s"></div>
      </div>
      <span>SIGNAL.ACTIVE</span>
    </div>

    <!-- ── Hover Glow ── -->
    <div class="banner-hover-glow"></div>
  </div>
</template>

<style scoped>
/* ═══════════════════════════════════════════════════════════════════════
   BANNER ROOT
   ═══════════════════════════════════════════════════════════════════════ */
.banner-root {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  background: #08080a;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  user-select: none;
}

/* ── Base Grid ── */
.banner-grid {
  position: absolute;
  inset: 0;
  opacity: 0.3;
  pointer-events: none;
  background-image:
    linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
  background-size: 28px 28px;
  transition: all 0.7s cubic-bezier(0.4, 0, 0.2, 1);
}

.premium-card:hover .banner-grid {
  opacity: 0.5;
  transform: scale(1.05);
}

/* ── Vignette ── */
.banner-vignette {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(ellipse at center, transparent 30%, rgba(8,8,10,0.8) 100%);
}

/* ── Pattern Container ── */
.pattern-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
}

.premium-card:hover .pattern-layer {
  transform: scale(1.03);
}

.pattern-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

/* ── Scan Line ── */
.scan-line {
  position: absolute;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--accent), transparent);
  opacity: 0.12;
  z-index: 10;
  pointer-events: none;
  animation: scanDown 6s linear infinite;
}

@keyframes scanDown {
  0%   { top: -5%; }
  100% { top: 110%; }
}

/* ── Corner Brackets ── */
.corner {
  position: absolute;
  width: 20px;
  height: 20px;
  pointer-events: none;
  border-color: rgba(245, 166, 35, 0.2);
  border-style: solid;
  border-width: 0;
}
.corner-tl { top: 20px; left: 20px; border-top-width: 1px; border-left-width: 1px; }
.corner-tr { top: 20px; right: 20px; border-top-width: 1px; border-right-width: 1px; }
.corner-bl { bottom: 20px; left: 20px; border-bottom-width: 1px; border-left-width: 1px; }
.corner-br { bottom: 20px; right: 20px; border-bottom-width: 1px; border-right-width: 1px; }

/* ── System Labels ── */
.sys-label {
  position: absolute;
  top: 24px;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 10px;
}
.sys-label-left { left: 32px; }
.sys-label-right { right: 32px; }

.sys-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
  animation: dotPulse 2s ease-in-out infinite;
}

@keyframes dotPulse {
  0%, 100% { opacity: 0.4; }
  50%      { opacity: 1; }
}

.sys-text {
  font-family: 'DM Mono', 'Fira Code', monospace;
  font-size: 9px;
  color: var(--accent);
  opacity: 0.6;
  text-transform: uppercase;
  letter-spacing: 0.3em;
}

.sys-version {
  font-family: 'DM Mono', 'Fira Code', monospace;
  font-size: 9px;
  color: var(--muted);
  opacity: 0.4;
  text-transform: uppercase;
  letter-spacing: 0.2em;
}

/* ── Center Typography ── */
.banner-center {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 0 2rem;
  transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
}

.premium-card:hover .banner-center {
  transform: scale(1.04);
}

.center-line {
  width: 32px;
  height: 1px;
  background: rgba(245, 166, 35, 0.4);
  animation: lineGrow 1s ease-out forwards;
  transform: scaleX(0);
}
.center-line-top { margin-bottom: 20px; animation-delay: 0.5s; }
.center-line-bottom { margin-top: 20px; animation-delay: 0.7s; }

@keyframes lineGrow {
  to { transform: scaleX(1); }
}

.banner-title {
  font-size: clamp(1.4rem, 3.5vw, 2.4rem);
  font-weight: 900;
  letter-spacing: -0.05em;
  text-transform: uppercase;
  line-height: 1;
  margin-bottom: 10px;
  background: linear-gradient(160deg, #ffffff 0%, #888888 50%, #ffffff 100%);
  background-size: 200% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: shimmer 6s ease-in-out infinite;
}

@keyframes shimmer {
  0%, 100% { background-position: 0% 50%; }
  50%      { background-position: 100% 50%; }
}

.banner-subtitle {
  font-family: 'DM Mono', 'Fira Code', monospace;
  font-size: 0.6rem;
  font-weight: 700;
  color: var(--accent);
  text-transform: uppercase;
  letter-spacing: 0.35em;
}

/* ── Bottom Meta Labels ── */
.meta-label {
  position: absolute;
  bottom: 24px;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'DM Mono', 'Fira Code', monospace;
  font-size: 8px;
  color: var(--muted);
  opacity: 0.3;
  text-transform: uppercase;
  letter-spacing: 0.25em;
}
.meta-left { left: 32px; }
.meta-right { right: 32px; }

.meta-dash {
  width: 12px;
  height: 1px;
  background: rgba(245, 166, 35, 0.3);
}

.data-bars {
  display: flex;
  gap: 3px;
  align-items: flex-end;
}

.data-bar {
  width: 3px;
  border-radius: 9999px;
  background: rgba(245, 166, 35, 0.3);
  animation: barPulse 1.5s ease-in-out infinite;
}

@keyframes barPulse {
  0%, 100% { height: 4px; }
  50%      { height: 12px; }
}

/* ── Hover Glow ── */
.banner-hover-glow {
  position: absolute;
  inset: 0;
  opacity: 0;
  pointer-events: none;
  background: radial-gradient(circle at center, rgba(245,166,35,0.04) 0%, transparent 60%);
  transition: opacity 0.7s ease;
}
.premium-card:hover .banner-hover-glow {
  opacity: 1;
}

/* ═══════════════════════════════════════════════════════════════════════
   NEURAL PATTERN ANIMATIONS
   ═══════════════════════════════════════════════════════════════════════ */
.neural-line {
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  animation: drawLine 1.5s ease-out forwards;
}

@keyframes drawLine {
  to { stroke-dashoffset: 0; }
}

.neural-pulse {
  opacity: 0;
  animation: neuralGlow 3s ease-in-out infinite;
}

@keyframes neuralGlow {
  0%, 100% { opacity: 0; }
  50%      { opacity: 0.06; }
}

.neural-dot {
  opacity: 0;
  animation: fadeIn 0.6s ease-out forwards;
}

@keyframes fadeIn {
  to { opacity: 0.5; }
}

.neural-travel {
  animation: travelPulse 3s ease-in-out infinite alternate;
}

@keyframes travelPulse {
  0%   { cx: var(--from-x); cy: var(--from-y); }
  100% { cx: var(--to-x); cy: var(--to-y); }
}

/* ═══════════════════════════════════════════════════════════════════════
   CRYSTAL PATTERN ANIMATIONS
   ═══════════════════════════════════════════════════════════════════════ */
.crystal-hex {
  opacity: 0;
  animation: crystalAppear 1s ease-out forwards;
}

@keyframes crystalAppear {
  to { opacity: 0.2; }
}

.crystal-fill {
  opacity: 0;
  animation: crystalPulse 4s ease-in-out infinite;
}

@keyframes crystalPulse {
  0%, 100% { opacity: 0; }
  50%      { opacity: 0.04; }
}

.crystal-line {
  opacity: 0;
  animation: fadeIn 1s ease-out forwards;
}

/* ═══════════════════════════════════════════════════════════════════════
   MATRIX PATTERN ANIMATIONS
   ═══════════════════════════════════════════════════════════════════════ */
.matrix-container {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.matrix-col {
  position: absolute;
  top: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
  opacity: 0;
  transform: translateY(-20px);
  animation: matrixColIn 0.8s ease-out forwards;
}

@keyframes matrixColIn {
  to { opacity: 1; transform: translateY(0); }
}

.matrix-char {
  font-family: 'DM Mono', 'Fira Code', monospace;
  font-size: 0.55rem;
  text-align: center;
  line-height: 1;
  color: var(--muted);
}

.matrix-accent {
  color: var(--accent) !important;
  animation: matrixBlink 2.5s ease-in-out infinite;
}

@keyframes matrixBlink {
  0%, 100% { opacity: 0.3; }
  50%      { opacity: 0.8; }
}

.matrix-beam {
  position: absolute;
  height: 2px;
  border-radius: 9999px;
  background: linear-gradient(90deg, transparent, var(--accent), transparent);
  opacity: 0;
  transform: scaleX(0);
  animation: beamSweep 3s ease-in-out infinite;
  animation-delay: 0.5s;
}
.matrix-beam-2 { animation-delay: 1.2s; }
.matrix-beam-3 { animation-delay: 1.8s; }

@keyframes beamSweep {
  0%, 100% { opacity: 0; transform: scaleX(0); }
  50%      { opacity: 0.25; transform: scaleX(1); }
}

/* ═══════════════════════════════════════════════════════════════════════
   WAVE PATTERN ANIMATIONS
   ═══════════════════════════════════════════════════════════════════════ */
.wave-path {
  stroke-dasharray: 2000;
  stroke-dashoffset: 2000;
  animation: drawWave 2s ease-out forwards;
}

@keyframes drawWave {
  to { stroke-dashoffset: 0; }
}

.wave-vscan {
  opacity: 0;
  animation: vscanPulse 3s ease-in-out infinite;
}

@keyframes vscanPulse {
  0%, 100% { opacity: 0; }
  50%      { opacity: 0.15; }
}
</style>
