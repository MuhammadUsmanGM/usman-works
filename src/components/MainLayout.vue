<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next'
</script>

<template>
  <div class="layout-container">
    <header class="nav-header">
      <div class="nav-content">
        <a href="/" class="back-link">
          <ArrowLeft :size="18" />
          <span>Back to Portfolio</span>
        </a>
        <div class="brand-logo bebas">VAULT v1.0</div>
      </div>
    </header>

    <main class="main-content">
      <slot />
    </main>

    <footer class="archive-footer">
      <p class="muted-text">Built with Amber & Vue • © {{ new Date().getFullYear() }} Usman Mustafa</p>
    </footer>
  </div>
</template>

<style scoped>
.layout-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.nav-header {
  padding: 2rem 0;
}

.nav-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.back-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-sub);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s ease;
}

.back-link:hover {
  color: var(--accent);
}

.brand-logo {
  font-size: 1.5rem;
  color: var(--accent);
}

.main-content {
  flex-grow: 1;
}

.archive-footer {
  padding: 4rem 0 2rem;
  text-align: center;
  border-top: 1px solid var(--border);
}

.muted-text {
  color: var(--muted);
  font-size: 0.85rem;
}
</style>
