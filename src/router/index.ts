import { createRouter, createWebHistory } from 'vue-router'
import ArchiveHome from '../views/ArchiveHome.vue'
import ProjectDetail from '../views/ProjectDetail.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: ArchiveHome
    },
    {
      path: '/project/:id',
      name: 'project-detail',
      component: ProjectDetail,
      props: true
    }
  ],
  scrollBehavior() {
    return { top: 0, behavior: 'smooth' }
  }
})

export default router
