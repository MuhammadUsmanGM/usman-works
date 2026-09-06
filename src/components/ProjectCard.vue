<script setup lang="ts">
import { ref } from 'vue'
import { Github, ArrowRight, ExternalLink } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import ProjectBanner from './ProjectBanner.vue'
import type { Project } from '../types'

const props = defineProps<{
  project: Project
}>()

const router = useRouter()
const cardRef = ref<HTMLElement | null>(null)
const mouseX = ref(0)
const mouseY = ref(0)
const isHovering = ref(false)

const handleMouseMove = (e: MouseEvent) => {
  if (!cardRef.value) return
  const rect = cardRef.value.getBoundingClientRect()
  mouseX.value = e.clientX - rect.left
  mouseY.value = e.clientY - rect.top
}

const goToCaseStudy = () => {
  router.push({ name: 'project-detail', params: { id: props.project.id } })
}
</script>

<template>
  <div 
    ref="cardRef"
    class="premium-card"
    @mousemove="handleMouseMove"
    @mouseenter="isHovering = true"
    @mouseleave="isHovering = false"
    @click="goToCaseStudy"
    :style="{
      '--x': `${mouseX}px`,
      '--y': `${mouseY}px`,
      '--opacity': isHovering ? 1 : 0
    }"
  >
    <!-- Spotlight Glow Layer -->
    <div class="spotlight"></div>

    <!-- Code-Generated Banner -->
    <div class="card-image-wrap">
      <ProjectBanner
        :title="project.name"
        :subtitle="project.type"
        :variant="project.bannerVariant || 'neural'"
        :status="project.bannerStatus || project.status"
        :version="project.bannerVersion || 'v1.0'"
      />
      
      <!-- Custom Architectural Visual Overlay -->
      <transition name="fade">
        <div v-if="project.customVisual && isHovering" class="custom-visual-overlay">
          <img :src="project.customVisual" :alt="project.name" class="visual-img" />
        </div>
      </transition>

      <!-- Technical Code Snippet HUD -->
      <transition name="slide-up">
        <div v-if="project.codeSnippet && isHovering" class="code-snippet-hud">
          <div class="hud-label">Technical Logic</div>
          <pre class="hud-code"><code>{{ project.codeSnippet }}</code></pre>
        </div>
      </transition>
    </div>

    <!-- Content -->
    <div class="card-content">
      <div class="card-header">
        <span class="project-type">{{ project.type }}</span>
        <h3 class="project-name">{{ project.name }}</h3>
        <span v-if="project.highlight" class="project-highlight">{{ project.highlight }}</span>
      </div>
      
      <p class="project-desc">{{ project.description }}</p>

      <div class="tech-stack">
        <span v-for="t in project.tech.slice(0, 4)" :key="t" class="tech-pill">{{ t }}</span>
        <span v-if="project.tech.length > 4" class="tech-pill more">+{{ project.tech.length - 4 }}</span>
      </div>

      <!-- Action Footer -->
      <div class="card-footer">
        <a :href="project.github" target="_blank" class="footer-icon-btn" v-if="project.github && project.github !== '#'" title="View Source" @click.stop>
          <Github :size="15" />
        </a>
        
        <a 
          v-if="project.links && project.links.find(l => l.label.toUpperCase().includes('LIVE'))"
          :href="project.links.find(l => l.label.toUpperCase().includes('LIVE'))?.url" 
          target="_blank" 
          class="footer-icon-btn live-btn" 
          title="Live Experience" 
          @click.stop
        >
          <ExternalLink :size="15" />
        </a>

        <button @click.stop="goToCaseStudy" class="case-study-btn group">
          <span>DETAILS</span>
          <ArrowRight :size="13" class="btn-icon" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.premium-card {
  position: relative;
  background: var(--bg-2);
  border: 1px solid var(--border);
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  height: 100%;
  cursor: pointer;
  z-index: 1;
}

.spotlight {
  pointer-events: none;
  position: absolute;
  inset: -1px;
  opacity: var(--opacity);
  background: radial-gradient(
    400px circle at var(--x) var(--y),
    rgba(245, 166, 35, 0.15),
    transparent 40%
  );
  z-index: 3;
  transition: opacity 0.3s ease;
}

.premium-card:hover {
  transform: translateY(-4px);
  border-color: var(--accent);
  box-shadow: 0 12px 24px -10px rgba(0, 0, 0, 0.3);
}

.card-image-wrap {
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: var(--bg-3);
  border-bottom: 1px solid var(--border);
  max-height: 150px;
}

.custom-visual-overlay {
  position: absolute;
  inset: 0;
  background: #0A0A0A;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem;
}

.visual-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.code-snippet-hud {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(10, 10, 15, 0.95);
  backdrop-filter: blur(8px);
  padding: 0.75rem;
  z-index: 10;
  border-top: 1px solid var(--accent);
  max-height: 80%;
  overflow-y: auto;
}

.hud-label {
  font-size: 0.55rem;
  font-weight: 900;
  color: var(--accent);
  text-transform: uppercase;
  letter-spacing: 0.15em;
  margin-bottom: 0.4rem;
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.hud-code {
  font-family: monospace;
  font-size: 0.65rem;
  color: var(--text-sub);
  line-height: 1.4;
  margin: 0;
  white-space: pre-wrap;
}

/* Transitions */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-up-enter-active, .slide-up-leave-active { transition: transform 0.3s ease; }
.slide-up-enter-from, .slide-up-leave-to { transform: translateY(100%); }

.card-content {
  padding: 1.15rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  z-index: 4;
}

.project-type {
  font-size: 0.6rem;
  font-weight: 800;
  color: var(--accent);
  text-transform: uppercase;
  letter-spacing: 0.15em;
  margin-bottom: 0.25rem;
  display: block;
}

.project-name {
  font-size: 1.15rem;
  font-weight: 800;
  color: var(--text);
  margin-bottom: 0.35rem;
  line-height: 1.2;
  letter-spacing: -0.01em;
}

.project-highlight {
  font-size: 0.65rem;
  font-weight: 700;
  color: var(--accent);
  background: rgba(245, 166, 35, 0.08);
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
  display: inline-block;
  margin-bottom: 0.6rem;
  border: 1px solid rgba(245, 166, 35, 0.2);
  line-height: 1.3;
}

.project-desc {
  color: var(--text-sub);
  font-size: 0.825rem;
  line-height: 1.45;
  margin-bottom: 0.85rem;
  flex-grow: 1;
  opacity: 0.85;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.tech-stack {
  display: flex;
  gap: 0.35rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.tech-pill {
  font-size: 0.55rem;
  font-weight: 700;
  background: var(--bg-3);
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
  color: var(--muted);
  border: 1px solid var(--border);
  font-family: monospace;
}

.tech-pill.more {
  color: var(--accent);
}

.card-footer {
  border-top: 1px solid var(--border);
  padding-top: 0.75rem;
  margin-top: auto;
  display: flex;
  gap: 0.5rem;
}

.footer-icon-btn {
  background: var(--bg-3);
  color: var(--text);
  width: 34px;
  height: 34px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  border: 1px solid var(--border);
  flex-shrink: 0;
}

.footer-icon-btn:hover {
  background: var(--accent);
  color: black;
  border-color: var(--accent);
}

.live-btn:hover {
  background: #3ecf8e;
  border-color: #3ecf8e;
  color: black;
}

.case-study-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  background: var(--accent);
  color: black;
  font-weight: 800;
  font-size: 0.7rem;
  padding: 0 0.85rem;
  border-radius: 6px;
  transition: all 0.2s ease;
  flex-grow: 1;
  height: 34px;
  letter-spacing: 0.08em;
  border: none;
  cursor: pointer;
}

.case-study-btn:hover {
  opacity: 0.9;
}

.btn-icon {
  transition: transform 0.2s ease;
}

.case-study-btn:hover .btn-icon {
  transform: translateX(3px);
}

/* Mobile Responsiveness (Phones) */
@media (max-width: 768px) {
  .card-content { padding: 0.85rem; }
  .card-image-wrap { max-height: 110px; }
  .project-name { font-size: 0.95rem; margin-bottom: 0.25rem; }
  .project-type { font-size: 0.55rem; }
  .project-highlight { font-size: 0.6rem; padding: 0.15rem 0.4rem; margin-bottom: 0.5rem; }
  .project-desc { font-size: 0.75rem; -webkit-line-clamp: 2; margin-bottom: 0.6rem; }
  .tech-stack { gap: 0.25rem; margin-bottom: 0.75rem; }
  .tech-pill { font-size: 0.5rem; padding: 0.1rem 0.35rem; }
  .footer-icon-btn { width: 30px; height: 30px; }
  .case-study-btn { height: 30px; font-size: 0.625rem; padding: 0 0.5rem; }
}

@media (max-width: 480px) {
  .card-content { padding: 0.7rem; }
  .card-image-wrap { max-height: 90px; }
  .project-name { font-size: 0.875rem; }
  .project-highlight { display: none; } /* Hide highlight tag on ultra-compact mobile to save vertical space */
  .tech-stack { margin-bottom: 0.5rem; }
}
</style>
