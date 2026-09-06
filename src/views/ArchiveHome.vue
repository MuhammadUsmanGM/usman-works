<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import ProjectCard from '../components/ProjectCard.vue'
import projectsDataRaw from '../data/projects.json'
import type { Project } from '../types'
import { Search, X } from 'lucide-vue-next'

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

const categories = computed(() => {
  const cats = new Set(['All', 'Client Work', 'AI & Agents', 'Full-Stack', 'Systems / Rust', 'Automation', 'Developer Tools'])
  projectsData.forEach(p => {
    if (p.categories) {
      p.categories.forEach(c => cats.add(c))
    }
  })
  return Array.from(cats)
})

const filteredProjects = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()
  return projectsData.filter(p => {
    const matchesSearch = !query || 
      p.name.toLowerCase().includes(query) || 
      p.description.toLowerCase().includes(query) ||
      p.tech.some(t => t.toLowerCase().includes(query)) ||
      (p.type && p.type.toLowerCase().includes(query)) ||
      (p.highlight && p.highlight.toLowerCase().includes(query))

    const matchesCategory = selectedCategory.value === 'All' || 
      (p.categories && p.categories.includes(selectedCategory.value)) ||
      p.tech.includes(selectedCategory.value)

    return matchesSearch && matchesCategory
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

const resetFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = 'All'
}
</script>

<template>
  <div class="archive-view">
    <!-- Header & Hero Section -->
    <header class="archive-header" v-motion-fade>
      <div class="header-badge-row">
        <span class="meta-badge">PROJECT ARCHIVE</span>
        <span class="count-pill">{{ filteredProjects.length }} Projects</span>
      </div>

      <div class="hero-content">
        <h1 class="bebas main-title">PROJECTS & LABS</h1>
        <p class="hero-sub">Curated archive of production client work, open-source tools, and software engineered by Usman.</p>
      </div>
      
      <!-- Sleek Search & Filters Bar -->
      <div class="filter-controls">
        <div class="search-box">
          <Search :size="16" class="search-icon" />
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Search by project name, tech stack, or topic..." 
            class="search-input" 
          />
          <button v-if="searchQuery" @click="searchQuery = ''" class="clear-search-btn" title="Clear search">
            <X :size="14" />
          </button>
        </div>

        <div class="filter-chips">
          <button 
            v-for="cat in categories" 
            :key="cat" 
            @click="selectedCategory = cat" 
            :class="['chip', { active: selectedCategory === cat }]"
          >
            {{ cat }}
          </button>
        </div>
      </div>
    </header>

    <!-- Projects Gallery -->
    <main class="archive-content">
      <div v-if="filteredProjects.length === 0" class="no-results" v-motion-fade>
        <div class="empty-state">
          <p class="empty-title">NO MATCHING PROJECTS FOUND</p>
          <p class="empty-sub">Try adjusting your search terms or filter selection.</p>
          <button @click="resetFilters" class="reset-btn">Reset Filters</button>
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
            :initial="{ opacity: 0, y: 16 }"
            :enter="{ opacity: 1, y: 0, transition: { delay: index * 40 } }"
          />
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.archive-view {
  padding: 0.75rem 0 3rem;
}

.archive-header {
  margin-bottom: 3rem;
}

.header-badge-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}

.meta-badge {
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--accent);
  border: 1px solid var(--accent);
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
  letter-spacing: 0.1em;
}

.count-pill {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--muted);
  background: var(--bg-2);
  border: 1px solid var(--border);
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
}

.main-title {
  font-size: clamp(2.5rem, 8vw, 4.5rem);
  line-height: 1;
  margin-bottom: 0.75rem;
  color: var(--text);
  letter-spacing: 0.02em;
}

.hero-sub {
  color: var(--text-sub);
  font-size: clamp(0.95rem, 2.5vw, 1.1rem);
  max-width: 620px;
  line-height: 1.5;
  margin-bottom: 2rem;
}

/* Modern Filter Controls Layout */
.filter-controls {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: var(--bg-2);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1.25rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.search-box {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 1rem;
  color: var(--muted);
  pointer-events: none;
}

.search-input {
  width: 100%;
  background: var(--bg);
  border: 1px solid var(--border);
  padding: 0.75rem 2.5rem 0.75rem 2.5rem;
  border-radius: 8px;
  color: var(--text);
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 2px rgba(var(--accent-rgb, 59, 130, 246), 0.15);
}

.clear-search-btn {
  position: absolute;
  right: 0.75rem;
  background: none;
  border: none;
  color: var(--muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  border-radius: 50%;
  transition: color 0.2s ease;
}

.clear-search-btn:hover {
  color: var(--text);
}

.filter-chips {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.chip {
  background: var(--bg);
  border: 1px solid var(--border);
  padding: 0.4rem 0.85rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-sub);
  cursor: pointer;
  transition: all 0.2s ease;
}

.chip:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.chip.active {
  background: var(--accent);
  border-color: var(--accent);
  color: #000;
}

/* Gallery & Year Blocks */
.year-block {
  margin-bottom: 4rem;
}

.year-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.year-text {
  font-size: 2.5rem;
  color: var(--accent);
  opacity: 0.3;
  line-height: 1;
}

.year-line {
  flex-grow: 1;
  height: 1px;
  background: var(--border);
}

.project-gallery {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
}

@media (max-width: 1024px) {
  .project-gallery {
    grid-template-columns: repeat(3, 1fr);
    gap: 0.85rem;
  }
}

@media (max-width: 768px) {
  .project-gallery {
    grid-template-columns: repeat(3, 1fr);
    gap: 0.65rem;
  }
}

@media (max-width: 480px) {
  .project-gallery {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
  }
}

.empty-state {
  text-align: center;
  padding: 4rem 1rem;
  background: var(--bg-2);
  border: 1px dashed var(--border);
  border-radius: 12px;
}

.empty-title {
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--text);
  margin-bottom: 0.5rem;
}

.empty-sub {
  font-size: 0.85rem;
  color: var(--muted);
  margin-bottom: 1.25rem;
}

.reset-btn {
  background: var(--accent);
  color: #000;
  border: none;
  padding: 0.5rem 1.25rem;
  border-radius: 6px;
  font-weight: 700;
  font-size: 0.8rem;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.reset-btn:hover {
  opacity: 0.9;
}
</style>
