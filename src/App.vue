<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import MainLayout from './components/MainLayout.vue'
import ProjectCard from './components/ProjectCard.vue'
import projectsData from './data/projects.json'
import { Search, X } from 'lucide-vue-next'

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
      <div class="header-top">
        <div class="status-pill">
          <span class="dot"></span>
          Vault : {{ filteredProjects.length }} Result(s)
        </div>
        <button v-if="searchQuery || selectedTech !== 'All'" @click="searchQuery = ''; selectedTech = 'All'" class="clear-btn">
          <X :size="14" /> CLEAR FILTERS
        </button>
      </div>

      <h1 class="bebas main-title">PROJ<span class="accent-text">ECTS</span></h1>
      
      <div class="filter-bar">
        <div class="search-input-wrapper">
          <Search :size="18" class="search-icon" />
          <input v-model="searchQuery" type="text" placeholder="Search the collection..." class="search-input" />
        </div>
        <div class="tech-filter-chips">
          <button v-for="tech in allTech" :key="tech" @click="selectedTech = tech" :class="['filter-chip', { active: selectedTech === tech }]">
            {{ tech }}
          </button>
        </div>
      </div>
    </header>

    <div class="archive-content">
      <div v-if="filteredProjects.length === 0" class="no-results">
        No records matching your parameters.
      </div>

      <div v-for="[year, projects] in groupedProjects" :key="year" class="year-group">
        <div class="year-divider">
          <span class="year-label bebas">{{ year }}</span>
          <div class="divider-line"></div>
        </div>

        <div class="project-grid">
          <ProjectCard 
            v-for="(project, index) in projects" 
            :key="project.id" 
            :project="project"
            v-motion
            :initial="{ opacity: 0, y: 15 }"
            :enter="{ opacity: 1, y: 0, transition: { delay: index * 40 } }"
          />
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<style>
/* Simplified Main CSS after component abstraction */
.header-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
.clear-btn { background: none; border: none; color: var(--muted); font-size: 0.7rem; font-weight: 800; display: flex; align-items: center; gap: 0.4rem; cursor: pointer; letter-spacing: 0.1em; padding: 0.5rem; border-radius: 6px; }
.clear-btn:hover { color: var(--accent); background: var(--bg-2); }

.filter-bar { margin: 2rem 0 4rem; display: flex; flex-direction: column; gap: 1.5rem; }
.search-input-wrapper { position: relative; max-width: 600px; }
.search-icon { position: absolute; left: 1.25rem; top: 50%; transform: translateY(-50%); color: var(--muted); opacity: 0.5; }
.search-input { width: 100%; background: var(--bg-2); border: 1px solid var(--border); padding: 1.1rem 1.1rem 1.1rem 3.5rem; border-radius: 12px; color: var(--text); font-size: 1rem; transition: all 0.3s ease; }
.search-input:focus { outline: none; border-color: var(--accent); background: var(--bg); box-shadow: 0 0 0 4px rgba(245, 166, 35, 0.1); }

.tech-filter-chips { display: flex; gap: 0.6rem; flex-wrap: wrap; }
.filter-chip { background: var(--bg-2); border: 1px solid var(--border); padding: 0.5rem 1.2rem; border-radius: 100px; font-size: 0.75rem; font-weight: 700; color: var(--text-sub); cursor: pointer; transition: 0.2s; text-transform: uppercase; }
.filter-chip.active { background: var(--accent); border-color: var(--accent); color: black; }

.year-divider { display: flex; align-items: center; gap: 2rem; margin-bottom: 2.5rem; }
.year-label { font-size: 4rem; color: var(--accent); opacity: 0.15; }
.divider-line { flex-grow: 1; height: 1px; background: linear-gradient(to right, var(--border), transparent); }

.project-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 1.5rem; margin-bottom: 5rem; }
.no-results { text-align: center; padding: 6rem; color: var(--muted); border: 1px dashed var(--border); border-radius: 24px; }
</style>
