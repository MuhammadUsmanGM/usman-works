<script setup lang="ts">
import { ExternalLink, Github, ArrowRight } from 'lucide-vue-next'

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
</script>

<template>
  <div class="project-card">
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

      <!-- Action Footer (New Cluster) -->
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
.project-card {
  background: var(--bg-2);
  border: 1px solid var(--border);
  border-radius: 24px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  height: 100%;
}

.project-card:hover {
  transform: translateY(-8px);
  border-color: var(--accent);
  box-shadow: 0 30px 60px -20px rgba(0, 0, 0, 0.2);
}

/* Image Section */
.card-image-wrap {
  position: relative;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  background: var(--bg-3);
}

.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.project-card:hover .card-img {
  transform: scale(1.05);
}

.badge-float {
  position: absolute;
  top: 1.25rem;
  left: 1.25rem;
}

.status-badge {
  font-size: 0.65rem;
  font-weight: 900;
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  text-transform: uppercase;
  backdrop-filter: blur(8px);
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}

.status-badge.live { background: rgba(16, 185, 129, 0.9); color: white; }
.status-badge.alpha { background: rgba(245, 158, 11, 0.9); color: black; }
.status-badge.archived { background: rgba(107, 114, 128, 0.9); color: white; }

/* Content Section */
.card-content {
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.project-type {
  font-size: 0.7rem;
  font-weight: 800;
  color: var(--accent);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 0.4rem;
  display: block;
}

.project-name {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--text);
  margin-bottom: 0.75rem;
  line-height: 1.2;
}

.project-desc {
  color: var(--text-sub);
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  flex-grow: 1;
}

.tech-stack {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
}

.tech-pill {
  font-size: 0.65rem;
  font-weight: 700;
  background: var(--bg-3);
  padding: 0.25rem 0.6rem;
  border-radius: 6px;
  color: var(--text-sub);
}

/* Footer Section */
.card-footer {
  border-top: 1px solid var(--border);
  padding-top: 1.5rem;
  margin-top: auto;
  display: flex;
  gap: 0.75rem;
}

.github-btn {
  background: var(--bg-3);
  color: var(--text);
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.github-btn:hover {
  background: var(--text);
  color: var(--bg);
  border-color: var(--text);
}

.case-study-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  background: var(--accent);
  color: black;
  text-decoration: none;
  font-weight: 800;
  font-size: 0.8rem;
  padding: 0 1.5rem;
  border-radius: 12px;
  transition: all 0.3s ease;
  flex-grow: 1;
  height: 50px;
  letter-spacing: 0.05em;
}

.case-study-btn:hover {
  background: var(--accent-glow);
  gap: 1.25rem;
}
</style>
