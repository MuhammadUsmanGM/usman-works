<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import projectsDataRaw from '../data/projects.json'
import type { Project } from '../types'
import { 
  ArrowLeft, Github, Database, Zap, Cpu, 
  ShieldCheck, Activity, Code2, Link as LinkIcon, Layers,
  Library, CheckCircle
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

const projectsData = projectsDataRaw as Project[]

const project = computed(() => {
  return projectsData.find(p => p.id === route.params.id)
})

const copied = ref(false)
const selectedTab = ref(0)

// Reset tab when navigating between projects
watch(() => route.params.id, () => {
  selectedTab.value = 0
})

const copyCommand = (cmd: string) => {
  navigator.clipboard.writeText(cmd)
  copied.value = true
  setTimeout(() => copied.value = false, 2000)
}

const goBack = () => router.push('/')

// Icon mapping system
const iconMap: Record<string, any> = {
  Database, Zap, Cpu, ShieldCheck, Activity, Code2, Layers, Library, CheckCircle
}
</script>

<template>
  <div v-if="project" class="project-detail-view">
    <!-- Back Button -->
    <button @click="goBack" class="back-nav-btn group" v-motion-fade>
      <ArrowLeft :size="16" class="arrow-ico" />
      <span>BACK TO VAULT</span>
    </button>

    <header class="detail-header" v-motion-slide-top>
      <div class="header-meta-tags">
        <span class="meta-tag blue">{{ project.type }}</span>
        <span class="meta-tag mono">TECHNICAL STUDY</span>
      </div>
      
      <h1 class="bebas detail-title">
        {{ project.name }}<span class="accent-text">.</span>
        <div class="title-shine"></div>
      </h1>
      
      <p class="detail-subtitle">{{ project.description }}</p>

      <div class="header-actions">
        <a v-if="project.github !== '#'" :href="project.github" target="_blank" class="action-link primary">
          SOURCE CODE <Github :size="16" />
        </a>
        <a 
          v-for="link in project.links" 
          :key="link.url" 
          :href="link.url" 
          target="_blank" 
          class="action-link border"
        >
          {{ link.label }} <LinkIcon :size="16" />
        </a>
      </div>

      <!-- Multi-Command Install Block (for projects like FerrumDB) -->
      <div v-if="project.installCommands" class="multi-install-wrap" v-motion-fade>
        <div v-for="cmd in project.installCommands" :key="cmd.label" class="terminal-frame mini">
          <div class="terminal-header">
            <div class="dots-group">
              <div class="dots"><span></span><span></span><span></span></div>
              <span class="platform-label">{{ cmd.label }}</span>
            </div>
          </div>
          <div class="command-body">
            <span class="prompt">$</span>
            <code>{{ cmd.command }}</code>
            <button @click="copyCommand(cmd.command)" class="copy-btn">
              <span v-if="copied">COPIED!</span>
              <span v-else>COPY</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Single Command Install Block (for CodeLens/ELYX) -->
      <div v-else-if="project.installCommand" class="install-command-wrap" v-motion-fade>
        <div class="terminal-frame">
          <div class="terminal-header">
            <div class="dots"><span></span><span></span><span></span></div>
            <span class="terminal-title">SHELL_ACCESS</span>
          </div>
          <div class="command-body">
            <span class="prompt">$</span>
            <code>{{ project.installCommand }}</code>
            <button @click="copyCommand(project.installCommand)" class="copy-btn">
              <span v-if="copied">COPIED!</span>
              <span v-else>COPY</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Benchmarks Grid -->
    <section class="benchmarks-grid" v-motion-slide-visible-bottom>
      <div v-for="bench in project.benchmarks" :key="bench.label" class="bench-item">
        <span class="bench-value bebas">{{ bench.value }}</span>
        <span class="bench-label">{{ bench.label }}</span>
        <span class="bench-detail">{{ bench.detail }}</span>
      </div>
    </section>

    <!-- Technical Sections -->
    <div class="technical-deep-dive">
      <div v-for="(section, i) in project.sections" :key="section.title" class="tech-section" v-motion-fade-visible>
        <div class="section-sidebar">
          <div class="icon-wrap">
            <component :is="iconMap[section.icon] || Code2" :size="24" />
          </div>
          <h2 class="bebas section-title">{{ section.title }}</h2>
        </div>
        <div class="section-body">
          <p>{{ section.content }}</p>
        </div>
      </div>
    </div>

    <!-- The Hard Truths (Learnings) -->
    <section class="learnings-section" v-motion-fade-visible>
      <h2 class="bebas learning-title">THE HARD <span class="accent-text">TRUTHS</span></h2>
      <div class="learning-grid">
        <div v-for="(learning, i) in project.learnings" :key="i" class="learning-card">
          <div class="card-num">0{{ i + 1 }}</div>
          <p>{{ learning }}</p>
        </div>
      </div>
    </section>

    <!-- Footer CTA -->
    <footer class="detail-footer" v-motion-fade>
      <a :href="project.github" target="_blank" class="footer-cta-block">
        <div class="cta-icon-wrap">
          <Code2 :size="32" />
        </div>
        <span class="bebas">VIEW TECHNICAL IMPLEMENTATION ON GITHUB</span>
      </a>
    </footer>
  </div>
</template>

<style scoped>
.project-detail-view {
  padding-bottom: 10rem;
}

/* Back Button */
.back-nav-btn {
  background: none;
  border: none;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--muted);
  font-weight: 900;
  font-size: 0.7rem;
  letter-spacing: 0.15em;
  cursor: pointer;
  margin-bottom: 4rem;
  transition: color 0.3s ease;
}

.back-nav-btn:hover { color: var(--accent); }
.arrow-ico { transition: transform 0.3s ease; }
.back-nav-btn:hover .arrow-ico { transform: translateX(-5px); }

/* Header Styles */
.detail-header { margin-bottom: 6rem; }
.header-meta-tags { display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; }
.meta-tag { font-size: 0.65rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; }
.meta-tag.blue { background: rgba(245, 166, 35, 0.1); color: var(--accent); padding: 0.3rem 0.8rem; border-radius: 4px; border: 1px solid rgba(245, 166, 35, 0.2); }
.meta-tag.mono { color: var(--muted); font-family: monospace; }

.detail-title {
  font-size: clamp(4rem, 15vw, 8rem);
  line-height: 0.85;
  margin-bottom: 2.5rem;
  position: relative;
  display: inline-block;
  background: linear-gradient(to right, var(--text), var(--text) 40%, var(--accent) 50%, var(--text) 60%, var(--text));
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shine 6s linear infinite;
}

.detail-subtitle { font-size: 1.4rem; color: var(--text-sub); max-width: 700px; line-height: 1.5; }

.header-actions { display: flex; gap: 1rem; margin-top: 3rem; }
.action-link { display: flex; align-items: center; gap: 0.75rem; padding: 1.25rem 2rem; border-radius: 100px; font-weight: 900; font-size: 0.75rem; text-decoration: none; transition: all 0.3s ease; }
.action-link.primary { background: var(--accent); color: black; box-shadow: 0 10px 30px rgba(245, 166, 35, 0.2); }
.action-link.border { border: 1px solid var(--border); color: var(--text); }
.action-link:hover { transform: translateY(-5px); }

/* Benchmarks */
.benchmarks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 8rem;
}

.bench-item {
  background: var(--bg-2);
  border: 1px solid var(--border);
  padding: 2rem;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: border-color 0.3s ease;
}

.bench-item:hover { border-color: var(--accent); }
.bench-value { font-size: 3rem; color: var(--accent); line-height: 1; margin-bottom: 0.5rem; }
.bench-label { font-size: 0.7rem; font-weight: 900; color: var(--text); text-transform: uppercase; letter-spacing: 0.1em; }
.bench-detail { font-size: 0.65rem; color: var(--muted); margin-top: 0.5rem; text-transform: uppercase; }

/* Tech Deep Dive */
.technical-deep-dive { margin-bottom: 10rem; }
.tech-section { display: grid; grid-template-columns: 1fr 2fr; gap: 4rem; margin-bottom: 10rem; }

.section-sidebar { display: flex; align-items: center; gap: 1.5rem; }
.icon-wrap { width: 48px; height: 48px; background: rgba(245, 166, 35, 0.1); border: 1px solid rgba(245, 166, 35, 0.2); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: var(--accent); }
.section-title { font-size: 2.5rem; line-height: 1; }
.section-body p { font-size: 1.25rem; color: var(--text-sub); line-height: 1.7; font-style: italic; background: var(--bg-2); padding: 2.5rem; border-radius: 24px; border: 1px solid var(--border); white-space: pre-line; }

/* Learnings */
.learning-title { font-size: 4rem; margin-bottom: 4rem; }
.learning-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; }
.learning-card { position: relative; padding-top: 2rem; border-top: 1px solid var(--border); }
.card-num { font-size: 0.7rem; font-weight: 950; color: var(--accent); margin-bottom: 1rem; }
.learning-card p { font-size: 1.1rem; color: var(--text-sub); line-height: 1.6; }

/* Footer */
.detail-footer { margin-top: 10rem; text-align: center; }
.footer-cta-block { display: inline-flex; flex-direction: column; align-items: center; gap: 1.5rem; text-decoration: none; color: var(--muted); transition: all 0.3s ease; }
.cta-icon-wrap { width: 80px; height: 80px; border: 1px solid var(--border); border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease; }
.footer-cta-block:hover { color: var(--accent); }
.footer-cta-block:hover .cta-icon-wrap { border-color: var(--accent); transform: scale(1.1); }
.footer-cta-block span { font-size: 1.25rem; letter-spacing: 0.1em; }

/* Install Command Section */
.install-command-wrap {
  margin-top: 3.5rem;
  max-width: 600px;
}

.terminal-frame {
  background: #0d0d12;
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0,0,0,0.3);
}

.terminal-header {
  background: #16161e;
  padding: 0.75rem 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border);
}

.dots-group {
  display: flex;
  align-items: center;
  gap: 2rem;
}

/* Multi-Install Stack */
.multi-install-wrap {
  margin-top: 3.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 600px;
}

.terminal-frame.mini {
  background: #0d0d12;
  border-radius: 10px;
}

.platform-label {
  font-family: monospace;
  font-size: 0.65rem;
  font-weight: 800;
  color: var(--accent);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.terminal-header .dots {
  display: flex;
  gap: 6px;
}

.terminal-header .dots span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #333;
}

.terminal-header .dots span:nth-child(1) { background: #ff5f56; }
.terminal-header .dots span:nth-child(2) { background: #ffbd2e; }
.terminal-header .dots span:nth-child(3) { background: #27c93f; }

.terminal-title {
  font-family: monospace;
  font-size: 0.65rem;
  font-weight: 700;
  color: var(--muted);
  letter-spacing: 0.1em;
}

.command-body {
  padding: 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  font-family: 'JetBrains Mono', monospace;
}

.prompt {
  color: var(--accent);
  font-weight: 900;
  user-select: none;
}

.command-body code {
  color: #e0e0e0;
  font-size: 0.95rem;
  flex-grow: 1;
}

.copy-btn {
  background: rgba(245, 166, 35, 0.1);
  border: 1px solid rgba(245, 166, 35, 0.2);
  color: var(--accent);
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-size: 0.65rem;
  font-weight: 900;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 70px;
}

.copy-btn:hover {
  background: var(--accent);
  color: black;
}

@media (max-width: 768px) {
  .tech-section { grid-template-columns: 1fr; gap: 1.5rem; }
  .learning-grid { grid-template-columns: 1fr; }
  .detail-title { font-size: 4rem; }
  .install-command-wrap { width: 100%; }
}
</style>
