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
    <header class="archive-header" v-motion-fade>
      <!-- Premium Status Ribbon -->
      <div class="header-ribbon">
        <div class="system-index">
          <LayoutGrid :size="14" />
          <span class="index-label">PROJECT_INDEX</span>
          <span class="index-count">[{{ filteredProjects.length < 10 ? '0' + filteredProjects.length : filteredProjects.length }}]</span>
        </div>
        <div class="action-zone">
          <button v-if="searchQuery || selectedTech !== 'All'" @click="searchQuery = ''; selectedTech = 'All'" class="reset-link">
            // RESET_FILTERS
          </button>
        </div>
      </div>

      <!-- Main Brutalist Title -->
      <div class="hero-title-wrap">
        <h1 class="bebas hero-title">PROJ<span class="accent-text">ECTS</span></h1>
        <div class="hero-serial">CATALOG_2024_UMA</div>
      </div>
      
      <!-- Integrated Search -->
      <div class="search-command-center">
        <div class="search-field">
          <Search :size="20" class="search-icon" />
          <input v-model="searchQuery" type="text" placeholder="TYPE TO SEARCH THE VAULT..." class="command-input" />
        </div>
        <div class="tech-navigator">
          <button 
            v-for="tech in allTech" 
            :key="tech" 
            @click="selectedTech = tech" 
            :class="['nav-chip', { active: selectedTech === tech }]"
          >
            {{ tech }}
          </button>
        </div>
      </div>
    </header>

    <div class="archive-content">
      <div v-if="filteredProjects.length === 0" class="no-results" v-motion-slide-bottom>
        <div class="empty-state">
          <X :size="40" stroke-width="1" />
          <p>NO MATCHES FOUND IN DATABASE</p>
          <button @click="searchQuery = ''; selectedTech = 'All'" class="cta-link">Clear Parameters</button>
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
            :initial="{ opacity: 0, y: 30 }"
            :enter="{ opacity: 1, y: 0, transition: { delay: index * 60, duration: 800 } }"
          />
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<style>
/* New Premium Header Logic */
.archive-header {
  margin-bottom: 6rem;
}

.header-ribbon {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.5rem;
}

.system-index {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 900;
  font-size: 0.7rem;
  letter-spacing: 0.15em;
  color: var(--muted);
}

.index-label {
  color: var(--text-sub);
}

.index-count {
  color: var(--accent);
}

.reset-link {
  background: none;
  border: none;
  color: var(--accent);
  font-family: monospace;
  font-size: 0.7rem;
  font-weight: 700;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.reset-link:hover { opacity: 1; }

.hero-title-wrap {
  position: relative;
  margin-bottom: 4rem;
}

.hero-title {
  font-size: clamp(4rem, 15vw, 9rem);
  line-height: 0.8;
  letter-spacing: -0.01em;
  margin-left: -5px;
}

.hero-serial {
  position: absolute;
  bottom: 0px;
  right: 0px;
  font-family: monospace;
  font-size: 0.65rem;
  color: var(--muted);
  writing-mode: vertical-rl;
  opacity: 0.4;
  letter-spacing: 0.2em;
}

/* Command Center */
.search-command-center {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.search-field {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  color: var(--accent);
}

.command-input {
  width: 100%;
  background: transparent;
  border: none;
  border-bottom: 1px solid var(--border);
  padding: 1.5rem 0 1.5rem 3rem;
  font-family: 'Bebas Neue', sans-serif;
  font-size: 1.8rem;
  letter-spacing: 0.05em;
  color: var(--text);
  transition: all 0.3s ease;
}

.command-input:focus {
  outline: none;
  border-color: var(--accent);
  padding-left: 3.5rem;
}

.tech-navigator {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.nav-chip {
  background: var(--bg-2);
  border: 1px solid var(--border);
  padding: 0.5rem 1.25rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 800;
  color: var(--text-sub);
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
}

.nav-chip:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.nav-chip.active {
  background: var(--accent);
  border-color: var(--accent);
  color: black;
}

/* Gallery Restructure */
.year-block { 
  margin-bottom: 8rem; 
}

.year-header { 
  display: flex; 
  align-items: center; 
  gap: 2rem; 
  margin-bottom: 3.5rem; 
  position: sticky;
  top: 0;
  z-index: 10;
  padding: 2rem 0;
  background: linear-gradient(to bottom, var(--bg) 80%, transparent);
}

.year-text { 
  font-size: 5rem; 
  color: var(--accent); 
  opacity: 0.2; 
  line-height: 1; 
  transition: opacity 0.3s ease;
}

.year-header:hover .year-text {
  opacity: 0.6;
}

.year-line { flex-grow: 1; height: 1px; background: linear-gradient(to right, var(--border), transparent); }

.project-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 2.5rem;
}

/* No Results state */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8rem 0;
  gap: 1.5rem;
  color: var(--muted);
  border: 1px dashed var(--border);
  border-radius: 32px;
}

.empty-state p { font-weight: 900; letter-spacing: 0.1em; font-size: 0.9rem; }
.cta-link { background: none; border-bottom: 1px solid var(--accent); color: var(--accent); cursor: pointer; font-weight: 800; }
</style>
