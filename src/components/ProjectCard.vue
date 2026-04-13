<script setup lang="ts">
import { ExternalLink } from 'lucide-vue-next'

defineProps<{
  project: {
    id: string
    name: string
    description: string
    tech: string[]
    type: string
    status: string
    link: string
  }
}>()
</script>

<template>
  <div class="project-item">
    <div class="project-header">
      <h3 class="project-name">{{ project.name }}</h3>
      <div class="project-badges">
        <span :class="['status-badge', project.status.toLowerCase()]">{{ project.status }}</span>
        <span class="type-badge">{{ project.type }}</span>
      </div>
    </div>
    <p class="project-description">{{ project.description }}</p>
    <div class="project-footer">
      <div class="project-tech">
        <span v-for="t in project.tech" :key="t" class="tech-tag">#{{ t }}</span>
      </div>
      <a :href="project.link" target="_blank" class="project-link">
        <span>VIEW LINK</span>
        <ExternalLink :size="14" />
      </a>
    </div>
  </div>
</template>

<style scoped>
.project-item {
  background: var(--bg-2);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 2rem;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  height: 100%;
}

.project-item:hover {
  border-color: var(--accent);
  transform: translateY(-8px);
  background: var(--bg);
  box-shadow: 0 20px 40px -20px rgba(0, 0, 0, 0.2);
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.25rem;
}

.project-name {
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--text);
  letter-spacing: -0.02em;
}

.project-badges {
  display: flex;
  gap: 0.5rem;
}

.status-badge {
  font-size: 0.6rem;
  font-weight: 900;
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
  text-transform: uppercase;
}

.status-badge.live { background: #10b98120; color: #10b981; }
.status-badge.alpha { background: #f59e0b20; color: #f59e0b; }
.status-badge.archived { background: #6b728020; color: #6b7280; }

.type-badge {
  font-size: 0.6rem;
  font-weight: 800;
  color: var(--muted);
  border: 1px solid var(--border);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  text-transform: uppercase;
}

.project-description {
  color: var(--text-sub);
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 2.5rem;
  flex-grow: 1;
}

.project-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tech-tag {
  font-size: 0.7rem;
  color: var(--muted);
  font-weight: 700;
  margin-right: 0.75rem;
}

.project-link {
  color: var(--accent);
  font-weight: 800;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
}
</style>
