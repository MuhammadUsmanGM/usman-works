<script setup lang="ts">
import { ArrowUpRight } from 'lucide-vue-next'
</script>

<template>
  <div class="layout-container">
    <div class="top-nav-spacer"></div>
    <header class="floating-nav-wrapper">
      <nav class="premium-navbar">
        <a href="/" class="nav-brand">
          <div class="brand-logo">
            <img src="/favicon.webp" alt="MU" class="nav-logo-img" />
          </div>
          <span class="bebas logo-title">MuhammadUsman <span class="accent-text">/ ARCHIVE</span></span>
        </a>

        <div class="nav-links">
          <a href="https://www.buildwithusman.me/" target="_blank" class="nav-item external group">
            MAIN PORTFOLIO
            <ArrowUpRight :size="14" class="up-arrow" />
          </a>
        </div>
      </nav>
    </header>

    <main class="main-content">
      <slot />
    </main>

    <footer class="archive-footer">
      <div class="footer-grid">
        <p class="copyright">© {{ new Date().getFullYear() }} MUHAMMAD USMAN</p>
        <div class="footer-divider"></div>
        <p class="build-by">ENGINEERED FOR THE WEB</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.layout-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.top-nav-spacer { height: 2rem; }

.floating-nav-wrapper {
  position: sticky;
  top: 1.5rem;
  z-index: 1000;
  display: flex;
  justify-content: center;
}

.premium-navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4rem;
  padding: 0.6rem 0.6rem 0.6rem 1.5rem;
  background: rgba(10, 10, 15, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 100px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: var(--text);
  font-size: 1.1rem;
  letter-spacing: 0.05em;
}

.brand-logo {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 6px;
}

.nav-logo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.logo-title {
  font-size: 1.25rem;
  white-space: nowrap;
}

.accent-text {
  color: var(--accent);
  opacity: 0.8;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-item {
  color: var(--text-sub);
  text-decoration: none;
  font-size: 0.65rem;
  font-weight: 900;
  letter-spacing: 0.15em;
  padding: 0.75rem 1.25rem;
  border-radius: 100px;
  transition: all 0.3s ease;
}

.nav-item.active {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text);
}

.nav-item:hover {
  color: var(--accent);
}

.nav-item.external {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--accent);
  color: black;
}

.nav-item.external:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(245, 166, 35, 0.2);
}

.up-arrow {
  transition: transform 0.3s ease;
}

.nav-item.external:hover .up-arrow {
  transform: translate(2px, -2px);
}

/* Main Content Padding */
.main-content {
  padding-top: 4rem;
}

/* Footer refinements */
.archive-footer {
  padding: 8rem 0 4rem;
}

.footer-grid {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
}

.copyright, .build-by {
  font-size: 0.65rem;
  font-weight: 800;
  color: var(--muted);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.footer-divider {
  width: 30px;
  height: 1px;
  background: var(--border);
}

@media (max-width: 768px) {
  .premium-navbar { gap: 0.5rem; width: fit-content; max-width: 100%; padding: 0.4rem 0.6rem 0.4rem 1rem; }
  .logo-title { font-size: 0.8rem; }
  .nav-item.external { padding: 0.5rem 0.8rem; font-size: 0.55rem; }
  .brand-logo { width: 22px; height: 22px; border-radius: 4px; }
  .logo-text { font-size: 0.7rem; }
}
</style>
