<script setup lang="ts">
import { ref } from 'vue'
import { Github, ArrowRight } from 'lucide-vue-next'

defineProps<{
  project: {
    id: string
    name: string
    description: string
    tech: string[]
    type: string
    status: string
    link: string
    github: string
    image: string
  }
}>()

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
</script>

<template>
  <div 
    ref="cardRef"
    class="premium-card"
    @mousemove="handleMouseMove"
    @mouseenter="isHovering = true"
    @mouseleave="isHovering = false"
    :style="{
      '--x': `${mouseX}px`,
      '--y': `${mouseY}px`,
      '--opacity': isHovering ? 1 : 0
    }"
  >
    <!-- Spotlight Glow Layer -->
    <div class="spotlight"></div>

    <!-- Image Header -->
    <div class="card-image-wrap">
      <img :src="project.image" :alt="project.name" class="card-img" />
      <div class="badge-float">
        <span :class="['status-badge', project.status.toLowerCase()]">{{ project.status }}</span>
      </div>
    </div>

    <!-- Content -->
    <div class="card-content">
      <div class="card-header">
        <span class="project-type">{{ project.type }}</span>
        <h3 class="project-name">{{ project.name }}</h3>
      </div>
      
      <p class="project-desc">{{ project.description }}</p>

      <div class="tech-stack">
        <span v-for="t in project.tech" :key="t" class="tech-pill">{{ t }}</span>
      </div>

      <!-- Action Footer -->
      <div class="card-footer">
        <a :href="project.github" target="_blank" class="github-btn" v-if="project.github !== '#'" title="View Source">
          <Github :size="20" />
        </a>
        <a :href="project.link" target="_blank" class="case-study-btn">
          <span>CASE STUDY</span>
          <ArrowRight :size="16" />
        </a>
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

/* The Spotlight Effect */
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

/* Image Section */
.card-image-wrap {
  position: relative;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  background: var(--bg-3);
  border-bottom: 1px solid var(--border);
}

.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.premium-card:hover .card-img {
  transform: scale(1.08);
}

.badge-float {
  position: absolute;
  top: 1.25rem;
  left: 1.25rem;
  z-index: 4;
}

.status-badge {
  font-size: 0.65rem;
  font-weight: 900;
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  text-transform: uppercase;
  backdrop-filter: blur(12px);
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
  border: 1px solid rgba(255,255,255,0.1);
}

.status-badge.live { background: rgba(16, 185, 129, 0.8); color: white; }
.status-badge.alpha { background: rgba(245, 158, 11, 0.8); color: black; }
.status-badge.archived { background: rgba(107, 114, 128, 0.8); color: white; }

/* Content Section */
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

/* Footer Section */
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
  transition: all 0.3s ease;
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
  font-weight: 900;
  font-size: 0.85rem;
  padding: 0 1.5rem;
  border-radius: 14px;
  transition: all 0.3s ease;
  flex-grow: 1;
  height: 52px;
  letter-spacing: 0.05em;
  box-shadow: 0 4px 15px rgba(245, 166, 35, 0.2);
}

.case-study-btn:hover {
  background: var(--accent-glow);
  gap: 1.25rem;
  box-shadow: 0 8px 25px rgba(245, 166, 35, 0.4);
}
</style>
