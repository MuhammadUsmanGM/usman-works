export interface Project {
  id: string
  year: string
  name: string
  description: string
  highlight?: string
  tech: string[]
  categories: string[]
  type: string
  status: string
  github: string
  links: { label: string; url: string }[]
  image: string
  bannerVariant?: 'neural' | 'crystal' | 'matrix' | 'wave'
  bannerVersion?: string
  bannerStatus?: string
  installCommand?: string
  installCommands?: { label: string; command: string }[]
  benchmarks?: { label: string; value: string; detail: string }[]
  sections?: { title: string; icon: string; content: string }[]
  learnings?: string[]
}
