<script setup lang="ts">
import { ArrowLeft, Terminal } from 'lucide-vue-next'
</script>

<template>
  <div class="layout-container">
    <header class="nav-header">
      <div class="nav-content">
        <a href="/" class="back-link group">
          <ArrowLeft :size="16" class="arrow-icon" />
          <span class="back-text">PORTFOLIO</span>
        </a>
        
        <div class="brand-cluster">
          <div class="brand-id">UM-WORKS</div>
          <div class="brand-version">
            <span class="version-dot"></span>
            VAULT v1.0
          </div>
        </div>
      </div>
    </header>

    <main class="main-content">
      <slot />
    </main>

    <footer class="archive-footer">
      <div class="footer-grid">
        <p class="copyright">© {{ new Date().getFullYear() }} USMAN MUSTAFA</p>
        <div class="footer-divider"></div>
        <p class="build-by">ENGINEERED FOR THE WEB</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.layout-container {
  max-width: 1300px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.nav-header {
  padding: 3rem 0;
}

.nav-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Back Link */
.back-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--muted);
  text-decoration: none;
  font-weight: 800;
  font-size: 0.75rem;
  letter-spacing: 0.15em;
  transition: color 0.3s ease;
}

.arrow-icon {
  transition: transform 0.3s ease;
}

.back-link:hover {
  color: var(--accent);
}

.back-link:hover .arrow-icon {
  transform: translateX(-4px);
}

/* Brand Cluster */
.brand-cluster {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.brand-id {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 1.25rem;
  color: var(--text);
  letter-spacing: 0.05em;
}

.brand-version {
  background: var(--bg-2);
  border: 1px solid var(--border);
  padding: 0.3rem 0.75rem;
  border-radius: 6px;
  font-family: monospace;
  font-size: 0.7rem;
  color: var(--muted);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.version-dot {
  width: 5px;
  height: 5px;
  background: var(--accent);
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { opacity: 0.4; }
  50% { opacity: 1; }
  100% { opacity: 0.4; }
}

/* Footer refinements */
.archive-footer {
  padding: 5rem 0 3rem;
}

.footer-grid {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
}

.copyright, .build-by {
  font-size: 0.7rem;
  font-weight: 800;
  color: var(--muted);
  letter-spacing: 0.1em;
}

.footer-divider {
  width: 40px;
  height: 1px;
  background: var(--border);
}

@media (max-width: 768px) {
  .brand-id { display: none; }
}
</style>
