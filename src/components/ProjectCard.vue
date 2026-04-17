<script setup lang="ts">
import { ref } from 'vue'
import { Github, ArrowRight } from 'lucide-vue-next'
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
        <a :href="project.github" target="_blank" class="github-btn" v-if="project.github !== '#'" title="View Source" @click.stop>
          <Github :size="20" />
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
  border-radius: 24px;
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




.card-content {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  z-index: 4;
}

.project-type {
  font-size: 0.75rem;
  font-weight: 800;
  color: var(--accent);
  text-transform: uppercase;
  letter-spacing: 0.15em;
  margin-bottom: 0.5rem;
  display: block;
}

.project-name {
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--text);
  margin-bottom: 0.85rem;
  line-height: 1.1;
  letter-spacing: -0.02em;
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
  font-size: 1rem;
  line-height: 1.65;
  margin-bottom: 2rem;
  flex-grow: 1;
}

.tech-stack {
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
  margin-bottom: 2.5rem;
}

.tech-pill {
  font-size: 0.65rem;
  font-weight: 800;
  background: var(--bg-3);
  padding: 0.3rem 0.7rem;
  border-radius: 6px;
  color: var(--muted);
  border: 1px solid var(--border);
  transition: all 0.3s ease;
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

.github-btn {
  background: var(--bg-3);
  color: var(--text);
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid var(--border);
}

.github-btn:hover {
  background: var(--accent);
  color: black;
  border-color: var(--accent);
}

.case-study-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  background: var(--accent);
  color: black;
  text-decoration: none;
  font-weight: 950;
  font-size: 1rem;
  padding: 0 1.5rem;
  border-radius: 14px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  flex-grow: 1;
  height: 52px;
  letter-spacing: 0.15em;
  box-shadow: 0 4px 15px rgba(245, 166, 35, 0.2);
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
</style>
