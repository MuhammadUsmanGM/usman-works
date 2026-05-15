<script setup lang="ts">
import { ArrowUpRight, Github, Linkedin, ArrowLeft } from 'lucide-vue-next'
import { onMounted, ref } from 'vue'

const isFromPortfolio = ref(false)

onMounted(() => {
  // Detect if user came from the main portfolio to provide a graceful "Back" experience
  if (document.referrer.includes('buildwithusman.me')) {
    isFromPortfolio.value = true
  }
})

const handlePortfolioClick = (e: MouseEvent) => {
  if (isFromPortfolio.value) {
    e.preventDefault()
    // Attempt to close the tab to return to the original tab
    window.close()
    
    // Fallback: If the tab didn't close (browser security), navigate instead
    setTimeout(() => {
      window.location.href = 'https://www.buildwithusman.me/'
    }, 100)
  }
}
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
          <span class="bebas logo-title">MUHAMMAD USMAN <span class="archive-tag">/ VAULT.CORE</span></span>
        </a>

        <div class="nav-links">
          <a 
            href="https://www.buildwithusman.me/" 
            class="nav-item external group"
            @click="handlePortfolioClick"
          >
            <ArrowLeft v-if="isFromPortfolio" :size="14" class="back-arrow" />
            <span>{{ isFromPortfolio ? 'BACK TO PORTFOLIO' : 'MAIN PORTFOLIO' }}</span>
            <ArrowUpRight v-if="!isFromPortfolio" :size="14" class="up-arrow" />
          </a>
        </div>
      </nav>
    </header>

    <main class="main-content">
      <slot />
    </main>

    <footer class="premium-footer" v-motion-fade>
      <div class="footer-inner">
        <div class="footer-top">
          <div class="footer-left">
            <span class="bebas footer-brand">MUHAMMAD USMAN <span class="archive-tag">/ VAULT.CORE</span></span>
            <p class="footer-tagline">Systems Engineering • AI Agentics • Distributed Architecture</p>
          </div>
          
          <div class="footer-right">
            <div class="social-links">
              <a href="https://github.com/MuhammadUsmanGM" target="_blank" class="social-link">
                <Github :size="18" />
                <span>GITHUB</span>
              </a>
              <a href="https://linkedin.com/in/muhammad-usman-mustafa" target="_blank" class="social-link">
                <Linkedin :size="18" />
                <span>LINKEDIN</span>
              </a>
            </div>
          </div>
        </div>

        <div class="footer-bottom">
          <div class="footer-line"></div>
          <div class="footer-meta">
            <p class="copyright">© 2026 MUHAMMAD USMAN. DATA_VAULT_OPERATIONAL</p>
            <p class="build-tag">BUILT BY MUHAMMAD USMAN</p>
          </div>
        </div>
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
  width: 100%;
}

.premium-navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  padding: 0.6rem 0.6rem 0.6rem 1.5rem;
  background: rgba(10, 10, 15, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 100px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  width: 100%;
  max-width: 1200px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: var(--text);
  font-size: 1.1rem;
  letter-spacing: 0.05em;
  flex-shrink: 0;
}

.brand-logo {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 6px;
  background: var(--bg-3);
}

.nav-logo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.logo-title {
  font-size: 1.1rem;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.archive-tag {
  font-family: monospace;
  font-size: 0.65rem;
  color: var(--accent);
  background: rgba(245, 166, 35, 0.1);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  border: 1px solid rgba(245, 166, 35, 0.2);
  letter-spacing: 0.1em;
  font-weight: 900;
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
  white-space: nowrap;
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

.up-arrow, .back-arrow {
  transition: transform 0.3s ease;
}

.nav-item.external:hover .up-arrow {
  transform: translate(2px, -2px);
}

.nav-item.external:hover .back-arrow {
  transform: translateX(-4px);
}

/* Main Content Padding */
.main-content {
  padding-top: 4rem;
}

/* Premium Footer Overhaul */
.premium-footer {
  padding: 8rem 0 4rem;
  margin-top: auto;
}

.footer-inner {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.footer-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 2rem;
}

.footer-brand {
  font-size: 1.5rem;
  display: block;
  margin-bottom: 0.5rem;
}

.footer-tagline {
  font-size: 0.8rem;
  color: var(--muted);
  font-weight: 500;
  letter-spacing: 0.02em;
}

.social-links {
  display: flex;
  gap: 1.5rem;
}

.social-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: var(--text-sub);
  font-size: 0.7rem;
  font-weight: 900;
  letter-spacing: 0.1em;
  transition: all 0.3s ease;
}

.social-link:hover {
  color: var(--accent);
  transform: translateY(-2px);
}

.footer-bottom {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.footer-line {
  width: 100%;
  height: 1px;
  background: linear-gradient(to right, var(--border), transparent);
}

.footer-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.copyright, .build-tag {
  font-size: 0.65rem;
  font-weight: 800;
  color: var(--muted);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

/* Responsiveness Overhaul */
@media (max-width: 1024px) {
  .premium-navbar {
    max-width: 95%;
    gap: 1.5rem;
  }
}

@media (max-width: 768px) {
  .layout-container { padding: 0 1rem; }
  .top-nav-spacer { height: 1rem; }
  .floating-nav-wrapper { top: 1rem; }

  .premium-navbar {
    padding: 0.4rem 0.4rem 0.4rem 1rem;
    gap: 1rem;
  }

  .nav-brand { gap: 0.5rem; }
  .logo-title { font-size: 0.9rem; }
  .brand-logo { width: 22px; height: 22px; }

  .nav-item {
    padding: 0.6rem 1rem;
    font-size: 0.55rem;
  }

  .footer-top { flex-direction: column; gap: 2.5rem; }
  .social-links { flex-direction: column; gap: 1rem; }
}

@media (max-width: 480px) {
  .premium-navbar {
    padding: 0.3rem 0.3rem 0.3rem 0.75rem;
    gap: 0.5rem;
  }

  .logo-title {
    font-size: 0.75rem;
  }

  .brand-logo {
    width: 18px;
    height: 18px;
    border-radius: 4px;
  }

  .nav-item {
    padding: 0.5rem 0.75rem;
    font-size: 0.5rem;
  }

  .nav-item.external {
    gap: 0.3rem;
  }

  .up-arrow {
    width: 12px;
    height: 12px;
  }
}
</style>
