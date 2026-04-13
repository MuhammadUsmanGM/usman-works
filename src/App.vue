<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import MainLayout from './components/MainLayout.vue'
import ProjectCard from './components/ProjectCard.vue'
import projectsData from './data/projects.json'
import { Search, X, LayoutGrid } from 'lucide-vue-next'

const searchQuery = ref('')
const selectedTech = ref('All')

onMounted(() => {
  const params = new URLSearchParams(window.location.search)
  if (params.has('q')) searchQuery.value = params.get('q') || ''
  if (params.has('tech')) selectedTech.value = params.get('tech') || 'All'
})

watch([searchQuery, selectedTech], ([newQ, newT]) => {
  const url = new URL(window.location.href)
  newQ ? url.searchParams.set('q', newQ) : url.searchParams.delete('q')
  newT !== 'All' ? url.searchParams.set('tech', newT) : url.searchParams.delete('tech')
  window.history.replaceState({}, '', url)
})

const allTech = computed(() => {
  const tags = new Set(['All'])
  projectsData.forEach(p => p.tech.forEach(t => tags.add(t)))
  return Array.from(tags)
})

const filteredProjects = computed(() => {
  return projectsData.filter(p => {
    const query = searchQuery.value.toLowerCase()
    const matchesSearch = p.name.toLowerCase().includes(query) || 
                          p.description.toLowerCase().includes(query) ||
                          p.tech.some(t => t.toLowerCase().includes(query))
    return (selectedTech.value === 'All' || p.tech.includes(selectedTech.value)) && matchesSearch
  })
})

const groupedProjects = computed(() => {
  const groups: Record<string, typeof projectsData> = {}
  filteredProjects.value.forEach(p => {
    if (!groups[p.year]) groups[p.year] = []
    groups[p.year].push(p)
  })
  return Object.entries(groups).sort((a, b) => Number(b[0]) - Number(a[0]))
})
</script>

<template>
  <MainLayout>
    <div v-if="$route.path === '/'">
      <!-- Your Existing Archive UI -->
      <header class="archive-header" v-motion-fade>
        <div class="header-meta">
          <div class="index-status">
            <span class="status-icon"></span>
            <span class="label">VAULT_RECORDS:</span>
            <span class="value">[{{ filteredProjects.length }}]</span>
          </div>
          <button v-if="searchQuery || selectedTech !== 'All'" @click="searchQuery = ''; selectedTech = 'All'" class="reset-btn">
            RESET_VIEW
          </button>
        </div>

        <div class="hero-section">
          <h1 class="bebas premium-title">
            <span>PROJECTS</span>
            <div class="title-shine"></div>
          </h1>
          <p class="hero-sub">Selected engineering works and technical artifacts from 2021—Present.</p>
        </div>
        
        <div class="search-wrap">
          <div class="search-box">
            <Search :size="16" class="search-icon" />
            <input v-model="searchQuery" type="text" placeholder="FILTER BY STACK OR NAME..." class="compact-input" />
          </div>
          <div class="filter-chips">
            <button 
              v-for="tech in allTech" 
              :key="tech" 
              @click="selectedTech = tech" 
              :class="['chip', { active: selectedTech === tech }]"
            >
              {{ tech }}
            </button>
          </div>
        </div>
      </header>

      <div class="archive-content">
        <div v-if="filteredProjects.length === 0" class="no-results" v-motion-fade>
          <div class="empty-state">
            <p>NO DATA NODES FOUND</p>
            <button @click="searchQuery = ''; selectedTech = 'All'" class="link-btn">RE-INITIALIZE SEARCH</button>
          </div>
        </div>

        <div v-for="[year, projects] in groupedProjects" :key="year" class="year-block">
          <div class="year-header">
            <span class="year-text bebas">{{ year }}</span>
            <div class="year-line"></div>
          </div>

          <div class="project-gallery">
            <ProjectCard 
              v-for="(project, index) in projects" 
              :key="project.id" 
              :project="project"
              v-motion
              :initial="{ opacity: 0, y: 20 }"
              :enter="{ opacity: 1, y: 0, transition: { delay: index * 50 } }"
            />
          </div>
        </div>
      </div>
    </div>
    <RouterView v-else />
  </MainLayout>
</template>

<style>
/* Refined Compact Header */
.archive-header {
  margin-bottom: 5rem;
  padding-top: 1rem;
}

.header-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.index-status {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-family: monospace;
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--muted);
  letter-spacing: 0.1em;
}

.status-icon {
  width: 6px;
  height: 6px;
  background: var(--accent);
  border-radius: 50%;
  box-shadow: 0 0 8px var(--accent);
}

.value { color: var(--accent); }

.reset-btn {
  background: none;
  border: 1px solid var(--border);
  color: var(--text-sub);
  font-family: monospace;
  font-size: 0.65rem;
  padding: 0.25rem 0.6rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.reset-btn:hover {
  background: var(--accent);
  border-color: var(--accent);
  color: black;
}

/* Premium Title with Live Effect */
.hero-section {
  margin-bottom: 3rem;
}

.premium-title {
  font-size: clamp(3rem, 10vw, 5.5rem);
  line-height: 1;
  margin-bottom: 0.75rem;
  position: relative;
  display: inline-block;
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
  color: var(--muted);
  font-size: 0.95rem;
  max-width: 450px;
  line-height: 1.5;
}

/* Sleek Search Wrap */
.search-wrap {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.search-box {
  position: relative;
  max-width: 400px;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--accent);
  opacity: 0.6;
}

.compact-input {
  width: 100%;
  background: var(--bg-2);
  border: 1px solid var(--border);
  padding: 0.85rem 1rem 0.85rem 2.75rem;
  border-radius: 10px;
  color: var(--text);
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  transition: all 0.3s ease;
}

.compact-input:focus {
  outline: none;
  border-color: var(--accent);
  background: var(--bg);
  box-shadow: 0 0 0 4px rgba(245, 166, 35, 0.08);
}

.filter-chips {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.chip {
  background: transparent;
  border: 1px solid var(--border);
  padding: 0.4rem 0.9rem;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 800;
  color: var(--muted);
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
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
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 2.5rem;
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
