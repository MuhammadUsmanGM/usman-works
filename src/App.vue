<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import MainLayout from './components/MainLayout.vue'
import ProjectCard from './components/ProjectCard.vue'
import projectsDataRaw from './data/projects.json'
import type { Project } from './types'
import { Search } from 'lucide-vue-next'

const projectsData = projectsDataRaw as Project[]

const searchQuery = ref('')
const selectedCategory = ref('All')

onMounted(() => {
  const params = new URLSearchParams(window.location.search)
  if (params.has('q')) searchQuery.value = params.get('q') || ''
  if (params.has('cat')) selectedCategory.value = params.get('cat') || 'All'
})

watch([searchQuery, selectedCategory], ([newQ, newC]) => {
  const url = new URL(window.location.href)
  newQ ? url.searchParams.set('q', newQ) : url.searchParams.delete('q')
  newC !== 'All' ? url.searchParams.set('cat', newC) : url.searchParams.delete('cat')
  window.history.replaceState({}, '', url)
})

const allCategories = ['All', 'AI & Agents', 'Systems Engineering', 'Systems / Rust', 'High-Perf Go', 'Automation', 'Developer Tools', 'Full-Stack']

const filteredProjects = computed(() => {
  return projectsData.filter(p => {
    const query = searchQuery.value.toLowerCase()
    const matchesSearch = p.name.toLowerCase().includes(query) || 
                          p.description.toLowerCase().includes(query) ||
                          p.tech.some(t => t.toLowerCase().includes(query))
    
    const matchesCategory = selectedCategory.value === 'All' || 
                            p.categories.includes(selectedCategory.value)
                            
    return matchesCategory && matchesSearch
  })
})

</script>

<template>
  <MainLayout>
    <div v-if="$route.path === '/'">
      <div class="hero-background">
        <div class="grid-pattern"></div>
        <div class="scan-line-v"></div>
      </div>
      <!-- Your Existing Archive UI -->
      <header class="archive-header" v-motion-fade>
        <div class="vault-status-bar">
          <div class="status-item">
            <span class="label">VAULT_STATUS:</span>
            <span class="value pulse">OPERATIONAL</span>
          </div>
          <div class="status-item hide-mobile">
            <span class="label">ACTIVE_NODES:</span>
            <span class="value">{{ projectsData.length }}</span>
          </div>
          <div class="status-item hide-mobile">
            <span class="label">CORE_STACKS:</span>
            <span class="value">RUST / GO / AI / TS</span>
          </div>
          <div class="status-item">
            <span class="label">LAST_SYNC:</span>
            <span class="value">MAY_2026</span>
          </div>
        </div>

        <div class="hero-section">
          <div class="hero-badge" v-motion-slide-visible-top>SECONDARY_ENGINEERING_ARCHIVE</div>
          <h1 class="bebas premium-title">
            <span>DATA VAULT</span>
            <div class="title-shine"></div>
          </h1>
          <p class="hero-sub">Deep-dive technical artifacts, production benchmarks, and architectural patterns from systems engineering and AI agentics research.</p>
        </div>
        
        <div class="controls-wrapper">
          <div class="search-wrap">
            <div class="search-box">
              <div class="prompt-arrow">></div>
              <input v-model="searchQuery" type="text" placeholder="FILTER BY STACK, NAME OR TOOL..." class="compact-input" />
              <Search :size="14" class="search-icon" />
            </div>
          </div>
          <div class="filter-chips">
            <button 
              v-for="cat in allCategories" 
              :key="cat" 
              @click="selectedCategory = cat" 
              :class="['chip', { active: selectedCategory === cat }]"
            >
              {{ cat }}
            </button>
          </div>
        </div>
      </header>

      <div class="archive-content">
        <div v-if="filteredProjects.length === 0" class="no-results" v-motion-fade>
          <div class="empty-state">
            <p>NO DATA NODES FOUND</p>
            <button @click="searchQuery = ''; selectedCategory = 'All'" class="link-btn">RE-INITIALIZE SEARCH</button>
          </div>
        </div>

        <div class="project-gallery">
          <ProjectCard 
            v-for="(project, index) in filteredProjects" 
            :key="project.id" 
            :project="project"
            v-motion
            :initial="{ opacity: 0, y: 20 }"
            :enter="{ opacity: 1, y: 0, transition: { delay: index * 50 } }"
          />
        </div>
      </div>
    </div>
    <RouterView v-else />
  </MainLayout>
</template>

<style>
/* Refined Compact Header */
.archive-header {
  margin-bottom: 6rem;
  padding-top: 1rem;
}

.vault-status-bar {
  display: flex;
  gap: 2rem;
  padding: 0.75rem 1.25rem;
  background: var(--bg-2);
  border: 1px solid var(--border);
  border-radius: 8px;
  margin-bottom: 4rem;
  font-family: monospace;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.1em;
}

.status-item {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.status-item .label {
  color: var(--muted);
}

.status-item .value {
  color: var(--accent);
}

.pulse {
  animation: soft-pulse 2s infinite;
}

@keyframes soft-pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}

/* Hero Background Effects */
.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 800px;
  pointer-events: none;
  z-index: -1;
  overflow: hidden;
}

.grid-pattern {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(var(--border) 1px, transparent 1px),
    linear-gradient(90deg, var(--border) 1px, transparent 1px);
  background-size: 50px 50px;
  opacity: 0.05;
  mask-image: radial-gradient(circle at 50% 30%, black 20%, transparent 80%);
}

.scan-line-v {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100px;
  background: linear-gradient(to bottom, transparent, var(--accent), transparent);
  opacity: 0.03;
  animation: scan-v 8s linear infinite;
}

@keyframes scan-v {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(800px); }
}

/* Premium Title with Live Effect */
.hero-section {
  margin-bottom: 4rem;
  position: relative;
}

.hero-badge {
  display: inline-block;
  font-size: 0.6rem;
  font-weight: 900;
  color: var(--accent);
  border: 1px solid var(--accent);
  padding: 0.25rem 0.6rem;
  border-radius: 4px;
  margin-bottom: 1.5rem;
  letter-spacing: 0.2em;
}

.premium-title {
  font-size: clamp(3rem, 12vw, 7rem);
  line-height: 0.9;
  margin-bottom: 1.5rem;
  position: relative;
  display: block;
  color: var(--text);
  background: linear-gradient(
    to right,
    var(--text),
    var(--text) 40%,
    var(--accent) 50%,
    var(--text) 60%,
    var(--text)
  );
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shine 6s linear infinite;
}

@keyframes shine {
  to { background-position: 200% center; }
}

.hero-sub {
  color: var(--text-sub);
  font-size: clamp(0.9rem, 3vw, 1.1rem);
  max-width: 600px;
  line-height: 1.6;
  font-weight: 500;
}

/* Sleek Search Wrap */
.controls-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  border-left: 2px solid var(--accent);
  padding-left: 2rem;
}

.search-box {
  position: relative;
  width: 100%;
  max-width: 500px;
  display: flex;
  align-items: center;
}

.prompt-arrow {
  position: absolute;
  left: 1rem;
  color: var(--accent);
  font-family: monospace;
  font-weight: 900;
  font-size: 1rem;
}

.search-icon {
  position: absolute;
  right: 1.25rem;
  color: var(--muted);
  opacity: 0.5;
}

.compact-input {
  width: 100%;
  background: var(--bg-2);
  border: 1px solid var(--border);
  padding: 1rem 1rem 1rem 2.5rem;
  border-radius: 4px;
  color: var(--text);
  font-family: monospace;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  transition: all 0.3s ease;
}

.compact-input:focus {
  outline: none;
  border-color: var(--accent);
  background: var(--bg-3);
}

.filter-chips {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.chip {
  background: transparent;
  border: 1px solid var(--border);
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  font-size: 0.65rem;
  font-weight: 800;
  color: var(--muted);
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.chip:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.chip.active {
  background: var(--accent);
  border-color: var(--accent);
  color: black;
}

/* Gallery Restructure */
.year-block { margin-bottom: 6rem; }
.year-header { 
  display: flex; 
  align-items: center; 
  gap: 1.5rem; 
  margin-bottom: 3rem; 
  position: sticky;
  top: 0;
  z-index: 10;
  padding: 1.5rem 0;
  background: linear-gradient(to bottom, var(--bg) 80%, transparent);
}
.year-text { font-size: 3.5rem; color: var(--accent); opacity: 0.15; line-height: 1; transition: opacity 0.3s ease; }
.year-header:hover .year-text { opacity: 0.5; }
.year-line { flex-grow: 1; height: 1px; background: linear-gradient(to right, var(--border), transparent); }

.project-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 340px), 1fr));
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .layout-container { padding: 0 1rem; }
  .archive-header { margin-bottom: 4rem; }
  .vault-status-bar { gap: 1rem; padding: 0.6rem 1rem; margin-bottom: 3rem; overflow-x: auto; white-space: nowrap; }
  .hide-mobile { display: none; }
  .hero-section { margin-bottom: 2.5rem; }
  .controls-wrapper { padding-left: 1.25rem; }
  .search-box { max-width: 100%; }
}

.empty-state {
  text-align: center;
  padding: 5rem 0;
  color: var(--muted);
  font-weight: 800;
  font-size: 0.8rem;
  letter-spacing: 0.1em;
}

.link-btn {
  background: none;
  border: none;
  color: var(--accent);
  text-decoration: underline;
  cursor: pointer;
  margin-top: 1rem;
}
</style>
