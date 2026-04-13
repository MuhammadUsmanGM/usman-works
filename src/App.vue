<script setup lang="ts">
import MainLayout from './components/MainLayout.vue'
import projects from './data/projects.json'
import { ExternalLink, Github, Terminal } from 'lucide-vue-next'
import { Motion } from 'motion/vue'

const getTechVariant = (index: number) => ({
  initial: { opacity: 0, y: 10 },
  enter: { 
    opacity: 1, 
    y: 0, 
    transition: { delay: index * 0.05, duration: 0.4 } 
  }
})
</script>

<template>
  <MainLayout>
    <!-- Header Section -->
    <header class="archive-header">
      <Motion 
        :initial="{ opacity: 0, y: 20 }" 
        :enter="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.6 }"
      >
        <div class="status-pill">
          <span class="dot"></span>
          ACTIVE REGISTRY
        </div>
        <h1 class="bebas main-title">PROJECT <span class="accent-text">ARCHIVE</span></h1>
        <p class="subtitle">An exhaustive list of everything I've built, from production SaaS to weekend experiments.</p>
      </Motion>
    </header>

    <!-- Project Table -->
    <div class="archive-table-container">
      <table class="archive-table">
        <thead>
          <tr>
            <th class="col-year">Year</th>
            <th class="col-project">Project</th>
            <th class="col-made">Made at</th>
            <th class="col-tech hide-mobile">Built with</th>
            <th class="col-link">Link</th>
          </tr>
        </thead>
        <tbody>
          <Motion 
            v-for="(project, index) in projects" 
            :key="project.id"
            tag="tr"
            class="project-row"
            :initial="{ opacity: 0, x: -10 }"
            :enter="{ opacity: 1, x: 0 }"
            :transition="{ delay: index * 0.1, duration: 0.5 }"
          >
            <td class="cell-year">{{ project.year }}</td>
            <td class="cell-project">
              <div class="project-info">
                <span class="project-name">{{ project.name }}</span>
                <span class="project-desc hide-mobile">— {{ project.description }}</span>
              </div>
            </td>
            <td class="cell-made">{{ project.type }}</td>
            <td class="cell-tech hide-mobile">
              <div class="tech-pills">
                <span v-for="t in project.tech" :key="t">{{ t }}</span>
              </div>
            </td>
            <td class="cell-link">
              <a :href="project.link" target="_blank" class="action-btn">
                <ExternalLink :size="16" />
              </a>
            </td>
          </Motion>
        </tbody>
      </table>
    </div>
  </MainLayout>
</template>

<style>
/* Header refinements */
.archive-header {
  margin-bottom: 5rem;
  padding-top: 2rem;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  color: var(--accent);
  border: 1px solid var(--border);
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  margin-bottom: 1.5rem;
}

.dot {
  width: 6px;
  height: 6px;
  background: var(--accent);
  border-radius: 50%;
  box-shadow: 0 0 10px var(--accent);
}

.main-title {
  font-size: clamp(3.5rem, 12vw, 7rem);
  line-height: 0.85;
  margin-bottom: 1.5rem;
}

.subtitle {
  color: var(--text-sub);
  max-width: 600px;
  font-size: 1.1rem;
  line-height: 1.6;
}

/* Table Styles */
.archive-table-container {
  width: 100%;
  overflow-x: auto;
}

.archive-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

th {
  padding: 1rem;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--muted);
  border-bottom: 1px solid var(--border);
}

td {
  padding: 1.25rem 1rem;
  border-bottom: 1px solid var(--border);
  vertical-align: middle;
}

.project-row {
  transition: background-color 0.2s ease;
}

.project-row:hover {
  background-color: var(--bg-2);
}

.cell-year {
  font-family: monospace;
  color: var(--muted);
}

.project-name {
  font-weight: 700;
  color: var(--text);
  font-size: 1.05rem;
}

.project-desc {
  font-size: 0.9rem;
  color: var(--text-sub);
  margin-left: 0.5rem;
}

.cell-made {
  font-size: 0.85rem;
  color: var(--text-sub);
}

.tech-pills {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.tech-pills span {
  font-size: 0.65rem;
  padding: 0.15rem 0.5rem;
  background: var(--bg-3);
  border-radius: 4px;
  color: var(--text-sub);
  font-weight: 600;
}

.action-btn {
  color: var(--text-sub);
  transition: color 0.2s ease, transform 0.2s ease;
  display: inline-block;
}

.action-btn:hover {
  color: var(--accent);
  transform: translateY(-2px);
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .hide-mobile {
    display: none;
  }
  
  .main-title {
    font-size: 4rem;
  }
  
  td, th {
    padding: 0.75rem 0.5rem;
  }
}
</style>
