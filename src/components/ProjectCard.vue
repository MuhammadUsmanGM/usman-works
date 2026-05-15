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

    <!-- Premium Code-Generated Banner -->
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
        <span v-for="t in project.tech" :key="t" class="tech-pill">{{ t }}</span>
      </div>

      <!-- Action Footer -->
      <div class="card-footer">
        <a :href="project.github" target="_blank" class="footer-icon-btn" v-if="project.github !== '#'" title="View Source" @click.stop>
          <Github :size="20" />
        </a>
        
        <a 
          v-if="project.links.find(l => l.label.toUpperCase().includes('LIVE'))"
          :href="project.links.find(l => l.label.toUpperCase().includes('LIVE'))?.url" 
          target="_blank" 
          class="footer-icon-btn live-btn" 
          title="Live Experience" 
          @click.stop
        >
          <ExternalLink :size="20" />
        </a>

        <button @click.stop="goToCaseStudy" class="case-study-btn group">
          <span>CASE STUDY</span>
          <ArrowRight :size="16" class="btn-icon" />
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
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
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
    600px circle at var(--x) var(--y),
    rgba(245, 166, 35, 0.15),
    transparent 40%
  );
  z-index: 3;
  transition: opacity 0.4s ease;
}

.premium-card:hover {
  transform: translateY(-8px);
  border-color: var(--accent);
  box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.3);
}

.card-image-wrap {
  position: relative;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  background: var(--bg-3);
  border-bottom: 1px solid var(--border);
}

.custom-visual-overlay {
  position: absolute;
  inset: 0;
  background: #0A0A0A;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
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
  backdrop-filter: blur(12px);
  padding: 1.25rem;
  z-index: 10;
  border-top: 1px solid var(--accent);
  max-height: 80%;
  overflow-y: auto;
}

.hud-label {
  font-size: 0.6rem;
  font-weight: 900;
  color: var(--accent);
  text-transform: uppercase;
  letter-spacing: 0.2em;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.hud-label::before {
  content: '';
  width: 4px;
  height: 4px;
  background: var(--accent);
  border-radius: 50%;
  box-shadow: 0 0 10px var(--accent);
}

.hud-code {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.75rem;
  color: var(--text-sub);
  line-height: 1.5;
  margin: 0;
  white-space: pre-wrap;
}

/* Transitions */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active, .slide-up-leave-active {
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-up-enter-from, .slide-up-leave-to {
  transform: translateY(100%);
}




.card-content {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  z-index: 4;
}

.project-type {
  font-size: 0.65rem;
  font-weight: 800;
  color: var(--accent);
  text-transform: uppercase;
  letter-spacing: 0.2em;
  margin-bottom: 0.75rem;
  display: block;
}

.project-name {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--text);
  margin-bottom: 0.75rem;
  line-height: 1.1;
  letter-spacing: -0.01em;
}

.project-highlight {
  font-size: 0.75rem;
  font-weight: 800;
  color: var(--accent);
  background: rgba(245, 166, 35, 0.1);
  padding: 0.4rem 0.75rem;
  border-radius: 8px;
  display: inline-block;
  margin-bottom: 1rem;
  border: 1px solid rgba(245, 166, 35, 0.2);
  letter-spacing: 0.05em;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}

.project-desc {
  color: var(--text-sub);
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  flex-grow: 1;
  opacity: 0.8;
}

.tech-stack {
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
  margin-bottom: 2.5rem;
}

.tech-pill {
  font-size: 0.6rem;
  font-weight: 800;
  background: var(--bg-3);
  padding: 0.25rem 0.6rem;
  border-radius: 4px;
  color: var(--muted);
  border: 1px solid var(--border);
  transition: all 0.3s ease;
  font-family: monospace;
}

.premium-card:hover .tech-pill {
  border-color: var(--accent);
  color: var(--text-sub);
}

.card-footer {
  border-top: 1px solid var(--border);
  padding-top: 1.5rem;
  margin-top: auto;
  display: flex;
  gap: 1rem;
}

.footer-icon-btn {
  background: var(--bg-3);
  color: var(--text);
  width: 44px;
  height: 44px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid var(--border);
  flex-shrink: 0;
}

.footer-icon-btn:hover {
  background: var(--accent);
  color: black;
  border-color: var(--accent);
}

.live-btn:hover {
  background: #3ecf8e; /* emerald for live */
  border-color: #3ecf8e;
  color: black;
}

.case-study-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  background: var(--accent);
  color: black;
  text-decoration: none;
  font-weight: 900;
  font-size: 0.85rem;
  padding: 0 1.25rem;
  border-radius: 8px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  flex-grow: 1;
  height: 44px;
  letter-spacing: 0.1em;
  box-shadow: 0 4px 15px rgba(245, 166, 35, 0.1);
  border: none;
  cursor: pointer;
}

.case-study-btn:hover {
  background: var(--accent-glow);
  box-shadow: 0 8px 25px rgba(245, 166, 35, 0.4);
}

.btn-icon {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.case-study-btn:hover .btn-icon {
  transform: translateX(6px);
}
@media (max-width: 480px) {
  .card-content { padding: 1.25rem; }
  .project-name { font-size: 1.3rem; }
  .project-desc { font-size: 0.9rem; margin-bottom: 1.5rem; }
  .footer-icon-btn { width: 44px; height: 44px; border-radius: 10px; }
  .case-study-btn { height: 44px; font-size: 0.85rem; padding: 0 1rem; border-radius: 10px; }
  .tech-stack { margin-bottom: 1.5rem; }
}
</style>
