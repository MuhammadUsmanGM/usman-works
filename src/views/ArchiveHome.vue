<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import ProjectCard from '../components/ProjectCard.vue'
import projectsDataRaw from '../data/projects.json'
import type { Project } from '../types'
import { Search } from 'lucide-vue-next'

const projectsData = projectsDataRaw as Project[]

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
  <div>
    <header class="archive-header" v-motion-fade>
      <!-- Top Meta Bar -->
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

      <!-- Compact Hero -->
      <div class="hero-section">
        <h1 class="bebas premium-title">
          <span>PROJECTS</span>
          <div class="title-shine"></div>
        </h1>
        <p class="hero-sub">Selected engineering works and technical artifacts from 2021—Present.</p>
      </div>
      
      <!-- Sleek Search Navigation -->
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
</template>
